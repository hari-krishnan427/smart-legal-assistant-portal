package com.smartlegal.portal.dto.legalcase;

import jakarta.validation.constraints.NotBlank;

public class CreateCaseNoteRequest {

    @NotBlank(message = "Note content is required")
    private String content;

    public CreateCaseNoteRequest() {
    }

    public CreateCaseNoteRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
