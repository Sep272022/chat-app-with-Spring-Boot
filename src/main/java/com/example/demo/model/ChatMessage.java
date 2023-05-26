package com.example.demo.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;

@Document("chatMessage")
public class ChatMessage {
  @Id
  private String id;
  @NotBlank
  private String fromUserId;
  
  private String toUserId;
  @NotBlank
  private String text;
  @NotBlank
  @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
  private Date date;
  @NotBlank
  private String chatRoomId;
  
  

  public String getFromUserId() {
    return fromUserId;
  }
  public void setFromUserId(String from) {
    this.fromUserId = from;
  }
  public String getText() {
    return text;
  }
  public void setText(String text) {
    this.text = text;
  }
  public String getToUserId() {
    return toUserId;
  }
  public void setToUserId(String to) {
    this.toUserId = to;
  }
  public Date getDate() {
    return date;
  }
  public void setDate(Date date) {
    this.date = date;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getChatRoomId() {
    return chatRoomId;
  }
  public void setChatRoomId(String chatRoomId) {
    this.chatRoomId = chatRoomId;
  }

  
  
}
