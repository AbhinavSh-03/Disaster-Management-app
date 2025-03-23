import { useState } from "react";
import { googleSignIn, logout } from "../auth";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgba(0, 128, 255, 0.285);;
`;

const Card = styled.div`
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
  width: 350px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;
  font-size: 1rem;
  background-color: ${(props) => props.bgColor || "#007bff"};
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
    transform: scale(1.05);
  }
`;

const Message = styled.p`
  margin-top: 12px;
  color: green;
  font-size: 1rem;
`;

export default function Login() {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    const googleUser = await googleSignIn();
    if (googleUser) setUser(googleUser);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <Container>
      <Card>
        <Title>Authentication</Title>
        <Button bgColor="#ea4335" hoverColor="#c1351d" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
        <Button bgColor="#0ebcbc" hoverColor="#a52a2a" onClick={handleLogout}>
          Logout
        </Button>
        {user && <Message>Logged in as: {user.email}</Message>}
      </Card>
    </Container>
  );
}
