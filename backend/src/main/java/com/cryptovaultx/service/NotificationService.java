package com.cryptovaultx.service;

import com.cryptovaultx.entity.Notification;
import com.cryptovaultx.entity.NotificationPreferences;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.NotificationPreferencesRepository;
import com.cryptovaultx.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferencesRepository preferencesRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void createNotification(User user, String title, String message, String type) {
        // Fetch user preferences
        NotificationPreferences prefs = preferencesRepository.findByUserId(user.getId()).orElse(null);
        
        // If preferences exist, check if this type of notification is enabled
        if (prefs != null && !isNotificationTypeEnabled(prefs, type)) {
            return; // Skip notification
        }

        // Save to DB
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        
        Notification saved = notificationRepository.save(notification);

        // Send via STOMP WebSocket
        // Using a topic specific to the user ID: /topic/notifications-{userId}
        messagingTemplate.convertAndSend("/topic/notifications-" + user.getId(), saved);
    }

    private boolean isNotificationTypeEnabled(NotificationPreferences prefs, String type) {
        if (type == null) return true; // Default true if no type
        return switch (type.toUpperCase()) {
            case "BUY" -> prefs.isBuyAlerts();
            case "SELL" -> prefs.isSellAlerts();
            case "DEPOSIT" -> prefs.isDepositAlerts();
            case "WITHDRAWAL" -> prefs.isWithdrawalAlerts();
            case "TRADE" -> prefs.isTradeExecutionAlerts();
            case "PORTFOLIO" -> prefs.isPortfolioUpdates();
            case "PRICE" -> prefs.isPriceAlerts();
            default -> true;
        };
    }

    // Legacy method for backwards compatibility if used elsewhere (just in case)
    public void sendPushNotification(User user, String title, String message, String type) {
        createNotification(user, title, message, type);
    }

    public void sendEmailNotification(User user, String title, String message) {
        // Currently a mock, can integrate SendGrid/SES later
        System.out.println("Sending EMAIL to " + user.getEmail() + ": " + title);
    }
}
