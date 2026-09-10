package com.cryptovaultx.controller;

import com.cryptovaultx.entity.Order;
import com.cryptovaultx.entity.OrderSide;
import com.cryptovaultx.entity.OrderType;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/trading")
@RequiredArgsConstructor
public class TradingController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        Order order = orderService.placeOrder(
                userId,
                request.getMarketId(),
                request.getType(),
                request.getSide(),
                request.getQuantity(),
                request.getPrice(),
                request.getStopPrice()
        );
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable String orderId, Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        orderService.cancelOrder(orderId, userId);
        return ResponseEntity.ok().build();
    }
}

@Data
class OrderRequest {
    private String marketId;
    private OrderType type;
    private OrderSide side;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal stopPrice;
}
