import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_login_valid(browser, base_url, admin_credentials):
    browser.get(f"{base_url}/auth/login")
    
    browser.find_element(By.ID, "email-address").send_keys(admin_credentials["email"])
    browser.find_element(By.ID, "password").send_keys(admin_credentials["password"])
    browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    # Check if redirected to home
    WebDriverWait(browser, 10).until(EC.url_to_be(f"{base_url}/"))
    assert browser.current_url == f"{base_url}/"

def test_login_invalid_password(browser, base_url):
    browser.get(f"{base_url}/auth/login")
    
    browser.find_element(By.ID, "email-address").send_keys("muhammadhaseebhassan23@gmail.com")
    browser.find_element(By.ID, "password").send_keys("wrongpassword")
    browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    # Check for error message
    error_msg = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "div.bg-red-50"))
    )
    assert "Invalid password" in error_msg.text

def test_login_non_existent_user(browser, base_url):
    browser.get(f"{base_url}/auth/login")
    
    browser.find_element(By.ID, "email-address").send_keys("nonexistent@example.com")
    browser.find_element(By.ID, "password").send_keys("somepassword")
    browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    error_msg = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "div.bg-red-50"))
    )
    assert "No user found" in error_msg.text

def test_logout(browser, base_url, admin_credentials):
    # Ensure logged in
    test_login_valid(browser, base_url, admin_credentials)
    
    # Click logout button in navbar
    logout_btn = browser.find_element(By.CSS_SELECTOR, 'button[title="Sign Out"]')
    logout_btn.click()
    
    # Should see "Join Tekron" (Login link)
    join_btn = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "JOIN TEKRON"))
    )
    assert join_btn.is_displayed()
