package com.cryptovaultx.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PanCardValidator implements ConstraintValidator<PanCard, String> {

    @Override
    public boolean isValid(String panCard, ConstraintValidatorContext context) {
        if (panCard == null || panCard.trim().isEmpty()) {
            return true; // Use @NotBlank for null checks
        }
        return panCard.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}");
    }
}
