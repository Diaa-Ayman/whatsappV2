import styled from 'styled-components';
import { Avatar, IconButton } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import getRecipientUser from '../libs/getRecipientUser';
function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const curEmail = getRecipientUser(users, user); // it's a way to get the email for each
  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientUser(users, user))
  ); // Here, we get the snapshot of the recipientEmail so that we can get
  // its data from db as below directly... then use it as we need
  const recipientUserData = recipientSnapshot?.docs?.[0]?.data();

  //
  const chatName = users[2];

  const enterChatHandler = () => {
    router.push(`/chat/${id}`);
  };
  const deleteChatHandler = () => {
    router.push('/');

    db.collection('chats').doc(id).delete();
  };
  return (
    <Container>
      <ChatData onClick={enterChatHandler}>
        {recipientUserData ? (
          <UserAvatar src={recipientUserData?.photoURL} />
        ) : (
          <UserAvatar sx={{ bgcolor: 'orange' }}>
            {curEmail[0].toUpperCase()}
          </UserAvatar>
        )}
        <UserName>{chatName}</UserName>
      </ChatData>
      <IconButton>
        <MoreVertIcon onClick={deleteChatHandler} />
      </IconButton>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  transition: 0.5s;
  word-break: break-word; // In Case any user name is big then break it
  :hover {
    cursor: pointer;
    background: #eee;
    transition: 0.5s;
  }
`;

const UserAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin-right: 8px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const UserName = styled.span`
  font-size: 17px;
  font-weight: 500;
  flex: 1;
`;

const ChatData = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;
