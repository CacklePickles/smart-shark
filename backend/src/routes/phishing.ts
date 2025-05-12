import express from 'express';
import { auth } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock AI phishing detection function
const detectPhishing = (url: string, content: string): { isPhishing: boolean; confidence: number; reasons: string[] } => {
  // Mock logic - in reality, this would use ML models
  const suspiciousPatterns = [
    'urgent',
    'verify',
    'password',
    'account',
    'suspicious',
    'unusual',
    'login',
    'security'
  ];

  const reasons: string[] = [];
  let confidence = 0;

  // Check for suspicious patterns in content
  suspiciousPatterns.forEach(pattern => {
    if (content.toLowerCase().includes(pattern)) {
      confidence += 0.1;
      reasons.push(`Contains suspicious word: ${pattern}`);
    }
  });

  // Check URL for suspicious patterns
  if (url.includes('http://')) {
    confidence += 0.2;
    reasons.push('Uses unsecured HTTP connection');
  }

  if (url.includes('login') || url.includes('signin')) {
    confidence += 0.1;
    reasons.push('URL contains login-related keywords');
  }

  return {
    isPhishing: confidence > 0.3,
    confidence: Math.min(confidence, 1),
    reasons
  };
};

// Analyze URL for phishing
router.post(
  '/analyze',
  auth,
  [
    body('url').isURL().withMessage('Please provide a valid URL'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { url, content } = req.body;
      const result = detectPhishing(url, content);

      res.json({
        url,
        timestamp: new Date().toISOString(),
        ...result
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get phishing detection history
router.get('/history', auth, async (req, res) => {
  try {
    // Mock history data
    const history = [
      {
        id: 1,
        url: 'https://example.com',
        timestamp: new Date().toISOString(),
        isPhishing: false,
        confidence: 0.1
      },
      {
        id: 2,
        url: 'http://suspicious-site.com',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isPhishing: true,
        confidence: 0.8
      }
    ];

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 