import React from "react";
import styled from "styled-components";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import footbg from "../assets/footbg.jpg";

const FooterContainer = styled.footer`
  background-image: url(${footbg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.6);
  background-blend-mode: overlay;
  color: white;
  padding: 3rem 1.5rem;
  text-align: center;
  height: 250px;
  display: flex;
  align-items: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  font-size: 1.5rem;

  a {
    color: white;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: scale(1.2);
      color: #ffd700;
    }
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CopyRight = styled.p`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>Disaster Aid Platform</h2>
        <p style={{ maxWidth: "600px", lineHeight: 1.4, fontSize: "0.9rem" }}>
          Helping communities respond and recover faster with real-time reporting,
          donations, and verified data.
        </p>

        <FooterLinks>
          <span>About Us</span>
          <span>Contact</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Volunteer</span>
          <span>Support</span>
        </FooterLinks>

        <SocialIcons>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="mailto:contact@disasteraid.org" target="_blank" rel="noopener noreferrer">
            <FaEnvelope />
          </a>
        </SocialIcons>

        <CopyRight>© {new Date().getFullYear()} Disaster Aid Platform. All rights reserved.</CopyRight>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
