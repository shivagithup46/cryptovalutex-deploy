package com.cryptovaultx.service.blockchain;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
public class BNBAdapter implements BlockchainAdapter {
    @Override
    public String generateWalletAddress(String userId) {
        return "bnb" + UUID.randomUUID().toString().replace("-", "").substring(0, 39);
    }

    @Override
    public boolean validateAddress(String address) {
        return address != null && address.startsWith("bnb");
    }

    @Override
    public String sendTransaction(String toAddress, BigDecimal amount) {
        return "tx_" + UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public BigDecimal estimateNetworkFee() {
        return new BigDecimal("0.001");
    }

    @Override
    public String getSupportedSymbol() {
        return "BNB";
    }
}
