package com.example.demo.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

@RestController
public class MainController {

  @Autowired
  private UserService userService;
  
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

  @GetMapping("/login")
  public String showLoginPage() {
    return "login";
  }

  @PostMapping("/login")
  public String login(Model model) {
    return "index";
  }

  @PostMapping("/login/process")
  public String performLogin() {
    System.out.println("performLogin");
    return "index";
  }

  @PostMapping("/logout")
  public String logout(Model model) {
    return "login";
  }

  @GetMapping("/index") 
  public String showIndexPage() {
    return "index";
  }

}
