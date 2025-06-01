import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, Hammer, Globe } from "lucide-react";

// Styled Components
const Container = styled(motion.div)`
  max-width: 1920px;
  padding: 80px 24px;
  min-height: 100vh;
  background-color: #243336;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.08), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.08), transparent 40%);
  color: white;
  font-family: "Courier New", monospace;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 48px;
  background: linear-gradient(to right, #3b82f6, #22c55e, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${(props) => props.borderColor || "#ccc"};
  border-left: 5px solid ${(props) => props.borderColor || "#ccc"};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(6px);
  box-shadow: 0 0 15px ${(props) => props.borderColor || "#ccc"}44;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 0 25px ${(props) => props.borderColor || "#ccc"}88;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;

  svg {
    margin-right: 10px;
  }
`;

const CardText = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
`;

const List = styled.ul`
  padding-left: 20px;
  color: #cbd5e1;
  line-height: 1.6;

  li::marker {
    color: ${(props) => props.color || "#94a3b8"};
  }
`;

const About = () => {
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Title
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        About Our Disaster Management System
      </Title>

      <Grid>
        <Card
          borderColor="#3b82f6"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <CardTitle>
            <Globe color="#3b82f6" /> Project Goal
          </CardTitle>
          <CardText>
            A real-time platform where communities report disasters to help
            authorities and relief teams act swiftly.
          </CardText>
        </Card>

        <Card
          borderColor="#22c55e"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CardTitle>
            <Hammer color="#22c55e" /> Technologies Used
          </CardTitle>
          <List color="#22c55e">
            <li>React.js (Frontend)</li>
            <li>Firebase Firestore & Auth</li>
            <li>Cloud Functions (Backend)</li>
            <li>Firebase Storage (Images)</li>
            <li>Razorpay API (Donations)</li>
            <li>Google Maps API (Locations)</li>
          </List>
        </Card>

        <Card
          borderColor="#a855f7"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CardTitle>
            <CheckCircle color="#a855f7" /> Available Features
          </CardTitle>
          <List color="#a855f7">
            <li>User registration & login</li>
            <li>Incident reporting with image & location</li>
            <li>Interactive map for incident location</li>
            <li>Image preview and upload</li>
            <li>Razorpay donation integration</li>
            <li>Optional admin approval</li>
          </List>
        </Card>
      </Grid>
    </Container>
  );
};

export default About;
