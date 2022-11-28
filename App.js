import React from 'react';
import Root from 'router';
import * as Notifications from 'expo-notifications';

export default function App() {
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  return (
    <Root />
  );
}
