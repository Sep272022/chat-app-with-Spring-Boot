package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.demo.model.ChatMessage;

@Controller
public class ChatController {

  @Autowired
  private ChatMessage chatMessage;

  @MessageMapping("/chat") // this is the endpoint the client sends to
  @SendTo("/topic/messages") // this is the endpoint the client subscribes to
  public ChatMessage getMessage(ChatMessage message) {
    System.out.println(message.getText());
    return message; // this value is broadcast to all subscribers to the endpoint specified in
                    // @SendTo annotation above
  }
}
