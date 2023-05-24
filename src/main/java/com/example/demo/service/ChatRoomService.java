package com.example.demo.service;


import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.model.ChatRoom;
import com.example.demo.model.ChatRoomDTO;

@Service
public class ChatRoomService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private UserService userService;

  @Autowired
  private ModelMapper modelMapper;

  public ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDto) {
    ChatRoom chatRoom = modelMapper.map(chatRoomDto, ChatRoom.class);
    List<String> userIds = new ArrayList<>();
    chatRoomDto.getMembers().forEach(member -> {
      userIds.add(member.getId());
    });
    chatRoom.setMemberIds(userIds);
    List<String> chatRoomIds = new ArrayList<>();
    chatRoomDto.getMessages().forEach(message -> {
      chatRoomIds.add(message.getId());
    });
    chatRoom.setMessageIds(chatRoomIds);
    return modelMapper.map(mongoTemplate.save(chatRoom), ChatRoomDTO.class);
  }

  public ChatRoomDTO updateChatRoom(ChatRoomDTO chatRoomDto) {
    throw new UnsupportedOperationException();
  }

  public ChatRoomDTO findChatRoomById(String id) {
    ChatRoom chatRoom = mongoTemplate.findById(id, ChatRoom.class);
    if (chatRoom == null) {
      return null;
    }
    ChatRoomDTO chatRoomDTO = modelMapper.map(chatRoom, ChatRoomDTO.class);
    chatRoomDTO.setMembers(userService.findAllById(chatRoom.getMemberIds()));
    return chatRoomDTO;
  }

  public ChatRoomDTO findChatRoomBySenderIdAndRecipientId(String senderId, String recipientId) {
    throw new UnsupportedOperationException();
  }

  public void deleteChatRoomById(String id) {
    mongoTemplate.remove(findChatRoomById(id));
  }
}
