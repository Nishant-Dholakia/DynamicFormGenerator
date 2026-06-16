package org.project.config;

import lombok.RequiredArgsConstructor;
import org.project.entities.User;
import org.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:adminpassword}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (adminUsername == null || adminUsername.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }

        // 1. Ensure the configured admin exists and has the correct password and role
        Optional<User> adminOpt = userRepository.findByUsernameOrEmailid(adminUsername);
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setRole("ADMIN");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEnabled(true);
            userRepository.save(admin);
        } else {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmailid(adminUsername + "@admin.com");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        // 2. Demote any other users who might have ROLE_ADMIN in the database (e.g. from previous signups)
        List<User> allUsers = userRepository.findAll();
        for (User u : allUsers) {
            if ("ADMIN".equals(u.getRole()) && !u.getUsername().equals(adminUsername)) {
                u.setRole("USER");
                userRepository.save(u);
            }
        }
    }
}
