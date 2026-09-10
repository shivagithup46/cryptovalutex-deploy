package com.cryptovaultx.repository;

import com.cryptovaultx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByPhoneOrderByIdAsc(String phone);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, String id);
    boolean existsByPhoneAndIdNot(String phone, String id);
}
