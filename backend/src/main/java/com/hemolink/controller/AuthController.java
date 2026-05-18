package com.hemolink.controller;

import com.hemolink.model.User;
import com.hemolink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        // Simplified for simulation
        return ResponseEntity.ok("JWT_TOKEN_HERE");
    }
}
