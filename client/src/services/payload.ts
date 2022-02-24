export interface Payload {
    username: string | undefined;
    password: string | undefined;
    reservations: Reservation[];
}

export interface Reservation {
    timeslot: string | undefined;
    day: string | undefined;
}