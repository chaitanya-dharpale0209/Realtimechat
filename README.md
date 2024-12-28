
# Documentation - React Native Chat Application

## Assignment Overview
The goal of this assignment is to develop a React Native chat application for both Android and iOS platforms. The application should mimic a typical chat interface, displaying messages from both the user and others. The UI design should be as per the provided specification.


## Technology Stack

- **React Native**: For building the mobile application.
- **Axios**: For making API requests.
- **React Navigation**: For handling navigation within the app (if needed in future enhancements).
- **React Hooks**: For managing the state and side effects in functional components.
- **Ionicons**: For icon rendering in the send button.

## Features Breakdown

### 1. **Chat Screen**
The chat screen displays a list of messages. New messages are added at the top of the chat, and old messages can be loaded as the user scrolls upwards.

### 2. **Loading Older Messages**
When the user scrolls to the top of the chat, older messages are fetched from the API by incrementing the `page` number.

### 3. **Sending Messages**
Users can send messages by typing in the input field and clicking the send button. These messages are displayed immediately in the chat.

### 4. **Auto Scrolling**
The app automatically scrolls to the latest message whenever a new message is sent.


