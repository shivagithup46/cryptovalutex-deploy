package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.OrderRepository;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MarketService marketService;
    private final WalletService walletService;
    private final UserRepository userRepository;
    private final MatchingEngine matchingEngine;
    private final com.cryptovaultx.repository.TradeRepository tradeRepository;

    private final PortfolioService portfolioService;
    private final com.cryptovaultx.repository.TransactionRepository transactionRepository;
    private final com.cryptovaultx.repository.AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    @Transactional
    public Order placeOrder(String userId, String marketId, OrderType type, OrderSide side, BigDecimal quantity, BigDecimal price, BigDecimal stopPrice) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Market market = marketService.getMarket(marketId);

        // Validation
        if (quantity.compareTo(market.getBaseMinSize()) < 0) throw new RuntimeException("Quantity too small");
        if (quantity.compareTo(market.getBaseMaxSize()) > 0) throw new RuntimeException("Quantity too large");

        // Lock funds
        if (side == OrderSide.BUY) {
            if (type == OrderType.MARKET) {
                // For a market buy, price is unknown. In a real exchange, we lock a reasonable maximum or current best ask.
                // Simplified: we'll lock current price * quantity * 1.05 (5% slippage buffer)
                BigDecimal lockPrice = market.getQuoteToken().getCurrentPrice().multiply(new BigDecimal("1.05"));
                BigDecimal requiredQuote = quantity.multiply(lockPrice);
                walletService.lockFunds(userId, market.getQuoteToken().getSymbol(), requiredQuote);
            } else {
                BigDecimal requiredQuote = quantity.multiply(price);
                walletService.lockFunds(userId, market.getQuoteToken().getSymbol(), requiredQuote);
            }
        } else {
            // Sell side, lock base token
            walletService.lockFunds(userId, market.getBaseToken().getSymbol(), quantity);
        }

        Order order = Order.builder()
                .user(user)
                .market(market)
                .type(type)
                .side(side)
                .price(price)
                .stopPrice(stopPrice)
                .quantity(quantity)
                .remainingQuantity(quantity)
                .filledQuantity(BigDecimal.ZERO)
                .fee(BigDecimal.ZERO)
                .status(OrderStatus.PENDING)
                .build();

        Order saved = orderRepository.save(order);

        if (type == OrderType.MARKET || type == OrderType.LIMIT) {
            matchingEngine.matchOrder(saved);
        } // Stop Limit will be handled by a price trigger scheduler
        
        return saved;
    }

    @Transactional
    public void cancelOrder(String orderId, String userId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (order.getStatus() == OrderStatus.FILLED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel order in status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Unlock funds
        if (order.getSide() == OrderSide.BUY) {
            BigDecimal lockedQuote = order.getRemainingQuantity().multiply(order.getPrice());
            walletService.unlockFunds(userId, order.getMarket().getQuoteToken().getSymbol(), lockedQuote);
        } else {
            walletService.unlockFunds(userId, order.getMarket().getBaseToken().getSymbol(), order.getRemainingQuantity());
        }
    }

    @Transactional
    public Trade executeInstantTrade(String userId, String marketSymbol, OrderSide side, BigDecimal quantity, BigDecimal currentMarketPrice) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Market market = marketService.getMarketBySymbol(marketSymbol);
        
        String baseSymbol = market.getBaseToken().getSymbol();
        String quoteSymbol = market.getQuoteToken().getSymbol();
        
        BigDecimal orderValue = quantity.multiply(currentMarketPrice);
        BigDecimal feeRate = new BigDecimal("0.001"); // 0.1% fee
        BigDecimal fee = orderValue.multiply(feeRate);
        
        Wallet quoteWallet = walletService.getOrCreateWallet(userId, quoteSymbol);
        Wallet baseWallet = walletService.getOrCreateWallet(userId, baseSymbol);
        
        if (side == OrderSide.BUY) {
            BigDecimal totalCost = orderValue.add(fee);
            if (quoteWallet.getBalance().compareTo(totalCost) < 0) {
                throw new RuntimeException("Insufficient " + quoteSymbol + " balance. Required: " + totalCost + ", Available: " + quoteWallet.getBalance());
            }
            quoteWallet.setBalance(quoteWallet.getBalance().subtract(totalCost));
            
            BigDecimal oldBalance = baseWallet.getBalance();
            BigDecimal oldAvg = baseWallet.getAverageBuyPrice() == null ? BigDecimal.ZERO : baseWallet.getAverageBuyPrice();
            BigDecimal newBalance = oldBalance.add(quantity);
            if (newBalance.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal totalInvestment = oldBalance.multiply(oldAvg).add(totalCost);
                baseWallet.setAverageBuyPrice(totalInvestment.divide(newBalance, 18, java.math.RoundingMode.HALF_UP));
            }
            baseWallet.setBalance(newBalance);
        } else {
            if (baseWallet.getBalance().compareTo(quantity) < 0) {
                throw new RuntimeException("Insufficient " + baseSymbol + " balance. Required: " + quantity + ", Available: " + baseWallet.getBalance());
            }
            
            BigDecimal revenue = orderValue.subtract(fee);
            
            baseWallet.setBalance(baseWallet.getBalance().subtract(quantity));
            if (baseWallet.getBalance().compareTo(BigDecimal.ZERO) == 0) {
                baseWallet.setAverageBuyPrice(BigDecimal.ZERO);
            }
            quoteWallet.setBalance(quoteWallet.getBalance().add(revenue));
        }

        // Create fully filled Order
        Order order = Order.builder()
                .user(user)
                .market(market)
                .type(OrderType.MARKET)
                .side(side)
                .price(currentMarketPrice)
                .quantity(quantity)
                .remainingQuantity(BigDecimal.ZERO)
                .filledQuantity(quantity)
                .fee(fee)
                .status(OrderStatus.FILLED)
                .build();
        Order savedOrder = orderRepository.save(order);

        // Create Trade
        Trade trade = Trade.builder()
                .market(market)
                .makerOrder(savedOrder) 
                .takerOrder(savedOrder)
                .price(currentMarketPrice)
                .quantity(quantity)
                .makerFee(fee)
                .takerFee(fee)
                .side(side)
                .build();
        Trade savedTrade = tradeRepository.save(trade);
        
        // Create Transaction History
        Transaction transaction = Transaction.builder()
                .user(user)
                .token(market.getBaseToken())
                .type(side == OrderSide.BUY ? TransactionType.BUY : TransactionType.SELL)
                .amount(quantity)
                .price(currentMarketPrice)
                .fee(fee)
                .status(TransactionStatus.COMPLETED)
                .txHash("TX-" + side.name().charAt(0) + "-" + System.currentTimeMillis())
                .build();
        transactionRepository.save(transaction);
        
        // Update Portfolio
        portfolioService.updatePortfolio(userId);
        
        // Save AuditLog
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(side == OrderSide.BUY ? "TRADE_BUY" : "TRADE_SELL")
                .details(String.format("Executed %s %s %s at price %s", side.name(), quantity.toPlainString(), baseSymbol, currentMarketPrice.toPlainString()))
                .build();
        auditLogRepository.save(auditLog);
        
        // Send Notification
        String title = side == OrderSide.BUY ? "Buy Order Successful" : "Sell Order Successful";
        String msg = String.format("Successfully %s %s %s for %s %s", 
            side == OrderSide.BUY ? "bought" : "sold", 
            quantity.stripTrailingZeros().toPlainString(), 
            baseSymbol, 
            side == OrderSide.BUY ? orderValue.add(fee).stripTrailingZeros().toPlainString() : orderValue.subtract(fee).stripTrailingZeros().toPlainString(), 
            quoteSymbol);
        notificationService.createNotification(user, title, msg, side.name());
        
        return savedTrade;
    }
}
