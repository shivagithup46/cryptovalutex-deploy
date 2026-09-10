package com.cryptovaultx.repository;

import com.cryptovaultx.entity.P2pOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface P2pOrderRepository extends JpaRepository<P2pOrder, String> {
    List<P2pOrder> findByBuyerIdOrSellerId(String buyerId, String sellerId);
    List<P2pOrder> findByAdId(String adId);
}
