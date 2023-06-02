package com.example.demo.controller;

import com.example.demo.kafka.KafkaSenderService;
import com.example.demo.model.ChatMessage;
import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.UserDTO;
import com.example.demo.service.ChatMessageService;
import com.example.demo.service.ChatRoomService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

  @Autowired
  private UserService userService;

  @Autowired
  private ChatRoomService chatRoomService;

  @Autowired
  private ChatMessageService chatMessageService;

  @Autowired
  private SimpMessagingTemplate simpMessagingTemplate;

  @Autowired
  private KafkaSenderService kafkaSenderService;

  @MessageMapping("/chat")
  // @SendTo("/topic/messages")
  public ChatMessage getMessage(ChatMessage message) {
    // handleChatMessage(message);
    kafkaSenderService.sendMessage(message, "chat-message");
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
    sendChatMessageToUser(recipient, message);
  }

  private void sendChatMessageToUser(UserDTO to, ChatMessage message) {
    ChatMessageDTO chatMessageDTO = chatMessageService.convertChatMessageToDTO(
      message
    );
    simpMessagingTemplate.convertAndSendToUser(
      to.getEmail(),
      "/topic/messages",
      chatMessageDTO
    );
  }
}
