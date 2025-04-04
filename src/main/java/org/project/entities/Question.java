package org.project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.project.mapToJsonConverter.QuestionConverter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "form")
public class Question {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID questionid;
        private String question;
        private String answer_type;

        @ManyToOne
        @JoinColumn(name = "form_id")
        @JsonBackReference("form-question")
        private FormData form;

        @Column(columnDefinition = "TEXT") // Stores as JSON string
        @JdbcTypeCode(SqlTypes.JSON) // Hibernate 6+ supports JSON directly
        private List<String> options;

        private String placeholder;
        private Boolean is_required;

        @Convert(converter = QuestionConverter.class)
        @Column(columnDefinition = "TEXT")
        private Map<String, String > validations;

        private String defaultValue;
        private int orderno;

}
