package com.example.demo.service;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.ChatMessageDTO;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private UserService userService;

  @Autowired
  private ModelMapper modelMapper;

  public void saveChatMessage(ChatMessage chatMessage) {
    mongoTemplate.save(chatMessage);
  }

  public List<ChatMessage> findAllByUserId(String userId) {
    Query query = new Query();
    Criteria criteria = new Criteria();
    criteria.orOperator(
      Criteria.where("fromUserId").is(userId),
      Criteria.where("toUserId").is(userId)
    );
    query.addCriteria(criteria);
    return mongoTemplate.find(query, ChatMessage.class);
  }

  public void deleteChatMessage(ChatMessage chatMessage) {
    mongoTemplate.remove(chatMessage);
  }

  public ChatMessageDTO convertChatMessageToDTO(ChatMessage chatMessage) {
    ChatMessageDTO chatMessageDTO = modelMapper.map(
      chatMessage,
      ChatMessageDTO.class
    );
    chatMessageDTO.setFromUser(
      userService.findUserById(chatMessage.getFromUserId())
    );
    chatMessageDTO.setToUser(
      userService.findUserById(chatMessage.getToUserId())
    );
    return chatMessageDTO;
  }
}
