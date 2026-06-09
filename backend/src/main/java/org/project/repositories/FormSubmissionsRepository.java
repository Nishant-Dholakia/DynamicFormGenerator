package org.project.repositories;
import org.project.entities.FormSubmissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository

public interface FormSubmissionsRepository extends JpaRepository<FormSubmissions, UUID>
{
    @Query("from FormSubmissions fs where fs.form.formid =:id ")
    List<FormSubmissions> findByFormId(@Param("id") UUID id);
}
