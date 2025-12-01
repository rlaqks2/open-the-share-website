package com.opentheshare.dto;

import lombok.Data;

@Data
public class PartnershipInquiryDto {
    // Company information
    private String company;
    private String companySize;

    // Manager information
    private String manager;
    private String title;
    private String phone;
    private String email;

    // Program information
    private String programType;
    private String participants;
    private String preferredDate;
    private String budget;

    // Additional information
    private String message;
}
