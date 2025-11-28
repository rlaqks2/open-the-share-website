package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String logo;
}
