import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_products_listing(browser, base_url):
    browser.get(f"{base_url}/products")
    
    # Wait for products to load
    WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a.group.glass-card"))
    )
    products = browser.find_elements(By.CSS_SELECTOR, "a.group.glass-card")
    assert len(products) > 0

def test_search_product(browser, base_url):
    browser.get(base_url)
    
    # Open search overlay
    search_btn = browser.find_element(By.CSS_SELECTOR, 'button[title*="Search"]')
    search_btn.click()
    
    # Type search query
    search_input = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder*="looking for"]'))
    )
    search_input.send_keys("Laptop")
    
    # Check for results
    results = WebDriverWait(browser, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.group"))
    )
    assert len(results) > 0

def test_search_no_results(browser, base_url):
    browser.get(base_url)
    
    search_btn = browser.find_element(By.CSS_SELECTOR, 'button[title*="Search"]')
    search_btn.click()
    
    search_input = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder*="looking for"]'))
    )
    search_input.send_keys("NonExistentProductXYZ123")
    
    # Check for "couldn't find anything" message
    no_results_text = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), \"couldn't find anything\")]"))
    )
    assert no_results_text.is_displayed()
