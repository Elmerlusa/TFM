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
		self.wait = WebDriverWait(self.driver, 10)
		logging.info('ScrapeHuntersPage() created')

	def scrape(self):
		url = ''
		self.driver.get(url)

		logging.info('Waiting for scrollable content to render...')
		self.wait.until(
			EC.presence_of_element_located((By.CSS_SELECTOR, 'perfect-scrollbar > .ps.ps--active-y'))
		)
		scrollable = self.driver.find_element(By.CSS_SELECTOR, 'perfect-scrollbar > .ps.ps--active-y')
		
		# Scroll to load all the content
		logging.info('Scrolling to load all cyberattacks...')
		last_height = self.driver.execute_script('return arguments[0].scrollHeight', scrollable)
		while True:
			self.driver.execute_script('arguments[0].scrollTo(0, arguments[0].scrollHeight)', scrollable)
			time.sleep(3) # wait for load
			new_height = self.driver.execute_script('return arguments[0].scrollHeight', scrollable)
			if new_height == last_height:
				break
			last_height = new_height

		time.sleep(5)


		cyberattacks = self.driver.find_elements(
			By.CSS_SELECTOR, 'app-company-list div.wrapper.fullDisclosed'
		)

		attack = { 'cybercriminal', 'hunters' }

		for element in cyberattacks:
			country = element.find_element(By.CSS_SELECTOR, 'app-flag > .title').text
			if country != 'Spain':
				continue
			company = element.find_element(By.CLASS_NAME, '.data .content').text
			attack['company'] = { 'name': company }
			metadata = element.find_element(By.CLASS_NAME, '.meta')
			attack.company['revenue'] = metadata.find_element(By.XPATH, './*[1]//*[contains(@class, "value")]').text
			attack.company['size'] = metadata.find_element(By.XPATH, './*[2]//*[contains(@class, "value")').text
			attack.company['disclosures'] = metadata.find_element(By.XPATH, './*[4]//*[contains(@class, "value")').text
			logging.info(attack)

			# cyberattack details
			website_link = self.driver.find_element(By.CSS_SELECTOR, '.details .value > a')
			href_old = website_link.get_attribute('href')
			element.click()
			self.wait.until(
				lambda d: website_link.get_attribute('href') != href_old
			)
			attack.company['website'] = website_link.get_attribute('href')
			logging.info(attack)
		# logging.info(f'Number of spanish cyberattacks found {1}')
