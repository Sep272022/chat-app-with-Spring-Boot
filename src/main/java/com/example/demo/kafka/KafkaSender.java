package com.example.demo.kafka;

import com.example.demo.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaSender {

  Logger LOG = LoggerFactory.getLogger(KafkaSender.class);

  @Autowired
  private KafkaTemplate<String, ChatMessage> kafkaTemplate;

  public void sendMessage(ChatMessage message, String topicName) {
    kafkaTemplate.send(topicName, message);
    LOG.info("Message sent to topic: {}", topicName);
  }
}
