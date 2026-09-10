package com.cryptovaultx.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AadhaarValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Aadhaar {
    String message() default "Invalid Aadhaar Number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
