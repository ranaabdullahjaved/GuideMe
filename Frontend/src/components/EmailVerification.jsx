import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        const response = await axios.get(`https://harmonious-creation-production.up.railway.app/api/auth/verify-email/${token}`);
        if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed');
        }
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

  const handleRetry = () => {
    verificationAttempted.current = false;
    setStatus('verifying');
    setMessage('');
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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleRetry}
              sx={{ 
                backgroundColor: '#007b5e',
                '&:hover': {
                  backgroundColor: '#005a45'
                }
              }}
            >
              Try Again
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleLogin}
              sx={{ 
                borderColor: '#007b5e',
                color: '#007b5e',
                '&:hover': {
                  borderColor: '#005a45',
                  backgroundColor: 'rgba(0, 123, 94, 0.04)'
                }
              }}
            >
            Go to Login
          </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmailVerification; 