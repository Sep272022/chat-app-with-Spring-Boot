package com.example.demo.model;

import java.sql.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("user")
public class User {

  @Id
  private Long id;
  private String name;
  private String email;
  private String password;
  private String gender;
  private String note;
  private boolean married; 
  private Date birthday;
  private String profession;
  private String role;
  
  public String getRole() {
    return role;
  }
  public void setRole(String role) {
    this.role = role;
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
  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
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
  @Override
  public String toString() {
    return "User [name=" + name + ", email=" + email + ", password=" + password + ", gender=" + gender + ", note="
        + note + ", married=" + married + ", birthday=" + birthday + ", profession=" + profession + "]";
  }

  
}
