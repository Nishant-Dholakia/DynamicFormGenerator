package org.project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.project.dto.QuestionDto;
import org.project.mapToJsonConverter.QuestionConverter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"form"})
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

        // Constructor from QuestionDto with options conversion
        public Question(QuestionDto dto) {
                this.question = dto.getLabel();
                this.answer_type = dto.getType();
                this.placeholder = dto.getPlaceholder();
                this.is_required = dto.isRequired();
                this.orderno = dto.getOrder() != null ? dto.getOrder() : 0;

                // Convert DTO options (Object) to Entity options (String)
                this.options = dto.getOptions();
        }

        // Constructor from QuestionDto with FormData
        public Question(QuestionDto dto, FormData form) {
                this(dto);
                this.form = form;
        }


}
