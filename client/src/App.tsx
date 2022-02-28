import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import "./App.css";
import {
  AlertTitle,
  CardHeader,
  createTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider,
} from "@mui/material";
import Backend from "./services/backend";
import React from "react";
import ReservationSlot from "./components/reservation-slot";
import { Payload, Reservation } from "./services/payload";
import { AxiosResponse } from "axios";

function App() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [values, setValues] = React.useState({
    username: "",
    password: "",
  });

  const [counter, setCounter] = React.useState(0);

  const [reservations, setReservations] = React.useState<Reservation[]>([]);

  const [isError, setError] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = (_event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };

  function handleClick() {
    for (const key in values) {
      if (values[key] === "") {
        setErrorMessage("Please fill your username and password");
        setError(true);
        return;
      }
    }
    for (const res in reservations) {
      if (reservations[res].timeslot === "" || reservations[res].day === "") {
        setErrorMessage("Please fill all of your reservations");
        setError(true);
        return;
      }
    }
    setError(false);
    Backend.send({
      username: values.username,
      password: values.password,
      reservations: reservations,
    }).then((res) => {
      handleResquestResponse(res);
    });
  }

  function handleResquestResponse(res: AxiosResponse<string, any>) {

    console.log(res)
    if (res.status !== 200) {
      setError(true);
      setErrorMessage("Resquest error. Please try again");
      return;
    }

    switch (res.data) {
      case "DUPLICATE":
        setError(true);
        setErrorMessage("You already have a reservation for this day");
        break;
    }
  }

  function addReservation() {
    setCounter(counter + 1);
    setReservations([
      ...reservations,
      { day: "fdf", timeslot: "fdfd", id: counter },
    ]);
  }

  function updateReservation(data: Reservation) {
    reservations.forEach((item, index) => {
      if (item.id === data.id) {
        reservations[index] = data;
      }
    });
    setReservations([...reservations]);
  }

  function deleteReservation(id: number) {
    const items = reservations.filter((item) => item.id !== id);
    console.log(items);
    setReservations(items);
  }

  React.useEffect(() => {}, [values]);

  const themeOptions: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        main: "#ffffff",
      },
      secondary: {
        main: "#006bb6",
      },
      background: {
        default: "#0f192c",
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
      },
    },
    typography: {
      fontFamily: "Raleway",
    },
  };

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Snackbar
          open={isError}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            icon={<ErrorIcon fontSize="inherit" />}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        </Snackbar>
        <Card sx={{ minWidth: 275, maxWidth: 800, margin: "auto", backgroundColor: "#0f192c"}}>
          <CardHeader title="CEPSUM AUTO RESERVER" sx={{ textAlign: "center" }} />
          <CardActions>
            <TextField
              value={values.username}
              onChange={handleChange("username")}
              id="outlined-basic"
              label="Username"
              variant="outlined"
            />
            <TextField
              value={values.password}
              onChange={handleChange("password")}
              id="outlined-basic"
              label="Password"
              variant="outlined"
            />
            <Button
              variant="outlined"
              sx={{ marginLeft: "auto" }}
              onClick={addReservation}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: "auto" }}
              onClick={handleClick}
            >
              Send
            </Button>
          </CardActions>
          <CardContent>
            <div>
              {reservations.map((data: Reservation) => (
                <ReservationSlot
                  key={data.id}
                  id={data.id}
                  updateReservation={updateReservation}
                  deleteReservation={deleteReservation}
                ></ReservationSlot>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
