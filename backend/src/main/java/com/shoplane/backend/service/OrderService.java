package com.shoplane.backend.service;

import com.shoplane.backend.dto.OrderRequest;
import com.shoplane.backend.model.Order;
import com.shoplane.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repo;

    public Order placeOrder(OrderRequest req) {
        Order order = new Order();
        order.setFullName(req.getFullName());
        order.setPhone(req.getPhone());
        order.setEmail(req.getEmail());
        order.setAddress1(req.getAddress1());
        order.setAddress2(req.getAddress2());
        order.setCity(req.getCity());
        order.setState(req.getState());
        order.setPincode(req.getPincode());
        order.setCountry(req.getCountry());
        order.setCartJson(req.getCartJson());
        order.setTotalAmount(req.getTotalAmount());
        return repo.save(order);
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }
}
