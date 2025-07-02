from pymongo import MongoClient
import json
import datetime

if __name__ == '__main__':
    mongouri = 'mongodb://localhost:27017'
    username = 'admin'
    password = 'admin'
    db = 'cyberattacks'
    mongoclient = MongoClient(mongouri, username=username, password=password)
    mongodb = mongoclient[db]

    with open("sample_data.json", 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            for d in data:
                d['detectedAt'] = datetime.datetime.fromisoformat(d['detectedAt'])
            mongodb.scraped_attacks.insert_many(data)
        except json.JSONDecodeError as e:
            pass
