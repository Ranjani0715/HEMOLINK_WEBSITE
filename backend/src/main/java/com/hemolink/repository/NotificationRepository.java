package com.hemolink.repository;

import com.hemolink.model.Notification;
import com.hemolink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
}
