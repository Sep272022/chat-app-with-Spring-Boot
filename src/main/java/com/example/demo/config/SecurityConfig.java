package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebSecurity
@EnableWebMvc
public class SecurityConfig {

  String[] staticResources = {
    "/resources/**",
    "/static/**",
    "/css/**",
    "/js/**",
    "/*.js"};

  String[] permittededUrls = {
    "/index",
    "/login",
    "/register",
    "/check_email**"};

  @Autowired
  private UserDetailsService userDetailsService;

  @Autowired
  private PasswordEncoder passwordEncoder;



  // https://www.baeldung.com/spring-security-login 
  // https://docs.spring.io/spring-security/reference/5.8/migration/servlet/config.html
  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http.authorizeHttpRequests((authz) -> authz
              .requestMatchers(staticResources).permitAll()
              .requestMatchers(permittededUrls).permitAll()
              .requestMatchers("/admins/**").hasRole("ADMIN")
              .requestMatchers("/users/**").hasAnyRole("USER", "ADMIN")
              .anyRequest().authenticated())
              .formLogin(login -> login.loginPage("/login")
                      .loginProcessingUrl("/login/process")
                      .usernameParameter("email")
                      .successForwardUrl("/index")
                      .failureUrl("/login?error")
                      .permitAll())
              .logout(logout -> logout.logoutUrl("/logout")
                      .logoutSuccessUrl("/login?logout")
                      .invalidateHttpSession(true)
                      .deleteCookies("JSESSIONID")
                      .permitAll())
              .csrf((csrf) -> csrf.disable())
              .cors((cors) -> cors.disable())
              .anonymous(anonymous -> anonymous.disable());
    return http.build();
  }


  @Bean
  AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
  }

}
