package org.project.service;


import lombok.RequiredArgsConstructor;
import org.project.entities.FormSubmissions;
import org.project.repositories.FormSubmissionsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final FormSubmissionsRepository formSubmissionsRepository;

    public FormSubmissions submitForm(FormSubmissions formSubmissions)
    {
        return formSubmissionsRepository.save(formSubmissions);
    }

    public Optional<FormSubmissions> getSubmissionById(UUID id)
    {
        return formSubmissionsRepository.findById(id);
    }
    public Optional<FormSubmissions> getSubmissionByEmailid(String emailid)
    {
        return formSubmissionsRepository.findByEmailid(emailid);
    }
    public List<FormSubmissions> getAllSubmissions()
    {
        return formSubmissionsRepository.findAll();
    }

    public void deleteSubmissionById(UUID id)
    {
        formSubmissionsRepository.deleteById(id);
    }
    public void deleteSubmissionByEmailid(String emailid)
    {
        formSubmissionsRepository.deleteByEmailid(emailid);
    }


    public List<FormSubmissions> getSubmissionByFormId(UUID id) {
        return formSubmissionsRepository.findByFormId(id);
    }

    public FormSubmissions updateSubmission(FormSubmissions formSubmission) {
        FormSubmissions submission = formSubmissionsRepository.findById(formSubmission.getSubmissionid()).orElseThrow(()->new RuntimeException("Submission not found..."));

        submission.setAnswers(formSubmission.getAnswers());
        submission.setForm(formSubmission.getForm());
        submission.setEmailid(formSubmission.getEmailid());
        submission.setSubmittedAt(LocalDateTime.now());
        return formSubmissionsRepository.save(submission);

    }
}
