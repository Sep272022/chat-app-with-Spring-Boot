package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.UserDTO;
import com.example.demo.service.ChatRoomService;
import com.example.demo.service.UserService;

@Controller
public class MessageController {
  
  @Autowired
  private UserService userService;

  @Autowired
  private ChatRoomService chatRoomService;

  @Autowired
  private SimpMessagingTemplate simpMessagingTemplate;

  @MessageMapping("/chat") // this is the endpoint the client sends to
  // @SendTo("/topic/messages") // this is the endpoint the client subscribes to
  public ChatMessage getMessage(ChatMessage message) {
    handleChatMessage(message);
    return message; // this value is broadcast to all subscribers to the endpoint specified in
                    // @SendTo annotation above
  }
  
  private void handleChatMessage(ChatMessage message) {
    UserDTO recipient = userService.findUserById(message.getToUserId());
    if (recipient == null) {
      // handle if recipient is not found
      return; // error or something else?
    }
    UserDTO sender = userService.findUserById(message.getFromUserId());
    if (sender == null) {
      // handle if sender is not found
      return;
    }
    chatRoomService.addMessageToChatRoom(message.getChatRoomId(), message);
    sendChatMessage(recipient, message);
  }

  private void sendChatMessage(UserDTO to, ChatMessage message) {
    chatRoomService.addMessageToChatRoom(message.getChatRoomId(), message);
    simpMessagingTemplate.convertAndSendToUser(to.getEmail(), "/topic/messages", message);
  }

}
