import datetime

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

def log(message):
    f = open('logs.txt', 'a')
    f.write("{} {}\n".format(datetime.datetime.now().strftime("%I:%M %B-%d-%Y"), message))
    f.close()        

class presence_of_n_elements(object):
  """An expectation for checking that an elements has changes.

  locator - used to find the element
  returns the WebElement once the length has changed
  """
  def __init__(self, locator, length):
    self.locator = locator
    self.length = length

  def __call__(self, driver):
    element = driver.find_elements(*self.locator)
    element_count = len(element)
    if element_count >= self.length:
      return element
    else:
      return False