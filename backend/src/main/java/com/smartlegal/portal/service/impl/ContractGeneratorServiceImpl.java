package com.smartlegal.portal.service.impl;

import com.smartlegal.portal.dto.contract.ContractResponse;
import com.smartlegal.portal.dto.contract.GenerateContractRequest;
import com.smartlegal.portal.entity.GeneratedContract;
import com.smartlegal.portal.entity.Role;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.repository.GeneratedContractRepository;
import com.smartlegal.portal.repository.UserRepository;
import com.smartlegal.portal.service.ContractGeneratorService;
import com.smartlegal.portal.service.GeminiApiClient;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractGeneratorServiceImpl implements ContractGeneratorService {

    private final GeneratedContractRepository contractRepository;
    private final UserRepository userRepository;
    private final GeminiApiClient geminiApiClient;

    public ContractGeneratorServiceImpl(GeneratedContractRepository contractRepository,
                                         UserRepository userRepository,
                                         GeminiApiClient geminiApiClient) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.geminiApiClient = geminiApiClient;
    }

    @Override
    @Transactional
    public ContractResponse generateContract(GenerateContractRequest request, String currentUserEmail) {
        User user = getUser(currentUserEmail);

        String draftText = draftLegalContractText(request);

        GeneratedContract contract = new GeneratedContract();
        contract.setTitle(request.getTitle());
        contract.setContractType(request.getContractType());
        contract.setPartyOne(request.getPartyOne());
        contract.setPartyTwo(request.getPartyTwo());
        contract.setJurisdiction(request.getJurisdiction() != null ? request.getJurisdiction() : "State/Federal Jurisdiction");
        contract.setEffectiveDate(request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now());
        contract.setAdditionalTerms(request.getAdditionalTerms());
        contract.setContractText(draftText);
        contract.setUser(user);

        GeneratedContract savedContract = contractRepository.save(contract);
        return mapToContractResponse(savedContract);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> getUserContracts(String currentUserEmail) {
        User user = getUser(currentUserEmail);
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        List<GeneratedContract> contracts = isAdmin ? contractRepository.findAll() : contractRepository.findByUserOrderByCreatedAtDesc(user);
        return contracts.stream().map(this::mapToContractResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id, String currentUserEmail) {
        GeneratedContract contract = getContractWithSecurityCheck(id, currentUserEmail);
        return mapToContractResponse(contract);
    }

    @Override
    @Transactional
    public void deleteContract(Long id, String currentUserEmail) {
        GeneratedContract contract = getContractWithSecurityCheck(id, currentUserEmail);
        contractRepository.delete(contract);
    }

    private String draftLegalContractText(GenerateContractRequest req) {
        String effDateStr = req.getEffectiveDate() != null ? req.getEffectiveDate().toString() : LocalDate.now().toString();
        String jurisdictionStr = req.getJurisdiction() != null && !req.getJurisdiction().trim().isEmpty() ? req.getJurisdiction() : "the applicable courts of competent jurisdiction";
        String extraTerms = req.getAdditionalTerms() != null && !req.getAdditionalTerms().trim().isEmpty() ? req.getAdditionalTerms() : "Standard operational guidelines apply.";

        StringBuilder sb = new StringBuilder();
        sb.append(req.getTitle().toUpperCase()).append("\n");
        sb.append("================================================================================\n\n");
        sb.append("THIS AGREEMENT (the \"Agreement\") is entered into and made effective as of ").append(effDateStr).append(" (the \"Effective Date\"), by and between:\n\n");
        sb.append("PARTY A (First Party): ").append(req.getPartyOne()).append("\n");
        sb.append("PARTY B (Second Party): ").append(req.getPartyTwo()).append("\n\n");
        sb.append("RECITALS:\n");
        sb.append("WHEREAS, Party A and Party B desire to establish a formal legal relationship regarding ").append(req.getContractType()).append(";\n");
        sb.append("WHEREAS, both parties agree to adhere to the terms, covenants, and conditions specified herein.\n\n");
        sb.append("NOW, THEREFORE, in consideration of the mutual promises contained herein, the parties agree as follows:\n\n");

        sb.append("1. SCOPE OF ENGAGEMENT & OBLIGATIONS\n");
        sb.append("1.1 Party A and Party B shall fulfill their respective duties in good faith and in compliance with applicable law.\n");
        sb.append("1.2 Specific Covenants: ").append(extraTerms).append("\n\n");

        sb.append("2. CONFIDENTIALITY & PROPRIETARY INFORMATION\n");
        sb.append("2.1 Each party agrees to maintain strict confidentiality regarding all proprietary, trade secret, or business information disclosed during the term of this Agreement.\n");
        sb.append("2.2 Neither party shall disclose Confidential Information to any third party without prior written consent.\n\n");

        sb.append("3. TERM & TERMINATION\n");
        sb.append("3.1 This Agreement shall commence on the Effective Date and continue in full force until terminated.\n");
        sb.append("3.2 Either party may terminate this Agreement by providing thirty (30) days' prior written notice to the other party.\n\n");

        sb.append("4. GOVERNING LAW & JURISDICTION\n");
        sb.append("4.1 This Agreement shall be governed by, construed, and enforced in accordance with the laws of ").append(jurisdictionStr).append(".\n");
        sb.append("4.2 Any disputes arising out of this Agreement shall be submitted to binding arbitration or court proceedings within ").append(jurisdictionStr).append(".\n\n");

        sb.append("5. INDEMNIFICATION & LIMITATION OF LIABILITY\n");
        sb.append("5.1 Each party agrees to indemnify and hold harmless the other party against any third-party claims, liabilities, or expenses.\n");
        sb.append("5.2 Neither party shall be liable for indirect, consequential, or punitive damages.\n\n");

        sb.append("IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date written above.\n\n");
        sb.append("------------------------------------------          ------------------------------------------\n");
        sb.append("Party A Signature: ").append(req.getPartyOne()).append("               Party B Signature: ").append(req.getPartyTwo()).append("\n");
        sb.append("Date: ____________________________________          Date: ____________________________________\n");

        return sb.toString();
    }

    private GeneratedContract getContractWithSecurityCheck(Long id, String userEmail) {
        User currentUser = getUser(userEmail);
        GeneratedContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found with id: " + id));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = contract.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Access Denied: You do not own this generated contract.");
        }

        return contract;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private ContractResponse mapToContractResponse(GeneratedContract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getTitle(),
                contract.getContractType(),
                contract.getPartyOne(),
                contract.getPartyTwo(),
                contract.getJurisdiction(),
                contract.getEffectiveDate(),
                contract.getAdditionalTerms(),
                contract.getContractText(),
                contract.getUser().getFullName(),
                contract.getCreatedAt()
        );
    }
}
