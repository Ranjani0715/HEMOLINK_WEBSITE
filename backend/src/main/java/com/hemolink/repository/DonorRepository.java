package com.hemolink.repository;

import com.hemolink.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByIsAvailableTrue();
}
