package com.shoplane.backend.controller;

import com.shoplane.backend.model.Product;
import com.shoplane.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return service.search(search);
        }
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @PostMapping
    public Product add(@RequestBody Product p) {
        return service.save(p);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        p.setId(id);
        return service.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
