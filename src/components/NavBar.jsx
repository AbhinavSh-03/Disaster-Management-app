import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import logoImg from "../assets/logo.jpg";

import {
  LayoutDashboard,
  FilePlus,
  ListChecks,
  ShieldCheck,
  Info,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";

// Styled components
const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
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
  color: #0077cc;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    right: ${({ open }) => (open ? "0" : "-100%")};
    flex-direction: column;
    background: #ffffff;
    width: 200px;
    padding: 1rem;
    border-left: 1px solid #ddd;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ active }) => (active ? "#0077cc" : "#333333")};
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #0077cc;
  }
`;

const NavButton = styled.button`
  background-color: #0077cc;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #005fa3;
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    color: #333;
  }
`;

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <NavBarContainer>
      <LogoContainer to="/dashboard">
        <LogoImage src={logoImg} alt="Logo" />
        <LogoText>Disaster Portal</LogoText>
      </LogoContainer>

      <Hamburger onClick={() => setMenuOpen((prev) => !prev)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </Hamburger>

      {currentUser && (
        <NavLinks open={menuOpen}>
          <NavLink to="/dashboard" active={isActive("/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/report" active={isActive("/report")}>
            <FilePlus size={18} />
            Report Incident
          </NavLink>

          <NavLink to="/my-reports" active={isActive("/my-reports")}>
            <ListChecks size={18} />
            My Reports
          </NavLink>

          {/* New Donation Campaigns tab */}
          <NavLink to="/donation-campaigns" active={isActive("/donation-campaigns")}>
            <Heart size={18} />
            Donations
          </NavLink>

          {userRole === "admin" && (
            <NavLink to="/admin-reports" active={isActive("/admin-reports")}>
              <ShieldCheck size={18} />
              Admin Control
            </NavLink>
          )}

          <NavLink to="/about" active={isActive("/about")}>
            <Info size={18} />
            About
          </NavLink>

          <NavButton onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </NavButton>
        </NavLinks>
      )}
    </NavBarContainer>
  );
};

export default Navbar;
