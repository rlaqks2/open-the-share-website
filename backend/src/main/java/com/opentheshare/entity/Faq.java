package com.opentheshare.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String question;
    @Column(length = 1000)
    private String answer;
}
