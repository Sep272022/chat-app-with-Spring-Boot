package com.example.demo.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Document("chatRoom")
public class ChatRoom {
  
  @Id
  private String id;
  @NotBlank
  private String name;
  @NotBlank
  private List<UserDTO> members;

  private List<ChatMessage> messages;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<UserDTO> getMembers() {
    return members;
  }

  public void setMembers(List<UserDTO> members) {
    this.members = members;
  }

  public List<ChatMessage> getMessages() {
    return messages;
  }

  public void setMessages(List<ChatMessage> messages) {
    this.messages = messages;
  }

  

}
