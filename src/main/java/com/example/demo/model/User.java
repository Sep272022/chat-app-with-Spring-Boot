package com.example.demo.model;

import java.util.Date;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

@Document("user")
public class User {

  @Id
  private String id;
  private String name;
  private String email;
  private String password;
  private String gender;
  private String note;
  private boolean married; 

  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private Date birthday;
  private String profession;
  private Set<Role> roles;
  
  public Set<Role> getRoles() {
    return roles;
  }
  public void setRoles(Set<Role> roles) {
    this.roles = roles;
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
    return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", gender=" + gender
        + ", note=" + note + ", married=" + married + ", birthday=" + birthday + ", profession=" + profession
        + ", roles=" + roles + "]";
  }
  public String getId() {
    return id;
  }

  
}
