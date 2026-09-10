package com.cryptovaultx.service;

import com.cryptovaultx.dto.RegisterRequest;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private RedisService redisService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_ValidRequest_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@test.com");
        request.setPassword("Password123!");
        
        when(userRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(encoder.encode(anyString())).thenReturn("encodedPass");
        
        authService.register(request);
        
        verify(userRepository, times(1)).save(any(User.class));
        verify(redisService, times(1)).save(anyString(), anyString(), anyLong(), any());
        verify(emailService, times(1)).sendOtp(anyString(), anyString());
    }
}
