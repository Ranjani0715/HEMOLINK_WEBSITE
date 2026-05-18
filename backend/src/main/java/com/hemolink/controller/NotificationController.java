package com.hemolink.controller;

import com.hemolink.model.Notification;
import com.hemolink.model.User;
import com.hemolink.repository.NotificationRepository;
import com.hemolink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification note = notificationRepository.findById(id).orElse(null);
        if (note == null) return ResponseEntity.notFound().build();
        note.setRead(true);
        notificationRepository.save(note);
        return ResponseEntity.ok().build();
    }
}
