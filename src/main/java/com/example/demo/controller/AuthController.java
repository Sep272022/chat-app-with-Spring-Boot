package com.example.demo.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.Validator.UserValidator;
import com.example.demo.model.User;
import com.example.demo.model.UserDTO;
import com.example.demo.service.UserService;

@Controller
public class AuthController {

  @Autowired
  private UserService userService;

  @Autowired
  private UserValidator userValidator;

  @GetMapping("/register")
  public String showForm(Model model) {
    model.addAttribute("user", new UserDTO());

    List<String> listProfession = Arrays.asList("Developer", "Tester", "Architect");
    model.addAttribute("listProfession", listProfession);

    return "register_form";
  }

  @PostMapping("/register")
  public String submitForm(@ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
    System.out.println(user);
    userValidator.validate(user, bindingResult);
    if (bindingResult.hasErrors()) {
      model.addAttribute("errors", bindingResult.getAllErrors());
      System.out.println(bindingResult.getAllErrors());
      return "register_form";
    }
    user = userService.createUser(user);

    return "register_success";
  }

  @GetMapping("/check_email")
  @ResponseBody
  public ResponseEntity<Boolean> checkEmailAvailability(@RequestParam String email) {
    boolean inUse = userService.isEmailAvailable(email);
    return ResponseEntity.ok(inUse);
  }

  @GetMapping("/login")
  public String login(Model model) {
    model.addAttribute("user", new User());

    return "login";
  }

  @GetMapping("/login?error")
  public String loginError(Model model) {
    model.addAttribute("user", new User());
    model.addAttribute("error", true);
    
    return "login";
  }
  
  @PostMapping("/login")
  String authorizeUser(@ModelAttribute("user") User user, Model model) {
    boolean verified = userService.verifyUser(user);
    if (verified) {
      return "index";
    } else {
      model.addAttribute("error", true);
      return "login";
    }
  }

  @PostMapping("/logout")
  String logout(Model model) {
    model.addAttribute("logout", true);

    return "login";
  }
}
