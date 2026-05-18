package com.hemolink.repository;

import com.hemolink.model.Inventory;
import com.hemolink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByHospital(User hospital);
}
