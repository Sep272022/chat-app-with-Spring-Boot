package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ChatRoomDTO;
import com.example.demo.service.ChatRoomService;

@RestController
public class ChatRestController {

  @Autowired
  private ChatRoomService chatRoomService;

  @PostMapping("/chatrooms")
  public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoom) {
    return ResponseEntity.ok(chatRoomService.createChatRoom(chatRoom));
  }

  @GetMapping("/chatrooms/{id}")
  public ResponseEntity<ChatRoomDTO> getChatRoomById(String id) {
    return ResponseEntity.ok(chatRoomService.findChatRoomById(id));
  }

  @GetMapping("/chatrooms")
  public ResponseEntity<List<ChatRoomDTO>> getAllChatRooms(@RequestParam(value = "userId", required = true) String userId) {
    return ResponseEntity.ok(chatRoomService.findChatRoomsByUserId(userId));
  }

  @PostMapping("chatrooms/{userId}/leave/{chatRoomId}")
  public ResponseEntity<ChatRoomDTO> leaveChatRoom(@PathVariable String userId, @PathVariable String chatRoomId) {
    System.out.println("userId: " + userId + ", chatRoomId: " + chatRoomId);
    return ResponseEntity.ok(chatRoomService.leaveChatRoom(userId, chatRoomId));
  }
}
