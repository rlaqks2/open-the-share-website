package com.opentheshare.controller;

import com.opentheshare.entity.*;
import com.opentheshare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ContentController {

    @Autowired
    private AboutRepository aboutRepository;
    @Autowired
    private AboutFeatureRepository aboutFeatureRepository;
    @Autowired
    private ImpactStatRepository impactStatRepository;
    @Autowired
    private ProgramRepository programRepository;
    @Autowired
    private ProcessStepRepository processStepRepository;
    @Autowired
    private PortfolioItemRepository portfolioItemRepository;
    @Autowired
    private TestimonialRepository testimonialRepository;
    @Autowired
    private PartnerRepository partnerRepository;
    @Autowired
    private FaqRepository faqRepository;

    @GetMapping("/content")
    public Map<String, Object> getAllContent() {
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

        return content;
    }
}
