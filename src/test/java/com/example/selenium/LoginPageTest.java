package com.example.selenium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class LoginPageTest {

  private static final String LOGOUT_BUTTON_ID = "logout-button";

  private static final String LOGIN_BUTTON_ID = "login-button";

  private static final String PASSWORD_INPUT_ID = "password";

  private static final String EMAIL_INPUT_ID = "email";

  private static final String VALID_USER_EMAIL = "test@test.com";

  private static final String INVALID_USER_EMAIL = "test10@test.com";

  private static final String VALID_USER_PASSWORD = "111";

  private static final String INVALID_USER_PASSWORD = "!@#";

  // TODO: link port number in application.properties if possible
  private static final int PORT = 8080;

  private static final String LOGIN_PAGE_URL =
    "http://localhost:" + PORT + "/login";

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
  }

  @Test
  void testLoginWithValidCredentials() {
    try {
      driver.get(LOGIN_PAGE_URL);

      driver.findElement(By.id(EMAIL_INPUT_ID)).sendKeys(VALID_USER_EMAIL);
      driver
        .findElement(By.id(PASSWORD_INPUT_ID))
        .sendKeys(VALID_USER_PASSWORD);

      driver.findElement(By.id(LOGIN_BUTTON_ID)).click();

      Thread.sleep(2000);

      String expectedUrl = "http://localhost:" + PORT + "/index";
      String actualUrl = driver.getCurrentUrl();

      assertEquals(
        expectedUrl,
        actualUrl,
        "Successful login should redirect to index page"
      );
    } catch (Exception e) {
      e.printStackTrace();
      fail();
    }
  }

  @Test
  void testLoginWithInvalidCredentials() {
    try {
      driver.get(LOGIN_PAGE_URL);

      driver.findElement(By.id(EMAIL_INPUT_ID)).sendKeys(INVALID_USER_EMAIL);
      driver
        .findElement(By.id(PASSWORD_INPUT_ID))
        .sendKeys(INVALID_USER_PASSWORD);

      driver.findElement(By.id(LOGIN_BUTTON_ID)).click();

      String expectedUrl = "http://localhost:" + PORT + "/login?error";
      String actualUrl = driver.getCurrentUrl();

      assertEquals(
        expectedUrl,
        actualUrl,
        "Failed login should redirect to login page with error"
      );

      String expectedErrorMessage = "Invalid email or password";
      String bodyText = driver.findElement(By.tagName("body")).getText();

      assertTrue(
        bodyText.contains(expectedErrorMessage),
        "Failed login should display error message"
      );
    } catch (Exception e) {
      e.printStackTrace();
      fail();
    }
  }

  @Test
  void testLoginPageAfterLogout() {
    try {
      driver.get(LOGIN_PAGE_URL);

      driver.findElement(By.id(EMAIL_INPUT_ID)).sendKeys(VALID_USER_EMAIL);
      driver
        .findElement(By.id(PASSWORD_INPUT_ID))
        .sendKeys(VALID_USER_PASSWORD);

      driver.findElement(By.id(LOGIN_BUTTON_ID)).click();

      driver.findElement(By.id(LOGOUT_BUTTON_ID)).click();

      String expectedUrl = "http://localhost:" + PORT + "/login?logout";
      String actualUrl = driver.getCurrentUrl();

      assertEquals(
        expectedUrl,
        actualUrl,
        "Successful logout should redirect to login page"
      );

      String expectedErrorMessage = "You have been logged out";
      String bodyText = driver.findElement(By.tagName("body")).getText();

      assertTrue(
        bodyText.contains(expectedErrorMessage),
        "Successful logout should display success message"
      );
    } catch (Exception e) {
      e.printStackTrace();
      fail();
    }
  }

  @AfterAll
  static void teardown() {
    if (driver != null) {
      driver.quit();
    }
  }
}
