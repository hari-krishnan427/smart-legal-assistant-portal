package com.smartlegal.portal.service;

import com.smartlegal.portal.dto.contract.ContractResponse;
import com.smartlegal.portal.dto.contract.GenerateContractRequest;

import java.util.List;

public interface ContractGeneratorService {

    ContractResponse generateContract(GenerateContractRequest request, String currentUserEmail);

    List<ContractResponse> getUserContracts(String currentUserEmail);

    ContractResponse getContractById(Long id, String currentUserEmail);

    void deleteContract(Long id, String currentUserEmail);
}
