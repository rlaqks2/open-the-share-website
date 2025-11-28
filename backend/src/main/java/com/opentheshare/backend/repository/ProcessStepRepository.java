package com.opentheshare.backend.repository;

import com.opentheshare.backend.entity.ProcessStep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessStepRepository extends JpaRepository<ProcessStep, Long> {
}
