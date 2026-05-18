package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private User hospital;

    private String bloodGroup;
    private int units;
    
    @Enumerated(EnumType.STRING)
    private StockStatus status;

    public enum StockStatus {
        OPTIMAL, LOW, CRITICAL
    }
}
