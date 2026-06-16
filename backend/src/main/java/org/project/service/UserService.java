package org.project.service;

import lombok.RequiredArgsConstructor;
import org.project.entities.User;
import org.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Transactional
    public User addUser(User user)
    {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User payload is required");
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (user.getEmailid() == null || user.getEmailid().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (userRepository.findByUsernameOrEmailid(user.getUsername()).isPresent()
                || userRepository.findByUsernameOrEmailid(user.getEmailid()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email already exists");
        }

        user.setUserid(null);
        user.setForms(null);
        // Force role to USER to prevent admin signup/creation via registration
        user.setRole("USER");
        if (user.getEnabled() == null) {
            user.setEnabled(true);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public List<User> getAllUsers()// only for admin
    {
        return userRepository.findAll();
    }
    @Transactional
    public void deleteUserById(UUID id)
    {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    public void toggleEnable(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setEnabled(!user.getEnabled());
        userRepository.save(user);
    }
    @Transactional
    public User updateUser(User user) {
        if (user == null || user.getUserid() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id is required");
        }
        User existingUser = userRepository.findById(user.getUserid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getEmailid() != null) existingUser.setEmailid(user.getEmailid());
        if (user.getContact() != 0) existingUser.setContact(user.getContact());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getRole() != null && !user.getRole().isBlank()) {
            String updatedRole = user.getRole().replace("ROLE_", "").toUpperCase();
            if (!"ADMIN".equals(updatedRole)) {
                existingUser.setRole(updatedRole);
            }
        }
        if (user.getEnabled() != null) {
            existingUser.setEnabled(user.getEnabled());
        }

        return userRepository.save(existingUser);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsernameOrEmailid(username).orElseThrow(()->new UsernameNotFoundException("Invalid username "+username));
    }
}
