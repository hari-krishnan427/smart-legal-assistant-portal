package com.smartlegal.portal.service.impl;

import com.smartlegal.portal.dto.auth.*;
import com.smartlegal.portal.entity.RefreshToken;
import com.smartlegal.portal.entity.Role;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.exception.EmailAlreadyExistsException;
import com.smartlegal.portal.exception.TokenRefreshException;
import com.smartlegal.portal.repository.UserRepository;
import com.smartlegal.portal.security.JwtTokenProvider;
import com.smartlegal.portal.security.UserPrincipal;
import com.smartlegal.portal.service.AuthService;
import com.smartlegal.portal.service.RefreshTokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId());

        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userPrincipal.getEmail()));

        UserDto userDto = mapToUserDto(user);

        return new AuthResponse(accessToken, refreshToken.getToken(), userDto);
    }

    @Override
    @Transactional
    public UserDto register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("An account with email address '" + registerRequest.getEmail() + "' already exists.");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_USER);

        User savedUser = userRepository.save(user);

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    UserPrincipal userPrincipal = UserPrincipal.create(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userPrincipal, null, userPrincipal.getAuthorities());
                    
                    String newAccessToken = tokenProvider.generateToken(authentication);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    
                    return new TokenRefreshResponse(newAccessToken, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void logout(String email, String refreshToken) {
        if (refreshToken != null && !refreshToken.isEmpty()) {
            refreshTokenService.revokeToken(refreshToken);
        } else if (email != null && !email.isEmpty()) {
            userRepository.findByEmail(email).ifPresent(user -> refreshTokenService.deleteByUserId(user.getId()));
        }
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
