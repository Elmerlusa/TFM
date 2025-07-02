import logging
import time
import json
import os
from datetime import date, datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from TorWebScraper import TorWebScraper

class ScrapeHuntersPage:
	def __init__(self, tor_web_scraper: TorWebScraper =None):
		env_output_dir = os.getenv('OUTPUT_DIR', f'/app/data')
		env_output_file_suffix = os.getenv('OUTPUT_FILE_SUFFIX', f'scraped_data_{date.today().strftime("%Y%m%d")}.json')
		self.output_file = f'{env_output_dir}/hunters{env_output_file_suffix}'
		self.tor_web_scraper = tor_web_scraper
		self.driver = self.tor_web_scraper.driver
		self.wait = WebDriverWait(self.driver, 10)
		logging.info('ScrapeHuntersPage() created')

	def scrape(self):
		url = 'https://hunters55rdxciehoqzwv7vgyv6nt37tbwax2reroyzxhou7my5ejyid.onion'
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
			time.sleep(1) # wait for load
			new_height = self.driver.execute_script('return arguments[0].scrollHeight', scrollable)
			if new_height == last_height:
				break
			last_height = new_height
		cyberattacks = scrollable.find_elements(
			By.CSS_SELECTOR, 'app-company-list-item'
		)
		
		logging.info('Checking cyberattack country...')
		attacks = []
		for index, element in enumerate(cyberattacks):
			try:
				ele = element.find_element(By.CSS_SELECTOR, 'app-flag > .title')
				title = self.driver.execute_script('return arguments[0].innerText', ele)
				if title.strip() != 'Spain':
					continue
				if index != 0:
					self.driver.execute_script('arguments[0].click()', element)
					time.sleep(1)
			except:
				continue
			attacks.append(self.getSelectedAttackData())

		logging.info('Writing attacks in file...')
		with open(self.output_file, 'w', encoding='utf-8') as f:
			json.dump(attacks, f, indent=4, ensure_ascii=False)


	def getSelectedAttackData(self):
		attack_data = { 'cybercriminalName': 'hunters', 'target': {} }

		# card info
		selected_attack = self.driver.find_element(By.CSS_SELECTOR, '.selected-company > app-company-list-item')
		metadata = selected_attack.find_element(By.CLASS_NAME, 'meta')
		attack_data['target']['name'] = selected_attack.find_element(By.CSS_SELECTOR, '.data .content').text
		attack_data['target']['revenue'] = metadata.find_element(By.XPATH, './*[1]//*[contains(@class, "value")]').text
		attack_data['target']['size'] = metadata.find_element(By.XPATH, './*[2]//*[contains(@class, "value")]').text
		try:
			attack_data['disclosures'] = metadata.find_element(By.XPATH, './*[4]//*[contains(@class, "value")]').text
		except Exception:
			pass

		# details info
		attack_details = self.driver.find_element(By.TAG_NAME, 'app-company-overview')
		website_link = attack_details.find_element(By.CSS_SELECTOR, '.details .value > a')
		attack_data['target']['website'] = website_link.get_attribute('href')
		try:
			disclosures = attack_details.find_elements(By.TAG_NAME, 'app-company-disclosure-item')
			for disclosure in disclosures:
				title = disclosure.find_element(By.CLASS_NAME, 'd_title').text.lower()
				if 'all' in title and 'data' in title:
					attack_data['leakSize'] = disclosure.find_element(By.XPATH, './/*[contains(@class, "actions")]//*[contains(@class, "meta")]/*[1]').text
					attack_data['leakFiles'] = disclosure.find_element(By.XPATH, './/*[contains(@class, "actions")]//*[contains(@class, "meta")]/*[3]').text
		except Exception:
			pass
		attack_data['scrapedAt'] = datetime.now().isoformat()
		return attack_data
