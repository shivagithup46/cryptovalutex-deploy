package com.cryptovaultx.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class ReferralService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String LEADERBOARD_KEY = "referral_leaderboard";

    public String generateReferralCode(String username) {
        String code = "CVX-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return code;
    }

    public void processReferralReward(String referrerUsername, String newUsername) {
        // Logic to grant points
        System.out.println("Granting 50 VIP points to " + referrerUsername + " for referring " + newUsername);
        
        // Update Redis Leaderboard
        redisTemplate.opsForZSet().incrementScore(LEADERBOARD_KEY, referrerUsername, 50.0);
    }

    public Set<Object> getTopReferrers() {
        return redisTemplate.opsForZSet().reverseRange(LEADERBOARD_KEY, 0, 10);
    }
}
