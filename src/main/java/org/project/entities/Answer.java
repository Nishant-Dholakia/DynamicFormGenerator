package org.project.entities;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.project.mapToJsonConverter.AnswerConverter;
import java.util.Map;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"question", "submission"})
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID answerid;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonBackReference("question-answer")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "submission_id")
    @JsonBackReference("submission-answer")
    private FormSubmissions submission;

    @Convert(converter = AnswerConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> response;

}
