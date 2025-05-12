import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from '@mui/material';
import {
  Link as LinkIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface PhishingResult {
  url: string;
  isPhishing: boolean;
  confidence: number;
  reasons: string[];
  timestamp: string;
}

interface PhishingHistory {
  id: number;
  url: string;
  timestamp: string;
  isPhishing: boolean;
  confidence: number;
}

const Phishing: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [history, setHistory] = useState<PhishingHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/phishing/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const analyzeUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await axios.post('/api/phishing/analyze', { url, content });
      setResult(response.data);
      fetchHistory();
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'error';
    if (confidence >= 0.4) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Phishing Detection
      </Typography>

      <Grid container spacing={3}>
        {/* Analysis Form */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analyze URL
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <TextField
                fullWidth
                label="Content (optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                placeholder="Paste suspicious email content or webpage text here..."
              />
              <Button
                variant="contained"
                onClick={analyzeUrl}
                disabled={analyzing}
                startIcon={analyzing ? <CircularProgress size={20} /> : <LinkIcon />}
              >
                {analyzing ? 'Analyzing...' : 'Analyze URL'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Analysis Result */}
        {result && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Result
                </Typography>
                <Alert
                  severity={result.isPhishing ? 'error' : 'success'}
                  sx={{ mb: 2 }}
                >
                  {result.isPhishing
                    ? 'This URL appears to be a phishing attempt!'
                    : 'This URL appears to be safe.'}
                </Alert>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="URL"
                      secondary={result.url}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {result.isPhishing ? <WarningIcon color="error" /> : <CheckCircleIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Confidence"
                      secondary={
                        <Chip
                          label={`${(result.confidence * 100).toFixed(1)}%`}
                          color={getConfidenceColor(result.confidence)}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  {result.reasons.length > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Reasons"
                        secondary={
                          <List dense>
                            {result.reasons.map((reason, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={reason} />
                              </ListItem>
                            ))}
                          </List>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis History
              </Typography>
              <List>
                {history.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      {item.isPhishing ? <WarningIcon color="error" /> : <CheckCircleIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.url}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
                          <br />
                          <Chip
                            label={`${(item.confidence * 100).toFixed(1)}% confidence`}
                            color={getConfidenceColor(item.confidence)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Phishing; 