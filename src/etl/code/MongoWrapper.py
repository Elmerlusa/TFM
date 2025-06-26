import logging
import os
from pymongo import MongoClient
from datetime import datetime

class MongoWrapper:
	def __init__(self, mongo_uri='mongodb://localhost:27017'):
		username = os.getenv('MONGO_INITDB_ROOT_USERNAME', 'admin')
		password = os.getenv('MONGO_INITDB_ROOT_PASSWORD', 'admin')
		db = os.getenv('MONGO_INITDB_DATABASE', 'cyberattacks')
		self.client = MongoClient(mongo_uri, username=username, password=password)
		self.db = self.client[db]
		logging.info(
            'TorWebScraper(' \
            f'mongo_uri={mongo_uri}'
            ') created'
        )

	def count_cyberattack_by_criminal_target(self, criminal: str, target: str) -> int:
		query = {
			'cybercriminalName': criminal,
			'company.name': target
		}
		return self.db.scraped_attacks.count_documents(query)
	
	def save_cyberattack(self, data):
		self.db.scraped_attacks.insert_one(data)
	
	def save_cyberattacks(self, data):
		self.db.scraped_attacks.insert_many(data)
	
	def save_cybercriminal(self, data):
		self.db.scraped_cybercriminals.insert_one(data)
	
	def save_cybercriminal(self, data):
		self.db.scraped_globalStats.insert_one(data)

	def save_last_scrape(self):
		query = {
			'_id': 'metadata'
		}
		new_value = {
			'lastScrape': datetime.now()
		}
		self.db.scraper_info.update_one(query, {'$set': new_value}, upsert=True)
