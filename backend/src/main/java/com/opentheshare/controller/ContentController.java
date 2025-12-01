package com.opentheshare.controller;

import com.opentheshare.dto.ApiResponse;
import com.opentheshare.entity.*;
import com.opentheshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ContentController {

    private final AboutRepository aboutRepository;
    private final AboutFeatureRepository aboutFeatureRepository;
    private final ImpactStatRepository impactStatRepository;
    private final ProgramRepository programRepository;
    private final ProcessStepRepository processStepRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final TestimonialRepository testimonialRepository;
    private final PartnerRepository partnerRepository;
    private final FaqRepository faqRepository;

    @GetMapping("/content")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllContent() {
        Map<String, Object> content = new HashMap<>();

        // About
        List<About> aboutList = aboutRepository.findAll();
        if (!aboutList.isEmpty()) {
            About about = aboutList.get(0);
            Map<String, Object> aboutMap = new HashMap<>();
            aboutMap.put("title", about.getTitle());
            aboutMap.put("description", about.getDescription());
            aboutMap.put("imageUrl", about.getImageUrl());
            aboutMap.put("features", aboutFeatureRepository.findAll());
            content.put("about", aboutMap);
        }

        content.put("impactStats", impactStatRepository.findAll());
        content.put("programs", programRepository.findAll());
        content.put("processSteps", processStepRepository.findAll());
        content.put("portfolioItems", portfolioItemRepository.findAll());
        content.put("testimonials", testimonialRepository.findAll());
        content.put("partners", partnerRepository.findAll());
        content.put("faqs", faqRepository.findAll());

        return ResponseEntity.ok(ApiResponse.success("Content fetched successfully", content));
    }
}
