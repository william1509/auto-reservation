import json

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from utils import getNextReservationDay, presence_of_n_elements


def add_reservation(data: dict) -> bool:
    file = open("reservations.json",'r+')
    username = data['username']
    password = data['password']
    for reservation in data['reservations']:
        day = reservation['day']
        timeslot = reservation['timeslot']


        file_data = json.load(file)
        res_for_day = file_data[day.lower()]
        for res in res_for_day:
            if res['username'] == username:
                return False
        file_data[day.lower()].append({
            'username': username,
            'password': password,
            'timeslot': timeslot
        })
        file.seek(0)
        json.dump(file_data, file, indent = 4)
        return True

def connect(username: str, password: str) -> bool:
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager(version="98.0.4758.102").install()), options=options)
    driver.get("https://interactif.cepsum.umontreal.ca/CapNet/login.coba")

    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'txtCodeUsager')]")
    
    elem[0].clear()
    elem[0].send_keys(username)

    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'txtMotDePasse')]")
    elem[0].clear()
    elem[0].send_keys(password)

    old_url = driver.current_url

    elem[0].send_keys(Keys.RETURN)
    try:
        WebDriverWait(driver, 1).until(lambda driver: old_url != driver.current_url)
        return True
    except:
        return False
    finally:
        driver.close()
    
def reserve(email: str, password: str, timeslot: str):
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager(version="98.0.4758.102").install(),), options=options)
    driver.get("https://interactif.cepsum.umontreal.ca/CapNet/login.coba")

    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'txtCodeUsager')]")
    
    elem[0].clear()
    elem[0].send_keys(email)

    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'txtMotDePasse')]")
    elem[0].clear()
    elem[0].send_keys(password)

    elem[0].send_keys(Keys.RETURN)

    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.NAME, "lnkRESACT")))

    wait.until(EC.presence_of_element_located((By.NAME, "lnkRESACT")))
    elem = driver.find_elements(by=By.NAME, value="lnkRESACT")
    elem[0].click()

    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(@name, 'grdReservations-ajouter')]")))
    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'grdReservations-ajouter')]")
    elem[0].click()

    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "popup-content")))

    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@class, 'col-1 contenant')]")
    elem[2].click()

    wait.until(presence_of_n_elements((By.XPATH, "//*[contains(@class, 'col-1 contenant avec-titre')]"), 4))
    elem = driver.find_elements(by=By.XPATH, value="//*[contains(@class, 'col-1 contenant avec-titre')]")

    #Eliminate first element because it's a label
    elem = elem[3].find_elements(by=By.TAG_NAME, value="a")

    for availableSlot in elem:
        if timeslot in availableSlot.text:
            availableSlot.click()
            wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(@name, 'btnConfirmer')]")))
            elem = driver.find_elements(by=By.XPATH, value="//*[contains(@name, 'btnConfirmer')]")
            elem[0].click()
            break

    driver.close()

                                
if __name__ == "__main__":
    connect("ff", "ff")