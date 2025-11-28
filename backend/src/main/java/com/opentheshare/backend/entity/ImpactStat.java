package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ImpactStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String value;
    private String label;
}
