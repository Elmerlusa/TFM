import datetime

def parse_str(value):
    if value is None:
        return value
    try:
        string = str(value).strip()
        if string == '':
            return None
        else:
            return string
    except (ValueError, TypeError):
        return None

def parse_date(value, format='%Y-%m-%d %H:%M:%S'):
    try:
        return datetime.strptime(parse_str(value), format)
    except (ValueError, TypeError):
        return None

def parse_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

def parse_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def remove_none(obj):
    return { k: v for k, v in obj.items() if v is not None }
