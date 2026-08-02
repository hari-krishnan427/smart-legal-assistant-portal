package com.smartlegal.portal.service;

import com.smartlegal.portal.dto.auth.*;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    UserDto register(RegisterRequest registerRequest);

    TokenRefreshResponse refreshToken(RefreshTokenRequest request);

    void logout(String email, String refreshToken);

    UserDto getCurrentUser(String email);
}
