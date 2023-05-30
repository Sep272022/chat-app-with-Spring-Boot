package com.example.demo.model;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("user")
public class User {

  @Id
  private String id;

  @NotBlank
  private String email;

  @NotBlank
  private String password;

  private Set<Role> roles;
  private Set<String> chatRoomIds;

  public Set<String> getChatRoomIds() {
    return chatRoomIds;
  }

  public void setChatRoomIds(Set<String> chatRoomIds) {
    this.chatRoomIds = chatRoomIds;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getId() {
    return id;
  }
}
