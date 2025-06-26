import os
import json
import logging
from datetime import date

from MongoWrapper import MongoWrapper
import HuntersETL

def separate_attacks(parsed_attacks):
    new_attacks = []
    multiple_attacks = []
    for data in parsed_attacks:
        criminal = data['cybercriminal']['name']
        target = data['target']['name']
        count = mongo.count_cyberattack_by_criminal_target(criminal, target)
        if count == 0:
            new_attacks.append(data)
        elif count == 1:
            continue
        else:
            multiple_attacks.append(data)
    return new_attacks, multiple_attacks


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    mongo = MongoWrapper()
    file = os.getenv('INPUT_FILE', f'./data/scraped_data_{date.today().strftime("%Y%m%d")}.json')
    
    mongo.save_last_scrape()
    with open(file, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            parsed_data = list(map(lambda x: HuntersETL.parse_attack_data(x), data))
            new_attacks, multiple_attacks = separate_attacks(parsed_data)
            logging.info(f'There are {len(new_attacks)} new attacks')
            if len(new_attacks) != 0:
                mongo.save_cyberattacks(new_attacks)
            logging.warning(f'There are {len(new_attacks)} multiple attacks')
        except json.JSONDecodeError as e:
            logging.error(e)
