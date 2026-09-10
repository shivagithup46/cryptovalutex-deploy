package com.cryptovaultx.repository;

import com.cryptovaultx.entity.TaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxRecordRepository extends JpaRepository<TaxRecord, String> {
    List<TaxRecord> findByUserIdAndFinancialYear(String userId, String financialYear);
}
