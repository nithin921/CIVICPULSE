const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// In-memory storage for demo (replace with MongoDB in production)
let reports = [];
let users = [];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Civic Pulse API is running' });
});

// User authentication (simplified for demo)
app.post('/api/auth/send-otp', (req, res) => {
  const { phoneOrEmail } = req.body;
  
  // Simulate OTP sending
  setTimeout(() => {
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp: '123456' // In production, this would be sent via SMS/Email
    });
  }, 1000);
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneOrEmail, otp } = req.body;
  
  if (otp === '123456') {
    const user = {
      id: uuidv4(),
      phoneOrEmail,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.json({
      success: true,
      user,
      token: `token_${user.id}` // In production, use JWT
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid OTP'
    });
  }
});

// Reports endpoints
app.get('/api/reports', (req, res) => {
  const { userId, filter, lat, lng, radius } = req.query;
  
  let filteredReports = [...reports];
  
  if (filter === 'my' && userId) {
    filteredReports = reports.filter(report => report.userId === userId);
  } else if (filter === 'nearby' && lat && lng) {
    // Simple distance calculation (in production, use proper geospatial queries)
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDistance = radius ? parseFloat(radius) : 5; // 5km default
    
    filteredReports = reports.filter(report => {
      const distance = calculateDistance(userLat, userLng, report.latitude, report.longitude);
      return distance <= maxDistance;
    });
  }
  
  res.json({
    success: true,
    reports: filteredReports
  });
});

app.post('/api/reports', upload.single('photo'), (req, res) => {
  try {
    const { description, category, latitude, longitude, userId } = req.body;
    
    if (!req.file || !description || !category || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const report = {
      id: uuidv4(),
      ticketId: `CP${Date.now().toString().slice(-6)}`,
      description,
      category,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      userId: userId || 'anonymous',
      photo: `/uploads/${req.file.filename}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reports.push(report);
    
    res.json({
      success: true,
      report,
      ticketId: report.ticketId
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Report not found'
    });
  }
  
  res.json({
    success: true,
    report
  });
});

app.put('/api/reports/:id/status', (req, res) => {
  const { status } = req.body;
  const reportIndex = reports.findIndex(r => r.id === req.params.id);
  
  if (reportIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Report not found'
    });
  }
  
  reports[reportIndex].status = status;
  reports[reportIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    report: reports[reportIndex]
  });
});

// Utility function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Start server
app.listen(PORT, () => {
  console.log(`Civic Pulse API server running on port ${PORT}`);
});

module.exports = app;
