import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_checkout_validation(browser, base_url):
    # Add product to cart first
    browser.get(f"{base_url}/products")
    add_btn = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[title="Add to Cart"]'))
    )
    add_btn.click()
    
    browser.get(f"{base_url}/checkout")
    
    # Try to submit without filling fields
    submit_btn = browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_btn.click()
    
    # Browser should prevent submission (HTML5 validation) or show error
    # Since it's HTML5 'required', we can't easily check for a message unless it's custom
    # But we can check if we are still on the checkout page
    assert "/checkout" in browser.current_url

def test_checkout_full_flow(browser, base_url):
    # Add product to cart
    browser.get(f"{base_url}/products")
    add_btn = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[title="Add to Cart"]'))
    )
    add_btn.click()
    
    browser.get(f"{base_url}/checkout")
    
    # Fill form
    browser.find_element(By.NAME, "firstName").send_keys("John")
    browser.find_element(By.NAME, "lastName").send_keys("Doe")
    browser.find_element(By.NAME, "email").send_keys("john@example.com")
    browser.find_element(By.NAME, "address").send_keys("123 Street")
    browser.find_element(By.NAME, "city").send_keys("New York")
    browser.find_element(By.NAME, "state").send_keys("NY")
    browser.find_element(By.NAME, "postalCode").send_keys("10001")
    browser.find_element(By.NAME, "country").send_keys("USA")
    
    browser.find_element(By.NAME, "cardNumber").send_keys("4242 4242 4242 4242")
    browser.find_element(By.NAME, "expDate").send_keys("12/25")
    browser.find_element(By.NAME, "cvc").send_keys("123")
    
    submit_btn = browser.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_btn.click()
    
    # Wait for success message
    success_msg = WebDriverWait(browser, 20).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Payment Successful')]"))
    )
    assert success_msg.is_displayed()

def test_access_checkout_empty_cart(browser, base_url):
    # Ensure cart is empty
    browser.get(f"{base_url}/cart")
    try:
        remove_btns = browser.find_elements(By.CSS_SELECTOR, 'button[title="Remove Item"]')
        for btn in remove_btns:
            btn.click()
    except:
        pass
        
    browser.get(f"{base_url}/checkout")
    
    # Should show "Your cart is empty"
    msg = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Your cart is empty')]"))
    )
    assert msg.is_displayed()
