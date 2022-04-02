import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientUser from '../../libs/getRecipientUser';
import { useRouter } from 'next/router';
import Head from 'next/head';
function ChatPage({ chat, messages }) {
  const [user] = useAuthState(auth);

  const router = useRouter();
  const userName =
    chat.users[2] || getRecipientUser(chat.users, user) || 'a friend';

  return (
    <Container>
      <Head>
        <title>chatting with {userName}</title>
      </Head>
      <Sidebar chatId={router.query.chatId} />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default ChatPage;

export async function getServerSideProps(ctx) {
  const ref = db.collection('chats').doc(ctx.query.chatId);

  // PREP THE MESSAGES ON THE SERVER..
  const messagesRes = await ref
    .collection('messages')
    .orderBy('timeStamp', 'asc')
    .get();

  const messages = await messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timeStamp: messages.timeStamp.toDate().getTime(),
    }));

  // PREP THE CHAT ON THE SERVER...

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages), // as it's more complex so stringify it send it on the server then
      // return it as prop then convert it again.
      chat: chat,
    },
  };
}
const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
`;
