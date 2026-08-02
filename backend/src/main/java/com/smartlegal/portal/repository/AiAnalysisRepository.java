package com.smartlegal.portal.repository;

import com.smartlegal.portal.entity.AiAnalysis;
import com.smartlegal.portal.entity.LegalDocument;
import com.smartlegal.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {

    Optional<AiAnalysis> findByDocument(LegalDocument document);

    Optional<AiAnalysis> findByDocumentId(Long documentId);

    long countByDocument_User(User user);

    long countByDocument_UserAndRiskLevel(User user, String riskLevel);

    @Query("SELECT AVG(a.riskScore) FROM AiAnalysis a WHERE a.document.user = :user")
    Double findAverageRiskScoreByUser(@Param("user") User user);

    @Query("SELECT AVG(a.riskScore) FROM AiAnalysis a")
    Double findGlobalAverageRiskScore();

    List<AiAnalysis> findTop5ByDocument_UserOrderByCreatedAtDesc(User user);

    List<AiAnalysis> findTop5ByOrderByCreatedAtDesc();
}
