import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import logoImg from "../assets/logo.jpg";
import { motion, AnimatePresence } from "framer-motion";

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
  Bell,
} from "lucide-react";

// Styled Components

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

const NavLinks = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
  position: absolute;
  top: 70px;
  right: ${({ open }) => (open ? "0" : "-100%")};
  flex-direction: column;
  background: #ffffff;
  width: 200px;                        // ✅ only 200px wide now
  padding: 1rem;
  border-left: 1px solid #ddd;
  transition: right 0.3s ease;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
  text-align: left;
  align-items: flex-start;
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
  transition: color 0.2s ease;

  &:hover {
    color: #0077cc;
    transform: scale(1.02);
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

const NotificationWrapper = styled.div`
  position: relative;
`;

const NotificationIcon = styled.button`
  background: none;
  color: black;
  border: none;
  cursor: pointer;
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff3b3b;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 50%;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 2000;
  padding: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  background-color: ${({ read }) => (read ? "#f9f9f9" : "#e6f4ff")};
  border-radius: 4px;
  margin-bottom: 0.25rem;
`;

const NotificationTitle = styled.strong`
  display: block;
  color: black;
`;

const NotificationMessage = styled.p`
  color: black;
  font-size: 0.85rem;
  margin: 0.25rem 0;
`;

const NotificationTime = styled.small`
  color: #888;
`;

const Navbar = ({ notifications }) => {
  const { currentUser, userRole, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (showDropdown) {
      setLocalNotifications((prevNotifs) =>
        prevNotifs.map((notif) =>
          notif.read ? notif : { ...notif, read: true }
        )
      );

      notifications.forEach(async (n) => {
        if (!n.read) {
          try {
            const notifRef = doc(db, "notifications", n.id);
            await updateDoc(notifRef, { read: true });
          } catch (err) {
            console.error("Error updating notification:", err);
          }
        }
      });
    }
  }, [showDropdown, notifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

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
        <AnimatePresence>
          {menuOpen || window.innerWidth > 768 ? (
            <NavLinks
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              open={menuOpen}
            >
              <NavLink to="/dashboard" active={isActive("/dashboard")} onClick={handleNavClick}>
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink to="/report" active={isActive("/report")} onClick={handleNavClick}>
                <FilePlus size={18} />
                Report Incident
              </NavLink>

              <NavLink to="/my-reports" active={isActive("/my-reports")} onClick={handleNavClick}>
                <ListChecks size={18} />
                My Reports
              </NavLink>

              <NavLink to="/donation-campaigns" active={isActive("/donation-campaigns")} onClick={handleNavClick}>
                <Heart size={18} />
                Donations
              </NavLink>

              {userRole === "admin" && (
                <NavLink to="/admin-reports" active={isActive("/admin-reports")} onClick={handleNavClick}>
                  <ShieldCheck size={18} />
                  Admin Control
                </NavLink>
              )}

              <NavLink to="/about" active={isActive("/about")} onClick={handleNavClick}>
                <Info size={18} />
                About
              </NavLink>

              {/* Notification Icon */}
              <NotificationWrapper ref={dropdownRef}>
                <NotificationIcon onClick={() => setShowDropdown((prev) => !prev)}>
                  <Bell size={22} />
                  {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
                </NotificationIcon>

                {showDropdown && (
                  <NotificationDropdown>
                    <strong>Notifications</strong>
                    {localNotifications.length === 0 ? (
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        No notifications
                      </p>
                    ) : (
                      localNotifications.map((n) => (
                        <NotificationItem key={n.id} read={n.read}>
                          <NotificationTitle>{n.title}</NotificationTitle>
                          <NotificationMessage>{n.message}</NotificationMessage>
                          <NotificationTime>
                            {n.timestamp?.seconds &&
                              formatDistanceToNow(
                                new Date(n.timestamp.seconds * 1000),
                                { addSuffix: true }
                              )}
                          </NotificationTime>
                        </NotificationItem>
                      ))
                    )}
                  </NotificationDropdown>
                )}
              </NotificationWrapper>

              <NavButton onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </NavButton>
            </NavLinks>
          ) : null}
        </AnimatePresence>
      )}
    </NavBarContainer>
  );
};

export default Navbar;
