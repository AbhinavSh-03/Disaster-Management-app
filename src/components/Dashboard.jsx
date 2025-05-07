import React from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext"; // Import the useAuth hook to handle logout

// Styled components
const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e53935;
  }
`;

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const Dashboard = () => {
  const { logout } = useAuth(); // Use the logout function from the AuthContext

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from your AuthContext
      window.location.href = "/login"; // Redirect to the login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Container>
      <Title>Dashboard</Title>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <MapWrapper>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={10}
          >
            <MarkerF position={center} />
          </GoogleMap>
        </LoadScript>
      </MapWrapper>
    </Container>
  );
};

export default Dashboard;