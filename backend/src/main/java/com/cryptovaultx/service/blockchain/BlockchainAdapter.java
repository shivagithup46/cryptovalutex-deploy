package com.cryptovaultx.service.blockchain;

import java.math.BigDecimal;

public interface BlockchainAdapter {
    String generateWalletAddress(String userId);
    boolean validateAddress(String address);
    String sendTransaction(String toAddress, BigDecimal amount);
    BigDecimal estimateNetworkFee();
    String getSupportedSymbol();
}
