package org.project.service;


import lombok.RequiredArgsConstructor;
import org.project.entities.Question;
import org.project.repositories.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    public Question saveQuestion(Question question)
    {
        return questionRepository.save(question);
    }

    public Optional<Question> getQuestionById(UUID id)
    {
        return questionRepository.findById(id);
    }
}
