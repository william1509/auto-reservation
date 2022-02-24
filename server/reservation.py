class Reservation:
    username: str
    password: str
    timeslot: str

class DayReservation:
    monday: list[Reservation]
    tuesday: list[Reservation]
    wednesday: list[Reservation]
    thursday: list[Reservation]
    friday: list[Reservation]
    saturday: list[Reservation]
    sunday: list[Reservation]