package com.opentheshare.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ProcessStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
}
