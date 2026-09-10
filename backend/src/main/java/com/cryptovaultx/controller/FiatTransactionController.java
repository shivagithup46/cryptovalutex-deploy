package com.cryptovaultx.controller;

import com.cryptovaultx.dto.FiatTransactionRequest;
import com.cryptovaultx.service.PaymentGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fiat")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FiatTransactionController {

    @Autowired
    private PaymentGatewayService paymentGatewayService;

    @PostMapping("/deposit")
    public ResponseEntity<?> initiateDeposit(@RequestBody FiatTransactionRequest request) {
        String transactionId = paymentGatewayService.processFiatDeposit(request.getAmount(), request.getCurrency(), request.getGateway());
        
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "transactionId", transactionId,
                "message", "Deposit initiated via " + request.getGateway()
        ));
    }

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<?> razorpayWebhook(@RequestBody String payload, @RequestHeader("X-Razorpay-Signature") String signature) {
        boolean isValid = paymentGatewayService.verifyWebhookSignature(payload, signature);
        if (isValid) {
            return ResponseEntity.ok("Webhook processed");
        }
        return ResponseEntity.badRequest().body("Invalid signature");
    }
}
