package com.example.demo.kafka;

import com.example.demo.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class KafkaListener {

  Logger LOG = LoggerFactory.getLogger(KafkaListener.class);

  @org.springframework.kafka.annotation.KafkaListener(
    topics = "chat-message",
    groupId = "group_id"
  )
  public void listen(ChatMessage message) {
    LOG.info("Received message: {}", message);
  }
}
