
import { Box } from '@mui/material';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

function Error() {
  let error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Box>
        {error.status} {error.message} <Link to="/">Back to cats</Link>
      </Box>
    );
  }
  return <Box> {error.message} </Box>;
}

export default Error;
