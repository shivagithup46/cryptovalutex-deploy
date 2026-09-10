package com.cryptovaultx.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    @MessageMapping("/chat/support")
    @SendTo("/topic/support")
    public Map<String, String> handleSupportChat(@Payload Map<String, String> message) {
        // Echo back for now. In reality, route to Admin dashboard or AI agent.
        return Map.of(
                "sender", message.getOrDefault("sender", "User"),
                "content", message.getOrDefault("content", ""),
                "timestamp", String.valueOf(System.currentTimeMillis())
        );
    }
    
    @MessageMapping("/chat/p2p")
    @SendTo("/topic/p2p")
    public Map<String, String> handleP2pChat(@Payload Map<String, String> message) {
        return Map.of(
                "sender", message.getOrDefault("sender", "User"),
                "content", message.getOrDefault("content", ""),
                "timestamp", String.valueOf(System.currentTimeMillis())
        );
    }
}
