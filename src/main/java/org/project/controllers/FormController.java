package org.project.controllers;


import lombok.RequiredArgsConstructor;
import org.project.entities.FormData;
import org.project.entities.Question;
import org.project.entities.User;
import org.project.service.FormService;
import org.project.service.QuestionService;
import org.project.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/form")
@RequiredArgsConstructor
public class FormController {
    private final FormService formService;
    private final UserService userService;
    private final QuestionService questionService;

    @PostMapping("/save")
    public ResponseEntity<String> addForm(@RequestBody FormData formData)
    {
        if (formData.getUser() != null && formData.getUser().getUserid() != null) {
            User user = userService.getUserById(formData.getUser().getUserid());
            if(user == null)
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found");
            formData.setUser(user);
        } else {
            throw new RuntimeException("User is required!");
        }
        formData = formService.addForm(formData);
        List<Question> questionList = formData.getQuestions();
        List<Question> savedQuestions = new ArrayList<>();
        for(var question: questionList){
            Question que  = questionService.saveQuestion(question);
            savedQuestions.add(que);
        }
        formData.setQuestions(savedQuestions);
        FormData savedForm = formService.addForm(formData);
        return ResponseEntity.ok("savedForm "+savedForm);
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
