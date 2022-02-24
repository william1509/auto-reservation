from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import datetime

def log(message):
    f = open('logs.txt', 'a')
    f.write("{} {}\n".format(datetime.datetime.now().strftime("%I:%M %B-%d-%Y"), message))
    f.close()
    
def reserve(email: str, password: str, timeslot: str):
    options = Options()
    options.binary_location = 'C:/Users/willi/AppData/Local/Mozilla Firefox/firefox.exe'
    #options.add_argument('--headless')
    driver = webdriver.Firefox(executable_path='geckodriver.exe', options=options)
    driver.get("https://interactif.cepsum.umontreal.ca/CapNet/login.coba")

    elem = driver.find_elements_by_xpath("//*[contains(@name, 'txtCodeUsager')]")
    
    elem[0].clear()
    elem[0].send_keys(email)

    elem = driver.find_elements_by_xpath("//*[contains(@name, 'txtMotDePasse')]")
    elem[0].clear()
    elem[0].send_keys(password)

    elem[0].send_keys(Keys.RETURN)

    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.NAME, "lnkRESACT")))

    elem = driver.find_elements_by_name("lnkRESACT")
    elem[0].click()

    elem = driver.find_elements_by_xpath("//*[contains(@name, 'grdReservations-ajouter')]")
    elem[0].click()

    elem = driver.find_elements_by_xpath("//*[contains(@class, 'col-1 contenant')]")
    elem[2].click()

    elem = driver.find_elements_by_xpath("//*[contains(@class, 'col-1 contenant avec-titre')]")

    #Eliminate first element because it's a label
    elem = elem[1:4]

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
                        log("Reservation done at {}".format(timeslot))
                        exit()
                    except Exception as e:
                        elem = driver.find_elements_by_xpath("//*[contains(@class, 'message erreur')]/span")
                        if "maximum" in elem[0].text:
                            log('Max number of reservation reached')
                    
                    break
            
            break
    log("Could not reserve for {} at {}".format(sectionDay, timeslot))

    driver.close()   

def getNextReservationDay():
    day = datetime.date.today().weekday()
    if day == 0:
        return "mercredi"
    elif day == 1:
        return "jeudi"
    elif day == 2:
        return "vendredi"
    elif day == 3:
        return "samedi"
    elif day == 4:
        return "dimanche"
    elif day == 5:
        return "lundi"
    elif day == 6:
        return "mardi"

if __name__ == '__main__':
    try:
        log("Starting reservation")
        reserve()
    except Exception as e:
        log("An error occured")