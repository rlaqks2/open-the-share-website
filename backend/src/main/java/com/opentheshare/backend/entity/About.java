package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class About {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String description;
    private String imageUrl;
}
