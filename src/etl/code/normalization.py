import datetime

def parse_str(value: str):
    if value is None:
        return value
    string = value.strip()
    return None if string == '' else string
    
def parse_date(value: str, format='%Y-%m-%d %H:%M:%S'):
    try:
        return datetime.strptime(parse_str(value), format)
    except (ValueError, TypeError):
        return None

def parse_int(value: str):
    try:
        return int(parse_str(value))
    except (ValueError, TypeError):
        return None

def parse_float(value: str):
    try:
        return float(parse_str(value))
    except (ValueError, TypeError):
        return None

def remove_none(obj):
    return { k: v for k, v in obj.items() if v is not None }
