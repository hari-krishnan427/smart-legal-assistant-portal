package com.smartlegal.portal.dto.contract;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ContractResponse {

    private Long id;
    private String title;
    private String contractType;
    private String partyOne;
    private String partyTwo;
    private String jurisdiction;
    private LocalDate effectiveDate;
    private String additionalTerms;
    private String contractText;
    private String authorName;
    private LocalDateTime createdAt;

    public ContractResponse() {
    }

    public ContractResponse(Long id, String title, String contractType, String partyOne, String partyTwo, String jurisdiction, LocalDate effectiveDate, String additionalTerms, String contractText, String authorName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.contractType = contractType;
        this.partyOne = partyOne;
        this.partyTwo = partyTwo;
        this.jurisdiction = jurisdiction;
        this.effectiveDate = effectiveDate;
        this.additionalTerms = additionalTerms;
        this.contractText = contractText;
        this.authorName = authorName;
        this.createdAt = createdAt;
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

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
