import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_admin_route_protection(browser, base_url):
    # Ensure logged out
    browser.get(f"{base_url}/auth/login")
    try:
        logout_btn = browser.find_element(By.CSS_SELECTOR, 'button[title="Sign Out"]')
        logout_btn.click()
    except:
        pass
        
    browser.get(f"{base_url}/admin")
    
    # Should redirect to login
    WebDriverWait(browser, 10).until(EC.url_contains("/auth/login"))
    assert "/auth/login" in browser.current_url

def test_admin_access(browser, base_url, admin_credentials):
    # Login as admin
    browser.get(f"{base_url}/auth/login")
    browser.find_element(By.ID, "email-address").send_keys(admin_credentials["email"])
    browser.find_element(By.ID, "password").send_keys(admin_credentials["password"])
    browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    WebDriverWait(browser, 10).until(EC.url_to_be(f"{base_url}/"))
    
    # Go to admin
    browser.get(f"{base_url}/admin")
    
    # Check for admin dashboard header
    dashboard_header = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Dashboard')]"))
    )
    assert dashboard_header.is_displayed()
