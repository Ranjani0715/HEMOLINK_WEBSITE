package com.hemolink.repository;

import com.hemolink.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
}
