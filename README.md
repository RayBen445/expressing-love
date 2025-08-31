# Expressing Love 💕

A comprehensive web application for expressing love and creating beautiful romantic experiences. Built with vanilla JavaScript, HTML, CSS, and Firebase for authentication and data storage.

## ✨ Features

### 🔐 Authentication System
- **User Registration**: Sign up with email/password or Google OAuth
- **User Login**: Secure login with multiple authentication methods
- **Profile Management**: Comprehensive user profiles with personal information
- **Password Management**: Change password and account security options
- **Account Deletion**: Complete account deletion with data removal

### 👤 User Dashboard
- **Personal Dashboard**: Overview of all activities and features
- **Profile Editing**: Update display name, bio, birthday, Telegram username, favorite quote
- **Profile Picture Upload**: Firebase Storage integration for profile images
- **Theme Customization**: Choose from Pink, Red, Purple, and Blue themes
- **Privacy Settings**: Control profile visibility (Private/Public)
- **Activity Analytics**: Track confessions, memories, and quiz results

### 💕 Love Features

#### 💌 Love Confession
- **Interactive Confession Form**: Beautiful form with theme selection
- **Photo Upload**: Add special photos to confessions
- **Romantic Quotes**: Choose from pre-written romantic quotes or write custom messages
- **Special Date Selection**: Set important dates with countdown timer
- **Voice Messages**: Placeholder for future Web Audio API integration
- **Social Sharing**: Share confessions on Facebook, Twitter, Instagram
- **QR Code Generation**: Generate QR codes for easy sharing

#### 💬 Love Quotes
- **Quote Categories**: Romantic, Cute, Deep, and Funny quotes
- **Custom Quotes**: Add your own personal love quotes
- **Quote Management**: Edit and delete your custom quotes
- **Copy & Share**: Easy copying and sharing of quotes
- **Categorized Display**: Filter quotes by category

#### 🧠 Compatibility Quiz
- **5-Question Quiz**: Comprehensive compatibility assessment
- **Smart Algorithm**: Calculates compatibility based on answers
- **Visual Results**: Animated score display with compatibility message
- **Results Storage**: Save quiz results to Firebase
- **Detailed Analytics**: Track quiz performance over time

#### 📖 Memory Book
- **Memory Creation**: Add beautiful memories with photos and descriptions
- **Timeline Display**: Chronological display of memories
- **Photo Gallery**: Visual memory gallery with image upload
- **Mood Tracking**: Select emotional context for each memory
- **Memory Export**: Feature for exporting memories (scaffolded)

#### 📅 Anniversary Reminders
- **Smart Reminders**: Never miss important dates
- **Multiple Categories**: Anniversary, Birthday, First Date, Engagement, etc.
- **Advance Notifications**: Set reminder timing (1 day to 1 month in advance)
- **Recurring Reminders**: Yearly, monthly, or one-time reminders
- **Personal Notes**: Add special notes to each reminder
- **Upcoming Notifications**: Dashboard for approaching dates

#### 🎁 Virtual Gifts
- **Gift Categories**: Flowers, Hearts, Jewelry, Cute items, Sweet treats, Cards
- **24+ Virtual Gifts**: Beautiful emoji-based virtual gifts
- **Personal Messages**: Add custom messages to gifts
- **Scheduled Delivery**: Send gifts now or schedule for later
- **Gift History**: Track sent and received gifts
- **Confetti Animation**: Celebratory animations when gifts are sent

### 🛠️ Technical Features
- **Firebase Integration**: Complete backend with Firestore and Authentication
- **Responsive Design**: Mobile-first responsive design
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Real-time Updates**: Firebase real-time database integration
- **Image Upload**: Firebase Storage for profile pictures and memory photos
- **Data Privacy**: User data isolation and privacy controls
- **Error Handling**: Comprehensive error handling and user feedback

### 🎨 UI/UX Features
- **Floating Hearts Animation**: Beautiful background animations
- **Theme System**: Dynamic color theming with CSS custom properties
- **Toast Notifications**: User-friendly success/error messages
- **Modal System**: Clean modal dialogs for forms and confirmations
- **Loading States**: Proper loading indicators throughout the app
- **Empty States**: Helpful empty state messages and guidance

## 🚀 Setup Instructions

### Prerequisites
- Modern web browser with ES6+ support
- Firebase project (for backend functionality)
- Web server (for local development)

