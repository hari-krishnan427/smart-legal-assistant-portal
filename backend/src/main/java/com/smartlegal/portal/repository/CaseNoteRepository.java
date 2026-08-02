package com.smartlegal.portal.repository;

import com.smartlegal.portal.entity.CaseNote;
import com.smartlegal.portal.entity.LegalCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseNoteRepository extends JpaRepository<CaseNote, Long> {

    List<CaseNote> findByLegalCaseOrderByCreatedAtDesc(LegalCase legalCase);
}
