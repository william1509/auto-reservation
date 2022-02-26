import { Card, CardContent, Autocomplete, TextField, Button } from "@mui/material";
import React from "react";
import { DAYS, TIME_SLOTS } from "../services/constants";
import { Props, Reservation } from "../services/payload";

function ReservationSlot(props: Props) {
  const [values, setValues] = React.useState({
    day: '',
    timeslot: '',
    id: props.id,
  });

  const handleChange = (prop: string) => (event: any) => {

    setValues({ ...values, [prop]: event.target.textContent });
  };

  React.useEffect(() => {
    props.updateReservation(values);
  }, [values]);

  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Autocomplete
          id="days"
          onChange={handleChange('day')}
          options={DAYS}
          getOptionLabel={(option) => option.label}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="DAY" />
          )}
        />
        <Autocomplete
          id="timeslot"
          options={TIME_SLOTS}
          getOptionLabel={(option) => option.label}
          onChange={handleChange('timeslot')}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="TIME SLOT" />
          )}
        />

        <Button
          variant="outlined"
          sx={{ marginLeft: "auto" }}
          onClick={() => props.deleteReservation(props.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export default ReservationSlot;
