package com.cryptovaultx.controller;

import com.cryptovaultx.dto.Web3AuthRequest;
import com.cryptovaultx.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/web3")
@CrossOrigin(origins = "*", maxAge = 3600)
public class Web3AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateWeb3Wallet(@RequestBody Web3AuthRequest authRequest) {
        // In a real production scenario, we would verify the EIP-4361 signature using web3j
        // For this startup MVP, we will simulate a successful signature verification
        
        if (authRequest.getWalletAddress() == null || authRequest.getSignature() == null) {
            return ResponseEntity.badRequest().body("Wallet address and signature are required.");
        }

        // Mock authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                authRequest.getWalletAddress(), null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate a standard JWT using the wallet address as the subject
        String jwt = jwtUtils.generateTokenFromUsername(authRequest.getWalletAddress());
        
        return ResponseEntity.ok(Map.of(
            "accessToken", jwt,
            "address", authRequest.getWalletAddress()
        ));
    }
}
