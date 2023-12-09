import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { blue, indigo, pink } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import CatList from './components/CatList';
import CatInfo from './components/CatInfo';
import Error from './components/Error';
import LikedCats from './components/LikedCats';
import Login from './components/Login';
import Register from './components/Register';

import { AuthProvider } from './components/AuthContext';
import { CssBaseline } from '@mui/material';
import HomePage from './components/HomePage';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import fi from 'date-fns/locale/fi';
import UserProfile from './components/UserProfile';

const theme = createTheme({
  palette: {
    primary: { main: pink[200], contrastText: '#FFFFFF' },
    secondary: { main: blue[400], contrastText: '#FFFFFF' },
    text: { primary: indigo[900], secondary: indigo[400] },
  },
  typography: {
    fontFamily: "'Sometype Mono', 'monospace'",
  },
});

const router = createBrowserRouter([
  {
    element: <CatAppBar />,
    errorElement: <Error />,
    children: [
      {
        path: '/cats',
        element: <CatList />,
      },
      {
        path: 'add',
        element: <CatForm />,
      },
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'edit/:id',
        element: <CatForm />,
      },
      {
        path: 'info/:id',
        element: <CatInfo />,
      },
      {
        path: 'likes',
        element: <LikedCats />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
    ],
  },
]);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fi}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
