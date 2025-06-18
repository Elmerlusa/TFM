import logging
import time

from TorWebScraper import TorWebScraper
from ScrapeHuntersPage import ScrapeHuntersPage

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    while True:
        try:
            scraper = TorWebScraper()
            scraper.setup_chrome_with_tor()
            scraper.rotate_tor_identity()
            scrape_hunters = ScrapeHuntersPage(scraper)
            scrape_hunters.scrape()
        except Exception as e:
            logging.error(f'Error: {e}')
        finally:
            scraper.close()
            time.sleep(60)
