package com.hemolink.service;

import com.hemolink.model.User;
import com.hemolink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
