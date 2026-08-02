package com.smartlegal.portal.dto.contract;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class GenerateContractRequest {

    @NotBlank(message = "Contract title is required")
    private String title;

    @NotBlank(message = "Contract type is required")
    private String contractType; // NDA, MSA, EMPLOYMENT, CONSULTING, LEASE

    @NotBlank(message = "Party One (Disclosing / Employer / Client) is required")
    private String partyOne;

    @NotBlank(message = "Party Two (Receiving / Employee / Contractor) is required")
    private String partyTwo;

    private String jurisdiction;
    private LocalDate effectiveDate;
    private String additionalTerms;

    public GenerateContractRequest() {
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
}
