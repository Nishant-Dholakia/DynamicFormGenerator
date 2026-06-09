package org.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.project.entities.User;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String username;
    private String emailid;
    private long contact;
    private String role;
    private boolean enabled;

    public UserDto(User user)
    {
        this.id = user.getUserid();
        this.username = user.getUsername();
        this.emailid = user.getEmailid();
        this.contact = user.getContact();
        this.role = user.getRole();
        this.enabled = user.getEnabled();
    }
}