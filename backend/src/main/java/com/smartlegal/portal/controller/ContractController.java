package com.smartlegal.portal.controller;

import com.smartlegal.portal.common.ApiResponse;
import com.smartlegal.portal.dto.contract.ContractResponse;
import com.smartlegal.portal.dto.contract.GenerateContractRequest;
import com.smartlegal.portal.service.ContractGeneratorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractGeneratorService contractService;

    public ContractController(ContractGeneratorService contractService) {
        this.contractService = contractService;
    }

    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ContractResponse>> generateContract(
            @Valid @RequestBody GenerateContractRequest request,
            Authentication authentication) {

        ContractResponse response = contractService.generateContract(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Legal contract generated successfully with AI", response));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ContractResponse>>> getUserContracts(Authentication authentication) {
        List<ContractResponse> contracts = contractService.getUserContracts(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Generated contracts retrieved", contracts));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ContractResponse>> getContractById(
            @PathVariable Long id,
            Authentication authentication) {

        ContractResponse response = contractService.getContractById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Contract details retrieved", response));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadContract(
            @PathVariable Long id,
            Authentication authentication) {

        ContractResponse contract = contractService.getContractById(id, authentication.getName());
        byte[] content = contract.getContractText().getBytes(StandardCharsets.UTF_8);

        String filename = contract.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".txt";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(content);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> deleteContract(
            @PathVariable Long id,
            Authentication authentication) {

        contractService.deleteContract(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Generated contract deleted successfully", "Contract ID: " + id));
    }
}
