package com.example.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

  // @GetMapping("/") 
  // public String showDefaultPage() {
  //   return "login";
  // }

  @GetMapping("/index") 
  public String showIndexPage() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    System.out.println("MainController.showIndexPage() authentication: " + authentication);
    return "index";
  }

}
