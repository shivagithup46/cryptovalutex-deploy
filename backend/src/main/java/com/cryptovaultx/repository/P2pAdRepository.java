package com.cryptovaultx.repository;

import com.cryptovaultx.entity.P2pAd;
import com.cryptovaultx.entity.P2pAdStatus;
import com.cryptovaultx.entity.OrderSide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface P2pAdRepository extends JpaRepository<P2pAd, String> {
    List<P2pAd> findByStatusAndTypeAndFiatCurrency(P2pAdStatus status, OrderSide type, String fiatCurrency);
    List<P2pAd> findByUserId(String userId);
}
