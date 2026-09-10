package com.cryptovaultx.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PanCardValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PanCard {
    String message() default "Invalid PAN Card Number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
