package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String icon;
}
