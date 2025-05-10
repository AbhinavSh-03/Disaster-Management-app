import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";  // Assuming the firebase config is exported here
import { collection, getDocs } from "firebase/firestore";

// Styled components
const Container = styled.div`
  text-align: center;
  padding: 20px;
  height: calc(100vh - 80px);  /* Adjust for the navbar height */
  overflow-y: auto; /* Enable scrolling */
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
  background-color: #000000;
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
  const [incidents, setIncidents] = useState([]);  // State to store incidents
  const [selectedIncident, setSelectedIncident] = useState(null);  // Store the incident selected by the user

  // Fetch incidents from Firestore
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "incidents"));
        const incidentsArray = [];
        querySnapshot.forEach((doc) => {
          incidentsArray.push({ id: doc.id, ...doc.data() });
        });
        setIncidents(incidentsArray);
        console.log("Fetched incidents: ", incidentsArray);  // Log incidents to debug
      } catch (error) {
        console.error("Error fetching incidents: ", error);
      }
    };

    fetchIncidents();
  }, []);

  // Handle logout
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
            {/* Add a Marker for each incident */}
            {incidents.map((incident) => (
              <MarkerF
                key={incident.id}
                position={{ lat: incident.location.lat, lng: incident.location.lng }}
                onClick={() => {
                  console.log("Incident clicked:", incident);  // Log incident on click
                  setSelectedIncident(incident);
                }}  
              />
            ))}

            {/* Display InfoWindow if an incident is selected */}
            {selectedIncident && (
              <InfoWindow
                position={{
                  lat: selectedIncident.location.lat,
                  lng: selectedIncident.location.lng,
                }}
                onCloseClick={() => setSelectedIncident(null)}  // Close InfoWindow on click
              >
                <div style={{ backgroundColor: '#333', color: 'white', padding: '10px', borderRadius: '8px' }}>
                  <h3>{selectedIncident.title}</h3>
                  <p>{selectedIncident.description}</p>
                  {selectedIncident.imageUrl && selectedIncident.imageUrl !== "" && (
                    <img src={selectedIncident.imageUrl} alt="incident" style={{ width: '100%', borderRadius: '8px' }} />
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </MapWrapper>
    </Container>
  );
};

export default Dashboard;
