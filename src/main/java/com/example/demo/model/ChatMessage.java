package com.example.demo.model;

import java.sql.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Document("chatMessage")
public class ChatMessage {
  @NotBlank
  private String fromUserId;
  @NotBlank
  private String toUserId;
  @NotBlank
  private String text;
  @NotBlank
  private Date date;
  

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
  
}
