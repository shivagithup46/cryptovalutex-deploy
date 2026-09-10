package com.cryptovaultx.repository;

import com.cryptovaultx.entity.KycDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KycDetailsRepository extends JpaRepository<KycDetails, String> {
    Optional<KycDetails> findByUserId(String userId);
}
