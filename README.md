# Civic Pulse - Progressive Web App

A mobile-first Progressive Web App (PWA) for citizens to report civic issues like potholes, garbage, streetlight problems, and drainage issues.

## Features

### Core Pages
- **Home Page**: Interactive map with issue markers and floating camera button
- **Report Issue Page**: Photo capture, GPS location, category selection, and description
- **My Reports Page**: List of submitted reports with status tracking and detailed views

### Key Features
- 📱 **Mobile-First Design**: Optimized for smartphones with responsive layout
- 🌐 **Progressive Web App**: Works offline and can be installed on devices
- 🗺️ **Interactive Maps**: OpenStreetMap integration with Leaflet
- 📸 **Photo Capture**: Camera integration for issue documentation
- 📍 **GPS Location**: Automatic location detection with manual adjustment
- 🔐 **Simple Authentication**: Phone/Email login with OTP simulation
- 🌐 **Offline Support**: Local storage with sync when online
- 🌍 **Multilingual**: English and Telugu language support
- 📊 **Status Tracking**: Real-time status updates and SLA monitoring

## Tech Stack

### Frontend
- **React.js** - UI framework
- **TailwindCSS** - Styling and responsive design
- **React Router** - Navigation
- **Leaflet + React-Leaflet** - Interactive maps
- **Service Worker** - PWA functionality and offline support

### Backend
- **Node.js + Express** - API server
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Styling
- **Deep Teal** (#0f766e) - Headers and primary elements
- **Civic Orange** (#ea580c) - Action buttons and CTAs
- **Modern Cards** - Rounded corners, shadows, clean layout

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup
```bash
cd d:\CivicPulse
npm install
npm start
```

### Backend Setup
```bash
cd d:\CivicPulse\server
npm install
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### For Citizens
1. **Login**: Use phone/email with OTP (use `123456` for demo)
2. **View Issues**: Browse reported issues on the interactive map
3. **Report Issue**: 
   - Tap the orange camera button
   - Take/select a photo
   - Choose category (Pothole, Garbage, Streetlight, Drain, Other)
   - Add description
   - Confirm GPS location
   - Submit report
4. **Track Reports**: View all your reports with status updates and SLA countdown

### Demo Credentials
- **OTP**: `123456` (works for any phone/email)

## Categories
- 🕳️ **Pothole** - Road surface issues
- 🗑️ **Garbage** - Waste management problems
- 💡 **Streetlight** - Lighting infrastructure issues
- 🌊 **Drain** - Drainage and water logging
- ❓ **Other** - Miscellaneous civic issues

## Status Workflow
1. **Open** - Newly reported issue
2. **In Progress** - Issue under review/being fixed
3. **Resolved** - Issue has been addressed

## PWA Features
- **Installable**: Can be installed on mobile devices
- **Offline Mode**: Works without internet connection
- **Push Notifications**: (Ready for implementation)
- **Background Sync**: Syncs reports when connection is restored

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone/email
- `POST /api/auth/verify-otp` - Verify OTP and login

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id/status` - Update report status

## File Structure
```
d:\CivicPulse\
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── ReportIssuePage.js
│   │   ├── MyReportsPage.js
│   │   └── LoginPage.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   ├── LanguageContext.js
│   │   └── OfflineContext.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
├── package.json
├── tailwind.config.js
└── README.md
```

## Future Enhancements
- MongoDB integration for data persistence
- Real SMS/Email OTP integration
- Push notifications for status updates
- Admin dashboard for issue management
- Analytics and reporting
- Image compression and optimization
- Geofencing for location validation
- Social features (voting, comments)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License - feel free to use this project for learning and development.

## Support
For issues and questions, please create an issue in the repository or contact the development team.
