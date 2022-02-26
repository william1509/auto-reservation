export interface Payload {
    username: string | undefined;
    password: string | undefined;
    reservations: Reservation[];
}

export interface Reservation {
    timeslot: string | undefined;
    day: string | undefined;
    id: number | undefined;
}

export interface Props {
    updateReservation: (payload: Reservation) => void;
    deleteReservation: (id: number) => void;
    id: number | undefined;
}