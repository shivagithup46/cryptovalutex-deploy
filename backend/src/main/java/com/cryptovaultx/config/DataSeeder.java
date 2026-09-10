package com.cryptovaultx.config;

import com.cryptovaultx.entity.Market;
import com.cryptovaultx.entity.Token;
import com.cryptovaultx.repository.MarketRepository;
import com.cryptovaultx.repository.TokenRepository;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.entity.Role;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.BankAccountRepository;
import com.cryptovaultx.repository.PortfolioRepository;
import com.cryptovaultx.repository.UserSettingsRepository;
import com.cryptovaultx.repository.NotificationPreferencesRepository;
import com.cryptovaultx.service.WalletService;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TokenRepository tokenRepository;
    private final MarketRepository marketRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final BankAccountRepository bankAccountRepository;
    private final PortfolioRepository portfolioRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final NotificationPreferencesRepository notificationPreferencesRepository;
    private final WalletService walletService;

    @Override
    public void run(String... args) throws Exception {
        seedTokensAndMarkets();
        seedUsers();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("vmshiva0@gmail.com")) {
            User user = User.builder()
                    .firstName("Shiva")
                    .lastName("Admin")
                    .email("vmshiva0@gmail.com")
                    .password(encoder.encode("password"))
                    .role(Role.USER)
                    .isEmailVerified(true)
                    .isPhoneVerified(true)
                    .isTwoFactorEnabled(false)
                    .build();

            user = userRepository.save(user);

            com.cryptovaultx.entity.BankAccount bankAccount = com.cryptovaultx.entity.BankAccount.builder()
                    .user(user)
                    .accountHolderName("Shiva Admin")
                    .accountNumber("DEMO-" + user.getId().substring(0, 8).toUpperCase())
                    .ifscCode("DEMO0000123")
                    .bankName("CryptoVaultX Virtual Bank")
                    .upiId("vmshiva0@demoupi")
                    .isVerified(true)
                    .balance(new java.math.BigDecimal("10000000.00"))
                    .currency("INR")
                    .status("ACTIVE")
                    .build();
            bankAccountRepository.save(bankAccount);

            walletService.processDeposit(user.getId(), "INR", new java.math.BigDecimal("10000000.00"));
            
            com.cryptovaultx.entity.Portfolio portfolio = com.cryptovaultx.entity.Portfolio.builder()
                    .user(user)
                    .totalBalanceInr(java.math.BigDecimal.ZERO)
                    .totalProfitInr(java.math.BigDecimal.ZERO)
                    .todayProfitInr(java.math.BigDecimal.ZERO)
                    .roiPercentage(java.math.BigDecimal.ZERO)
                    .build();
            portfolioRepository.save(portfolio);
            
            com.cryptovaultx.entity.UserSettings userSettings = com.cryptovaultx.entity.UserSettings.builder()
                    .user(user)
                    .build();
            userSettingsRepository.save(userSettings);
            
            com.cryptovaultx.entity.NotificationPreferences prefs = com.cryptovaultx.entity.NotificationPreferences.builder()
                    .user(user)
                    .emailAlerts(true)
                    .smsAlerts(false)
                    .pushNotifications(true)
                    .marketingEmails(false)
                    .build();
            notificationPreferencesRepository.save(prefs);
            
            System.out.println("Seeded demo user: vmshiva0@gmail.com / password");
        }

        userRepository.findByEmail("vmshiva5@gmail.com").ifPresentOrElse(u -> {
            u.setPassword(encoder.encode("Shivaskct@46"));
            u.setEmailVerified(true);
            userRepository.save(u);
            System.out.println("Synced password for vmshiva5@gmail.com to Shivaskct@46");
        }, () -> {
            User user = User.builder()
                    .firstName("Shiva")
                    .lastName("K")
                    .email("vmshiva5@gmail.com")
                    .password(encoder.encode("Shivaskct@46"))
                    .role(Role.USER)
                    .isEmailVerified(true)
                    .isPhoneVerified(true)
                    .isTwoFactorEnabled(false)
                    .build();
            user = userRepository.save(user);

            com.cryptovaultx.entity.BankAccount bankAccount = com.cryptovaultx.entity.BankAccount.builder()
                    .user(user)
                    .accountHolderName("Shiva K")
                    .accountNumber("DEMO-" + user.getId().substring(0, 8).toUpperCase())
                    .ifscCode("DEMO0000123")
                    .bankName("CryptoVaultX Virtual Bank")
                    .upiId("vmshiva5@demoupi")
                    .isVerified(true)
                    .balance(new java.math.BigDecimal("10000000.00"))
                    .currency("INR")
                    .status("ACTIVE")
                    .build();
            bankAccountRepository.save(bankAccount);

            walletService.processDeposit(user.getId(), "INR", new java.math.BigDecimal("10000000.00"));
            
            com.cryptovaultx.entity.Portfolio portfolio = com.cryptovaultx.entity.Portfolio.builder()
                    .user(user)
                    .totalBalanceInr(java.math.BigDecimal.ZERO)
                    .totalProfitInr(java.math.BigDecimal.ZERO)
                    .todayProfitInr(java.math.BigDecimal.ZERO)
                    .roiPercentage(java.math.BigDecimal.ZERO)
                    .build();
            portfolioRepository.save(portfolio);
            
            com.cryptovaultx.entity.UserSettings userSettings = com.cryptovaultx.entity.UserSettings.builder()
                    .user(user)
                    .build();
            userSettingsRepository.save(userSettings);
            
            com.cryptovaultx.entity.NotificationPreferences prefs = com.cryptovaultx.entity.NotificationPreferences.builder()
                    .user(user)
                    .emailAlerts(true)
                    .smsAlerts(false)
                    .pushNotifications(true)
                    .marketingEmails(false)
                    .build();
            notificationPreferencesRepository.save(prefs);
            System.out.println("Created and seeded user: vmshiva5@gmail.com / Shivaskct@46");
        });
    }

    private void seedTokensAndMarkets() {
        if (tokenRepository.count() == 0) {
            Token inr = Token.builder().symbol("INR").name("Indian Rupee").currentPrice(BigDecimal.ONE).isActive(true).build();
            Token btc = Token.builder().symbol("BTC").name("Bitcoin").currentPrice(new BigDecimal("8000000")).isActive(true).build();
            Token eth = Token.builder().symbol("ETH").name("Ethereum").currentPrice(new BigDecimal("300000")).isActive(true).build();
            Token bnb = Token.builder().symbol("BNB").name("Binance Coin").currentPrice(new BigDecimal("50000")).isActive(true).build();
            Token sol = Token.builder().symbol("SOL").name("Solana").currentPrice(new BigDecimal("12000")).isActive(true).build();
            Token xrp = Token.builder().symbol("XRP").name("Ripple").currentPrice(new BigDecimal("50")).isActive(true).build();
            Token doge = Token.builder().symbol("DOGE").name("Dogecoin").currentPrice(new BigDecimal("15")).isActive(true).build();
            Token ada = Token.builder().symbol("ADA").name("Cardano").currentPrice(new BigDecimal("45")).isActive(true).build();
            Token matic = Token.builder().symbol("MATIC").name("Polygon").currentPrice(new BigDecimal("60")).isActive(true).build();
            Token link = Token.builder().symbol("LINK").name("Chainlink").currentPrice(new BigDecimal("1500")).isActive(true).build();
            Token avax = Token.builder().symbol("AVAX").name("Avalanche").currentPrice(new BigDecimal("3000")).isActive(true).build();
            Token shib = Token.builder().symbol("SHIB").name("Shiba Inu").currentPrice(new BigDecimal("0.002")).isActive(true).build();

            tokenRepository.saveAll(List.of(inr, btc, eth, bnb, sol, xrp, doge, ada, matic, link, avax, shib));
            System.out.println("Seeded database with initial tokens.");
            
            if (marketRepository.count() == 0) {
                List<Market> markets = List.of(
                    createMarket("BTC_INR", btc, inr),
                    createMarket("ETH_INR", eth, inr),
                    createMarket("BNB_INR", bnb, inr),
                    createMarket("SOL_INR", sol, inr),
                    createMarket("XRP_INR", xrp, inr),
                    createMarket("DOGE_INR", doge, inr),
                    createMarket("ADA_INR", ada, inr),
                    createMarket("MATIC_INR", matic, inr),
                    createMarket("SHIB_INR", shib, inr)
                );
                marketRepository.saveAll(markets);
                System.out.println("Seeded database with initial markets.");
            }
        }
    }

    private Market createMarket(String symbol, Token base, Token quote) {
        return Market.builder()
                .id(symbol)
                .symbol(symbol)
                .baseToken(base)
                .quoteToken(quote)
                .baseMinSize(new BigDecimal("0.0001"))
                .baseMaxSize(new BigDecimal("1000"))
                .baseTickSize(new BigDecimal("0.0001"))
                .quoteTickSize(new BigDecimal("0.01"))
                .makerFeeRate(new BigDecimal("0.001")) // 0.1%
                .takerFeeRate(new BigDecimal("0.001")) // 0.1%
                .isActive(true)
                .build();
    }
}
