import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Avatar, IconButton } from '@mui/material';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Message from './Message';
import { useRouter } from 'next/router';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useState } from 'react';
import firebase from 'firebase';
import getRecipientUser from '../libs/getRecipientUser';
import TimeAgo from 'timeago-react';
import { useRef } from 'react';
function ChatScreen({ chat, messages }) {
  const [input, setInput] = useState('');
  const [user] = useAuthState(auth);

  const endRef = useRef();
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.chatId)
      .collection('messages')
      .orderBy('timeStamp', 'asc')
  );
  // db
  //   .collection('chats')
  //   .doc(chatId)
  //   .collection('messages')
  //   .orderBy('timeStamp', 'asc')

  // const [messagesSnapshot] = useCollection(
  //   db
  //     .collection('chats')
  //     .doc(chatId)
  //     .collection('messages')
  //     .orderBy('timeStamp', 'asc')
  // );

  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const showMessagesHandler = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timeStamp: message.data().timeStamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();

    // update the last seen....
    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection('chats').doc(router.query.chatId).collection('messages').add({
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput('');
    scrollToBottom();
  };

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientUser(chat.users, user))
  ); // Here, we get the snapshot of the recipientEmail so that we can get
  // its data from db as below directly... then use it as we need
  const recipientUserData = recipientSnapshot?.docs?.[0]?.data();

  const lastSeen = (
    <LastSeen>
      {recipientSnapshot ? (
        recipientUserData?.lastSeen?.toDate() ? (
          <TimeAgo datetime={recipientUserData.lastSeen.toDate()} />
        ) : (
          'unavailable'
        )
      ) : (
        'loading last active...'
      )}
    </LastSeen>
  );
  const chatName = chat.users[2];
  return (
    <Container>
      <ChatHeader>
        {recipientUserData ? (
          <Avatar src={recipientUserData?.photoURL} />
        ) : (
          <Avatar sx={{ bgcolor: 'orange' }}>
            {getRecipientUser(chat.users, user)[0].toUpperCase()}
          </Avatar>
        )}
        <HeaderInfo>
          <h4>{chatName}</h4>
          {lastSeen}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </ChatHeader>
      <Messages>
      {showMessagesHandler()}
      <EndOfMessages ref={endRef} />
      </Messages>

      <InputContainer onSubmit={sendMessageHandler}>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <Input
          value={input}
          placeholder='write a message'
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton>
          <MicIcon />
        </IconButton>
        <button hidden disabled={!input} type='submit'>
          Send message
        </button>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const LastSeen = styled.span`
  font-size: 15px;
  color: #ccc;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: #fff;
`;
const Input = styled.input`
  flex: 1;
  border: none;
  border-bottom: 1px solid whitesmoke;
  padding: 10px;
  font-size: 17px;
  outline: none;
`;
const ChatHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  z-index: 100;
  height: 70px;
  border-bottom: 1px solid whitesmoke;
  background-color: white;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h4 {
    margin: 0;
    margin-bottom: 3px;
    text-transform: capitalize;
  }
`;

const HeaderIcons = styled.div``;

const Messages = styled.div`
  background-image: url('https://play-lh.googleusercontent.com/SZ97RCEv5EVH6iMCDIdHeGJM_BNyHYcnRQ4EdK4V_VyVxLlQS8GY1U3xB8atEBH55OM');
  background-attachment: fixed;
  padding: 20px;
  flex: 1;
`;
// sonny sangha video =>  2:06:50       important note about server side rendering.

const EndOfMessages = styled.div``;
