package org.project.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonManagedReference("form-question")
    private List<Question> questions;


    @OneToMany(mappedBy = "form",cascade = CascadeType.ALL)
    @JsonManagedReference("form-submission")
    private List<FormSubmissions> submissions;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Boolean isActive = true;


}
