package com.opentheshare.repository;

import com.opentheshare.entity.PartnershipInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnershipInquiryRepository extends JpaRepository<PartnershipInquiry, Long> {
}
