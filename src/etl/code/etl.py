import os
import json
import logging
import re

from normalization import *
from MongoWrapper import MongoWrapper

USD_TO_EUR = 0.93

def parse_leakSize(data):
	if not data:
		return None
	match = re.match(r'([\d.]+)\s*(GB|MB|TB)', data.strip().upper())
	if not match:
		return None
	value, unit = match.groups()
	value = parse_float(value)
	if value is None:
		return None
	return {'value': value, 'unit': unit}

def parse_disclosures(data):
	if not data or '/' not in data:
		return None
	parts = data.split('/')
	return {
		'completed': parse_int(parts[0]),
		'total': parse_int(parts[1])
	}

def parse_revenue(data):
	if not data:
		return None
	match = re.match(r'[$€]?\s*([\d.]+)\s*([KMB])?', data.strip().upper())
	if not match:
		return None
	number = parse_float(match.group(1))
	suffix = match.group(2)
	multiplier = {
		'K': 1_000,
		'M': 1_000_000,
		'B': 1_000_000_000,
	}
	euros = parse_float(number * multiplier[suffix] * USD_TO_EUR)
	if euros < 1_000:
		return {'value': euros, 'unit': '€'}
	elif euros < 1_000_000:
		return {'value': round(euros / 1_000, 2), 'multiplier': 'mil', 'unit': '€'}
	elif euros < 1_000_000_000_000:
		return {'value': round(euros / 1_000_000, 2), 'multiplier': 'millones', 'unit': '€'}
	else:
		return {'value': round(euros / 1_000_000_000_000, 2), 'multiplier': 'billones', 'unit': '€'}

def normalize_firstDisclosureDate(data):
	if not data:
		return None
	string = parse_str(data)
	date = parse_date(string, '%d %B %Y')
	if not date:
		date = parse_date(f'{string} {datetime.now().year}', '%d %B %Y')
	return date

def parse_website(data):
	if not data or ('http://' not in data and 'https://' not in data):
		return None
	return parse_str(data)

def parse_attack_data(data):
	company = data.get('company', {})
	cybercriminalName = parse_str(data.get('cybercriminalName'))
	companyName = parse_str(company.get('name'))
	disclosure_date = normalize_firstDisclosureDate(data.get('firstDisclosureDate'))
	parsed_data = {
		'cybercriminalName': cybercriminalName,
		'disclosures': parse_disclosures(data.get('disclosures')),
		'leakSize': parse_leakSize(data.get('leakSize')),
		'firstDisclosureAt': disclosure_date,
	}
	company = {
		'name': companyName,
		'website': parse_website(company.get('website')),
		'size': parse_int(company.get('size', '').replace(',', '')),
		'revenue': parse_revenue(company.get('revenue')),
	}
	parsed_data['company'] = remove_none(company)
	return remove_none(parsed_data)

if __name__ == '__main__':
	directory_path = './data'
	mongo = MongoWrapper()
	
	for filename in os.listdir(directory_path):
		if filename.endswith('.json'):
			logging.info(f'parsing {filename}...')
			file_path = os.path.join(directory_path, filename)
			with open(file_path, 'r', encoding='utf-8') as f:
				try:
					data = json.load(f)
					parsed_data = list(map(lambda x: parse_attack_data(x), data))
					logging.error(parsed_data[0])
				except json.JSONDecodeError as e:
					logging.error(e)
