package com.cryptovaultx.controller;

import com.cryptovaultx.entity.StakingPosition;
import com.cryptovaultx.entity.StakingProduct;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.StakingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/staking")
@RequiredArgsConstructor
public class StakingController {

    private final StakingService stakingService;

    @GetMapping("/products")
    public ResponseEntity<List<StakingProduct>> getActiveProducts() {
        return ResponseEntity.ok(stakingService.getActiveProducts());
    }

    @PostMapping("/stake")
    public ResponseEntity<StakingPosition> stake(@RequestBody StakeRequest request, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(stakingService.stake(
                userId,
                request.getProductId(),
                request.getAmount(),
                request.isAutoCompound()
        ));
    }

    @PostMapping("/positions/{positionId}/unstake")
    public ResponseEntity<Void> unstake(@PathVariable String positionId, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        stakingService.unstake(userId, positionId);
        return ResponseEntity.ok().build();
    }
}

@Data
class StakeRequest {
    private String productId;
    private BigDecimal amount;
    private boolean autoCompound;
}
