import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, Hammer, Globe } from "lucide-react";

// Styled Components


const Container = styled(motion.div)`
  max-width: 1920px;
  margin: 0;
  padding: 80px 24px;
  min-height: 100vh;
  background-color: #f8fafc;

  background-image: 
    radial-gradient(
      circle at top right,
      rgba(48, 255, 245, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(32, 178, 170, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    );

  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-position: top right, bottom left;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const Card = styled(motion.div)`
  background: white;
  border-top: 6px solid ${(props) => props.borderColor || "#ccc"};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08);
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;

  svg {
    margin-right: 10px;
  }
`;

const CardText = styled.p`
  color: #4b5563;
  line-height: 1.6;
`;

const List = styled.ul`
  padding-left: 20px;
  color: #4b5563;
  line-height: 1.6;
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
        {/* Project Goal */}
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

        {/* Technologies Used */}
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
          <List>
            <li>React.js (Frontend)</li>
            <li>Firebase Firestore & Auth</li>
            <li>Cloud Functions (Backend)</li>
            <li>Firebase Storage (Images)</li>
            <li>Stripe API (Donations)</li>
            <li>Google Maps API (Locations)</li>
          </List>
        </Card>

        {/* Features */}
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
          <List>
            <li>User registration & login</li>
            <li>Incident reporting with image & location</li>
            <li>Interactive map for incident location</li>
            <li>Image preview and upload</li>
            <li>Stripe donation integration</li>
            <li>Optional admin approval</li>
          </List>
        </Card>
      </Grid>
    </Container>
  );
};

export default About;
