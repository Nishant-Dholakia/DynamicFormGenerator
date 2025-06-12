package org.project.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private UUID id;
    private String type; // text, email, number, select, radio, checkbox, textarea
    private String label;
    private String placeholder;
    private boolean required;
    private Integer order;
    private List<String> options; // For select, radio, checkbox questions
}
