package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class P2pService {

    private final P2pAdRepository p2pAdRepository;
    private final P2pOrderRepository p2pOrderRepository;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EscrowService escrowService;

    @Transactional
    public P2pAd createAd(String userId, String tokenSymbol, String fiatCurrency, OrderSide type, BigDecimal price, BigDecimal totalQuantity, BigDecimal minLimit, BigDecimal maxLimit, String paymentMethods, String terms) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Token token = tokenRepository.findBySymbol(tokenSymbol).orElseThrow(() -> new RuntimeException("Token not found"));

        P2pAd ad = P2pAd.builder()
                .user(user)
                .token(token)
                .fiatCurrency(fiatCurrency)
                .type(type)
                .price(price)
                .totalQuantity(totalQuantity)
                .availableQuantity(totalQuantity)
                .minOrderLimit(minLimit)
                .maxOrderLimit(maxLimit)
                .paymentMethods(paymentMethods)
                .terms(terms)
                .status(P2pAdStatus.ACTIVE)
                .build();

        return p2pAdRepository.save(ad);
    }
    
    public List<P2pAd> browseAds(OrderSide type, String fiatCurrency) {
        return p2pAdRepository.findByStatusAndTypeAndFiatCurrency(P2pAdStatus.ACTIVE, type, fiatCurrency);
    }

    @Transactional
    public P2pOrder createOrder(String userId, String adId, BigDecimal fiatAmount, String paymentMethod) {
        User taker = userRepository.findById(userId).orElseThrow();
        P2pAd ad = p2pAdRepository.findById(adId).orElseThrow();
        
        if (ad.getStatus() != P2pAdStatus.ACTIVE) throw new RuntimeException("Ad is not active");
        
        if (fiatAmount.compareTo(ad.getMinOrderLimit()) < 0 || fiatAmount.compareTo(ad.getMaxOrderLimit()) > 0) {
            throw new RuntimeException("Fiat amount out of limits");
        }

        BigDecimal cryptoAmount = fiatAmount.divide(ad.getPrice(), 8, java.math.RoundingMode.DOWN);
        
        if (cryptoAmount.compareTo(ad.getAvailableQuantity()) > 0) {
            throw new RuntimeException("Insufficient ad liquidity");
        }

        // Deduct available quantity from ad
        ad.setAvailableQuantity(ad.getAvailableQuantity().subtract(cryptoAmount));
        if (ad.getAvailableQuantity().compareTo(BigDecimal.ZERO) == 0) {
            ad.setStatus(P2pAdStatus.COMPLETED);
        }
        p2pAdRepository.save(ad);

        User buyer = ad.getType() == OrderSide.SELL ? taker : ad.getUser();
        User seller = ad.getType() == OrderSide.SELL ? ad.getUser() : taker;

        P2pOrder order = P2pOrder.builder()
                .ad(ad)
                .buyer(buyer)
                .seller(seller)
                .token(ad.getToken())
                .fiatAmount(fiatAmount)
                .cryptoAmount(cryptoAmount)
                .price(ad.getPrice())
                .paymentMethod(paymentMethod)
                .status(P2pOrderStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(15)) // 15 mins to pay
                .build();
                
        P2pOrder savedOrder = p2pOrderRepository.save(order);
        
        // Lock funds via Escrow
        escrowService.lockFundsForP2p(savedOrder);
        
        return savedOrder;
    }

    @Transactional
    public void markAsPaid(String userId, String orderId, String paymentProofUrl) {
        P2pOrder order = p2pOrderRepository.findById(orderId).orElseThrow();
        if (!order.getBuyer().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (order.getStatus() != P2pOrderStatus.PENDING) throw new RuntimeException("Invalid status");
        
        order.setStatus(P2pOrderStatus.PAID);
        order.setPaymentProofUrl(paymentProofUrl);
        p2pOrderRepository.save(order);
    }

    @Transactional
    public void releaseCrypto(String userId, String orderId) {
        P2pOrder order = p2pOrderRepository.findById(orderId).orElseThrow();
        if (!order.getSeller().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (order.getStatus() != P2pOrderStatus.PAID) throw new RuntimeException("Invalid status");
        
        escrowService.releaseFunds(order);
        
        order.setStatus(P2pOrderStatus.RELEASED);
        p2pOrderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(String userId, String orderId) {
        P2pOrder order = p2pOrderRepository.findById(orderId).orElseThrow();
        if (!order.getBuyer().getId().equals(userId) && !order.getSeller().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (order.getStatus() != P2pOrderStatus.PENDING) throw new RuntimeException("Cannot cancel");
        
        escrowService.refundFunds(order);
        
        // Return quantity to ad
        P2pAd ad = order.getAd();
        ad.setAvailableQuantity(ad.getAvailableQuantity().add(order.getCryptoAmount()));
        if (ad.getStatus() == P2pAdStatus.COMPLETED) {
            ad.setStatus(P2pAdStatus.ACTIVE);
        }
        p2pAdRepository.save(ad);
        
        order.setStatus(P2pOrderStatus.CANCELLED);
        p2pOrderRepository.save(order);
    }
}
