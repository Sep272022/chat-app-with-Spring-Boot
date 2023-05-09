package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	@Value("${server.port}")
	private int serverPort;
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
