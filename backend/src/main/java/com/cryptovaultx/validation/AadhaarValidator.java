package com.cryptovaultx.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AadhaarValidator implements ConstraintValidator<Aadhaar, String> {

    @Override
    public boolean isValid(String aadhaar, ConstraintValidatorContext context) {
        if (aadhaar == null || aadhaar.trim().isEmpty()) {
            return true; 
        }
        return aadhaar.matches("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$");
    }
}
