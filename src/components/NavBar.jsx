import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import logoImg from "../assets/logo.jpg";

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00b7ff;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  &:hover {
    color: #0077cc;
  }
`;

const NavButton = styled.button`
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005fa3;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <NavBarContainer>
      <LogoContainer to="/dashboard">
        <LogoImage src={logoImg} alt="Logo" />
        <LogoText>Disaster Portal</LogoText>
      </LogoContainer>
      {user && (
        <NavLinks>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/report">Report Incident</NavLink>
          <NavLink to="/my-reports">My Reports</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavButton onClick={handleLogout}>Logout</NavButton>
        </NavLinks>
      )}
    </NavBarContainer>
  );
};

export default Navbar;
