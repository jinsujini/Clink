import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../../../assets/scss/contents/chat/chat.scss';
import Ib from '../../../assets/img/chat/imagebutton.png';
import Sb from '../../../assets/img/chat/sendbutton.png';
import Header from '../../Header';
import WebSocketService from './WebSocketService';
import axios from 'axios';

const Chat = () => {
  const { roomId } = useParams(); 
  const location = useLocation(); 
  const { userInfo: locationUserInfo } = location.state || {}; 
  const [userInfo, setUserInfo] = useState(locationUserInfo || {
    name: '',
    studentId: '',
    major: ''
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`https://clinkback.store/profile-image/get/${userInfo.studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.data && response.data.imageByte) {
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            profileImage: `data:image/jpeg;base64,${response.data.imageByte}`
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };

    fetchProfileImage();
  }, [userInfo.studentId]);

  const onMessageReceived = (message) => {
    try {
      const parsedMessage = JSON.parse(message.body);
      setMessages(prevMessages => [...prevMessages, parsedMessage]);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  useEffect(() => {
    const fetchOldMessagesAndConnect = async () => {
      try {
        const response = await axios.get(`https://clinkback.store/oldChat/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.data && response.data.chatEntities) {
          setMessages(response.data.chatEntities);
        }
      } catch (error) {
        console.error("Failed to fetch old chat messages:", error);
      }

      WebSocketService.connect(roomId, onMessageReceived);
    };

    fetchOldMessagesAndConnect();

    return () => {
      WebSocketService.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      axios.get('https://clinkback.store/api/auth/getLoggedInUsername', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(response => {
        const sender = response.data;

        // WebSocket으로 메시지를 전송
        WebSocketService.sendMessage(roomId, sender, inputMessage);

        // 메시지를 보낸 후 inputMessage 상태를 비웁니다.
        setInputMessage('');
      })
      .catch(error => {
        console.error("Failed to get logged in username:", error);
      });
    }
  };

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.floor((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.floor((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          callback(blob);
        }, 'image/jpeg', 0.8);
      };
    };

    reader.readAsDataURL(file);
  };

  const sendImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      axios.get('https://clinkback.store/api/auth/getLoggedInUsername', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(response => {
        const sender = response.data;

        resizeImage(file, 1024, 1024, (resizedBlob) => {
          const formData = new FormData();
          formData.append('imageFile', resizedBlob, file.name);
          formData.append('sender', sender);

          axios.post(`https://clinkback.store/room/${roomId}/sendImage`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
          .then(response => {
            console.log('Image sent:', response.data);
          })
          .catch(error => {
            console.error("Failed to send image:", error);
          });
        });
      })
      .catch(error => {
        console.error("Failed to get logged in username:", error);
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <Header />
      <div className='content'>
        <div className="chat-header">
          {userInfo.profileImage && (
            <div className="profile-img">
              <img src={userInfo.profileImage} alt={`${userInfo.name}의 프로필`} />
            </div>
          )}

          <div className="user-info">
            <div className='text'>{userInfo.name}</div>
            <div className='text'>{userInfo.studentId}</div>
            <div className='text'>{userInfo.major}</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === userInfo.studentId ? 'other' : 'me'}`}>
              {msg.imageBytes ? (
                <img src={`data:image/jpeg;base64,${msg.imageBytes}`} alt="sent image" className="sent-image" />
              ) : (
                <span>{msg.message}</span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={sendImage}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="image-upload-label">
            <img src={Ib} alt="이미지 전송" />
          </label>

          <button onClick={sendMessage} className="send-button">
            <img src={Sb} alt="전송" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
