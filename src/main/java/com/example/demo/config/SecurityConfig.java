package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    "/login",
    "/register",
    "/check_email**"};

  // @Bean
  // InMemoryUserDetailsManager userDetailsManager() {
  //   UserDetails user1 = User.withUsername("user1")
  //                           .password(passwordEncoder().encode("111"))
  //                           .roles("USER")
  //                           .build();
                            
  //   UserDetails user2 = User.withUsername("user2")
  //                           .password(passwordEncoder().encode("111"))
  //                           .roles("USER")
  //                           .build();
            
  //   UserDetails admin = User.withUsername("user3")
  //                           .password(passwordEncoder().encode("111"))
  //                           .roles("ADMIN")
  //                           .build();

  //   return new InMemoryUserDetailsManager(user1, user2, admin);
  // }


  // https://www.baeldung.com/spring-security-login 
  // https://docs.spring.io/spring-security/reference/5.8/migration/servlet/config.html
  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http.authorizeHttpRequests((authz) -> authz
              .requestMatchers(staticResources).permitAll()
              .requestMatchers(permittededUrls).permitAll()
              .requestMatchers("/admin/**").hasRole("ADMIN")
              .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
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
              .cors((cors) -> cors.disable());
    return http.build();
  }

  // @Bean
  // WebSecurityCustomizer webSecurityCustomizer() {
  //     return (web) -> web.ignoring().requestMatchers(staticResources);
  // }

  @Bean 
  PasswordEncoder passwordEncoder() { 
    return new BCryptPasswordEncoder(); 
  }

  // @Bean
  // AuthenticationFailureHandler authenticationFailureHandler() {
  //     return new CustomAuthenticationFailureHandler();
  // }
}
