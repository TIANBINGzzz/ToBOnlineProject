package com.steam.common.exception;

import com.steam.common.domain.result.Result;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;


@RestControllerAdvice
public class GlobalExceptionHandler {
    // EnumConversion execption(eg. IllegalArgumentException)
    @ExceptionHandler(value = MethodArgumentTypeMismatchException.class)
    public Result<String> handleEnumConversionError(MethodArgumentTypeMismatchException ex) {
        return Result.error(403,"invalid enumeration：" + ex.getValue());
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String defaultMessage = error.getDefaultMessage();
            if (defaultMessage != null) {
                errors.append(defaultMessage).append("; ");
            }
        });
        return Result.error(403, errors.toString());
    }
    // parameter constraction execption(eg. @NotNull, @Size)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Result<String>> handleConstraintViolationException(ConstraintViolationException ex) {
        StringBuilder errors = new StringBuilder();
        errors.append("invalid parameter：");
        ex.getConstraintViolations().forEach(violation -> errors.append(violation.getMessage()).append("; "));
        return new ResponseEntity<>(Result.error(403, errors.toString()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public Result<String> handleRuntimeException(RuntimeException ex) {
        return Result.error(500, "服务器错误：" + ex.getMessage());
    }
}
