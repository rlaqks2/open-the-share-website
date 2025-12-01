package com.opentheshare.dto;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String name;
    private String email;
    private String password;
    private String companyName;
    private String businessRegistrationNumber;
    private String phoneNumber;
}
