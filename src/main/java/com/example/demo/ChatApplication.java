package com.example.demo;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ChatApplication {

  public static void main(String[] args) {
    SpringApplication.run(ChatApplication.class, args);
  }

  @Bean
  CommandLineRunner initRoleData(RoleRepository roleRepository) {
    return args -> {
      roleRepository.deleteAll();
      roleRepository.save(new Role("ROLE_USER"));
      roleRepository.save(new Role("ROLE_ADMIN"));
    };
  }

  @Bean
  CommandLineRunner initAdminUserData(
    UserRepository userRepository,
    UserService userService
  ) {
    return args -> {
      if (userService.findByRole("ROLE_ADMIN").isEmpty()) {
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@localhost");
        admin.setPassword("111");
        userService.createAdmin(admin);
      }
    };
  }
}
