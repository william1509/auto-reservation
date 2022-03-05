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
import InfoIcon from "@mui/icons-material/Info";
import "./App.css";
import {
  AlertTitle,
  Box,
  CardHeader,
  CircularProgress,
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
import PopupDialog from "./components/popup-dialog/popup-dialog";
import { CONSTANTS } from './constants';

function App() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [values, setValues] = React.useState({
    username: "",
    password: "",
  });

  const [showingPopup, setShowingPopup] = React.useState(false);

  const [loadingSend, setLoadingSend] = React.useState(false);

  const [counter, setCounter] = React.useState(0);

  const [reservations, setReservations] = React.useState<Reservation[]>([]);

  const [showAlert, setShowAlert] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const [alertSeverity, setAlertSeverity] = React.useState("error");

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = (_event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
  };

  const showAlertMessage = (message: string, severity: string) => {
    setErrorMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleClick = () => {
    for (const key in values) {
      if (values[key] === "") {
        showAlertMessage("Please fill your username and password", "error");
        return;
      }
    }
    if (reservations.length === 0) {
      showAlertMessage("Please fill at least one reservation", "error");
      return;
    }
    for (const res in reservations) {
      if (reservations[res].timeslot === "" || reservations[res].day === "") {
        showAlertMessage("Please fill all of your reservations", "error");
        return;
      }
    }
    setLoadingSend(true);
    setShowAlert(false);
    Backend.send({
      username: values.username,
      password: values.password,
      reservations: reservations,
    }).then((res) => {
      setLoadingSend(false);
      handleResquestResponse(res);
    });
  }

  const showPopup = () => {
    setShowingPopup(true);
  }

  const handleResquestResponse = (res: AxiosResponse<string, any>) => {
    if (res.status !== 200) {
      setShowAlert(true);
      setErrorMessage("Resquest error. Please try again");
      return;
    }

    switch (res.data) {
      case "DUPLICATE":
        setShowAlert(true);
        setAlertSeverity("error");
        setErrorMessage("You already have a reservation for this day");
        break;
      case "INVALID":
        setShowAlert(true);
        setAlertSeverity("error");
        setErrorMessage("Username and password do not match");
        break;
      case "OK":
        setShowAlert(true);
        setAlertSeverity("success");
        setErrorMessage("Reservation successful");
        break;
    }
  }

  const addReservation = () => {
    if (counter + 1 > 7) {
      setShowAlert(true);
      setAlertSeverity("error");
      setErrorMessage("You can't have more than 7 reservations");
      return;
    }
    setCounter(counter + 1);
    setReservations([...reservations, { day: "", timeslot: "", id: counter }]);
  }

  const updateReservation = (data: Reservation) => {
    reservations.forEach((item, index) => {
      if (item.id === data.id) {
        reservations[index] = data;
      }
    });
    setReservations([...reservations]);
  }

  const deleteReservation = (id: number) => {
    const items = reservations.filter((item) => item.id !== id);
    setReservations(items);
  }

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
      fontFamily: "",
    },
  };

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <PopupDialog 
          open={showingPopup}
          title="Information"
          content={CONSTANTS.DISCLAIMER}
          closePopup={() => setShowingPopup(false)}
        />
        <Snackbar
          open={showAlert}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={alertSeverity}
            variant="filled"
            icon={<ErrorIcon fontSize="inherit" />}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShowAlert(false);
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
        <Card
          sx={{
            minWidth: 275,
            maxWidth: 800,
            margin: "auto",
            backgroundColor: "#0f192c",
          }}
        >
          <CardHeader
            action={
              <IconButton aria-label="info" onClick={showPopup}>
                <InfoIcon />
              </IconButton>
            }
            title="CEPSUM"
            subheader="Automatically reserve your timeslots !"
          />

          <CardActions
            style={{
              display: "flex",
            }}
          >
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
            <div style={{ marginLeft: "auto" }}>
              {loadingSend ? (
                <Box>
                  <CircularProgress />
                </Box>
              ) : (
                <Button variant="outlined" onClick={handleClick}>
                  Send
                </Button>
              )}
            </div>
          </CardActions>
          <CardContent
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {reservations.map((data: Reservation) => (
              <Box style={{ margin: "10px" }} key={data.id}>
                <ReservationSlot
                  id={data.id}
                  updateReservation={updateReservation}
                  deleteReservation={deleteReservation}
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              sx={{ margin: "auto" }}
              onClick={addReservation}
            >
              Add
            </Button>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
