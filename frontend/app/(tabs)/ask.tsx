import { useState, useRef, useEffect, memo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  Image,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  isUser: boolean;
}

const PEPPER_AVATAR = require('../../assets/images/pepper-clean.png');

const Avatar = memo(() => (
  <View style={styles.avatarContainer}>
    <Image 
      source={PEPPER_AVATAR} 
      style={styles.avatar}
      resizeMode="contain"
      fadeDuration={0}
    />
  </View>
));

const MessageBubble = memo(({ message }: { message: Message }) => (
  <View style={[
    styles.messageRow,
    message.isUser && styles.userMessageRow
  ]}>
    {!message.isUser && <Avatar />}
    <View
      style={[
        styles.messageBubble,
        message.isUser ? styles.userMessage : styles.botMessage,
      ]}>
      <Text style={styles.pepperName}>
        {message.isUser ? 'You' : 'Pepper'}
      </Text>
      <Text style={[
        styles.messageText,
        message.isUser && styles.userMessageText
      ]}>{message.text}</Text>
    </View>
  </View>
));

export default function AskScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const API_URL = 'http://192.168.1.75:5000/api';

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        id: 'welcome',
        text: "Hi! I'm Pepper, your personal cooking assistant. I'm here to help you discover new recipes, plan meals, and answer any cooking questions you might have. How can I assist you today?",
        timestamp: Date.now(),
        isUser: false,
      }]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: Date.now(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          timestamp: userMessage.timestamp,
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        timestamp: data.timestamp,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={[styles.container, { paddingBottom: 0 }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat with Pepper</Text>
          <TouchableOpacity 
            style={styles.voiceButton} 
            onPress={() => setIsVoiceMode(!isVoiceMode)}
          >
            <Ionicons 
              name={isVoiceMode ? "mic" : "mic-outline"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.voiceButtonText}>Voice</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isVoiceMode && styles.inputDisabled]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isVoiceMode ? "Tap to speak..." : "Ask Pepper anything..."}
            placeholderTextColor="#666"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            editable={!isVoiceMode}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!inputText.trim() || isVoiceMode}>
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() && !isVoiceMode ? '#FF6B6B' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  voiceButton: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  voiceButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userMessage: {
    backgroundColor: '#FF6B6B',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  pepperName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    minHeight: 40,
  },
  inputDisabled: {
    backgroundColor: '#E5E5E5',
    color: '#999',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 