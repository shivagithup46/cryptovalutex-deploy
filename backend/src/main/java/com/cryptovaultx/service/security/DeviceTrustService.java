package com.cryptovaultx.service.security;

import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class DeviceTrustService {

    public double calculateRiskScore(HttpServletRequest request, String username) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        
        double riskScore = 0.0;
        
        // Mock logic for risk scoring
        if (userAgent == null || userAgent.contains("bot") || userAgent.contains("curl")) {
            riskScore += 50.0;
        }
        
        // If IP is from a known risky region (mock)
        if (ipAddress.startsWith("192.168.100")) {
            riskScore += 30.0;
        }

        return riskScore;
    }

    public boolean isDeviceTrusted(HttpServletRequest request, String username) {
        return calculateRiskScore(request, username) < 60.0;
    }
}
