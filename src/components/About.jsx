import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, Hammer, Globe, LogIn, MapPin, UploadCloud, DollarSign, ShieldCheck } from "lucide-react";

const PageWrapper = styled.div`
  background: linear-gradient(135deg,rgb(91, 218, 238) 0%, #ccfbf1 100%);
  padding: 60px 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled(motion.h1)`
  font-size: 2.75rem;
  font-weight: 700;
  text-align: left;
  margin-bottom: 48px;
  background: linear-gradient(to right, #3b82f6, #22c55e, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled(motion.div)`
  margin-bottom: 48px;
  max-width: 800px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;

  svg {
    margin-right: 10px;
  }
`;

const SectionText = styled.p`
  color: #334155;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const Feature = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  svg {
    margin-right: 10px;
    margin-top: 3px;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: #334155;
    line-height: 1.5;
  }
`;

const About = () => {
  return (
    <PageWrapper>
      <motion.div
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

        <Section
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionTitle>
            <Globe color="#3b82f6" /> Project Goal
          </SectionTitle>
          <SectionText>
            A real-time platform empowering citizens to report disasters instantly,
            facilitating quick responses by emergency services, NGOs, and authorities.
          </SectionText>
        </Section>

        <Section
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SectionTitle>
            <Hammer color="#22c55e" /> Technologies Used
          </SectionTitle>
          <Feature><Hammer color="#22c55e" /><p><strong>React.js:</strong> Responsive frontend for dynamic user interaction.</p></Feature>
          <Feature><Hammer color="#22c55e" /><p><strong>Firebase Firestore & Auth:</strong> Real-time data storage and secure user authentication.</p></Feature>
          <Feature><Hammer color="#22c55e" /><p><strong>Cloud Functions:</strong> Serverless backend logic for processing reports and admin tasks.</p></Feature>
          <Feature><Hammer color="#22c55e" /><p><strong>Firebase Storage:</strong> Secure image upload and retrieval for incident evidence.</p></Feature>
          <Feature><DollarSign color="#22c55e" /><p><strong>Razorpay API:</strong> Enables users to contribute donations toward relief efforts.</p></Feature>
          <Feature><MapPin color="#22c55e" /><p><strong>Google Maps API:</strong> Allows pinpointing exact disaster locations.</p></Feature>
        </Section>

        <Section
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SectionTitle>
            <CheckCircle color="#a855f7" /> Available Features
          </SectionTitle>
          <Feature><LogIn color="#a855f7" /><p><strong>User authentication:</strong> Secure login and sign-up to protect user data.</p></Feature>
          <Feature><UploadCloud color="#a855f7" /><p><strong>Report submission:</strong> Users can upload incident photos and descriptions.</p></Feature>
          <Feature><MapPin color="#a855f7" /><p><strong>Location tagging:</strong> Every report includes accurate GPS coordinates.</p></Feature>
          <Feature><UploadCloud color="#a855f7" /><p><strong>Image previews:</strong> Users can preview uploaded images before submission.</p></Feature>
          <Feature><DollarSign color="#a855f7" /><p><strong>Donation support:</strong> Contribute directly to verified causes via Razorpay.</p></Feature>
          <Feature><ShieldCheck color="#a855f7" /><p><strong>Admin verification:</strong> Optional moderation for report credibility.</p></Feature>
        </Section>
      </motion.div>
    </PageWrapper>
  );
};

export default About;
