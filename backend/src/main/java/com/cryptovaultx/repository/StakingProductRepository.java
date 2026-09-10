package com.cryptovaultx.repository;

import com.cryptovaultx.entity.StakingProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StakingProductRepository extends JpaRepository<StakingProduct, String> {
    List<StakingProduct> findByIsActiveTrue();
    List<StakingProduct> findByTokenIdAndIsActiveTrue(String tokenId);
}
