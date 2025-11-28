package com.opentheshare.backend.repository;

import com.opentheshare.backend.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<Faq, Long> {
}
