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
import java.util.Optional;
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
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User u1 = userRepository.save(user);
        System.out.println("user added: " + u1);
        return u1;
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
        userRepository.deleteById(id);
    }

    public void toggleEnable(UUID id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        user.setEnabled(!user.getEnabled());
        userRepository.save(user);
    }
    @Transactional
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getUserid())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getEmailid() != null) existingUser.setEmailid(user.getEmailid());
        if (user.getContact() != 0) existingUser.setContact(user.getContact());

        return userRepository.save(existingUser);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsernameOrEmailid(username).orElseThrow(()->new UsernameNotFoundException("Invalid username "+username));
    }
}
