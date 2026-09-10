package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class EscrowService {

    private final EscrowTransactionRepository escrowRepository;
    private final WalletService walletService;
    private final WalletRepository walletRepository;

    @Transactional
    public EscrowTransaction lockFundsForP2p(P2pOrder order) {
        String tokenSymbol = order.getToken().getSymbol();
        
        // In P2P, the seller is locking crypto
        User seller = order.getSeller();
        BigDecimal cryptoAmount = order.getCryptoAmount();
        
        // Lock the seller's funds
        walletService.lockFunds(seller.getId(), tokenSymbol, cryptoAmount);
        
        Wallet sellerWallet = walletRepository.findByUserIdAndTokenId(seller.getId(), order.getToken().getId())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        EscrowTransaction escrow = EscrowTransaction.builder()
                .p2pOrder(order)
                .wallet(sellerWallet)
                .amount(cryptoAmount)
                .status(EscrowStatus.LOCKED)
                .build();
                
        return escrowRepository.save(escrow);
    }

    @Transactional
    public void releaseFunds(P2pOrder order) {
        EscrowTransaction escrow = escrowRepository.findByP2pOrderId(order.getId())
                .orElseThrow(() -> new RuntimeException("Escrow not found"));
                
        if (escrow.getStatus() != EscrowStatus.LOCKED) {
            throw new RuntimeException("Escrow is not in LOCKED state");
        }
        
        String tokenSymbol = order.getToken().getSymbol();
        
        // Deduct from seller's locked balance
        walletService.deductLockedFunds(order.getSeller().getId(), tokenSymbol, order.getCryptoAmount());
        
        // Add to buyer's available balance
        walletService.addFunds(order.getBuyer().getId(), tokenSymbol, order.getCryptoAmount());
        
        escrow.setStatus(EscrowStatus.RELEASED);
        escrowRepository.save(escrow);
    }

    @Transactional
    public void refundFunds(P2pOrder order) {
        EscrowTransaction escrow = escrowRepository.findByP2pOrderId(order.getId())
                .orElseThrow(() -> new RuntimeException("Escrow not found"));
                
        if (escrow.getStatus() != EscrowStatus.LOCKED) {
            throw new RuntimeException("Escrow is not in LOCKED state");
        }
        
        String tokenSymbol = order.getToken().getSymbol();
        
        // Unlock seller's funds
        walletService.unlockFunds(order.getSeller().getId(), tokenSymbol, order.getCryptoAmount());
        
        escrow.setStatus(EscrowStatus.REFUNDED);
        escrowRepository.save(escrow);
    }
}
