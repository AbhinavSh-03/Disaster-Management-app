import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Container = styled.div`
  text-align: center;
  padding: 20px;
  height: calc(100vh - 80px);
  overflow-y: auto;
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
  const { logout } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "incidents"));
        const incidentsArray = [];
        querySnapshot.forEach((doc) => {
          incidentsArray.push({ id: doc.id, ...doc.data() });
        });
        setIncidents(incidentsArray);
      } catch (error) {
        console.error("Error fetching incidents: ", error);
      }
    };

    fetchIncidents();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
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
            {incidents.map((incident) => (
              <MarkerF
                key={incident.id}
                position={{ lat: incident.location.lat, lng: incident.location.lng }}
                onClick={() => setSelectedIncident(incident)}
              />
            ))}

            {selectedIncident && (
              <InfoWindow
                position={{
                  lat: selectedIncident.location.lat,
                  lng: selectedIncident.location.lng,
                }}
                onCloseClick={() => setSelectedIncident(null)}
              >
                <div style={{ backgroundColor: "#333", color: "white", padding: "10px", borderRadius: "8px", maxWidth: "220px" }}>
                  <h3 style={{ marginBottom: "6px" }}>{selectedIncident.title}</h3>
                  <p style={{ fontSize: "0.85rem", margin: "0 0 6px" }}>{selectedIncident.description}</p>
                  {selectedIncident.status && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        marginBottom: "6px",
                        backgroundColor:
                          selectedIncident.status === "Resolved"
                            ? "#2e7d32"
                            : selectedIncident.status === "In Progress"
                            ? "#0288d1"
                            : "#f57c00",
                      }}
                    >
                      {selectedIncident.status}
                    </span>
                  )}
                  {selectedIncident.imageUrl && selectedIncident.imageUrl !== "" && (
                    <img
                      src={selectedIncident.imageUrl}
                      alt="incident"
                      style={{ width: "100%", borderRadius: "6px", marginTop: "6px" }}
                    />
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
