package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Data
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    private String bloodType;
    private int unitsRequired;
    private String hospitalName;
    private String patientName;
    private String reason;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    public enum Status {
        PENDING, MATCHED, FULFILLED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
