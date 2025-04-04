package org.project.service;

import lombok.RequiredArgsConstructor;
import org.project.entities.FormData;
import org.project.entities.Question;
import org.project.repositories.FormDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FormService {
    private final FormDataRepository formDataRepository;
    private final QuestionService questionService;

    public FormData addForm(FormData formData)
    {
        return formDataRepository.save(formData);
    }

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

    public void deleteFormById(UUID id)
    {
        formDataRepository.deleteById(id);
    }

    public void toggleActive(UUID id) {
        FormData form = formDataRepository.findById(id).orElseThrow(()-> new RuntimeException("Form not found"));
        form.setIsActive(!form.getIsActive());
        formDataRepository.save(form);
    }
}
