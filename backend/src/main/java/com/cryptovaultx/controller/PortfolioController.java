package com.cryptovaultx.controller;

import com.cryptovaultx.entity.Portfolio;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<Portfolio> getPortfolio(Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(portfolioService.getOrCreatePortfolio(userId));
    }

    @GetMapping("/summary")
    public ResponseEntity<com.cryptovaultx.dto.AccountSummaryDTO> getAccountSummary(
            @RequestParam(defaultValue = "BTC_INR") String market,
            Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(portfolioService.getAccountSummary(userId, market));
    }
}
