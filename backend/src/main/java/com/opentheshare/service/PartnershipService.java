package com.opentheshare.service;

import com.opentheshare.dto.PartnershipInquiryDto;
import com.opentheshare.entity.PartnershipInquiry;
import com.opentheshare.repository.PartnershipInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PartnershipService {

    @Autowired
    private PartnershipInquiryRepository inquiryRepository;

    public PartnershipInquiry createInquiry(PartnershipInquiryDto dto) {
        PartnershipInquiry inquiry = new PartnershipInquiry();

        // Company information
        inquiry.setCompany(dto.getCompany());
        inquiry.setCompanySize(dto.getCompanySize());

        // Manager information
        inquiry.setManager(dto.getManager());
        inquiry.setTitle(dto.getTitle());
        inquiry.setPhone(dto.getPhone());
        inquiry.setEmail(dto.getEmail());

        // Program information
        inquiry.setProgramType(dto.getProgramType());
        inquiry.setParticipants(dto.getParticipants());
        inquiry.setPreferredDate(dto.getPreferredDate());
        inquiry.setBudget(dto.getBudget());

        // Additional information
        inquiry.setMessage(dto.getMessage());

        return inquiryRepository.save(inquiry);
    }
}
