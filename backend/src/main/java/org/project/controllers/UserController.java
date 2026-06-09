package org.project.controllers;


import lombok.RequiredArgsConstructor;
import org.project.entities.User;
import org.project.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/save")
    public ResponseEntity<String> registerUser(@RequestBody User user)
    {
        User u1 = userService.addUser(user);
        System.out.println("user save thyo");
        if(u1 == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not saved");
        return ResponseEntity.ok("User saved");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody User user)
    {
        if(user == null || user.getUserid() == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid userid");

        User u1 = userService.updateUser(user);
        if(u1 == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not updated");
        return ResponseEntity.ok("User Updated");
    }

    @PutMapping("/toggle/{id}")
    public void toggleEnable(@PathVariable("id") UUID id)
    {
        userService.toggleEnable(id);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    @GetMapping("/all")
    public List<User> getAllUsers()
    {
        return userService.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") UUID id)
    {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted");
    }

}
