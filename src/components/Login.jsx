import { TextField, Button, Container, Alert } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMesage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('login was successfull');
        login();
        navigate('/');
      } else {
        const data = await response.json();
        setMesage('Login failed:' + data.error);
        console.log('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Login failed: ', error);
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
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {message && <Alert severity="error">{message}</Alert>}
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Sign In
        </Button>

        <Button component={Link} to="/register" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Register Form
        </Button>
      </form>
    </Container>
  );
}

export default Login;
