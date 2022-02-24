import { Card, CardContent, Autocomplete, TextField } from "@mui/material";
import React from "react";
import { DAYS, TIME_SLOTS } from "../services/constants";
import { Reservation } from "../services/payload";

function ReservationSlot(props: Reservation) {
  const data = props;

  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Autocomplete
          id="days"
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
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="TIME SLOT" />
          )}
        />
      </CardContent>
    </Card>
  );
}

export default ReservationSlot;
