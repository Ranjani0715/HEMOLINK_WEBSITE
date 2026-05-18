package com.hemolink.service;

import com.hemolink.model.Donor;
import com.hemolink.model.BloodRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class MatchingService {

    /**
     * AI-Powered Matching Algorithm
     * Ranks donors based on:
     * 1. Blood Type Compatibility
     * 2. Proximity (Distance)
     * 3. Trust Score
     */
    public List<Donor> matchDonors(BloodRequest request, List<Donor> availableDonors) {
        return availableDonors.stream()
            .filter(donor -> isCompatible(donor.getBloodGroup(), request.getBloodType()))
            .sorted(Comparator.comparingDouble((Donor d) -> calculateScore(d, request)).reversed())
            .collect(Collectors.toList());
    }

    private boolean isCompatible(String donorType, String recipientType) {
        if (donorType.equals("O-")) return true; // Universal donor
        if (donorType.equals(recipientType)) return true;
        
        // Simple compatibility logic
        if (recipientType.endsWith("+") && donorType.equals(recipientType.replace("+", "-"))) return true;
        
        return false;
    }

    private double calculateScore(Donor donor, BloodRequest request) {
        double score = 0;
        
        // Trust Score Weight (40%)
        score += donor.getTrustScore() * 0.4;
        
        // Distance Weight (60%) - Inverse relationship
        // Assuming distance is in KM, smaller is better.
        double distanceFactor = Math.max(1, 100 - donor.getDistanceInKm());
        score += distanceFactor * 0.6;

        // Priority Multiplier (System Override)
        if (request.getPriority() == BloodRequest.Priority.CRITICAL) {
            score *= 1.5;
        } else if (request.getPriority() == BloodRequest.Priority.HIGH) {
            score *= 1.25;
        }
        
        return score;
    }
}
