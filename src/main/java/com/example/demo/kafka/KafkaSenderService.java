package com.example.demo.kafka;

import com.example.demo.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KafkaSenderService {

  @Autowired
  private KafkaSender kafkaSender;

  public void sendMessage(ChatMessage message, String topicName) {
    kafkaSender.sendMessage(message, topicName);
  }
}
