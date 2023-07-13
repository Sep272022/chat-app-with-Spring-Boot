package com.example.demo.security;

import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email)
    throws UsernameNotFoundException {
    if (email == null || email.isEmpty()) {
      throw new IllegalArgumentException("Username cannot be null or empty");
    }

    return userRepository
      .findUserByEmail(email)
      .map(UserDetailsImpl::new)
      .orElseThrow(() ->
        new UsernameNotFoundException("User not found with username: " + email)
      );
  }
}
