import logging

from TorWebScraper import TorWebScraper

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    try:
        scraper = TorWebScraper()
        scraper.setup_chrome_with_tor()
        scraper.rotate_tor_identity()
    except Exception as e:
        logging.error(f'Error: {e}')
    finally:
        scraper.close()
