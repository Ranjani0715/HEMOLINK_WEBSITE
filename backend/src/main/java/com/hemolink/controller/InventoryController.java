package com.hemolink.controller;

import com.hemolink.model.Inventory;
import com.hemolink.model.User;
import com.hemolink.repository.InventoryRepository;
import com.hemolink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/hospital/{hospitalId}")
    public List<Inventory> getHospitalInventory(@PathVariable Long hospitalId) {
        User hospital = userRepository.findById(hospitalId).orElse(null);
        if (hospital == null) return List.of();
        return inventoryRepository.findByHospital(hospital);
    }

    @PostMapping("/update")
    public ResponseEntity<Inventory> updateStock(@RequestBody Inventory inventory) {
        if (inventory.getUnits() < 5) {
            inventory.setStatus(Inventory.StockStatus.CRITICAL);
        } else if (inventory.getUnits() < 15) {
            inventory.setStatus(Inventory.StockStatus.LOW);
        } else {
            inventory.setStatus(Inventory.StockStatus.OPTIMAL);
        }
        return ResponseEntity.ok(inventoryRepository.save(inventory));
    }
}
