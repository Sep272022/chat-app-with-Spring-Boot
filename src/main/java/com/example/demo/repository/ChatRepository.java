package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.demo.model.ChatMessage;

public interface ChatRepository extends MongoRepository<ChatMessage, String> {
  
  @Query("{fromUserId : ?0, toUserId : ?1}")
  ChatMessage findByFromAndTo(String fromUserId, String toUserId);

}
