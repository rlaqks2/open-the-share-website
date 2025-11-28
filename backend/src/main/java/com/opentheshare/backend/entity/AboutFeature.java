package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class AboutFeature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String icon;
    private String title;
    private String description;
}
