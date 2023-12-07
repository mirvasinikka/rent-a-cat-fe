import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { blue, indigo, pink } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import CatList from './components/CatList';
import CatInfo from './components/CatInfo';
import Error from './components/Error';
import LikedCats from './components/LikedCats';
import Login from './components/Login';
import Register from './components/Register';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './components/AuthContext';
import { CssBaseline } from '@mui/material';

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
        element: <ProtectedLayout />,
        children: [
          {
            path: '/',
            element: <CatList />,
          },
        ],
      },
      {
        path: 'add',
        element: <CatForm />,
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
    ],
  },
]);

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
