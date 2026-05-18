package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private BloodRequest request;

    private LocalDateTime donationDate;
    private int unitsDonated;
    private String certificateUrl;
}
