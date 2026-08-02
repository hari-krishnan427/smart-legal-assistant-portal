package com.smartlegal.portal.controller;

import com.smartlegal.portal.common.ApiResponse;
import com.smartlegal.portal.dto.auth.UserDto;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile(Authentication authentication) {
        Map<String, Object> profileInfo = Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities().stream().map(Object::toString).collect(Collectors.toList()),
                "message", "Access granted to authenticated user profile."
        );
        return ResponseEntity.ok(ApiResponse.success("Authenticated user profile data", profileInfo));
    }

    @GetMapping("/lawyer-desk")
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> getLawyerDesk(Authentication authentication) {
        Map<String, String> deskInfo = Map.of(
                "accessLevel", "Lawyer / Practitioner Portal",
                "lawyerUser", authentication.getName(),
                "activeCasesCount", "12 Active Case Briefs",
                "courtSchedule", "High Court - Bench 3 at 10:30 AM"
        );
        return ResponseEntity.ok(ApiResponse.success("Lawyer desk access granted", deskInfo));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("All registered users retrieved for admin", users));
    }
}
