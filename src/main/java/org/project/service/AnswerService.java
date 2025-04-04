package org.project.service;


import lombok.RequiredArgsConstructor;
import org.project.entities.Answer;
import org.project.repositories.AnswerRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    public Answer saveAnswer(Answer answer)
    {
        return answerRepository.save(answer);
    }
}
