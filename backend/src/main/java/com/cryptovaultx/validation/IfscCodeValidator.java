package com.cryptovaultx.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IfscCodeValidator implements ConstraintValidator<IfscCode, String> {

    @Override
    public boolean isValid(String ifsc, ConstraintValidatorContext context) {
        if (ifsc == null || ifsc.trim().isEmpty()) {
            return true;
        }
        return ifsc.matches("^[A-Z]{4}0[A-Z0-9]{6}$");
    }
}
