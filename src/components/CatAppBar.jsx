import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';

import { useAuth } from './AuthContext';
import UserMenu from './UserMenu';

function CatAppBar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <PetsIcon fontSize="large" sx={{ marginRight: 2 }} />
            RENT A CAT
          </Typography>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button size="large" component={Link} to="login" color="inherit">
              <PersonIcon fontSize="large" sx={{ marginRight: 1 }} /> Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
export default CatAppBar;
