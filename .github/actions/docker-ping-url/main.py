import os
import requests
import time

def ping_url(url,delay,max_trails):
    trails = 0
    while trails < max_trails :
        try:
            response = requests.get(url)
            if response.status_code == 200 :
                print(f"Webiste {url} is Reachable")
                return True
        except requests.ConnectionError:
            print(f"Webiste {url} is unreachable. Retrying in {delay} seconds")
            time.sleep(delay)
            trails += 1
        except requests.exceptions.MissingSchema :
            print(f"Inavlid URL for ping: {url} check the url format")
            return False
    return False
def run():
    webURL= os.getenv("INPUT_URL")
    delay = int(os.getenv("INPUT_DELAY"))
    max_trails = int(os.getenv("INPUT_MAX_TRAILS"))
    website_reachable = ping_url(webURL,delay,max_trails)
    if not website_reachable:
        raise Exception(f"Webiste {webURL} is malformed ")
    print(f"Website is reachable : {webURL}");
        
        
        
if __name__ == "__main__":

    run();