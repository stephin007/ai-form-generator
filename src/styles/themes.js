import { createTheme } from '@mui/material/styles';
import { deepPurple, grey, purple } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: deepPurple[500],
        },
        background: {
            default: grey[100],
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

export default theme;
