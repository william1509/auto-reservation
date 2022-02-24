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
import { Payload, Reservation } from './services/payload';

function App() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  var res: Reservation[] = [
    {
      timeslot: "08:00",
      day: "Monday",
    },
  ];

  const [values, setValues] = React.useState({
    username: "",
    password: "",
    reservations: res,
  });

  const [open, setOpen] = React.useState(false);

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = (_event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function handleClick() {
    for (const key in values) {
      if (values[key] === "") {
        setOpen(true);
        return;
      }
    }
    Backend.send({
      username: values.username,
      password: values.password,
      reservations: values.reservations,
    });
  }



  const themeOptions: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        main: "#9C9500",
      },
      secondary: {
        main: "#9C9500",
      },
      background: {
        default: "#2f2f2f",
      },
      text: {
        primary: "#9C9500",
        secondary: "#9C9500",
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
          open={open}
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
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <AlertTitle>Please fill all the fields</AlertTitle>
          </Alert>
        </Snackbar>
        <Card sx={{ minWidth: 275, maxWidth: 800, margin: "auto" }}>
          <CardHeader title="fffd" sx={{ textAlign: 'center' }}/>
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
              onClick={handleClick}
            >
              Send
            </Button>
          </CardActions>
          <CardContent>
            <div>
              {res.map((data) => (
                <ReservationSlot {...data}></ReservationSlot>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
