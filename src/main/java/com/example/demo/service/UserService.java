package com.example.demo.service;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.model.UserDTO;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ModelMapper modelMapper;

  public UserDTO createUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    Role role = new Role();
    role.setName("ROLE_USER");
    user.setRoles(Set.of(role));
    if (user.getChatRoomIds() == null) {
      user.setChatRoomIds(new HashSet<String>());
    }
    return modelMapper.map(mongoTemplate.save(user), UserDTO.class);
  }

  public UserDTO updateChatRoomToUser(UserDTO user) {
    Query query = new Query();
    query.addCriteria(Criteria.where("id").is(user.getId()));
    User foundUser = mongoTemplate.findOne(query, User.class);
    if (foundUser != null) {
      foundUser.setChatRoomIds(user.getChatRoomIds());
      foundUser = mongoTemplate.save(foundUser);
    }
    return modelMapper.map(foundUser, UserDTO.class);
  }

  public UserDTO findUserByEmail(String email) {
    Query query = new Query();
    query.addCriteria(Criteria.where("email").is(email));
    return modelMapper.map(
      mongoTemplate.findOne(query, User.class),
      UserDTO.class
    );
  }

  public UserDTO findUserById(String id) {
    return modelMapper.map(
      mongoTemplate.findById(id, User.class),
      UserDTO.class
    );
  }

  public boolean verifyUser(User user) {
    Query query = new Query();
    query.addCriteria(Criteria.where("email").is(user.getEmail()));
    User found = mongoTemplate.findOne(query, User.class);
    if (found != null) {
      return passwordEncoder.matches(user.getPassword(), found.getPassword());
    }
    return false;
  }

  public boolean isEmailAvailable(String email) {
    return !mongoTemplate.exists(new Query(Criteria.where("email").is(email)), User.class);
  }

  public List<UserDTO> findAll() {
    return Arrays.asList(
      modelMapper.map(mongoTemplate.findAll(User.class), UserDTO[].class)
    );
  }

  public List<UserDTO> findAllById(List<String> ids) {
    List<User> users = ids
      .stream()
      .filter(id ->
        mongoTemplate.exists(new Query(Criteria.where("id").is(id)), User.class)
      )
      .map(id -> mongoTemplate.findById(id, User.class))
      .toList();
    return Arrays.asList(modelMapper.map(users, UserDTO[].class));
  }

}