### 1. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Enable Authentication**:
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable "Email/Password" provider
   - Enable "Google" provider and configure OAuth consent screen

3. **Setup Firestore Database**:
   - Go to "Firestore Database" > "Create database"
   - Start in test mode (or production mode with proper security rules)
   - Set up collections: `users`, `confessions`, `quizResults`, `memories`, `customQuotes`, `reminders`, `virtualGifts`

4. **Enable Storage**:
   - Go to "Storage" > "Get started"
   - Set up Firebase Storage for image uploads

5. **Get Configuration**:
   - Go to Project Settings > General > Your apps
   - Add a web app and copy the Firebase config object

### 2. Application Configuration

1. **Update Firebase Config**:
   ```javascript
   // Edit js/firebase-config.js
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

2. **Security Rules** (optional but recommended):
   ```javascript
   // Firestore Security Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /{collection}/{document} {
         allow read, write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
     }
   }
   
   // Storage Security Rules
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profile-images/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /confessions/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### 3. Local Development

1. **Serve the Application**:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js http-server (install with: npm install -g http-server)
   http-server
   
   # Using Live Server extension in VS Code
   # Right-click index.html > "Open with Live Server"
   ```

2. **Access the Application**:
   - Open your browser and navigate to `http://localhost:8000` (or the port your server is using)
   - You should see the Expressing Love homepage

### 4. Deployment

#### Netlify Deployment
1. Create a [Netlify](https://netlify.com) account
2. Drag and drop your project folder to Netlify dashboard
3. Your site will be live instantly with HTTPS

#### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

#### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

## 📁 File Structure

```
expressing-love/
├── index.html              # Main landing page with navigation
├── login.html              # User login page
├── signup.html             # User registration page
├── dashboard.html          # User dashboard
├── profile.html            # Profile management page
├── confession.html         # Love confession feature
├── quotes.html             # Love quotes management
├── quiz.html               # Compatibility quiz
├── memory-book.html        # Memory book feature
├── reminders.html          # Anniversary reminders
├── gifts.html              # Virtual gifts feature
├── style.css               # Main stylesheet
├── script.js               # Main JavaScript utilities
├── css/
│   ├── auth.css           # Authentication pages styles
│   ├── dashboard.css      # Dashboard and navigation styles
│   └── profile.css        # Profile page specific styles
├── js/
│   ├── firebase-config.js # Firebase configuration and imports
│   └── auth.js           # Authentication management system
└── README.md             # This file
```

## 🔧 Customization

### Theme Colors
Edit CSS custom properties in any stylesheet:
```css
:root {
  --primary-color: #ff6b9d;    /* Main theme color */
  --secondary-color: #ff9a9e;  /* Secondary theme color */
  --accent-color: #ffc1cc;     /* Accent color */
}
```

### Adding New Features
1. Create new HTML page following existing structure
2. Include Firebase imports and auth integration
3. Add navigation links in dashboard and other relevant pages
4. Follow existing coding patterns and styles

### Telegram Integration (Optional)
The app includes optional Telegram bot integration for notifications:
1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Update bot token and chat ID in relevant files
3. This feature works alongside Firebase and can be disabled if not needed

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**:
   - Verify Firebase config is correctly set
   - Check if authentication and Firestore are enabled
   - Ensure security rules allow your operations

2. **Module Import Errors**:
   - Make sure you're serving the app from a web server (not opening files directly)
   - Check browser console for CORS errors
   - Verify Firebase SDK URLs are accessible

3. **Authentication Not Working**:
   - Check Firebase Authentication setup
   - Verify OAuth redirect URIs are configured
   - Test with valid email formats

4. **Responsive Design Issues**:
   - Test on various screen sizes
   - Check CSS media queries
   - Verify viewport meta tag is present

### Performance Tips

1. **Image Optimization**:
   - Compress images before upload
   - Use appropriate image formats (WebP when supported)
   - Implement lazy loading for better performance

2. **Firebase Optimization**:
   - Use Firebase offline persistence
   - Implement pagination for large data sets
   - Optimize Firestore queries with indexes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support and questions:
- **Telegram**: [@Prof_essor2025](https://t.me/Prof_essor2025)
- **WhatsApp**: [+234 913 560 0014](https://wa.me/2349135600014)

## 🎉 Acknowledgments

- Firebase for backend services
- Font Awesome for icons (if used)
- All the love and support from the community

---

Made with 💖 by RayBen445

*"Every love story is beautiful, but this app makes yours unforgettable."*
