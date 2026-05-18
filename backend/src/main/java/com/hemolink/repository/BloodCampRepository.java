package com.hemolink.repository;

import com.hemolink.model.BloodCamp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodCampRepository extends JpaRepository<BloodCamp, Long> {
    List<BloodCamp> findByCityIgnoreCase(String city);
}
