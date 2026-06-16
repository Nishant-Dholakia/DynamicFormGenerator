package org.project.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "form_submissions", indexes = {
        @Index(name = "idx_email_submission", columnList = "emailid")
})// to make indexing on emailid faster
//@JsonIgnoreProperties(ignoreUnknown = true)
public class FormSubmissions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID submissionid;

    @Column(nullable = false)
    private String emailid;// to know which user

    @ManyToOne
    @JoinColumn(name = "form_id")
    @JsonIgnoreProperties(value = {"questions", "submissions", "user"}, allowSetters = true)
    private FormData form;

    @OneToMany(mappedBy = "submission",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"submission"}, allowSetters = true)
    private List<Answer> answers = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime submittedAt;


}
