package org.project.service;


import lombok.RequiredArgsConstructor;
import org.project.entities.Answer;
import org.project.repositories.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    public Answer saveAnswer(Answer answer)
    {
        return answerRepository.save(answer);
    }

    public Optional<Answer> getAnswerById(UUID answerid) {
        return answerRepository.findById(answerid);
    }
}
