import time
import random
import json
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from fake_useragent import UserAgent
from stem import Signal
from stem.control import Controller

class TorWebScraper:
    def __init__(self, tor_proxy_port=9050, tor_control_port=9051, 
                 chromedriver_path=r'C:\webdrivers\chrome\chromedriver.exe'):
        self.tor_proxy_port = tor_proxy_port
        self.tor_control_prot = tor_control_port
        self.chromedriver_path = chromedriver_path
        self.ua = UserAgent()
        self.driver = None
        logging.info(
            'TorWebScraper(' \
            f'tor_proxy_port={tor_proxy_port}, ' \
            f'tor_control_port={tor_control_port}, ' \
            f'chromedriver_path={chromedriver_path}' \
            ') created'
        )

    def setup_chrome_with_tor(self) -> None:
        chrome_options = Options()

        # TOR proxy configuration
        chrome_options.add_argument(f'--proxy-server=socks5://127.0.0.1:{self.tor_proxy_port}')
        chrome_options.add_argument('--proxy-bypass-list=<-loopback>')

        # Anti-bot detection techniques
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)

        # Randomize user agent
        chrome_options.add_argument(f'--user-agent={self.ua.random}')

        # Additional configuration
        chrome_options.add_argument('--disable-webrtc')
        chrome_options.add_argument('--disable-webrtc-multiple-routes')
        chrome_options.add_argument('--disable-webrtc-hw-decoding')
        chrome_options.add_argument('--disable-webrtc-hw-encoding')
        chrome_options.add_argument('--disable-geolocation')
        chrome_options.add_argument('--disable-notifications')
        chrome_options.add_argument('--disable-default-apps')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-java')
        chrome_options.add_argument('--disable-web-security')
        # chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        # Randomize window size
        window_sizes = [
            (1366, 768), (1920, 1080), (1440, 900), 
            (1280, 720), (1024, 768), (1600, 900)
        ]
        width, height = random.choice(window_sizes)
        chrome_options.add_argument(f'--window-size={width},{height}')

        service = Service(executable_path=self.chromedriver_path)
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.check_current_ip()

    def check_current_ip(self) -> None:
        logging.info('Checking current IP...')
        try:
            self.driver.get('http://httpbin.org/ip')

            ip_element = self.driver.find_element(By.TAG_NAME, 'pre')
            ip_info = json.loads(ip_element.text)
            logging.info(f'Current IP {ip_info['origin']}')
        except Exception as e:
            logging.warning('Error checking current IP: {e}')

    def rotate_tor_identity(self) -> None:
        try:
            logging.info('Rotating TOR identity...')
            with Controller.from_port(port=self.tor_control_prot) as controller:
                controller.authenticate()
                controller.signal(Signal.NEWNYM)
                time.sleep(5) # wait for new tor circuit
                self.close()
                self.setup_chrome_with_tor()
        except Exception as e:
            logging.warning(f'Error rotating TOR identity: {e}')
    
    def human_like_delay(self, min_delay=1, max_delay=5) -> None:
        delay = random.uniform(min_delay, max_delay)
        time.sleep(delay)

    def random_mouse_movement(self) -> None:
        logging.info('Performing random mouse movements...')
        try:
            actions = ActionChains(self.driver)

            # Random movements within window size
            window_size = self.driver.get_window_size()
            max_x = window_size['width']
            max_y = window_size['height']
            for _ in range(random.randint(1, 3)):
                x = random.randint(0, max_x - 1)
                y = random.randint(0, max_y - 1)
                actions.move_by_offset(x, y)

            actions.perform()
        except Exception as e:
            logging.warning(f'Error performing mouse movement: {e}')
    
    def close(self) -> None:
        if self.driver:
            self.driver.quit()
        logging.info("TorWebScraper's driver closed")
