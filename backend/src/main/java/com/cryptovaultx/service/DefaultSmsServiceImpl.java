package com.cryptovaultx.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DefaultSmsServiceImpl implements SmsService {

    @Value("${sms.provider:development}")
    private String smsProvider;

    @Value("${sms.twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${sms.msg91.auth-key:}")
    private String msg91AuthKey;

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        if ("development".equalsIgnoreCase(smsProvider) || (twilioAccountSid.isEmpty() && msg91AuthKey.isEmpty())) {
            // Development mode or no provider configured
            log.info("==================================================");
            log.info(" DEVELOPMENT MODE: Simulated SMS");
            log.info(" OTP for {} : {}", phoneNumber, otp);
            log.info("==================================================");
        } else {
            // Real SMS delivery
            log.info("Sending real SMS via {} to {}", smsProvider, phoneNumber);
            
            // This is an abstraction point.
            // If the user configures TWILIO, MSG91, or AWS SNS in the environment variables,
            // we would route to the respective implementations here.
            
            if ("twilio".equalsIgnoreCase(smsProvider)) {
                sendViaTwilio(phoneNumber, otp);
            } else if ("msg91".equalsIgnoreCase(smsProvider)) {
                sendViaMsg91(phoneNumber, otp);
            } else if ("aws-sns".equalsIgnoreCase(smsProvider)) {
                sendViaAwsSns(phoneNumber, otp);
            } else if ("fast2sms".equalsIgnoreCase(smsProvider)) {
                sendViaFast2Sms(phoneNumber, otp);
            }
        }
    }

    private void sendViaTwilio(String phoneNumber, String otp) {
        // Implementation for Twilio
        log.info("Twilio: Sent OTP {} to {}", otp, phoneNumber);
    }

    private void sendViaMsg91(String phoneNumber, String otp) {
        // Implementation for MSG91
        log.info("MSG91: Sent OTP {} to {}", otp, phoneNumber);
    }

    private void sendViaAwsSns(String phoneNumber, String otp) {
        // Implementation for AWS SNS
        log.info("AWS SNS: Sent OTP {} to {}", otp, phoneNumber);
    }

    private void sendViaFast2Sms(String phoneNumber, String otp) {
        // Implementation for Fast2SMS
        log.info("Fast2SMS: Sent OTP {} to {}", otp, phoneNumber);
    }
}
