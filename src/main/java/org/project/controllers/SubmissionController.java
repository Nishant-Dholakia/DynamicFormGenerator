package org.project.controllers;


import lombok.RequiredArgsConstructor;
import org.project.entities.Answer;
import org.project.entities.FormData;
import org.project.entities.FormSubmissions;
import org.project.entities.Question;
import org.project.service.AnswerService;
import org.project.service.FormService;
import org.project.service.QuestionService;
import org.project.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/submission")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final FormService formService;
    private final QuestionService questionService;
    private final AnswerService answerService;

    @PostMapping(path = "/save", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<String> saveSubmission(@RequestBody FormSubmissions submission) {
        try {
            if (submission.getForm() == null || submission.getForm().getFormid() == null) {
                throw new RuntimeException("Form not specified...");
            }

            // Fetch the form from DB to ensure it exists
            FormData formData = formService.getFormById(submission.getForm().getFormid())
                    .orElseThrow(() -> new RuntimeException("Form not found!"));
            submission.setForm(formData);

            // Save submission FIRST to prevent transient issues
            submission = submissionService.submitForm(submission);

            List<Answer> acceptedAns = new ArrayList<>();
            for (Answer ans : submission.getAnswers()) {
                if (ans.getQuestion() == null || ans.getQuestion().getQuestionid() == null) {
                    throw new RuntimeException("Invalid question reference in answer!");
                }

                // Fetch question to ensure it's managed
                Question ques = questionService.getQuestionById(ans.getQuestion().getQuestionid())
                        .orElseThrow(() -> new RuntimeException("Question not found!"));
                ans.setQuestion(ques);
                ans.setSubmission(submission);
                ans.setAnswerid(null);
                acceptedAns.add(answerService.saveAnswer(ans));
            }

            submission.setAnswers(acceptedAns);
            submissionService.submitForm(submission);

            return ResponseEntity.ok("Form Submitted: " + submission);
        } catch (Exception e) {
            System.out.println("Error in submission save: ");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Form submission failed");
        }
    }

    @GetMapping("/all")
    public List<FormSubmissions> getAllSubmissions()
    {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/get/{id}")
    public FormSubmissions getSubmissionById(@PathVariable("id")UUID id)
    {
        return submissionService.getSubmissionById(id).orElseThrow(()->new RuntimeException("Submission not found"));
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
