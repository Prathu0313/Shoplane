package com.shoplane.backend.controller;

import com.shoplane.backend.dto.OrderRequest;
import com.shoplane.backend.model.Order;
import com.shoplane.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody OrderRequest req) {
        Order saved = orderService.placeOrder(req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", saved.getId(),
                "message", "Order placed successfully"
        ));
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
