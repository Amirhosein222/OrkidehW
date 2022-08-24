// Import module
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
import { PUSHER_INSTANCE_ID } from '../../configs';

// Get your interest
const donutsInterest = 'debug-a';

// Initialize notifications
export const initPusher = (userId, token, clear = false) => {
  // Set your app key and register for push
  RNPusherPushNotifications.setInstanceId(PUSHER_INSTANCE_ID);
  // Init interests after registration
  RNPusherPushNotifications.on('registered', () => {
    subscribe(donutsInterest);
  });

  // Setup notification listeners
  RNPusherPushNotifications.on('notification', handleNotification);
  !clear &&
    setUser(userId.toString(), token, onPusherInitError, onPusherInitSuccess);
  clear && RNPusherPushNotifications.clearAllState();
};

function onPusherInitError(statusCode, response) {
  // console.log('Error: PUSHER statusCode: ', statusCode);
  // console.log('Error: PUSHER response: ', response);
}

function onPusherInitSuccess(response) {
  // console.log('PUSHER SUCCESS: ', response);
}

function setUser(userId, token, onError, onSuccess) {
  // Note that only Android devices will respond to success/error callbacks
  RNPusherPushNotifications.setUserId(
    userId,
    token,
    (statusCode, response) => {
      onError(statusCode, response);
    },
    () => {
      onSuccess('Set User ID Success');
    },
  );
}

// Handle notifications received
const handleNotification = (notification) => {
  // console.log(notification);
};

// Subscribe to an interest
const subscribe = (interest) => {
  // Note that only Android devices will respond to success/error callbacks
  RNPusherPushNotifications.subscribe(
    interest,
    (statusCode, response) => {
      console.error(statusCode, response);
    },
    () => {
      // console.log('Success');
    },
  );
};
