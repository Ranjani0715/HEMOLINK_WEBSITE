package com.hemolink.controller;

import com.hemolink.model.Donor;
import com.hemolink.model.BloodRequest;
import com.hemolink.service.MatchingService;
import com.hemolink.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private DonorRepository donorRepository;

    @PostMapping("/find")
    public List<Donor> findMatches(@RequestBody BloodRequest request) {
        List<Donor> availableDonors = donorRepository.findByIsAvailableTrue();
        return matchingService.matchDonors(request, availableDonors);
    }
}
