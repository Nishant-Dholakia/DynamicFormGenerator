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
            if (submission == null)
                throw new RuntimeException("Submission not specified...");
            if (submission.getForm() == null || submission.getForm().getFormid() == null)
                throw new RuntimeException("Form not specified...");

            // Fetch the form to ensure it's managed by JPA
            FormData formData = formService.getFormById(submission.getForm().getFormid());
            submission.setForm(formData);
            submission.setSubmissionid(null); // Ensuring it's a new submission

            // Save the submission FIRST
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

                if (ans.getAnswerid() == null) {
                    acceptedAns.add(answerService.saveAnswer(ans));
                } else {
                    // Fetch existing answer and update it
                    Answer existingAnswer = answerService.getAnswerById(ans.getAnswerid())
                            .orElseThrow(() -> new RuntimeException("Answer not found!"));
                    existingAnswer.setResponse(ans.getResponse()); // Only update response
                    acceptedAns.add(answerService.saveAnswer(existingAnswer));
                }
            }

            submission.setAnswers(acceptedAns);

            return ResponseEntity.ok("Form Submitted: " + submission);
        } catch (Exception e) {
            System.out.println("Error in submission save: ");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Form submission failed: " + e.getMessage());
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
