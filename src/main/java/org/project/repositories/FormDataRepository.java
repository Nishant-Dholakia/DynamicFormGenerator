package org.project.repositories;
import org.project.entities.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository

public interface FormDataRepository extends JpaRepository<FormData, UUID>
{

    Optional<FormData> findByTitle(String title);

    @Query("delete from FormData f where f.title=:title")
    void deleteByTitle(@Param("title") String title);
}
