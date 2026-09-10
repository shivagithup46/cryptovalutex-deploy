package com.cryptovaultx.controller;

import com.cryptovaultx.dto.UserProfileDto;
import com.cryptovaultx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import java.security.Principal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfileByEmail(principal.getName()));
    }

    @PostMapping("/reset-demo")
    public ResponseEntity<String> resetDemoAccount(Principal principal) {
        UserProfileDto user = userService.getUserProfileByEmail(principal.getName());
        userService.resetDemoAccount(user.getId());
        return ResponseEntity.ok("Demo account reset successfully");
    }
}
