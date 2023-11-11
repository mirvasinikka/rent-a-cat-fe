import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import PetsIcon from '@mui/icons-material/Pets';

function CatAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <PetsIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: 2,
            }}
          >
            RENT A CAT
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <Button color="inherit">Add a cat</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default CatAppBar;
