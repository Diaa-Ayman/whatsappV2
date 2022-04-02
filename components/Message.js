import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';
function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <TimeStamp>
          {message.timeStamp ? moment(message.timeStamp).format('LT') : '...'}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;
const MessageElement = styled.div`
  position: relative;
  width: fit-content;
  min-width: 60px;
  padding: 10px;
  padding-bottom: 25px;
  border-radius: 10px;
  margin: 10px;
  text-align: right;
  font-size: 17px;
  font-weight: 500;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #242424;
  color: #fff;
`;
const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: #fff;
`;

const TimeStamp = styled.span`
  color: gray;
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 10px;
  font-weight: 450;
`;
