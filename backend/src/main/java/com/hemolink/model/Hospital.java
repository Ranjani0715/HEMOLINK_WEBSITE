package com.hemolink.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Data
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String contactNumber;
    
    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    private List<Inventory> inventory;
}
