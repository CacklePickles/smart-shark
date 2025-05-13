import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Code as CodeIcon,
  Phishing as PhishingIcon,
} from '@mui/icons-material';
import { scan } from '../services/api';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';

interface ScanResult {
  type: string;
  message: string;
}

const Scan: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [scanStage, setScanStage] = useState<string>('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scanning) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setScanning(false);
            return 100;
          }
          return prevProgress + 0.2;
        });
      }, 30);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [scanning]);

  const handleScan = async () => {
    if (!url) {
      toast.error('Please enter a URL to scan');
      return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*$/i;
    if (!urlPattern.test(url)) {
      toast.error('Invalid URL format. Please enter a valid URL.');
      return;
    }

    try {
      setScanning(true);
      setProgress(0);
      setResults([]);
      setScanStage('Initializing scan...');

      // Добавляем искусственную задержку для более длительного сканирования
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanStage('Checking URL structure...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanStage('Analyzing content...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanStage('Verifying security...');

      const response = await scan.startScan(url);
      const { isPhishing, confidence, reasons } = response.data;

      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanStage('Analysis complete');
      setProgress(100);

      const newResults: ScanResult[] = [];

      if (isPhishing) {
        newResults.push({
          type: 'error',
          message: `Phishing detected with ${(confidence * 100).toFixed(1)}% confidence`,
        });
        reasons.forEach((reason: string) => {
          newResults.push({
            type: 'warning',
            message: reason,
          });
        });
      } else {
        newResults.push({
          type: 'success',
          message: 'No phishing detected. The URL appears safe.',
        });
      }

      setResults(newResults);
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error(error.response?.data?.error || 'Failed to scan URL');
      setResults([
        {
          type: 'error',
          message: 'Failed to complete scan',
        },
      ]);
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResults([]);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <CodeIcon color="warning" />;
      case 'error':
        return <PhishingIcon color="error" />;
      default:
        return <SecurityIcon />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 4, 
        p: 3,
        minHeight: '100vh',
        backgroundColor: '#1a1d24'
      }}
    >
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        {/* Scan Button */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
            height: 200,
            margin: '0 auto',
            mb: 4
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            variant="contained"
            onClick={handleScan}
            disabled={scanning}
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: scanning ? '#2f3542' : (isHovered ? '#003B7C' : '#002B5C'),
              border: '4px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: scanning ? '#2f3542' : '#003B7C',
                transform: 'scale(1.05)',
                border: '4px solid rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 2,
              '&.Mui-disabled': {
                backgroundColor: '#2f3542',
                opacity: 0.8,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SecurityIcon sx={{ fontSize: 48 }} />
              <Typography variant="h6">Scan URL</Typography>
            </Box>
          </Button>
          {scanning && (
            <Box
              sx={{
                position: 'absolute',
                width: 220,
                height: 220,
                animation: 'rotate 8s linear infinite',
                '@keyframes rotate': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            >
              <CircularProgress
                variant="indeterminate"
                size={220}
                thickness={4}
                sx={{
                  position: 'absolute',
                  color: '#40E0D0',
                  zIndex: 1,
                  filter: 'drop-shadow(0 0 8px rgba(64, 224, 208, 0.5))',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Scan Stage */}
        {scanning && scanStage && (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 4
            }}
          >
            {scanStage}
          </Typography>
        )}

        {/* URL Input */}
        <Card sx={{ 
          backgroundColor: '#2f3542',
          color: 'white',
          mb: 4
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Enter URL to Scan
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={scanning}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#002B5C',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {url && (
                      <IconButton onClick={handleClear} edge="end">
                        <ClearIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card sx={{ 
            backgroundColor: '#2f3542',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  Scan Results
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    wordBreak: 'break-all'
                  }}
                >
                  for {url}
                </Typography>
              </Box>
              <List>
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      mb: 1,
                      '&:last-child': {
                        mb: 0
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getResultIcon(result.type)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={result.message}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'white'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Scan;