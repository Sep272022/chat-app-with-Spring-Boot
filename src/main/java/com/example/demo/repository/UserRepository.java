package com.example.demo.repository;

import com.example.demo.model.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String> {
  @Query("{email : ?0}")
  Optional<User> findUserByEmail(String email);

  @Query("{username : ?0}")
  Optional<User> findUserByUsername(String username);

  boolean existsByEmail(String email);
}
