package com.example.demo.service;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.ChatRoom;
import com.example.demo.model.ChatRoomDTO;
import com.example.demo.model.UserDTO;
import java.util.ArrayList;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

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
    ChatRoom savedChatRoom = mongoTemplate.save(chatRoom);
    addMembersToChatRoom(
      savedChatRoom.getId(),
      chatRoomDto.getMembers().stream().map(UserDTO::getId).toList()
    );
    return modelMapper.map(savedChatRoom, ChatRoomDTO.class);
  }

  public void addMembersToChatRoom(String chatRoomId, List<String> memberIds) {
    memberIds.forEach(id -> {
      UserDTO user = userService.findUserById(id);
      user.getChatRoomIds().add(chatRoomId);
      userService.updateChatRoomToUser(user);
    });
  }

  public ChatRoomDTO addMessageToChatRoom(
    String chatRoomId,
    ChatMessage message
  ) {
    ChatRoomDTO chatRoom = findChatRoomById(chatRoomId);
    if (chatRoom == null) {
      return null;
    }
    chatRoom.getMessages().add(message);
    return updateChatRoom(chatRoom);
  }

  public ChatRoomDTO addMessagesToChatRoom(
    String chatRoomId,
    List<ChatMessage> messages
  ) {
    ChatRoomDTO chatRoom = findChatRoomById(chatRoomId);
    if (chatRoom == null) {
      return null;
    }
    chatRoom.getMessages().addAll(messages);
    return updateChatRoom(chatRoom);
  }

  public ChatRoomDTO updateChatRoom(ChatRoomDTO chatRoomDto) {
    ChatRoom chatRoom = modelMapper.map(chatRoomDto, ChatRoom.class);
    return modelMapper.map(mongoTemplate.save(chatRoom), ChatRoomDTO.class);
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

  public List<ChatRoomDTO> findChatRoomsById(List<String> ids) {
    List<ChatRoomDTO> chatRoomDTOs = new ArrayList<>();
    ids.forEach(id -> {
      chatRoomDTOs.add(findChatRoomById(id));
    });
    return chatRoomDTOs;
  }

  public ChatRoomDTO leaveChatRoom(String userId, String chatRoomId) {
    ChatRoomDTO foundChatRoom = findChatRoomById(chatRoomId);
    List<UserDTO> newMembers = foundChatRoom
      .getMembers()
      .stream()
      .filter(member -> !member.getId().equals(userId))
      .toList();
    foundChatRoom.setMembers(newMembers);
    UserDTO user = userService.findUserById(userId);
    user.getChatRoomIds().remove(chatRoomId);
    userService.updateChatRoomToUser(user);
    return updateChatRoom(foundChatRoom);
  }

  public void deleteChatRoomById(String id) {
    ChatRoomDTO foundChatRoom = findChatRoomById(id);
    foundChatRoom
      .getMembers()
      .forEach(member -> {
        member.getChatRoomIds().remove(id);
        userService.updateChatRoomToUser(member);
      });
    mongoTemplate.remove(foundChatRoom);
  }

  public List<ChatRoomDTO> findChatRoomsByUserId(String userId) {
    UserDTO user = userService.findUserById(userId);
    return findChatRoomsById(new ArrayList<>(user.getChatRoomIds()));
  }
}
