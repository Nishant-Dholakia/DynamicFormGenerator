package org.project.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.project.dto.FormDto;
import org.project.entities.FormData;
import org.project.entities.Question;
import org.project.entities.User;
import org.project.repositories.FormDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FormService {
    private final FormDataRepository formDataRepository;
    private final QuestionService questionService;
    private final UserService userService;
    @Transactional
    public FormData createFormWithRelationships(FormDto formDto, String username) {
        // Get user
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not found: " + username);
        }

        // Create form with user relationship
        FormData formData = new FormData(formDto, user);

        // The constructor already handles question relationships, but let's ensure they're properly set
        if (formData.getQuestions() != null) {
            formData.getQuestions().forEach(question -> {
                question.setForm(formData); // Ensure bidirectional relationship
            });
        }

        // Save form (cascade will save questions)
        return formDataRepository.save(formData);
    }

    @Transactional
    public FormData updateForm(FormData updatedForm) {
        UUID formId = updatedForm.getFormid();
        Optional<FormData> existingFormOpt = formDataRepository.findById(formId);

        if (existingFormOpt.isPresent()) {
            FormData existingForm = existingFormOpt.get();

            existingForm.setTitle(updatedForm.getTitle());
            existingForm.setIsActive(updatedForm.getIsActive());

            List<Question> updatedQuestions = updatedForm.getQuestions();
            for (Question question : updatedQuestions) {
                question.setForm(existingForm);
                questionService.saveQuestion(question);
            }

            existingForm.setQuestions(updatedQuestions);

            return formDataRepository.save(existingForm);
        } else {
            throw new RuntimeException("Form not found!");
        }
    }

    public FormData getFormById(UUID id)
    {
        return formDataRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
    }
    public List<FormData> getAllForms()
    {
        return formDataRepository.findAll();
    }

    @Transactional
    public void deleteFormById(UUID id)
    {
        formDataRepository.deleteById(id);
    }

    @Transactional
    public void toggleActive(UUID id) {
        FormData form = formDataRepository.findById(id).orElseThrow(()-> new RuntimeException("Form not found"));
        form.setIsActive(!form.getIsActive());
        formDataRepository.save(form);
    }
}
