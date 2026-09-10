package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.OrderRepository;
import com.cryptovaultx.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingEngine {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final WalletService walletService;

    @Transactional
    public void matchOrder(Order newOrder) {
        if (newOrder.getType() == OrderType.MARKET) {
            matchMarketOrder(newOrder);
        } else if (newOrder.getType() == OrderType.LIMIT) {
            matchLimitOrder(newOrder);
        }
    }

    private void matchLimitOrder(Order taker) {
        List<OrderStatus> activeStatuses = List.of(OrderStatus.PENDING, OrderStatus.OPEN, OrderStatus.PARTIALLY_FILLED);
        List<Order> orderBook = orderRepository.findByMarketIdAndStatusIn(taker.getMarket().getId(), activeStatuses);
        
        // Filter by opposite side
        OrderSide oppositeSide = taker.getSide() == OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
        
        List<Order> oppositeOrders = orderBook.stream()
                .filter(o -> o.getSide() == oppositeSide)
                .filter(o -> o.getType() == OrderType.LIMIT)
                .filter(o -> {
                    if (taker.getSide() == OrderSide.BUY) {
                        return o.getPrice().compareTo(taker.getPrice()) <= 0; // Seller price is <= Buyer price
                    } else {
                        return o.getPrice().compareTo(taker.getPrice()) >= 0; // Buyer price is >= Seller price
                    }
                })
                .sorted((o1, o2) -> {
                    // Sort by best price first
                    int priceComp = taker.getSide() == OrderSide.BUY ? 
                            o1.getPrice().compareTo(o2.getPrice()) : 
                            o2.getPrice().compareTo(o1.getPrice());
                    // If same price, sort by time (FIFO)
                    return priceComp != 0 ? priceComp : o1.getCreatedAt().compareTo(o2.getCreatedAt());
                })
                .toList();

        for (Order maker : oppositeOrders) {
            if (taker.getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0) break;

            BigDecimal tradeQuantity = taker.getRemainingQuantity().min(maker.getRemainingQuantity());
            BigDecimal tradePrice = maker.getPrice(); // Maker's price dictates trade price

            executeTrade(taker, maker, tradeQuantity, tradePrice);
        }

        if (taker.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0) {
            if (taker.getFilledQuantity().compareTo(BigDecimal.ZERO) > 0) {
                taker.setStatus(OrderStatus.PARTIALLY_FILLED);
            } else {
                taker.setStatus(OrderStatus.OPEN);
            }
        } else {
            taker.setStatus(OrderStatus.FILLED);
        }
        orderRepository.save(taker);
    }

    private void matchMarketOrder(Order taker) {
        List<OrderStatus> activeStatuses = List.of(OrderStatus.PENDING, OrderStatus.OPEN, OrderStatus.PARTIALLY_FILLED);
        List<Order> orderBook = orderRepository.findByMarketIdAndStatusIn(taker.getMarket().getId(), activeStatuses);
        
        OrderSide oppositeSide = taker.getSide() == OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
        
        List<Order> oppositeOrders = orderBook.stream()
                .filter(o -> o.getSide() == oppositeSide)
                .filter(o -> o.getType() == OrderType.LIMIT)
                .sorted((o1, o2) -> {
                    int priceComp = taker.getSide() == OrderSide.BUY ? 
                            o1.getPrice().compareTo(o2.getPrice()) : 
                            o2.getPrice().compareTo(o1.getPrice());
                    return priceComp != 0 ? priceComp : o1.getCreatedAt().compareTo(o2.getCreatedAt());
                })
                .toList();

        for (Order maker : oppositeOrders) {
            if (taker.getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0) break;

            BigDecimal tradeQuantity = taker.getRemainingQuantity().min(maker.getRemainingQuantity());
            BigDecimal tradePrice = maker.getPrice();

            executeTrade(taker, maker, tradeQuantity, tradePrice);
        }

        // For market order, any remaining quantity is cancelled
        if (taker.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0) {
            taker.setStatus(taker.getFilledQuantity().compareTo(BigDecimal.ZERO) > 0 ? OrderStatus.PARTIALLY_FILLED : OrderStatus.CANCELLED);
        } else {
            taker.setStatus(OrderStatus.FILLED);
        }
        
        if (taker.getStatus() == OrderStatus.CANCELLED || taker.getStatus() == OrderStatus.PARTIALLY_FILLED) {
            // Unlock unused funds for cancelled part of market order
            // Note: In reality market orders lock fiat based on current best price, which is complex.
            // Simplified: we'll handle this in OrderService.
        }
        
        orderRepository.save(taker);
    }

    private void executeTrade(Order taker, Order maker, BigDecimal quantity, BigDecimal price) {
        // 1. Record Trade
        BigDecimal makerFeeRate = taker.getMarket().getMakerFeeRate();
        BigDecimal takerFeeRate = taker.getMarket().getTakerFeeRate();
        
        BigDecimal makerFee = quantity.multiply(price).multiply(makerFeeRate);
        BigDecimal takerFee = quantity.multiply(price).multiply(takerFeeRate);

        Trade trade = Trade.builder()
                .market(taker.getMarket())
                .makerOrder(maker)
                .takerOrder(taker)
                .price(price)
                .quantity(quantity)
                .makerFee(makerFee)
                .takerFee(takerFee)
                .side(taker.getSide())
                .build();
        tradeRepository.save(trade);

        // 2. Update Orders
        maker.setFilledQuantity(maker.getFilledQuantity().add(quantity));
        maker.setRemainingQuantity(maker.getRemainingQuantity().subtract(quantity));
        maker.setFee(maker.getFee().add(makerFee));
        if (maker.getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0) {
            maker.setStatus(OrderStatus.FILLED);
        } else {
            maker.setStatus(OrderStatus.PARTIALLY_FILLED);
        }
        orderRepository.save(maker);

        taker.setFilledQuantity(taker.getFilledQuantity().add(quantity));
        taker.setRemainingQuantity(taker.getRemainingQuantity().subtract(quantity));
        taker.setFee(taker.getFee().add(takerFee));

        // 3. Update Wallets (Settle funds)
        settleTrade(taker, maker, quantity, price, takerFee, makerFee);
    }

    private void settleTrade(Order taker, Order maker, BigDecimal quantity, BigDecimal price, BigDecimal takerFee, BigDecimal makerFee) {
        String baseSymbol = taker.getMarket().getBaseToken().getSymbol();
        String quoteSymbol = taker.getMarket().getQuoteToken().getSymbol();
        BigDecimal totalQuote = quantity.multiply(price);

        Order buyer = taker.getSide() == OrderSide.BUY ? taker : maker;
        Order seller = taker.getSide() == OrderSide.SELL ? taker : maker;
        
        BigDecimal buyerFee = taker.getSide() == OrderSide.BUY ? takerFee : makerFee;
        BigDecimal sellerFee = taker.getSide() == OrderSide.SELL ? takerFee : makerFee;

        // Buyer gets base, pays quote. Buyer's quote was already locked.
        walletService.deductLockedFunds(buyer.getUser().getId(), quoteSymbol, totalQuote);
        walletService.addFunds(buyer.getUser().getId(), baseSymbol, quantity.subtract(buyerFee)); // Deduct fee in base token

        // Seller gets quote, pays base. Seller's base was already locked.
        walletService.deductLockedFunds(seller.getUser().getId(), baseSymbol, quantity);
        walletService.addFunds(seller.getUser().getId(), quoteSymbol, totalQuote.subtract(sellerFee)); // Deduct fee in quote token
    }
}
