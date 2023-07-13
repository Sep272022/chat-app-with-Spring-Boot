package com.example.demo.repository;

import com.example.demo.model.Role;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface RoleRepository extends MongoRepository<Role, String> {
  @Query("{name : ?0}")
  Optional<Role> findRoleByName(String name);
}
