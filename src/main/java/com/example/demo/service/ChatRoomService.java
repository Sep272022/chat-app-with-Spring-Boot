package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.model.ChatRoom;

@Service
public class ChatRoomService {
  
  @Autowired
  private MongoTemplate mongoTemplate;

  public void createChatRoom(ChatRoom chatRoom) {
    mongoTemplate.save(chatRoom);
  }

  public ChatRoom findChatRoomById(String id) {
    return mongoTemplate.findById(id, ChatRoom.class);
  }

  public ChatRoom findChatRoomBySenderIdAndRecipientId(String senderId, String recipientId) {
    return mongoTemplate.findById(senderId + "_" + recipientId, ChatRoom.class);
  }

  public void deleteChatRoomById(String id) {
    mongoTemplate.remove(findChatRoomById(id));
  }
}
