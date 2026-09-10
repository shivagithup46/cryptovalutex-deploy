package com.cryptovaultx.repository;

import com.cryptovaultx.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    org.springframework.data.domain.Page<Transaction> findByUserId(String userId, org.springframework.data.domain.Pageable pageable);
    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);
}
