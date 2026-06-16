package org.project.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.project.dto.FormDto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"questions", "submissions", "user"})
public class FormData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID formid;

    @ManyToOne
    @JoinColumn(name="user_id",nullable = false)
    @JsonBackReference("user-form")
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("form-question")
    private List<Question> questions = new ArrayList<>();


    @OneToMany(mappedBy = "form",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"form"}, allowSetters = true)
    private List<FormSubmissions> submissions = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Boolean isActive = true;



    // Constructor from FormDto
    public FormData(FormDto dto) {
        this.title = dto.getTitle();
//        this.description = dto.getDescription();
        this.isActive = dto.isActive();
        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
        this.category = dto.getCategory();
        // Convert QuestionDtos to Questions
        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            this.questions = dto.getQuestions().stream()
                    .map(questionDto -> new Question(questionDto, this))
                    .collect(Collectors.toList());
        }
    }

    public FormData(FormDto dto, User user)
    {
        this(dto);
        this.user = user;
    }

}
