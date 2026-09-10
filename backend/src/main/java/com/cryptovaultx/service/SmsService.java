package com.cryptovaultx.service;

public interface SmsService {
    void sendOtp(String phoneNumber, String otp);
}
