import styled from 'styled-components';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Head from 'next/head';
import { auth, provider } from '../firebase';
const logo =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png';
function Login() {
  const signInHandler = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Whatsapp src={logo} alt='whats app image' />
        <Button onClick={signInHandler} variant='contained' color='success'>
          SIGN IN WITH GOOGLE
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  height: 100vh;
  background-image: url('http://www.meupositivo.com.br/doseujeito/wp-content/uploads/2021/08/25.jpg');
  background-repeat: no-repeat;
  background-size: cover;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  height: fit-content;
  margin: 8rem 0 0 3rem;
  padding: 50px;
  justify-content: center;
`;
const Whatsapp = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 40px;
  object-fit: cover;
`;
