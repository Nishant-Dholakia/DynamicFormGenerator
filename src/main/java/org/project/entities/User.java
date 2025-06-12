package org.project.entities;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.project.dto.UserDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "forms")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID userid;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String emailid;

    @Column(nullable = false)
    private long contact;

    @Column(nullable = false)
    private String role = "USER";

    private Boolean enabled = true;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonManagedReference("user-form")
    private List<FormData> forms;

    public User(UserDto dto) {
        this.userid = dto.getId();
        this.username = dto.getUsername();
        this.emailid = dto.getEmailid();
        this.contact = dto.getContact();
        this.role = dto.getRole() != null ? dto.getRole() : "USER";
        this.enabled = dto.isEnabled();

    }
}
