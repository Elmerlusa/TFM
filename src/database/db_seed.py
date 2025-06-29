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
        "Islas Baleares", "Huelva", "Asturias", "León",
    ]
    return random.choice(regions)

def get_sector():
    sectors = [
        "Tecnología", "Finanzas", "Salud", "Retail", "Educación"
    ]
    return random.choice(sectors)

def get_past_date():
    days_ago = random.randint(1, 50)
    return (datetime.now() - timedelta(days=days_ago))

def get_lorem_ipsum(word_count=100):
    lorem_words = (
        "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt "
        "ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco "
        "laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in "
        "voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat "
        "non proident sunt in culpa qui officia deserunt mollit anim id est laborum"
    ).split()

    paragraph = ' '.join(random.choices(lorem_words, k=word_count)).capitalize() + '.'
    return paragraph

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
            'detectedAt': get_past_date(),
            'description': get_lorem_ipsum(),
            'downTimeHours': random.randint(1, 100),
            'reputationalImpact': random.choice(['Aparece en prensa', 'No aparece en prensa'])
        }
        mongodb.scraped_attacks.update_one(query, {'$set': update})
