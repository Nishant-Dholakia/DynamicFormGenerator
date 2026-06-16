package org.project.controllers;

import lombok.RequiredArgsConstructor;
import org.project.entities.FormSubmissions;
import org.project.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/submission")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping(path = "/save", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<String> saveSubmission(@RequestBody FormSubmissions submission) {
        submissionService.submitForm(submission);
        return ResponseEntity.ok("Form submitted");
    }


    @GetMapping("/all")
    public List<FormSubmissions> getAllSubmissions()
    {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/get/{id}")
    public FormSubmissions getSubmissionById(@PathVariable("id")UUID id)
    {
        return submissionService.getSubmissionById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
    }

    @GetMapping("/form/{id}")
    public List<FormSubmissions> getAllSubmissionsForFormById(@PathVariable("id") UUID id)
    {
        return submissionService.getSubmissionByFormId(id);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateSubmission(@RequestBody FormSubmissions formSubmission)
    {
        try {
            return ResponseEntity.ok("submission updated: "+submissionService.updateSubmission(formSubmission));

        } catch (Exception e) {
            // Log the full exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred in updating submission: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSubmissionById(@PathVariable("id")UUID id)
    {
        submissionService.deleteSubmissionById(id);
        return ResponseEntity.ok("Submission Deleted");
    }



}
