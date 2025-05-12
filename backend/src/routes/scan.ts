import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

// Mock scan results
const mockScanResults = {
  threats: [
    {
      id: 1,
      name: 'Malware Type A',
      severity: 'High',
      description: 'Potential malware detected',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Suspicious Activity',
      severity: 'Medium',
      description: 'Unusual system behavior detected',
      timestamp: new Date().toISOString()
    }
  ],
  summary: {
    totalScanned: 100,
    threatsFound: 2,
    scanDuration: '2.5s',
    lastScan: new Date().toISOString()
  }
};

// Start scan
router.post('/start', auth, async (req, res) => {
  try {
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({
      message: 'Scan completed',
      results: mockScanResults
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get scan history
router.get('/history', auth, async (req, res) => {
  try {
    // Mock scan history
    const history = [
      {
        id: 1,
        date: new Date().toISOString(),
        threatsFound: 2,
        status: 'completed'
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
        threatsFound: 0,
        status: 'completed'
      }
    ];

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get scan details
router.get('/:id', auth, async (req, res) => {
  try {
    // Mock scan details
    res.json(mockScanResults);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 