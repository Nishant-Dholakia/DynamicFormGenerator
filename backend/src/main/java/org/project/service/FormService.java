package org.project.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.project.dto.FormDto;
import org.project.entities.FormData;
import org.project.entities.Question;
import org.project.entities.User;
import org.project.repositories.FormDataRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FormService {
    private final FormDataRepository formDataRepository;
    private final UserService userService;
    @Transactional
    public FormData createFormWithRelationships(FormDto formDto, String username) {
        if (formDto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form payload is required");
        }
        if (formDto.getTitle() == null || formDto.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form title is required");
        }
        if (formDto.getCategory() == null || formDto.getCategory().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form category is required");
        }

        User user = userService.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not found: " + username);
        }

        FormData formData = new FormData(formDto, user);

        if (formData.getQuestions() != null) {
            formData.getQuestions().forEach(question -> question.setForm(formData));
        }

        return formDataRepository.save(formData);
    }

    @Transactional
    public FormData updateForm(FormData updatedForm) {
        if (updatedForm == null || updatedForm.getFormid() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form id is required");
        }
        UUID formId = updatedForm.getFormid();
        Optional<FormData> existingFormOpt = formDataRepository.findById(formId);

        if (existingFormOpt.isPresent()) {
            FormData existingForm = existingFormOpt.get();

            if (updatedForm.getTitle() != null && !updatedForm.getTitle().isBlank()) {
                existingForm.setTitle(updatedForm.getTitle());
            }
            if (updatedForm.getCategory() != null && !updatedForm.getCategory().isBlank()) {
                existingForm.setCategory(updatedForm.getCategory());
            }
            if (updatedForm.getIsActive() != null) {
                existingForm.setIsActive(updatedForm.getIsActive());
            }

            List<Question> updatedQuestions = updatedForm.getQuestions();
            if (updatedQuestions != null) {
                existingForm.getQuestions().clear();
                for (Question question : updatedQuestions) {
                    question.setForm(existingForm);
                    existingForm.getQuestions().add(question);
                }
            }

            return formDataRepository.save(existingForm);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Form not found");
        }
    }

    public FormData getFormById(UUID id)
    {
        return formDataRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Form not found"));
    }
    public List<FormData> getAllForms()
    {
        return formDataRepository.findAll();
    }

    @Transactional
    public void deleteFormById(UUID id)
    {
        if (!formDataRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Form not found");
        }
        formDataRepository.deleteById(id);
    }

    @Transactional
    public void toggleActive(UUID id) {
        FormData form = formDataRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Form not found"));
        form.setIsActive(!form.getIsActive());
        formDataRepository.save(form);
    }
}
