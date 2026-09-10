package com.cryptovaultx.controller;

import com.cryptovaultx.entity.TaxRecord;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.TaxService;
import com.cryptovaultx.service.TaxSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tax")
@RequiredArgsConstructor
public class TaxController {

    private final TaxService taxService;

    @GetMapping("/records")
    public ResponseEntity<List<TaxRecord>> getRecords(
            @RequestParam String financialYear,
            Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(taxService.getTaxRecords(userId, financialYear));
    }

    @GetMapping("/summary")
    public ResponseEntity<TaxSummary> getSummary(
            @RequestParam String financialYear,
            Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(taxService.getTaxSummary(userId, financialYear));
    }
}
