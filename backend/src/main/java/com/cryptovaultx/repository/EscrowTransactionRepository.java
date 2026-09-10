package com.cryptovaultx.repository;

import com.cryptovaultx.entity.EscrowTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EscrowTransactionRepository extends JpaRepository<EscrowTransaction, String> {
    Optional<EscrowTransaction> findByP2pOrderId(String p2pOrderId);
}
