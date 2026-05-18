package com.hemolink.controller;

import com.hemolink.model.BloodRequest;
import com.hemolink.model.User;
import com.hemolink.repository.BloodRequestRepository;
import com.hemolink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private com.hemolink.service.MatchingService matchingService;
    
    @Autowired
    private com.hemolink.repository.DonorRepository donorRepository;

    @Autowired
    private com.hemolink.repository.NotificationRepository notificationRepository;

    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setStatus(BloodRequest.Status.PENDING);
        BloodRequest savedRequest = bloodRequestRepository.save(request);

        // Trigger AI Matching Engine
        List<com.hemolink.model.Donor> availableDonors = donorRepository.findByIsAvailableTrue();
        List<com.hemolink.model.Donor> matches = matchingService.matchDonors(savedRequest, availableDonors);

        // Generate Notifications for top 5 donors
        matches.stream().limit(5).forEach(donor -> {
            com.hemolink.model.Notification note = new com.hemolink.model.Notification();
            note.setUser(donor.getUser());
            note.setMessage("Emergency Alert: " + savedRequest.getBloodType() + " required at " + savedRequest.getHospitalName());
            note.setType("EMERGENCY");
            note.setCreatedAt(LocalDateTime.now());
            note.setRead(false);
            notificationRepository.save(note);
        });

        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping("/user/{userId}")
    public List<BloodRequest> getRequestsByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return bloodRequestRepository.findByRequester(user);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BloodRequest> updateStatus(@PathVariable Long id, @RequestParam BloodRequest.Status status) {
        BloodRequest request = bloodRequestRepository.findById(id).orElse(null);
        if (request == null) return ResponseEntity.notFound().build();
        request.setStatus(status);
        return ResponseEntity.ok(bloodRequestRepository.save(request));
    }
}
