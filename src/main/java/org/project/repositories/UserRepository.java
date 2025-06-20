package org.project.repositories;

import org.project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository

public interface UserRepository extends JpaRepository<User, UUID>
{

        @Query("SELECT u FROM User u WHERE u.username = :uname OR u.emailid = :uname")
        Optional<User> findByUsernameOrEmailid(@Param("uname") String uname);

}
