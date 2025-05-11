import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please try again.');
    }
  }, [token]);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f5f5f5'
      }}
    >
      {status === 'verifying' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
            Verifying your email...
          </Typography>
        </Box>
      )}

      {status === 'success' && (
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Email Verified Successfully!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            Your email has been verified. Your account is now pending admin approval.
            You will be notified once your account is approved.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleLogin}
            sx={{ 
              backgroundColor: '#007b5e',
              '&:hover': {
                backgroundColor: '#005a45'
              }
            }}
          >
            Go to Login
          </Button>
        </Box>
      )}

      {status === 'error' && (
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h4" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
            Verification Failed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            {message}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleLogin}
            sx={{ 
              backgroundColor: '#007b5e',
              '&:hover': {
                backgroundColor: '#005a45'
              }
            }}
          >
            Go to Login
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EmailVerification; 