package com.cryptovaultx.service.blockchain;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
public class BitcoinAdapter implements BlockchainAdapter {
    @Override
    public String generateWalletAddress(String userId) {
        return "bc1q" + UUID.randomUUID().toString().replace("-", "").substring(0, 36);
    }

    @Override
    public boolean validateAddress(String address) {
        return address != null && (address.startsWith("1") || address.startsWith("3") || address.startsWith("bc1"));
    }

    @Override
    public String sendTransaction(String toAddress, BigDecimal amount) {
        return "tx_" + UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public BigDecimal estimateNetworkFee() {
        return new BigDecimal("0.0005");
    }

    @Override
    public String getSupportedSymbol() {
        return "BTC";
    }
}
