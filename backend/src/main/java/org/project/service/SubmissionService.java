package org.project.service;


import lombok.RequiredArgsConstructor;
import org.project.entities.Answer;
import org.project.entities.FormData;
import org.project.entities.FormSubmissions;
import org.project.repositories.FormSubmissionsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final FormSubmissionsRepository formSubmissionsRepository;
    private final FormService formService;
    private final QuestionService questionService;

    @Transactional
    public FormSubmissions submitForm(FormSubmissions formSubmissions)
    {
        prepareSubmissionForSave(formSubmissions, true);
        return formSubmissionsRepository.save(formSubmissions);
    }

    public Optional<FormSubmissions> getSubmissionById(UUID id)
    {
        return formSubmissionsRepository.findById(id);
    }

    public List<FormSubmissions> getAllSubmissions()
    {
        return formSubmissionsRepository.findAll();
    }

    @Transactional
    public void deleteSubmissionById(UUID id)
    {
        if (!formSubmissionsRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found");
        }
        formSubmissionsRepository.deleteById(id);
    }


    public List<FormSubmissions> getSubmissionByFormId(UUID id) {
        return formSubmissionsRepository.findByFormId(id);
    }

    @Transactional
    public FormSubmissions updateSubmission(FormSubmissions formSubmission) {
        if (formSubmission == null || formSubmission.getSubmissionid() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission id is required");
        }
        FormSubmissions submission = formSubmissionsRepository.findById(formSubmission.getSubmissionid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        if (formSubmission.getEmailid() != null && !formSubmission.getEmailid().isBlank()) {
            submission.setEmailid(formSubmission.getEmailid());
        }
        if (formSubmission.getForm() != null && formSubmission.getForm().getFormid() != null) {
            submission.setForm(formService.getFormById(formSubmission.getForm().getFormid()));
        }
        if (formSubmission.getAnswers() != null) {
            submission.getAnswers().clear();
            for (Answer answer : prepareAnswers(formSubmission.getAnswers(), submission)) {
                submission.getAnswers().add(answer);
            }
        }
        submission.setSubmittedAt(LocalDateTime.now());
        return formSubmissionsRepository.save(submission);

    }

    private void prepareSubmissionForSave(FormSubmissions submission, boolean forceNewSubmission) {
        if (submission == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission payload is required");
        }
        if (submission.getEmailid() == null || submission.getEmailid().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submitter email is required");
        }
        if (submission.getForm() == null || submission.getForm().getFormid() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form id is required");
        }
        if (submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one answer is required");
        }

        FormData formData = formService.getFormById(submission.getForm().getFormid());
        if (Boolean.FALSE.equals(formData.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form is inactive");
        }

        if (forceNewSubmission) {
            submission.setSubmissionid(null);
        }
        submission.setForm(formData);
        submission.setAnswers(prepareAnswers(submission.getAnswers(), submission));
    }

    private List<Answer> prepareAnswers(List<Answer> answers, FormSubmissions submission) {
        List<Answer> preparedAnswers = new ArrayList<>();
        for (Answer answer : answers) {
            if (answer == null || answer.getQuestion() == null || answer.getQuestion().getQuestionid() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Every answer must include a question id");
            }

            answer.setAnswerid(null);
            answer.setQuestion(questionService.getQuestionById(answer.getQuestion().getQuestionid())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found")));
            answer.setSubmission(submission);
            preparedAnswers.add(answer);
        }
        return preparedAnswers;
    }
}
