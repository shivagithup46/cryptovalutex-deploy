package com.cryptovaultx.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IfscCodeValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface IfscCode {
    String message() default "Invalid IFSC Code";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
