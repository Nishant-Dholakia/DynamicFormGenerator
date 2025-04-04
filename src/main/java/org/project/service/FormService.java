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

            // ✅ Update fields (excluding questions initially)
            existingForm.setTitle(updatedForm.getTitle());
            existingForm.setIsActive(updatedForm.getIsActive());

            // ✅ Handle questions (save new and update existing)
            List<Question> updatedQuestions = updatedForm.getQuestions();
            for (Question question : updatedQuestions) {
                question.setForm(existingForm); // 🔥 Ensure the question references the form
                questionService.saveQuestion(question);
            }

            existingForm.setQuestions(updatedQuestions);

            // ✅ Save the updated form
            return formDataRepository.save(existingForm);
        } else {
            throw new RuntimeException("Form not found!");
        }
    }

    public Optional<FormData> getFormById(UUID id)
    {
        return formDataRepository.findById(id);
    }
    public List<FormData> getAllForms()
    {
        return formDataRepository.findAll();
    }
    public Optional<FormData> getFormByTitle(String title)
    {
        return formDataRepository.findByTitle(title);
    }

    public void deleteFormById(UUID id)
    {
        formDataRepository.deleteById(id);
    }
    public void deleteFormByTitle(String title)
    {
        formDataRepository.deleteByTitle(title);
    }

    public void toggleActive(UUID id) {
        FormData form = formDataRepository.findById(id).orElseThrow(()-> new RuntimeException("Form not found"));
        form.setIsActive(!form.getIsActive());
        formDataRepository.save(form);
    }
}
