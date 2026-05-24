import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="session")
def browser():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--allow-insecure-localhost")
    chrome_options.add_argument("--disable-features=UpgradeInsecureRequests")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-software-rasterizer")
    chrome_options.add_argument("--proxy-server='direct://'")
    chrome_options.add_argument("--proxy-bypass-list=*")
    chrome_options.set_capability("acceptInsecureCerts", True)
    
    # Check if running in Docker
    if os.path.exists('/.dockerenv'):
        service = Service("/usr/bin/chromedriver")
        driver = webdriver.Chrome(service=service, options=chrome_options)
    else:
        # Local execution
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

@pytest.fixture
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture
def admin_credentials():
    return {
        "email": "muhammadhaseebhassan23@gmail.com",
        "password": "AdminPassword123" # User should set this in .env
    }

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        try:
            if "browser" in item.fixturenames:
                web_driver = item.funcargs["browser"]
                if not os.path.exists("screenshots"):
                    os.makedirs("screenshots")
                web_driver.save_screenshot(f"screenshots/{item.name}.png")
        except Exception as e:
            print(f"Fail to take screenshot: {e}")
