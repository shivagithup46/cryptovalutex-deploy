package com.cryptovaultx.repository;

import com.cryptovaultx.entity.AmlAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmlAlertRepository extends JpaRepository<AmlAlert, String> {
    List<AmlAlert> findByUserId(String userId);
}
