package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.TokenRepository;
import com.cryptovaultx.repository.TransactionRepository;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.WalletRepository;
import com.cryptovaultx.service.blockchain.BlockchainAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TokenRepository tokenRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final com.cryptovaultx.repository.BankAccountRepository bankAccountRepository;
    private final com.cryptovaultx.repository.PortfolioRepository portfolioRepository;
    private final NotificationService notificationService;
    private final Map<String, BlockchainAdapter> blockchainAdapters; // Spring automatically injects beans by name if configured, but let's use a simpler approach or inject List and map it.

    private final List<BlockchainAdapter> adapters;

    private BlockchainAdapter getAdapter(String symbol) {
        return adapters.stream()
                .filter(a -> a.getSupportedSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Blockchain adapter not found for " + symbol));
    }

    @Transactional
    public Wallet getOrCreateWallet(String userId, String symbol) {
        return walletRepository.findByUserIdAndTokenSymbol(userId, symbol).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow();
            Token token = tokenRepository.findBySymbol(symbol).orElseGet(() -> {
                Token newToken = Token.builder()
                        .symbol(symbol)
                        .name(symbol)
                        .currentPrice(java.math.BigDecimal.ONE)
                        .isActive(true)
                        .build();
                return tokenRepository.save(newToken);
            });
            
            Wallet newWallet = Wallet.builder()
                    .user(user)
                    .token(token)
                    .balance(BigDecimal.ZERO)
                    .lockedBalance(BigDecimal.ZERO)
                    .averageBuyPrice(BigDecimal.ZERO)
                    .build();
            return walletRepository.save(newWallet);
        });
    }

    @Transactional
    public String generateDepositAddress(String userId, String symbol) {
        // Just verify wallet exists
        getOrCreateWallet(userId, symbol);
        BlockchainAdapter adapter = getAdapter(symbol);
        return adapter.generateWalletAddress(userId);
    }

    @Transactional
    public Transaction processWithdrawal(String userId, String symbol, BigDecimal amount, String toAddress) {
        Wallet wallet = getOrCreateWallet(userId, symbol);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance. Required: " + amount + ", Available: " + wallet.getBalance());
        }

        BigDecimal fee = BigDecimal.ZERO;
        String txHash = "TX-W-" + System.currentTimeMillis();

        if (!symbol.equalsIgnoreCase("INR")) {
            BlockchainAdapter adapter = getAdapter(symbol);
            if (!adapter.validateAddress(toAddress)) {
                throw new RuntimeException("Invalid " + symbol + " address");
            }
            fee = adapter.estimateNetworkFee();
            BigDecimal totalRequired = amount.add(fee);

            if (wallet.getBalance().compareTo(totalRequired) < 0) {
                throw new RuntimeException("Insufficient balance including fee. Required: " + totalRequired + ", Available: " + wallet.getBalance());
            }
            wallet.setBalance(wallet.getBalance().subtract(totalRequired));
            txHash = adapter.sendTransaction(toAddress, amount);
        } else {
            wallet.setBalance(wallet.getBalance().subtract(amount));
            // Demo mode: simply allow withdrawal without requiring an external bank account linked.
        }

        walletRepository.save(wallet);

        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        BigDecimal portfolioValue = portfolio != null && portfolio.getTotalBalanceInr() != null ? portfolio.getTotalBalanceInr() : BigDecimal.ZERO;

        Transaction transaction = Transaction.builder()
                .user(wallet.getUser())
                .token(wallet.getToken())
                .type(TransactionType.WITHDRAWAL)
                .amount(amount)
                .price(wallet.getToken().getCurrentPrice())
                .fee(fee)
                .status(TransactionStatus.COMPLETED)
                .txHash(txHash)
                .tradingPair(symbol + "/INR")
                .profit(BigDecimal.ZERO)
                .walletBalanceBefore(wallet.getBalance().add(amount).add(fee))
                .walletBalanceAfter(wallet.getBalance())
                .portfolioValue(portfolioValue)
                .build();
                
        transaction = transactionRepository.save(transaction);
        notificationService.createNotification(wallet.getUser(), "Withdrawal Successful", "Successfully withdrew " + amount + " " + symbol, "WITHDRAWAL");
        return transaction;
    }

    @Transactional
    public Transaction processDeposit(String userId, String symbol, BigDecimal amount) {
        Wallet wallet = getOrCreateWallet(userId, symbol);
        
        // Demo mode: Simply allow deposit without checking external bank account balance.
        if (symbol.equalsIgnoreCase("INR")) {
            // Do nothing, proceed to credit wallet.
        }

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        BigDecimal portfolioValue = portfolio != null && portfolio.getTotalBalanceInr() != null ? portfolio.getTotalBalanceInr() : BigDecimal.ZERO;

        Transaction transaction = Transaction.builder()
                .user(wallet.getUser())
                .token(wallet.getToken())
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .price(wallet.getToken().getCurrentPrice())
                .fee(BigDecimal.ZERO)
                .status(TransactionStatus.COMPLETED)
                .txHash("TX-D-" + System.currentTimeMillis())
                .tradingPair(symbol + "/INR")
                .profit(BigDecimal.ZERO)
                .walletBalanceBefore(wallet.getBalance().subtract(amount))
                .walletBalanceAfter(wallet.getBalance())
                .portfolioValue(portfolioValue)
                .build();
                
        transaction = transactionRepository.save(transaction);
        notificationService.createNotification(wallet.getUser(), "Deposit Successful", "Successfully deposited " + amount + " " + symbol, "DEPOSIT");
        return transaction;
    }

    @Transactional
    public Transaction buyCrypto(String userId, String symbol, BigDecimal quantity) {
        Wallet inrWallet = getOrCreateWallet(userId, "INR");
        Token cryptoToken = tokenRepository.findBySymbol(symbol).orElseThrow(() -> new RuntimeException("Token not found: " + symbol));
        BigDecimal cost = cryptoToken.getCurrentPrice().multiply(quantity);

        if (inrWallet.getBalance().compareTo(cost) < 0) {
            throw new RuntimeException("Insufficient INR balance. Required: " + cost + ", Available: " + inrWallet.getBalance());
        }

        inrWallet.setBalance(inrWallet.getBalance().subtract(cost));
        walletRepository.save(inrWallet);

        Wallet cryptoWallet = getOrCreateWallet(userId, symbol);
        
        BigDecimal oldBalance = cryptoWallet.getBalance();
        BigDecimal oldAvg = cryptoWallet.getAverageBuyPrice() == null ? BigDecimal.ZERO : cryptoWallet.getAverageBuyPrice();
        BigDecimal newBalance = oldBalance.add(quantity);
        if (newBalance.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalCost = oldBalance.multiply(oldAvg).add(cost);
            cryptoWallet.setAverageBuyPrice(totalCost.divide(newBalance, 18, java.math.RoundingMode.HALF_UP));
        }
        
        cryptoWallet.setBalance(newBalance);
        walletRepository.save(cryptoWallet);

        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        BigDecimal portfolioValue = portfolio != null && portfolio.getTotalBalanceInr() != null ? portfolio.getTotalBalanceInr() : BigDecimal.ZERO;

        Transaction transaction = Transaction.builder()
                .user(inrWallet.getUser())
                .token(cryptoToken)
                .type(TransactionType.BUY)
                .amount(quantity)
                .price(cryptoToken.getCurrentPrice())
                .fee(BigDecimal.ZERO)
                .status(TransactionStatus.COMPLETED)
                .txHash("TX-B-" + System.currentTimeMillis())
                .tradingPair(symbol + "/INR")
                .profit(BigDecimal.ZERO)
                .walletBalanceBefore(inrWallet.getBalance().add(cost))
                .walletBalanceAfter(inrWallet.getBalance())
                .portfolioValue(portfolioValue)
                .build();
                
        transaction = transactionRepository.save(transaction);
        notificationService.createNotification(inrWallet.getUser(), "Buy Order Successful", "Successfully bought " + quantity + " " + symbol + " for ₹" + cost, "BUY");
        return transaction;
    }

    @Transactional
    public Transaction sellCrypto(String userId, String symbol, BigDecimal quantity) {
        Wallet cryptoWallet = getOrCreateWallet(userId, symbol);
        if (cryptoWallet.getBalance().compareTo(quantity) < 0) {
            throw new RuntimeException("Insufficient crypto balance. Required: " + quantity + ", Available: " + cryptoWallet.getBalance());
        }

        Token cryptoToken = cryptoWallet.getToken();
        BigDecimal revenue = cryptoToken.getCurrentPrice().multiply(quantity);

        BigDecimal oldAvg = cryptoWallet.getAverageBuyPrice() == null ? BigDecimal.ZERO : cryptoWallet.getAverageBuyPrice();
        BigDecimal realizedProfit = revenue.subtract(oldAvg.multiply(quantity));

        cryptoWallet.setBalance(cryptoWallet.getBalance().subtract(quantity));
        if (cryptoWallet.getBalance().compareTo(BigDecimal.ZERO) == 0) {
            cryptoWallet.setAverageBuyPrice(BigDecimal.ZERO);
        }
        walletRepository.save(cryptoWallet);
        
        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        if (portfolio != null) {
            portfolio.setTotalProfitInr(portfolio.getTotalProfitInr().add(realizedProfit));
            portfolioRepository.save(portfolio);
        }

        Wallet inrWallet = getOrCreateWallet(userId, "INR");
        inrWallet.setBalance(inrWallet.getBalance().add(revenue));
        walletRepository.save(inrWallet);

        BigDecimal portfolioValue = portfolio != null && portfolio.getTotalBalanceInr() != null ? portfolio.getTotalBalanceInr() : BigDecimal.ZERO;

        Transaction transaction = Transaction.builder()
                .user(inrWallet.getUser())
                .token(cryptoToken)
                .type(TransactionType.SELL)
                .amount(quantity)
                .price(cryptoToken.getCurrentPrice())
                .fee(BigDecimal.ZERO)
                .status(TransactionStatus.COMPLETED)
                .txHash("TX-S-" + System.currentTimeMillis())
                .tradingPair(symbol + "/INR")
                .profit(realizedProfit)
                .walletBalanceBefore(inrWallet.getBalance().subtract(revenue))
                .walletBalanceAfter(inrWallet.getBalance())
                .portfolioValue(portfolioValue)
                .build();
                
        transaction = transactionRepository.save(transaction);
        notificationService.createNotification(inrWallet.getUser(), "Sell Order Successful", "Successfully sold " + quantity + " " + symbol + " for ₹" + revenue, "SELL");
        return transaction;
    }

    @Transactional
    public void lockFunds(String userId, String symbol, BigDecimal amount) {
        Wallet wallet = getOrCreateWallet(userId, symbol);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance to lock");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setLockedBalance(wallet.getLockedBalance().add(amount));
        walletRepository.save(wallet);
    }

    @Transactional
    public void unlockFunds(String userId, String symbol, BigDecimal amount) {
        Wallet wallet = getOrCreateWallet(userId, symbol);
        if (wallet.getLockedBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient locked balance to unlock");
        }
        wallet.setLockedBalance(wallet.getLockedBalance().subtract(amount));
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }

    @Transactional
    public void deductLockedFunds(String userId, String symbol, BigDecimal amount) {
        Wallet wallet = getOrCreateWallet(userId, symbol);
        if (wallet.getLockedBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient locked balance to deduct");
        }
        wallet.setLockedBalance(wallet.getLockedBalance().subtract(amount));
        walletRepository.save(wallet);
    }
    
    @Transactional
    public void addFunds(String userId, String symbol, BigDecimal amount) {
        Wallet wallet = getOrCreateWallet(userId, symbol);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }
}
