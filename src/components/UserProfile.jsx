import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Alert, Box, Button, CircularProgress, Grid, Snackbar, TextField, TextareaAutosize } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

function UserProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    address: '',
    about: '',
  });
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`/api/user/profile?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } else {
        console.error('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, [user.id]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevName) => ({
      ...prevName,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSnackbarInfo({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success',
        });
        console.log('Profile updated successfully!');
      } else {
        setSnackbarInfo({
          open: true,
          message: 'Failed to update profile.',
          severity: 'error',
        });
        console.error('Failed to update profile');
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: 'Error updating profile: ' + error.message,
        severity: 'error',
      });
      console.error('Error updating profile:', error.message);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarInfo((prevInfo) => ({
      ...prevInfo,
      open: false,
    }));
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box
      elevation={1}
      sx={{
        marginTop: 8,
        padding: 8,
        display: 'flex',
        gap: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '300px',
          height: '300px',
          marginRight: 2,
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: '#f5f5f5',
        }}
      >
        <img
          src={profile.avatarUrl}
          alt={profile.username}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Paper>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5">{profile.username}</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField id="email" label="Email" variant="outlined" name="email" value={profile.email} disabled fullWidth />
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                placeholder="E.g Helsinki"
                id="address"
                label="Address"
                variant="outlined"
                name="address"
                value={profile.address}
                fullWidth
              />
            </Grid>
          </Grid>
        </Typography>
        <Typography variant="h5" gutterBottom>
          About You
        </Typography>
        <TextareaAutosize
          aria-label="About You"
          placeholder="Write a few words about yourself..."
          value={profile.about}
          onChange={(e) => handleProfileChange({ target: { name: 'about', value: e.target.value } })}
          minRows={10}
          style={{ width: '100%', resize: 'vertical' }}
        />

        <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ marginTop: 2 }}>
          Save
        </Button>
        <Snackbar open={snackbarInfo.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
            {snackbarInfo.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default UserProfile;
