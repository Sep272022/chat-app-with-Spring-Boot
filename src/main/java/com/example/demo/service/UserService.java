package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;

@Service
public class UserService {

  @Autowired
  private MongoTemplate mongoTemplate;

  public User createUser(User user) {
    return mongoTemplate.save(user);
  }

  public User findUserByEmail(String email) {
    Query query = new Query();
    query.addCriteria(Criteria.where("email").is(email));
    return mongoTemplate.findOne(query, User.class);
  }

}