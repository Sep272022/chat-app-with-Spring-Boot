package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;

@RestController
@RequestMapping("/users")
public class UserRestController {
  
  @GetMapping("/current")
  public ResponseEntity<UserDetails> getCurrentUser() {
    System.out.println("UserRestController.getCurrentUser()");
    System.out.println(SecurityContextHolder.getContext().getAuthentication());
    UserDetails currentUserDetail = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return ResponseEntity.ok(currentUserDetail);
  }
}
