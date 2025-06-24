import logging
from pymongo import MongoClient

class MongoWrapper:
	def __init__(self, mongo_uri='mongodb://localhost:27017', db='cyberattacks'):
		self.client = MongoClient(mongo_uri, username='admin', password='admin')
		self.db = db
		logging.info(
            'TorWebScraper(' \
            f'mongo_uri={mongo_uri}' \
            f', db={db}' \
            ') created'
        )
	
	def save_cyberattack(self, data):
		self.db.attacks.insert_one(data)
	
	def save_cyberattacks(self, data):
		self.db.attacks.insert_many(data)
	
	def save_cybercriminal(self, data):
		self.db.cybercriminals.insert_one(data)
