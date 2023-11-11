

import CatTable from './components/CatTable';
import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <CatAppBar />,
    errorElement: null,
    children: [
      {
        path: '/',
        element: <CatTable />,
      },
      {
        path: 'add',
        element: <CatForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
