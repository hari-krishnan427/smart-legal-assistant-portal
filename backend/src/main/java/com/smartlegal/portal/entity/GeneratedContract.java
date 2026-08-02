package com.smartlegal.portal.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "generated_contracts")
public class GeneratedContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "contract_type", nullable = false, length = 50)
    private String contractType; // NDA, MSA, EMPLOYMENT, CONSULTING, LEASE

    @Column(name = "party_one", nullable = false)
    private String partyOne;

    @Column(name = "party_two", nullable = false)
    private String partyTwo;

    @Column(name = "jurisdiction")
    private String jurisdiction;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "additional_terms", columnDefinition = "LONGTEXT")
    private String additionalTerms;

    @Column(name = "contract_text", nullable = false, columnDefinition = "LONGTEXT")
    private String contractText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GeneratedContract() {
    }

    public GeneratedContract(Long id, String title, String contractType, String partyOne, String partyTwo, String jurisdiction, LocalDate effectiveDate, String additionalTerms, String contractText, User user) {
        this.id = id;
        this.title = title;
        this.contractType = contractType;
        this.partyOne = partyOne;
        this.partyTwo = partyTwo;
        this.jurisdiction = jurisdiction;
        this.effectiveDate = effectiveDate;
        this.additionalTerms = additionalTerms;
        this.contractText = contractText;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getPartyOne() {
        return partyOne;
    }

    public void setPartyOne(String partyOne) {
        this.partyOne = partyOne;
    }

    public String getPartyTwo() {
        return partyTwo;
    }

    public void setPartyTwo(String partyTwo) {
        this.partyTwo = partyTwo;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getAdditionalTerms() {
        return additionalTerms;
    }

    public void setAdditionalTerms(String additionalTerms) {
        this.additionalTerms = additionalTerms;
    }

    public String getContractText() {
        return contractText;
    }

    public void setContractText(String contractText) {
        this.contractText = contractText;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
