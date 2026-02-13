package com.example.dd_photography_backend.repository;

import com.example.dd_photography_backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByEmailOrderByCreatedAtAsc(String email); // get all messages of a user
    @Query("SELECT DISTINCT m.email FROM Message m")
    List<String> findDistinctEmails(); // get all users who have messages


    Long countByReadStatus(boolean b);
}
