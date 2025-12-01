package com.opentheshare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "partnership_inquiry")
public class PartnershipInquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Company information
    @Column(nullable = false)
    private String company;

    @Column(name = "company_size", nullable = false)
    private String companySize;

    // Manager information
    @Column(nullable = false)
    private String manager;

    private String title;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    // Program information
    @Column(name = "program_type")
    private String programType;

    private String participants;

    @Column(name = "preferred_date")
    private String preferredDate;

    private String budget;

    // Additional information
    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private String status = "NEW"; // NEW, CONTACTED, IN_PROGRESS, COMPLETED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "NEW";
        }
    }
}
