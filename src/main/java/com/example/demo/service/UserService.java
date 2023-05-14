package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;

@Service
public class UserService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public User createUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return mongoTemplate.save(user);
  }

  public User findUserByEmail(String email) {
    Query query = new Query();
    query.addCriteria(Criteria.where("email").is(email));
    return mongoTemplate.findOne(query, User.class);
  }

  public boolean verifyUser(User user) {
    User found = findUserByEmail(user.getEmail());
    if (found != null) {
      return passwordEncoder.matches(user.getPassword(), found.getPassword());
    }
    return false;
  }

  public boolean isEmailAvailable(String email) {
    return findUserByEmail(email) == null;
  }

}