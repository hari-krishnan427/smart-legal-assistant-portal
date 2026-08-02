package com.smartlegal.portal.config;

import com.smartlegal.portal.entity.Role;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("harikrishnanboopalan2@gmail.com")) {
            User demoUser = new User();
            demoUser.setFullName("Hari Krishnan");
            demoUser.setEmail("harikrishnanboopalan2@gmail.com");
            demoUser.setPassword(passwordEncoder.encode("hari@2006"));
            demoUser.setRole(Role.ROLE_USER);
            userRepository.save(demoUser);
        }
    }
}
