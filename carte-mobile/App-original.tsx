import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import CameraScreen from './src/screens/BasicCameraScreen';
import MenuScreen from './src/screens/MenuScreenSimple';
import OrderSummaryScreen from './src/screens/OrderSummaryScreenSimple';
import { ParsedMenu } from './src/types';

export type RootStackParamList = {
  Camera: undefined;
  Menu: { menu: ParsedMenu };
  OrderSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}