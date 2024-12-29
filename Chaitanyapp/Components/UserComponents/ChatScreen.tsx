import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Menu, Divider, Provider } from 'react-native-paper';

const Chat = ({ route }: { route: any }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<string>('');
  const [page, setPage] = useState(0); 
  const flatListRef = useRef<FlatList>(null); 
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => handleEditGroup()} style={styles.headerRightButton}>
          <Ionicons name="create" size={27} color="black"  />
        </TouchableOpacity>
      ),
      headerTitle: 'Trip 1',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
        color:'black',
      },
      headerStyle:{
        backgroundColor:'#f2f2f2',
        elevation: 0,
        borderBottomWidth: 0, 
      }
    });
  }, [navigation]);

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
          image: "https://fastly.picsum.photos/id/1072/160/160.jpg?hmac=IDpbpA5neYzFjtkdFmBDKXwgr-907ewXLa9lLk9JuA8",
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

  const openAttachmentMenu = () => setAttachmentMenuVisible(true);
  const closeAttachmentMenu = () => setAttachmentMenuVisible(false);

  const handleMenuOption = (option: string) => {
    console.log(`Selected: ${option}`);
    closeAttachmentMenu();
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
      <View style={styles.locationContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/8630/8630506.png',
          }}
          style={styles.groupImage}
        />
        <View style={styles.locationTextContainer}> 
          <Text>From</Text> 
          <Text>To</Text>
        </View>
        <View style={styles.locationTextContainer}> 
          <Text style={{ fontWeight: 'bold' }}>IGI Airport, T3</Text> 
          <Text style={{ fontWeight: 'bold' }}>Sector 28</Text>
        </View>

        {/* Menu Button  of navigation */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => handleMenuOption('Members')} title="Members"  leadingIcon={() => <Ionicons name="people" size={20} color="black" />} />
          <Divider />
          <Menu.Item onPress={() => handleMenuOption('Share Number')} title="Share Number"  leadingIcon={()=> <Ionicons name="call" size={20} color="black" />} />
          <Divider />
          <Menu.Item onPress={() => handleMenuOption('Report')} title="Report" leadingIcon={()=><Ionicons name="alert-circle" size={20} color="black"/>} />
        </Menu>
      </View>

   
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <View style={[styles.messageContainer, item.sender.self ? styles.sentContainer : styles.receivedContainer]}>
              <Image
                source={{
                  uri: item.sender.image || 'https://via.placeholder.com/40',
                }}
                style={[item.sender.self ? styles.senderImage: styles.receiverImage]}
              />
              <View
                style={[styles.message, item.sender.self ? styles.sent : styles.received]}
              >
                <View style={styles.messageContent}>
                  <Text
                    style={[styles.messageText, item.sender.self && styles.sentText]}
                  >
                    {item.message}
                  </Text>
                  <Text style={styles.timestamp}>{item.time}</Text>
                </View>
              </View>
            </View>
          </>
        )}
        onScroll={handleScroll}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        inverted={true}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={openAttachmentMenu} style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="steelblue" />
        </TouchableOpacity>
      </View>

      {/* Attachment Menu */}
      {attachmentMenuVisible && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity style={styles.attachmentMenuItem} onPress={() => handleMenuOption('Camera')}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentMenuItem} onPress={() => handleMenuOption('Video')}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentMenuItem} onPress={() => handleMenuOption('PDF')}>
            <Ionicons name="document-text" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginBottom: 10,
  },
  sentContainer: {
    justifyContent: 'flex-end', 
    marginLeft: 'auto', 
    marginRight: 5,
    maxWidth: '85%', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 0, 
    backgroundColor: 'steelblue',
    overflow: 'hidden', 
    padding: 5,
  },
  receivedContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    marginRight: 30,
    padding: 5,
    borderTopRightRadius: 30, 
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30, 
    backgroundColor: '#fff',
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
  },
  received: {
    backgroundColor: '#fff',
  },
  receiverImage: {
    flexDirection:'row',
    width: 38,
    height: 38,
    borderRadius: 20,
    marginRight: 10, 
    marginTop: 5, 
  },
  senderImage: {

    width: 0, 
    height: 0,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
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
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
  },
  attachmentButton: {
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  locationTextContainer: {
    marginLeft: 10,
  },
  menuButton: {
    marginLeft: 110,
  },
  groupImage: {
    width: 55,
    height: 55,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 20,
  },
  headerBackButton:{
    marginLeft:25
  },
  headerRightButton:{
    marginRight:20
  },
  attachmentMenu: {
    flexDirection: 'row',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: "7%",
    left: '60%',
    right: '10%',
  },
  attachmentMenuItem: { alignItems: 'center' },
  attachmentMenuText: { marginTop: 5, color: 'white' },
});

export default Chat;
