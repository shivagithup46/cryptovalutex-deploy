package com.cryptovaultx.repository;

import com.cryptovaultx.entity.Order;
import com.cryptovaultx.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByMarketIdAndStatusIn(String marketId, List<OrderStatus> statuses);
    List<Order> findByUserIdAndStatus(String userId, OrderStatus status);
}
