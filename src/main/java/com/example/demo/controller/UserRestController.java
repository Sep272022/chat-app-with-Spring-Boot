package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.web.exchanges.HttpExchange.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.User;
import com.example.demo.service.ChatService;
import com.example.demo.service.UserService;


@RestController
@RequestMapping("/users")
public class UserRestController {

  @Autowired
  private UserService userService;

  @Autowired
  private ChatService chatService;
  
  @GetMapping("/current")
  public ResponseEntity<User> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof UserDetails) {
        UserDetails userDetails = (UserDetails) principal;
        User user = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(user);
      }
    }
    return ResponseEntity.status(400).build();
  }

  @GetMapping("/all")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.findAll();
    return ResponseEntity.ok(users);
  }

  @GetMapping("/conversations")
  public ResponseEntity<List<ChatMessage>> getUserConversations(Principal principal) {
    User user = userService.findUserByEmail(principal.getName());
    List<ChatMessage> messages = chatService.findAllByUserId(user.getId());
    return ResponseEntity.ok(messages);
  }

}
