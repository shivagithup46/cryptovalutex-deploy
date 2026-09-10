package com.cryptovaultx.service.blockchain;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
public class EthereumAdapter implements BlockchainAdapter {
    @Override
    public String generateWalletAddress(String userId) {
        return "0x" + UUID.randomUUID().toString().replace("-", "") + "eth";
    }

    @Override
    public boolean validateAddress(String address) {
        return address != null && address.startsWith("0x") && address.length() == 42;
    }

    @Override
    public String sendTransaction(String toAddress, BigDecimal amount) {
        return "0x" + UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public BigDecimal estimateNetworkFee() {
        return new BigDecimal("0.005");
    }

    @Override
    public String getSupportedSymbol() {
        return "ETH";
    }
}
