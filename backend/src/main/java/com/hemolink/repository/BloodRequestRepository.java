package com.hemolink.repository;

import com.hemolink.model.BloodRequest;
import com.hemolink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByRequester(User requester);
    List<BloodRequest> findByStatus(BloodRequest.Status status);
}
