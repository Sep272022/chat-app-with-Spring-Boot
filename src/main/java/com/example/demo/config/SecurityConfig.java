package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableWebMvc
public class SecurityConfig {

  String[] staticResources = {
      "/resources/**",
      "/static/**",
      "/css/**",
      "/js/**",
      "/js/utils/**",
      "/js/class/**",
      "/*.js" };

  String[] permittededUrls = {
      "/login",
      "/logout",
      "/register",
      "/check_email**" };

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
        // .requestMatchers("/users/**").hasAnyRole("USER", "ADMIN")
        .anyRequest().authenticated())
        .formLogin(login -> login.loginPage("/login")
            .usernameParameter("email")
            .defaultSuccessUrl("/")
            .successHandler(authenticationSuccessHandler())
            .failureUrl("/login?error")
            .permitAll())
        .logout(logout -> logout.logoutUrl("/logout")
            .logoutSuccessUrl("/login?logout")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
            .permitAll())
        .csrf((csrf) -> csrf.disable()); // https://stackoverflow.com/questions/35767806/error-405-request-method-post-not-supported-spring-security
    // .cors((cors) -> cors.disable())
    // .httpBasic(withDefaults());
    return http.build();
  }

  // https://stackoverflow.com/questions/14573654/spring-security-redirect-to-previous-page-after-successful-login
  @Bean
  AuthenticationSuccessHandler authenticationSuccessHandler() {
    return new AuthenticationSuccessHandler() {
      @Override
      public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
          Authentication authentication) throws IOException, ServletException {
        response.sendRedirect("/index");
      }
    };
  }

  // @Bean
  // AuthenticationManager authenticationManager() {
  // System.out.println("authenticationManager()");
  // return authentication ->
  // authenticationProvider().authenticate(authentication);
  // }

  @Bean
  AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
  }

}
