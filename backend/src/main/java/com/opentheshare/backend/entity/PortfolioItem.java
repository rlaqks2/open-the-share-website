package com.opentheshare.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class PortfolioItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String category;
    private String imageUrl;
    private String partner;
    private String period;
    private Integer participants;
    @Column(length = 2000)
    private String story;
}
