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