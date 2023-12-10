import { AppBar, Avatar, Badge, Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function CatAppBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    logout();
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLikes = () => {
    navigate('/likes');
    handleClose();
  };

  const handleRentals = () => {
    navigate('/rentals');
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <>
              <Button size="large" component={Link} to="add" color="inherit">
                <AddCircleOutlineOutlinedIcon fontSize="large" sx={{ marginRight: 1 }} /> Add a cat
              </Button>
              <IconButton onClick={handleMenu}>
                <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                  {isLoading ? (
                    <Avatar sx={{ width: 50, height: 50 }} />
                  ) : (
                    <Avatar alt={user?.username} src={user?.avatarUrl} sx={{ width: 50, height: 50 }} />
                  )}
                </StyledBadge>
              </IconButton>
              <Menu id="menu-appbar" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: 1 }}>
                <MenuItem onClick={handleProfile} sx={{ padding: 2 }}>
                  <ListItemIcon>
                    <PersonIcon sx={{ marginRight: 1 }} />
                  </ListItemIcon>
                  <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLikes} sx={{ padding: 2 }}>
                  <ListItemIcon>
                    <FavoriteIcon sx={{ marginRight: 1 }} />
                  </ListItemIcon>
                  <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Likes</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleRentals} sx={{ padding: 2 }}>
                  <ListItemIcon>
                    <CalendarMonthIcon sx={{ marginRight: 1 }} />
                  </ListItemIcon>
                  <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Rentals</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ padding: 2 }}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ marginRight: 1 }} />
                  </ListItemIcon>
                  <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
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
