package com.example.demo.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageDTO {
  // @Id
  private String id;

  private UserDTO fromUser;

  private UserDTO toUser;
  @NotBlank
  private String text;
  @NotBlank
  @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
  private Date date;
  @NotBlank
  private String chatRoomId;

  public UserDTO getFromUser() {
    return fromUser;
  }

  public void setFromUser(UserDTO fromUser) {
    this.fromUser = fromUser;
  }

  public UserDTO getToUser() {
    return toUser;
  }

  public void setToUser(UserDTO toUser) {
    this.toUser = toUser;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
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
