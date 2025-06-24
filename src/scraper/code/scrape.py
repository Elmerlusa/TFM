import logging

from TorWebScraper import TorWebScraper
from ScrapeHuntersPage import ScrapeHuntersPage

if __name__ == '__main__':
        logging.basicConfig(level=logging.INFO)
        scraper = TorWebScraper()
    # while True:
        try:
            # scraper.rotate_tor_identity()
            scraper.setup_chrome_with_tor()
            scrape_hunters = ScrapeHuntersPage(scraper)
            scrape_hunters.scrape()
        except Exception as e:
            logging.error(f'Error: {e}')
        finally:
            scraper.close()
            # time.sleep(60)
