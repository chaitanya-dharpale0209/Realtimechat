import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Chat = ({ route }: { route: any }) => {
  
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<string>('');
  const [page, setPage] = useState(0); 
  const flatListRef = useRef<FlatList>(null); 
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

 
  const fetchMessages = async (pageNum: number) => {
    try {
      const response = await axios.get('https://qa.corider.in/assignment/chat', {
        params: {
          page: pageNum,
        },
      });

      if (response.data.chats) {
        const newMessages = response.data.chats.map((msg: any) => ({
          id: msg.id,
          message: msg.message,
          sender: msg.sender,
          time: msg.time,
        }));
        setMessages((prevMessages) => (pageNum === 0 ? newMessages : [...newMessages, ...prevMessages]));
      }
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  useEffect(() => {
   
    if (isAtBottom && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (text.trim()) {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newMessage = {
        id: `${Date.now()}`, 
        message: text,
        sender: {
          image: "https://fastly.picsum.photos/id/1072/160/160.jpg?hmac=IDpbpA5neYzFjtkdFmBDKXwgr-907ewXLa9lLk9JuA8", // Your specific image
          is_kyc_verified: true,
          self: true, 
          user_id: "73785ed67d034f6290b0334c6e756433",
        },
        time: currentTime, 
      };

      setMessages((prevMessages) => [newMessage, ...prevMessages]); 
      setText(''); 

      try {
        const response = await axios.get('https://qa.corider.in/assignment/chat', {
          message: text,
          user_id: "73785ed67d034f6290b0334c6e756433",
        });

        if (response.status !== 200) {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentOffsetY + layoutHeight >= contentHeight - 10) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const handleEndReached = () => {
    if (!isAtBottom) {
      setPage(page + 1); 
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender.self ? styles.sent : styles.received, 
            ]}
          >
            <Image
              source={{
                uri: item.sender.image || 'https://via.placeholder.com/40',
              }}
              style={styles.senderImage}
            />
            <View style={styles.messageContent}>
              <Text
                style={[
                  styles.messageText,
                  item.sender.self && styles.sentText, 
                ]}
              >
                {item.message}
              </Text>
              <Text style={styles.timestamp}>{item.time}</Text>
            </View>
          </View>
        )}
        
        onScroll={handleScroll}
        onEndReached={handleEndReached} 
        onEndReachedThreshold={0.1} 
        inverted={true}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
       
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="steelblue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    maxWidth: '80%', 
  },
  sent: {
    backgroundColor: 'steelblue',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#000', 
  },
  sentText: {
    color: 'white', 
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
