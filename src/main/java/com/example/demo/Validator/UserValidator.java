package com.example.demo.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

@Component
public class UserValidator implements Validator {

  @Autowired
  private UserService userService;

  @Override
  public boolean supports(Class<?> clazz) {
    return User.class.isAssignableFrom(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    User user = (User) target;

    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "NotEmpty.user.email");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty.user.password");
    // ValidationUtils.rejectIfEmptyOrWhitespace(errors, "confirmPassword", "NotEmpty.user.confirmPassword");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "NotEmpty.user.name");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "gender", "NotEmpty.user.gender");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "profession", "NotEmpty.user.profession");
    // TODO: validation for birthday



  }
  
}
