package com.cryptovaultx.controller;

import com.cryptovaultx.entity.OrderSide;
import com.cryptovaultx.entity.P2pAd;
import com.cryptovaultx.entity.P2pOrder;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.P2pService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/p2p")
@RequiredArgsConstructor
public class P2pController {

    private final P2pService p2pService;

    @PostMapping("/ads")
    public ResponseEntity<P2pAd> createAd(@RequestBody CreateAdRequest request, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(p2pService.createAd(
                userId,
                request.getTokenSymbol(),
                request.getFiatCurrency(),
                request.getType(),
                request.getPrice(),
                request.getTotalQuantity(),
                request.getMinLimit(),
                request.getMaxLimit(),
                request.getPaymentMethods(),
                request.getTerms()
        ));
    }

    @GetMapping("/ads")
    public ResponseEntity<List<P2pAd>> browseAds(
            @RequestParam OrderSide type,
            @RequestParam String fiatCurrency) {
        return ResponseEntity.ok(p2pService.browseAds(type, fiatCurrency));
    }

    @PostMapping("/orders")
    public ResponseEntity<P2pOrder> createOrder(@RequestBody CreateP2pOrderRequest request, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(p2pService.createOrder(
                userId,
                request.getAdId(),
                request.getFiatAmount(),
                request.getPaymentMethod()
        ));
    }

    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<Void> markAsPaid(
            @PathVariable String orderId,
            @RequestParam String paymentProofUrl,
            Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        p2pService.markAsPaid(userId, orderId, paymentProofUrl);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/orders/{orderId}/release")
    public ResponseEntity<Void> releaseCrypto(@PathVariable String orderId, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        p2pService.releaseCrypto(userId, orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable String orderId, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        p2pService.cancelOrder(userId, orderId);
        return ResponseEntity.ok().build();
    }
}

@Data
class CreateAdRequest {
    private String tokenSymbol;
    private String fiatCurrency;
    private OrderSide type;
    private BigDecimal price;
    private BigDecimal totalQuantity;
    private BigDecimal minLimit;
    private BigDecimal maxLimit;
    private String paymentMethods;
    private String terms;
}

@Data
class CreateP2pOrderRequest {
    private String adId;
    private BigDecimal fiatAmount;
    private String paymentMethod;
}
