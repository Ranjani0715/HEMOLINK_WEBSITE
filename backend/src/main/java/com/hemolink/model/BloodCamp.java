package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_camps")
@Data
public class BloodCamp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String city;
    private LocalDateTime eventDate;
    private String organizer;
    private String description;
}
