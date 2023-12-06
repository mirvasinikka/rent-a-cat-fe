import React, { useState } from 'react';
import { TextField, Button, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', severity: null });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, confirmPassword }),
      });

      if (response.ok) {
        setAlert({ message: 'Registeration successfull', severity: 'success' });
        setTimeout(() => navigate('/'), 3000);
      } else {
        const data = await response.json();
        setAlert({ message: 'Registeration failed: ' + data.error, severity: 'error' });
      }
    } catch (error) {
      console.error('Registeration failed: ', error.alert);
      setAlert({ message: 'Registeration failed', severity: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {alert.message && (
          <Alert severity={alert.severity} sx={{ marginBottom: 2, marginTop: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Button type="submit" fullWidth variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
