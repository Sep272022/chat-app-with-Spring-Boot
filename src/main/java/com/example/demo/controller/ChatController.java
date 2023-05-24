package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ChatRoomDTO;
import com.example.demo.service.ChatRoomService;

@RestController
public class ChatController {

  @Autowired
  private ChatRoomService chatRoomService;

  @PostMapping("/chatrooms")
  public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoom) {
    return ResponseEntity.ok(chatRoomService.createChatRoom(chatRoom));
  }

}
