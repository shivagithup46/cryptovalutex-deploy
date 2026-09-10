package com.cryptovaultx.controller;

import com.cryptovaultx.entity.Transaction;
import com.cryptovaultx.entity.Wallet;
import com.cryptovaultx.entity.Wallet;
import com.cryptovaultx.repository.TransactionRepository;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.WalletRepository;
import com.cryptovaultx.service.WalletService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private String getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<Wallet>> getWallets(Authentication authentication) {
        return ResponseEntity.ok(walletRepository.findByUserId(getUserId(authentication)));
    }

    @GetMapping("/demo")
    public ResponseEntity<List<Wallet>> getDemoWallets(Authentication authentication) {
        return ResponseEntity.ok(walletRepository.findByUserId(getUserId(authentication)));
    }

    @PostMapping("/deposit-address")
    public ResponseEntity<String> getDepositAddress(@RequestParam String symbol, Authentication authentication) {
        return ResponseEntity.ok(walletService.generateDepositAddress(getUserId(authentication), symbol));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody DepositRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.processDeposit(
                getUserId(authentication),
                request.getSymbol(),
                request.getAmount()
        ));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody WithdrawRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.processWithdrawal(
                getUserId(authentication),
                request.getSymbol(),
                request.getAmount(),
                request.getToAddress()
        ));
    }

    @PostMapping("/buy")
    public ResponseEntity<Transaction> buyCrypto(@RequestBody TradeRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.buyCrypto(
                getUserId(authentication),
                request.getSymbol(),
                request.getQuantity()
        ));
    }

    @PostMapping("/sell")
    public ResponseEntity<Transaction> sellCrypto(@RequestBody TradeRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.sellCrypto(
                getUserId(authentication),
                request.getSymbol(),
                request.getQuantity()
        ));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
        return ResponseEntity.ok(transactionRepository.findByUserIdOrderByCreatedAtDesc(getUserId(authentication)));
    }
}

@Data
class WithdrawRequest {
    private String symbol;
    private BigDecimal amount;
    private String toAddress;
}

@Data
class DepositRequest {
    private String symbol;
    private BigDecimal amount;
    private String method; // e.g., UPI, CARD
}

@Data
class TradeRequest {
    private String symbol;
    private BigDecimal quantity;
}
