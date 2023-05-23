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
  private List<String> memberIds;

  private List<String> messageIds;

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

  public List<String> getMemberIds() {
    return memberIds;
  }

  public void setMemberIds(List<String> memberIds) {
    this.memberIds = memberIds;
  }

  public List<String> getMessageIds() {
    return messageIds;
  }

  public void setMessageIds(List<String> messageIds) {
    this.messageIds = messageIds;
  }

  
  

}
