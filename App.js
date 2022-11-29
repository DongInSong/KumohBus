import React from 'react';
import Root from 'router';  
import * as Notificatios from 'expo-notifications'

export default function App() {

  Notificatios.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return (
    <Root />
  );
}
