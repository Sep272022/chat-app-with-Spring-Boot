package com.example.demo.validator;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

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

    ValidationUtils.rejectIfEmptyOrWhitespace(
      errors,
      "email",
      "NotEmpty.user.email"
    );
    ValidationUtils.rejectIfEmptyOrWhitespace(
      errors,
      "password",
      "NotEmpty.user.password"
    );
  }
}
