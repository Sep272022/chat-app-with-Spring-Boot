package com.example.demo.config;

import java.util.List;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.example.demo.model.ChatRoom;
import com.example.demo.model.ChatRoomDTO;
import com.example.demo.model.UserDTO;
import com.example.demo.service.UserService;

@Configuration
public class ModelMapperConfig {

  @Lazy
  @Autowired
  private UserService userService;

  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();
    TypeMap<ChatRoom, ChatRoomDTO> typeMapFromChatRoomToDTO = modelMapper.createTypeMap(ChatRoom.class, ChatRoomDTO.class);
    Converter<List<String>, List<UserDTO>> idsToUsers = ctx -> ctx.getSource().stream().map(id -> userService.findUserById(id)).toList();
    typeMapFromChatRoomToDTO.addMappings(mapper -> 
      mapper.using(idsToUsers).map(ChatRoom::getMemberIds, ChatRoomDTO::setMembers)
    );
    TypeMap<ChatRoomDTO, ChatRoom> typeMapFromDTOToChatRoom = modelMapper.createTypeMap(ChatRoomDTO.class, ChatRoom.class);
    Converter<List<UserDTO>, List<String>> usersToIds = ctx -> ctx.getSource().stream().map(user -> user.getId()).toList();
    typeMapFromDTOToChatRoom.addMappings(mapper -> 
      mapper.using(usersToIds).map(ChatRoomDTO::getMembers, ChatRoom::setMemberIds)
    );
    return modelMapper;
  }
}
