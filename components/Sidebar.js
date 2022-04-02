import styled from 'styled-components';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Chat from './Chat';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useState } from 'react';
import { Avatar, Button } from '@mui/material';
import * as EmailValidator from 'email-validator';
import { IconButton } from '@mui/material';
function Sidebar(chatId) {
  const [search, setSearch] = useState(null);
  const [user] = useAuthState(auth);

  // userChatRef...
  // what this does.. it goes to firestore and basically queries users array and check
  // where our email is seen for the person who logged in.  should give us all the chats
  // then mapping it to real_time listener using 'useCollection'

  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email);
  const [chatSnapshot, loading, error] = useCollection(userChatRef);

  const startChatHandler = async () => {
    const input = prompt('Enter The Email You want to Chat with (gmail one)');
    const chatName = prompt('Enter Name of the Chat');
    // console.log(input);

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      //check if it's not exist and valid then add it to db collection(chats)
      db.collection('chats').add({
        users: [user.email, input, chatName],
      });
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0

      //Here, we go through the chatSnapshot and find in chat users
      //and find if the user === recipientEmail. __ ( !! => return boolean)
      // return true or false.
    );

  return (
    <Container>
      <Header>
        <Me>
          <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
          <MyName>{user.displayName}</MyName>
        </Me>
        <IconContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconContainer>
      </Header>
      <SearchBar>
        <SearchIcon />
        <Input
          placeholder='Search in Chats'
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>
      <SidebarButton onClick={startChatHandler}>START A NEW CHAT</SidebarButton>
      <ChatFriends>
        {chatSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </ChatFriends>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  position: sticky;
  left: 0;
  height: 100vh;
  flex: 0.35;
  min-width: 300px;
  max-width: 350px;
  overflow: hidden;
  border-right: 2px solid whitesmoke;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  height: 70px;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 0px 5px 0px #eee;
  padding: 5px;
`;

const Me = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MyName = styled.h4`
  margin-left: 5px;
`;
const UserAvatar = styled(Avatar)`
  width: 50px;
  height: 50px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconContainer = styled.div``;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const Input = styled.input`
  height: 40px;
  border: none;
  outline: none;
  margin-left: 5px;
  font-size: 17px;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border: 1px solid whitesmoke;
  }
`;
const ChatFriends = styled.div`
  overflow-y: auto;
`;
