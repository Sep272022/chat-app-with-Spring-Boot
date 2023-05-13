package com.example.demo.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

@Controller
public class AuthController {

  @Autowired
  private UserService userService;

  
  @GetMapping("/login")
  String login() {
    return "login";
  }

  @PostMapping("/logout")
  String logout() {
    return "index";
  }

  @GetMapping("/register")
  public String showForm(Model model) {
    User user = new User();
    model.addAttribute("user", user);

    List<String> listProfession = Arrays.asList("Developer", "Tester", "Architect");
    model.addAttribute("listProfession", listProfession);

    return "register_form";
  }

  @PostMapping("/register")
  public String submitForm(@ModelAttribute("user") User user) {
    System.out.println(user);
    userService.createUser(user);
    return "register_success";
  }

  @PostMapping("/login/process")
  public String performLogin() {
    System.out.println("performLogin");
    return "index";
  }

  
}
