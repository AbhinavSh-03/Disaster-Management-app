import React, { useState } from "react";
import styled from "styled-components";
import bgImage from "../assets/bg1.jpg";
import { googleSignIn } from "../auth"; // Assuming this is your Firebase Google sign-in function
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useAuth } from "../contexts/AuthContext"; // Import useAuth to access the current user

const Container = styled.div`
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 3rem;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 2.2rem;
  color: #ffffff;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #cccaca;
`;

const Button = styled.button`
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    background-color: #0067a3;
  }
`;

export default function Login() {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const { user } = useAuth(); // Get the current user from context (if logged in)

  // This function handles the Google login
  const handleGoogleLogin = async () => {
    try {
      await googleSignIn(); // Sign in using the custom googleSignIn function
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error); // Log any error that occurs
    }
  };

  // If the user is already logged in, redirect them to the dashboard
  if (user) {
    navigate("/dashboard");
  }

  return (
    <Container>
      <LoginCard>
        <Title>Disaster Management Portal</Title>
        <Description>
          A crowdsourced platform for real-time disaster reporting, coordination, and aid.
          Sign in to contribute, report emergencies, or offer help.
        </Description>
        <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
      </LoginCard>
    </Container>
  );
}