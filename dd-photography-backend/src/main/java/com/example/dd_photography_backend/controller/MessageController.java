package com.example.dd_photography_backend.controller;

import com.example.dd_photography_backend.model.Message;
import com.example.dd_photography_backend.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // Get all messages of a user by email
    @GetMapping("/{email}")
    public List<Message> getMessagesByUser(@PathVariable String email) {
        return messageRepository.findByEmailOrderByCreatedAtAsc(email);
    }

    // Get all users who sent/received messages
    @GetMapping("/users")
    public List<String> getAllUsers() {
        return messageRepository.findDistinctEmails();
    }


    // Send a message (admin or user)
    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        message.setReadStatus(false);
        return messageRepository.save(message);
    }

    // Mark a message as read
    @PutMapping("/{id}")
    public Message markAsRead(@PathVariable Long id) {
        Message msg = messageRepository.findById(id).orElseThrow(() -> new RuntimeException("Message not found"));
        msg.setReadStatus(true);
        return messageRepository.save(msg);
    }

    // Delete a message
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        messageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
