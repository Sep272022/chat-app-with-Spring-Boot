package com.example.demo.model;

import java.util.Date;
import java.util.Set;


public class UserDTO {
  private String id;
  private String name;
  private String email;
  private String gender;
  private String note;
  private boolean married; 
  private Date birthday;
  private String profession;
  private Set<Role> roles;

  private Set<String> chatRoomIds;

  

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
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public String getGender() {
    return gender;
  }
  public void setGender(String gender) {
    this.gender = gender;
  }
  public String getNote() {
    return note;
  }
  public void setNote(String note) {
    this.note = note;
  }
  public boolean isMarried() {
    return married;
  }
  public void setMarried(boolean married) {
    this.married = married;
  }
  public Date getBirthday() {
    return birthday;
  }
  public void setBirthday(Date birthday) {
    this.birthday = birthday;
  }
  public String getProfession() {
    return profession;
  }
  public void setProfession(String profession) {
    this.profession = profession;
  }
  public Set<Role> getRoles() {
    return roles;
  }
  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }
  public Set<String> getChatRoomIds() {
    return chatRoomIds;
  }
  public void setChatRoomIds(Set<String> chatRoomIds) {
    this.chatRoomIds = chatRoomIds;
  }
}
