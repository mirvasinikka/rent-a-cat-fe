import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, Outlet } from 'react-router-dom';

function CatAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

            <Typography
              variant="h6"
              noWrap
              component={Link} 
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            > <PetsIcon sx={{ marginRight: 2 }}/>
              RENT A CAT
            </Typography>
          

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

          <Button component={Link} to="add" color="inherit">
            Add a cat
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
export default CatAppBar;
