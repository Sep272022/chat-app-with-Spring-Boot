package com.example.selenium;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.time.Duration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChatPageTest {

  private static final String TALK_BUTTON_ID = "talk-button";

  private static final String TALK_TO_BUTTON_ID = "talk-to-button";

  private static final String VALID_USER_EMAIL = "test@test.com";

  private static final String VALID_USER_PASSWORD = "111";

  private static final String LOGIN_BUTTON_ID = "login-button";

  private static final String PASSWORD_INPUT_ID = "password";

  private static final String EMAIL_INPUT_ID = "email";

  private static final int PORT = 8080;

  private static final String LOGIN_PAGE_URL =
    "http://localhost:" + PORT + "/login";

  private static final String MAIN_PAGE_URL =
    "http://localhost:" + PORT + "/index";

  private static WebDriver driver;

  @BeforeAll
  static void setup() {
    System.setProperty(
      "webdriver.chrome.driver",
      "/Users/joonwoolee/chromedriver_mac_arm64/chromedriver"
    );
    ChromeOptions options = new ChromeOptions();
    options.addArguments(
      "--remote-allow-origins=*",
      "--disable-gpu",
      "--no-sandbox"
    );
    // options.addArguments("--headless");

    driver = new ChromeDriver(options);

    // Login with valid credentials
    driver.get(LOGIN_PAGE_URL);
    login(VALID_USER_EMAIL, VALID_USER_PASSWORD);
  }

  private static void login(String email, String password) {
    driver.findElement(By.id(EMAIL_INPUT_ID)).sendKeys(email);
    driver.findElement(By.id(PASSWORD_INPUT_ID)).sendKeys(password);
    driver.findElement(By.id(LOGIN_BUTTON_ID)).click();

    new WebDriverWait(driver, Duration.ofSeconds(10))
      .until(ExpectedConditions.urlToBe(MAIN_PAGE_URL));
  }

  @Test
  void testCreateAndLeaveChatRoom() {
    try {
      driver.get(MAIN_PAGE_URL);
      Thread.sleep(4000);

      // TODO: can't get a list of the chat rooms from the server for some reason
      WebElement TalkToButton = new WebDriverWait(
        driver,
        Duration.ofSeconds(10)
      )
        .until(
          ExpectedConditions.elementToBeClickable(By.id(TALK_TO_BUTTON_ID))
        );
      Thread.sleep(4000);
      TalkToButton.click();
      WebElement userButton = new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(
          ExpectedConditions.elementToBeClickable(
            By.cssSelector("div[id='modal-body-all-users'] > div > label")
          )
        );
      // Thread.sleep(2000);
      String talkPartnerName = userButton.getText();
      userButton.click();
      driver.findElement(By.id(TALK_BUTTON_ID)).click();

      // check if chat room button is created
      WebElement createdChatRoomButton = driver.findElement(
        By.cssSelector("div[id='conversation-container'] > div > input")
      );
      assertTrue(
        createdChatRoomButton.getAttribute("value").contains(talkPartnerName)
      );
      createdChatRoomButton.click();
      // Thread.sleep(2000);

      assertTrue(
        driver
          .findElement(By.id("chat-title"))
          .getText()
          .contains(talkPartnerName),
        "Chat room title should contain the name of the talk partner"
      );
      // leave chat room
      driver.findElement(By.id("leave-button")).click();
      assertTrue(driver.findElement(By.id("chat-title")).getText().isEmpty());
    } catch (Exception e) {
      e.printStackTrace();
      fail();
    }
  }

  @Test
  void testSendMessageInChatRoom() {}

  @AfterAll
  static void teardown() {
    if (driver != null) {
      driver.quit();
    }
  }
}
