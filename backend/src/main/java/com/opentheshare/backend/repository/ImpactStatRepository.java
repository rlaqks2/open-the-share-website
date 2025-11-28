package com.opentheshare.backend.repository;

import com.opentheshare.backend.entity.ImpactStat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImpactStatRepository extends JpaRepository<ImpactStat, Long> {
}
