package com.cryptovaultx.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendVerificationOtp(String to, String otp) {
        if (fromEmail == null || fromEmail.trim().isEmpty()) {
            log.warn("Email service is not configured (MAIL_USERNAME is missing). MOCKING email send to: {} with OTP: {}", to, otp);
            return; // Skip throwing error so local development works
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("CryptoVaultX - Email Verification OTP");
            
            String htmlContent = String.format(
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">" +
                "<h2 style=\"color: #6C5DD3; text-align: center;\">CryptoVaultX</h2>" +
                "<p>Hello,</p>" +
                "<p>Your CryptoVaultX email verification OTP is:</p>" +
                "<div style=\"background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;\">" +
                "%s" +
                "</div>" +
                "<p>This OTP will expire in 5 minutes.</p>" +
                "<p>If you did not request this verification, please ignore this email.</p>" +
                "<br/>" +
                "<p>Regards,<br/>CryptoVaultX Security Team</p>" +
                "</div>", otp
            );

            helper.setText(htmlContent, true); // true indicates html
            
            javaMailSender.send(message);
            log.info("Sent verification OTP email to {}", to);
            
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}", to, e);
            throw new RuntimeException("Unable to send OTP. Please try again.");
        }
    }

    // Restored methods for compatibility with AuthService and KycService
    public void sendOtp(String to, String otp) {
        log.info("Sending standard OTP email to {} with code {}", to, otp);
        sendVerificationOtp(to, otp);
    }

    public void sendKycStatusUpdate(String to, String status, String message) {
        log.info("Sending KYC status update to {}: Status = {}, Message = {}", to, status, message);
        if (fromEmail == null || fromEmail.trim().isEmpty()) {
            return;
        }

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("CryptoVaultX - KYC Status Update: " + status);
            
            String htmlContent = String.format(
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">" +
                "<h2 style=\"color: #6C5DD3; text-align: center;\">CryptoVaultX</h2>" +
                "<p>Hello,</p>" +
                "<p>Your KYC application status has been updated.</p>" +
                "<p><strong>Status:</strong> %s</p>" +
                "<p><strong>Message:</strong> %s</p>" +
                "<br/>" +
                "<p>Regards,<br/>CryptoVaultX Compliance Team</p>" +
                "</div>", status, message
            );

            helper.setText(htmlContent, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("Failed to send KYC email to {}", to, e);
        }
    }
}
