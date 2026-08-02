package com.smartlegal.portal.repository;

import com.smartlegal.portal.entity.LegalDocument;
import com.smartlegal.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegalDocumentRepository extends JpaRepository<LegalDocument, Long> {

    List<LegalDocument> findByUserOrderByCreatedAtDesc(User user);

    List<LegalDocument> findAllByOrderByCreatedAtDesc();

    @Query("SELECT d FROM LegalDocument d WHERE d.user = :user AND " +
           "(LOWER(d.originalFilename) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CAST(d.extractedText AS string)) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY d.createdAt DESC")
    List<LegalDocument> searchUserDocuments(@Param("user") User user, @Param("query") String query);

    @Query("SELECT d FROM LegalDocument d WHERE " +
           "LOWER(d.originalFilename) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CAST(d.extractedText AS string)) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY d.createdAt DESC")
    List<LegalDocument> searchAllDocuments(@Param("query") String query);
}
