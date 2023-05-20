package com.example.demo.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.demo.model.ChatMessage;

@Controller
public class ChatController {
  
  @MessageMapping("/chat")
  @SendTo("/topic/messages")
  public ChatMessage getMessage(ChatMessage message) {
    System.out.println(message.getText());
    return message;
  }
}
