import re

from normalization import *

USD_TO_EUR = 0.93

def parse_leakSize(data: str):
	string = parse_str(data)
	if string is None:
		return None
	match = re.match(r'([\d.]+)\s*(GB|MB|TB)', string.upper())
	if not match:
		return None
	value, unit = match.groups()
	value = parse_float(value)
	return {'value': value, 'unit': unit} if value else None

def parse_disclosures(data: str):
	string = parse_str(data)
	if not string or '/' not in string:
		return None
	parts = data.split('/')
	if len(parts) != 2:
		return None
	obj = {
		'completed': parse_int(parts[0]),
		'total': parse_int(parts[1]),
	}
	return obj if obj['completed'] is not None and obj['completed'] is not None else None

def parse_revenue(data):
	string = parse_str(data)
	if string is None:
		return None
	match = re.match(r'[$]?\s*([\d.]+)\s*([KMB])?', string.upper())
	if not match:
		return None
	number = parse_float(match.group(1))
	suffix = match.group(2)
	return {'value': number * USD_TO_EUR, 'multiplier': suffix, 'unit': '€'}

def normalize_firstDisclosureDate(data):
	string = parse_str(data)
	if not string:
		return None
	date = parse_date(string, '%d %B %Y')
	if not date:
		date = parse_date(f'{string} {datetime.now().year}', '%d %B %Y')
	return date

def parse_website(data):
	string = parse_str(data)
	if not string or ('http://' not in string and 'https://' not in string):
		return None
	return string

def parse_attack_data(data):
	target_args = data.get('target', {})
	cybercriminal_name = parse_str(data.get('cybercriminalName'))
	target_name = parse_str(target_args.get('name'))
	disclosure_date = normalize_firstDisclosureDate(data.get('firstDisclosureDate'))
	parsed_data = {
		'cybercriminal': {
			'name': cybercriminal_name
		},
		'disclosures': parse_disclosures(data.get('disclosures')),
		'leakSize': parse_leakSize(data.get('leakSize')),
		'leakFiles': parse_int(data.get('leakFiles', '').replace(',', '').replace(' files', '')),
		'firstDisclosureAt': disclosure_date,
	}
	target = {
		'name': target_name,
		'website': parse_website(target_args.get('website')),
		'size': parse_int(target_args.get('size', '').replace(',', '')),
		'revenue': parse_revenue(target_args.get('revenue')),
	}
	parsed_data['target'] = remove_none(target)
	return remove_none(parsed_data)
