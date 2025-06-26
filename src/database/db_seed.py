import random
import string

from datetime import datetime, timedelta
from pymongo import MongoClient


def random_onion():
    onions = [
        'ftsgqtigrpvuc4dcfntpzkiczir6aid74xafeghouaxi5kamyin7et5b.onion',
        'xvl5hqbvt6ppy2pf42rvjkgv4io4mc5oxxehbskirfxy2rngthx5qip7.onion',
        'ytki3mufysbo57uc6o2quud7xpgd6osie4i5miwvxqilcsolmehpvjwo.onion'
    ]
    return random.choice(onions)


def random_email():
    domains = ['protonmail.com', 'tutanota.com', 'mail2tor.com', 'example.com']
    username = ''.join(random.choices(
        string.ascii_lowercase + string.digits, k=10))
    return f"{username}@{random.choice(domains)}"


def random_wallet():
    wallets = [
        'bc1caHsUvwxKXmGUTOpncpZJQvMYhnLmAUc56',
        '3L0fVmGyEBrJF1eUSqIWobSlaXJv',
        'bc1QHi1iHFYtNLwg6inTLsCDX5mHxqDmvYibps5Ruvs7'
    ]
    return random.choice(wallets)


def random_telegram():
    username = ''.join(random.choices(
        string.ascii_lowercase + string.digits + '_', k=random.randint(5, 15)))
    return f"https://t.me/{username}"

def get_region():
    regions = [
        "Andalucía", "Aragón", "Asturias", "Islas Baleares", "Canarias", "Cantabria"
    ]
    return random.choice(regions)

def get_sector():
    sectors = [
        "Tecnología", "Finanzas", "Salud", "Retail", "Educación", "Telecommunications"
    ]
    return random.choice(sectors)

def get_past_date():
    days_ago = random.randint(1, 365 * 5)  # Up to 5 years ago
    return (datetime.now() - timedelta(days=days_ago))

if __name__ == '__main__':
    mongouri = 'mongodb://localhost:27017'
    username = 'admin'
    password = 'admin'
    db = 'cyberattacks'
    mongoclient = MongoClient(mongouri, username=username, password=password)
    mongodb = mongoclient[db]

    attacks = mongodb.scraped_attacks.find()
    for attack in attacks:
        query = {
            '_id': attack['_id']
        }
        update = {
            'cybercriminal.telegram': random_telegram(),
            'cybercriminal.wallet': random_wallet(),
            'cybercriminal.email': random_email(),
            'cybercriminal.onion': random_onion(),
            'target.region': get_region(),
            'target.sector': get_sector(),
            'detectedAt': get_past_date()

        }
        mongodb.scraped_attacks.update_one(query, {'$set': update})
