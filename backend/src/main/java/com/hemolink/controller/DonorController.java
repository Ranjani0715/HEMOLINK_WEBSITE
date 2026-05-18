package com.hemolink.controller;

import com.hemolink.model.Donor;
import com.hemolink.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private com.hemolink.repository.BloodCampRepository bloodCampRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<Donor> getDonorProfile(@PathVariable Long userId) {
        // In real app, find by user ID
        Donor dummy = new Donor();
        dummy.setBloodGroup("O+");
        dummy.setTrustScore(85);
        dummy.setRewardPoints(1200);
        dummy.setAvailable(true);
        dummy.setVerificationStatus(Donor.VerificationStatus.VERIFIED);
        return ResponseEntity.ok(dummy); 
    }

    @GetMapping("/eligibility-check")
    public ResponseEntity<?> checkEligibility(@RequestParam int age, @RequestParam double weight, @RequestParam(required = false) String lastDonation) {
        boolean eligible = age >= 18 && age <= 65 && weight >= 50;
        // Logic for last donation gap (3 months) would go here
        return ResponseEntity.ok(eligible);
    }

    @GetMapping("/camps")
    public List<com.hemolink.model.BloodCamp> getNearbyCamps(@RequestParam String city) {
        return bloodCampRepository.findByCityIgnoreCase(city);
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Donor> toggleAvailability(@PathVariable Long id, @RequestParam boolean status) {
        Donor donor = donorRepository.findById(id).orElse(null);
        if (donor == null) return ResponseEntity.notFound().build();
        donor.setAvailable(status);
        return ResponseEntity.ok(donorRepository.save(donor));
    }

    @PostMapping("/{id}/reward")
    public ResponseEntity<?> addRewardPoints(@PathVariable Long id, @RequestParam int points) {
        // Implementation for reward logic
        return ResponseEntity.ok("Points added");
    }
}
