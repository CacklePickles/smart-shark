import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ScanResult {
  threats: Array<{
    id: number;
    name: string;
    severity: string;
    description: string;
    timestamp: string;
  }>;
  summary: {
    totalScanned: number;
    threatsFound: number;
    scanDuration: string;
    lastScan: string;
  };
}

const Scan: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);

  const startScan = async () => {
    setScanning(true);
    try {
      const response = await axios.post('/api/scan/start');
      setResults(response.data.results);
      toast.success('Scan completed successfully!');
    } catch (error) {
      toast.error('Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Malware Scan
      </Typography>

      <Grid container spacing={3}>
        {/* Scan Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={startScan}
                disabled={scanning}
                startIcon={scanning ? <CircularProgress size={20} /> : <SecurityIcon />}
              >
                {scanning ? 'Scanning...' : 'Start Scan'}
              </Button>
              {results && (
                <Typography variant="body2" color="text.secondary">
                  Last scan: {new Date(results.summary.lastScan).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Scan Results */}
        {results && (
          <>
            {/* Summary Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Scan Summary
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Total Files Scanned"
                        secondary={results.summary.totalScanned}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Threats Found"
                        secondary={results.summary.threatsFound}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Scan Duration"
                        secondary={results.summary.scanDuration}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Threats List */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Detected Threats
                  </Typography>
                  <List>
                    {results.threats.map((threat) => (
                      <ListItem key={threat.id}>
                        <ListItemIcon>
                          <WarningIcon color={getSeverityColor(threat.severity)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={threat.name}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {threat.description}
                              </Typography>
                              <br />
                              <Chip
                                label={threat.severity}
                                size="small"
                                color={getSeverityColor(threat.severity)}
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Scan; 