package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "donors")
@Data
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bloodGroup;
    private int age;
    private String gender;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private double latitude;
    private double longitude;
    private String medicalHistory;
    private double weight;
    private LocalDateTime lastDonationDate;
    
    private boolean isAvailable;
    private int trustScore;
    private int rewardPoints;
    private int totalDonations;
    private int totalLivesSaved;
    
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED
    }
}
