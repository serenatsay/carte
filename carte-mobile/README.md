# Carte Mobile - Menu Translation App

A React Native mobile app built with Expo that lets you translate restaurant menus by taking photos.

## Features

- 📷 **Camera Integration** - Take photos of menus or choose from gallery
- 🌍 **AI Translation** - Powered by Claude AI for accurate menu translation
- 🛒 **Smart Cart** - Add items to your order with quantities
- 📋 **Order Summary** - Review your selections before ordering
- 🎯 **Pick for Me** - AI-powered meal suggestions (coming soon)

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (iOS/Android)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API endpoint**

   Edit `src/services/parseMenuService.ts` and update the API_BASE_URL:
   ```typescript
   const API_BASE_URL = 'https://your-carte-api.vercel.app'; // Replace with your web app URL
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Test on your phone**
   - Install Expo Go from the App Store/Play Store
   - Scan the QR code shown in the terminal
   - Grant camera permissions when prompted

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── MenuItemCard.tsx # Individual menu item display
├── screens/            # Main app screens
│   ├── CameraScreen.tsx     # Photo capture & language selection
│   ├── MenuScreen.tsx       # Display translated menu
│   └── OrderSummaryScreen.tsx # Cart & checkout
├── services/           # API integrations
│   └── parseMenuService.ts  # Menu parsing API calls
├── store/              # State management
│   └── cartStore.ts         # Cart & preferences
└── types.ts           # TypeScript definitions
```

## Key Technologies

- **Expo** - React Native development platform
- **React Navigation** - Native navigation
- **Zustand** - Lightweight state management
- **Expo Camera** - Camera & image picker
- **TypeScript** - Type safety

## Development Notes

### API Integration

The mobile app connects to your existing web API:
- Uses the same `/api/parse` endpoint
- Shares the same data types and responses
- Requires your web app to be deployed and accessible

### State Management

Uses Zustand for simple, efficient state management:
- `cartStore` - Cart items, menu data, language preferences
- Automatically syncs cart state across screens

### Camera Permissions

The app requests camera permissions on first use:
- iOS: Automatically handled by Expo
- Android: Permissions managed through app manifest

### Testing

- **Development**: Use Expo Go for rapid testing
- **Production**: Build standalone apps for App Store/Play Store

## Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android
```

## Deployment

The mobile app requires your web API to be deployed first:

1. Deploy your web app to Vercel/Netlify
2. Update `API_BASE_URL` in `parseMenuService.ts`
3. Test the mobile app with the live API
4. Build and submit to app stores

## Common Issues

### Metro bundler cache issues
```bash
npx expo start --clear
```

### Build errors
```bash
npm install --force
npx expo install --fix
```

### API connection issues
- Check that your web app API is deployed and accessible
- Verify CORS headers allow mobile requests
- Test API endpoints in browser first

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request