package com.smartlegal.portal.repository;

import com.smartlegal.portal.entity.LegalCase;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.entity.enums.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegalCaseRepository extends JpaRepository<LegalCase, Long> {

    Optional<LegalCase> findByCaseNumber(String caseNumber);

    List<LegalCase> findByAssignedLawyerOrderByCreatedAtDesc(User lawyer);

    List<LegalCase> findByClientUserOrderByCreatedAtDesc(User client);

    List<LegalCase> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM LegalCase c WHERE c.assignedLawyer = :lawyer AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.clientName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<LegalCase> searchLawyerCases(@Param("lawyer") User lawyer, @Param("status") CaseStatus status, @Param("query") String query);

    @Query("SELECT c FROM LegalCase c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.clientName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<LegalCase> searchAllCases(@Param("status") CaseStatus status, @Param("query") String query);
}
