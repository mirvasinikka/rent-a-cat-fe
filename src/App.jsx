import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { indigo, grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

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
import RequireAuth from './components/RequireAuth';
import RentList from './components/RentList';
import CatManage from './components/CatManage';

const theme = createTheme({
  palette: {
    primary: { main: '#0c5057', contrastText: '#FFFFFF' },
    secondary: { main: grey[900], contrastText: '#000000' },
    text: { primary: indigo[900] },
  },
  typography: {
    fontFamily: "'Sometype Mono', 'monospace'",
  },
});

const ProtectedLayout = () => {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
};

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
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'info/:id',
        element: <CatInfo />,
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
        element: <ProtectedLayout />,
        children: [
          {
            path: 'likes',
            element: <LikedCats />,
          },
          {
            path: 'add-cat',
            element: <CatForm />,
          },
          {
            path: 'rentals',
            element: <RentList />,
          },
          {
            path: 'edit-cat/:id',
            element: <CatForm />,
          },
          {
            path: 'profile',
            element: <UserProfile />,
          },
          {
            path: '/manage',
            element: <CatManage />,
          },
        ],
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
