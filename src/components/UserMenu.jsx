import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Badge, Divider, ListItemIcon, ListItemText, Menu, MenuItem, styled, IconButton } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useAuth } from './AuthContext';

function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    logout();
    handleClose();
  };

  const handlePath = (path) => {
    navigate(path);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenu}>
        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
          <Avatar alt={user.username} src={user.avatarUrl} sx={{ width: 50, height: 50 }} />
        </StyledBadge>
      </IconButton>
      <Menu id="menu-appbar" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: 1 }}>
        <MenuItem onClick={() => handlePath('/profile')} sx={{ padding: 2 }}>
          <ListItemIcon>
            <PersonIcon sx={{ marginRight: 1 }} />
          </ListItemIcon>
          <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handlePath('/likes')} sx={{ padding: 2 }}>
          <ListItemIcon>
            <FavoriteIcon sx={{ marginRight: 1 }} />
          </ListItemIcon>
          <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Likes</ListItemText>
        </MenuItem>
        <Divider />
        {user.role === 'admin' && (
          <MenuItem onClick={() => handlePath('/manage')} sx={{ padding: 2 }}>
            <ListItemIcon>
              <PetsIcon sx={{ marginRight: 1 }} />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: 2, paddingRight: 2 }}>Manage Cats</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => handlePath('/rentals')} sx={{ padding: 2 }}>
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
  );
}

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

export default UserMenu;
