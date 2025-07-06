import ToastContainer from "@/components/ToastContainer";
import { store, persistor } from "@/src/store/store";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export default function RootLayout() {
  

   useEffect(() => {
    // Request permission on mount
    Notifications.requestPermissionsAsync();
  }, []);
  return (
    <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
      <Provider store={store}>
        <Stack initialRouteName="index">
          <Stack.Screen
            name="ProductFormScreen"
            options={{
              headerShown: true,
              title: "Add Product",
            }}
          />
          <Stack.Screen
            name="ProductScreen"
            options={{
              headerShown: true,
              title: "Products",
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              title: "Home",
            }}
          />
        </Stack>
        <ToastContainer />
      </Provider>
    </PersistGate>
  );
}
