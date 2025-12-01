package com.opentheshare.controller;

import com.opentheshare.dto.ApiResponse;
import com.opentheshare.dto.PartnershipInquiryDto;
import com.opentheshare.entity.PartnershipInquiry;
import com.opentheshare.service.PartnershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partnership")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PartnershipController {

    private final PartnershipService partnershipService;

    @PostMapping("/inquiry")
    public ResponseEntity<ApiResponse<PartnershipInquiry>> createInquiry(@RequestBody PartnershipInquiryDto dto) {
        PartnershipInquiry inquiry = partnershipService.createInquiry(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Partnership inquiry submitted successfully", inquiry));
    }
}
