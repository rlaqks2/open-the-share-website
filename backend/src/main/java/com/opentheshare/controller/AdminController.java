package com.opentheshare.controller;

import com.opentheshare.dto.ApiResponse;
import com.opentheshare.entity.PartnershipInquiry;
import com.opentheshare.entity.User;
import com.opentheshare.repository.PartnershipInquiryRepository;
import com.opentheshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PartnershipInquiryRepository partnershipInquiryRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", userRepository.findAll()));
    }

    @GetMapping("/inquiries")
    public ResponseEntity<ApiResponse<List<PartnershipInquiry>>> getAllInquiries() {
        return ResponseEntity.ok(ApiResponse.success("Inquiries fetched successfully", partnershipInquiryRepository.findAll()));
    }
}
