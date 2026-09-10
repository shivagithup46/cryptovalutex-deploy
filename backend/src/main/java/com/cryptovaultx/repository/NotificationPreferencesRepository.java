package com.cryptovaultx.repository;

import com.cryptovaultx.entity.NotificationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, String> {
    Optional<NotificationPreferences> findByUserId(String userId);
}
