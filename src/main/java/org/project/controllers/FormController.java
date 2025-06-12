package org.project.controllers;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.project.dto.FormDto;
import org.project.entities.FormData;
import org.project.service.FormService;
import org.project.service.QuestionService;
import org.project.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/form")
@RequiredArgsConstructor
public class FormController {
    private final FormService formService;
    private final UserService userService;
    private final QuestionService questionService;

    @PostMapping("/save")
    public ResponseEntity<?> saveForm(@RequestBody FormDto formDto, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(formDto);
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authentication required");
        }

        try {
            String username = auth.getName();
            FormData savedForm = formService.createFormWithRelationships(formDto, username);
            return ResponseEntity.ok(savedForm);
        } catch (Exception e) {
            System.out.println("Error saving form: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving form: " + e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public FormData getForm(@PathVariable("id") UUID id)
    {
        return formService.getFormById(id);
    }

    @GetMapping("/all")
    public List<FormData> getAllForms()
    {
        return formService.getAllForms();
    }

    @PutMapping(path = "/update", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateForm(@RequestBody FormData formData) {
        try {
            return ResponseEntity.ok(formService.updateForm(formData));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred in updating: " + e.getMessage());
        }
    }

    @PutMapping("/toggle/{id}")
    public void toggleActive(@PathVariable("id") UUID id)
    {
        formService.toggleActive(id);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteForm(@PathVariable("id") UUID id)
    {
        formService.deleteFormById(id);
        return ResponseEntity.ok("Form deleted");
    }





}
