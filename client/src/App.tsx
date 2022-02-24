import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import './App.css'
import { createTheme, CssBaseline, ThemeOptions, ThemeProvider } from '@mui/material';
import Backend from './services/backend';

function App() {

  function handleClick() {
    Backend.send()
  }
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark',
      primary: {
        main: '#9C9500',
      },
      secondary: {
        main: '#9C9500',
      },
      background: {
        default: '#2f2f2f',
      },
      text: {
        primary: '#9C9500',
        secondary:'#9C9500'
      }
    },
    typography: {
      fontFamily: 'Raleway',
    },
  };

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Card sx={{ minWidth: 275, maxWidth: 800, margin: 'auto' }}>
          <CardActions>
            <TextField id="outlined-basic" label="Username" variant="outlined" />
            <TextField id="outlined-basic" label="Password" variant="outlined" />
            <Button onClick={handleClick}>Hello</Button>
          </CardActions>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default App
