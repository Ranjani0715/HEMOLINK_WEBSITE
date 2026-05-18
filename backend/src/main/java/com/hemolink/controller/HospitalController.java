package com.hemolink.controller;

import com.hemolink.model.Hospital;
import com.hemolink.model.Inventory;
import com.hemolink.repository.HospitalRepository;
import com.hemolink.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @GetMapping("/{id}/inventory")
    public List<Inventory> getInventory(@PathVariable Long id) {
        Hospital hospital = hospitalRepository.findById(id).orElse(null);
        if (hospital == null) return List.of();
        return inventoryRepository.findByHospital(hospital);
    }

    @PostMapping("/{id}/inventory")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory item) {
        Hospital hospital = hospitalRepository.findById(id).orElse(null);
        if (hospital == null) return ResponseEntity.notFound().build();
        item.setHospital(hospital);
        return ResponseEntity.ok(inventoryRepository.save(item));
    }
}
