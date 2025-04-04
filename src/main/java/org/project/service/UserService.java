package org.project.service;

import lombok.RequiredArgsConstructor;
import org.project.entities.User;
import org.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

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

    public Optional<User> getUSerByUsername(String username)
    {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers()// only for admin
    {
        return userRepository.findAll();
    }



    public void deleteUserById(UUID id)
    {
        userRepository.deleteById(id);
    }

    public void deleteUserByUsername(String username)
    {
        userRepository.deleteByUsername(username);
    }


    public void toggleEnable(UUID id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("USer not found"));
        user.setEnabled(!user.getEnabled());
        userRepository.save(user);
    }
}
