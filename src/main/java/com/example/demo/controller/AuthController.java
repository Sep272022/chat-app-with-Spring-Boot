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

import com.example.demo.model.User;
import com.example.demo.model.UserDTO;
import com.example.demo.service.UserService;
import com.example.demo.validator.UserValidator;

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
    userValidator.validate(user, bindingResult);
    if (bindingResult.hasErrors()) {
      model.addAttribute("errors", bindingResult.getAllErrors());
      System.out.println(bindingResult.getAllErrors());
      return "register_form";
    }
    user = userService.createUser(user);

    return "redirect:/login?register-success";
  }

  @GetMapping("/check_email")
  @ResponseBody
  public ResponseEntity<Boolean> checkEmailAvailability(@RequestParam String email) {
    boolean inUse = userService.isEmailAvailable(email);
    return ResponseEntity.ok(inUse);
  }

  @GetMapping("/login")
  public String login(@RequestParam(value = "error", required = false) String error,
                      @RequestParam(value = "logout", required = false) String logout,
                      @RequestParam(value = "register-success", required = false) String registerSuccess, Model model) {
    model.addAttribute("user", new User());

    if (error != null) {
      model.addAttribute("status", "error");
    } else if (logout != null) {
      model.addAttribute("status", "logout");
    } else if (registerSuccess != null) {
      model.addAttribute("status", "register-success");
    }

    return "login";
  }

  @PostMapping("/login")
  String authorizeUser(@ModelAttribute("user") User user, Model model) {
    boolean verified = userService.verifyUser(user);
    if (verified) {
      return "index";
    } else {
      return "redirect:/login?error";
    }
  }

  @PostMapping("/logout")
  String logout(Model model) {
    model.addAttribute("logout", true);

    return "login";
  }
}
