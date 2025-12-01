package com.opentheshare.controller;

import com.opentheshare.dto.ApiResponse;
import com.opentheshare.dto.LoginRequestDto;
import com.opentheshare.dto.UserRegistrationDto;
import com.opentheshare.entity.User;
import com.opentheshare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signup(@RequestBody UserRegistrationDto dto) {
        User user = userService.register(dto);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@RequestBody LoginRequestDto dto) {
        User user = userService.authenticate(dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Login successful", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // In a stateless JWT auth, logout is handled client-side by deleting the token.
        // For session-based, we would invalidate session here.
        // For now, just return success.
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
