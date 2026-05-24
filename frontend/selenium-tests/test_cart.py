import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_add_to_cart(browser, base_url):
    browser.get(f"{base_url}/products")
    
    # Click "Add to Cart" on the first product
    add_btn = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[title="Add to Cart"]'))
    )
    add_btn.click()
    
    # Check cart badge in navbar
    badge = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href='/cart'] span"))
    )
    assert badge.text == "1"

def test_cart_persistence(browser, base_url):
    # Ensure something is in cart
    test_add_to_cart(browser, base_url)
    
    browser.refresh()
    
    badge = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href='/cart'] span"))
    )
    assert badge.text == "1"

def test_remove_from_cart(browser, base_url):
    # Ensure something is in cart
    test_add_to_cart(browser, base_url)
    
    browser.get(f"{base_url}/cart")
    
    # Click remove button
    remove_btn = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[title="Remove Item"]'))
    )
    remove_btn.click()
    
    # Check if empty message appears
    empty_msg = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Your Cart is Empty')]"))
    )
    assert empty_msg.is_displayed()
