import logging
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from TorWebScraper import TorWebScraper

class ScrapeHuntersPage:
	def __init__(self, tor_web_scraper: TorWebScraper =None):
		self.tor_web_scraper = tor_web_scraper
		self.driver = self.tor_web_scraper.driver
		logging.info('ScrapeHuntersPage() created')

	def scrape(self):
		url = 'hunters55rdxciehoqzwv7vgyv6nt37tbwax2reroyzxhou7my5ejyid.onion'
		self.driver.get(url)

		logging.info('Waiting for scrollable content to render...')
		WebDriverWait(self.driver, 10).until(
			EC.presence_of_element_located((By.TAG_NAME, 'perfect-scrollbar'))
		)
		scrollable = self.driver.find_element(By.TAG_NAME, 'perfect-scrollbar')

		time.sleep(10)
		
		# Scroll to load all the content
		logging.info('Scrolling to load all cyberattacks...')
		# TODO

		cyberattacks = self.driver.find_elements(
			By.CSS_SELECTOR, 'app-company-list div.wrapper.ng-star-inserted'
		)

		logging.info(f'Number of spanish cyberattacks found {1}')
