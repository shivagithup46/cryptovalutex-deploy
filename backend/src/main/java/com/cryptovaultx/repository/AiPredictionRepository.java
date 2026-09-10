package com.cryptovaultx.repository;

import com.cryptovaultx.entity.AiPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiPredictionRepository extends JpaRepository<AiPrediction, String> {
    List<AiPrediction> findByTokenSymbol(String symbol);
}
