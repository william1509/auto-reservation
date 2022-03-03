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


def add_reservation(username, password, data):
    day = data['day']
    timeslot = data['timeslot']

    with open("reservations.json",'r+') as file:
        file_data = json.load(file)
        res_for_day = file_data[day.lower()]
        for res in res_for_day:
            if res['username'] == username:
                raise Exception("User {} already has a reservation for {}".format(username, day))
        file_data[day.lower()].append({
            'username': username,
            'password': password,
            'timeslot': timeslot
        })
        file.seek(0)
        json.dump(file_data, file, indent = 4)

    
def reserve(email: str, password: str, timeslot: str):
    options = Options()
    # options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager(version="98.0.4758.102").install()))
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
    elem = elem[1:4]

    print(elem)
    
    for label in elem:
        sectionDay = label.find_element_by_tag_name("h4").text.split(',')[0].lower()
        if sectionDay == getNextReservationDay():
            elem = label.find_elements_by_tag_name("a")
            
            for availableSlot in elem:
                if timeslot in availableSlot.text:
                    availableSlot.click()

                    elem = driver.find_elements_by_xpath("//*[contains(@name, 'btnConfirmer')]")
                    try:
                        elem[0].click()
                        driver.close()  
                    except Exception as e:
                        elem = driver.find_elements_by_xpath("//*[contains(@class, 'message erreur')]/span")
                        if "maximum" in elem[0].text:
                            break
    driver.close()

                                
if __name__ == "__main__":
    reserve("william.martineau@polymtl.ca", "5wwaGuYdTt8tkpg", "16:10")