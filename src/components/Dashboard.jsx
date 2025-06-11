import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  padding: 20px;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  flex-direction: row;
  background: linear-gradient(to left, #b2dfdb 0%, #e0f2f1 40%, #ffffff 100%);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 15px 10px;
  }
`;

const MapWrapper = styled.div`
  flex: 3;
  height: 650px;
  border-radius: 12px;
  overflow: hidden;
  
  margin-right: 20px;
  box-shadow: 0 6px 15px rgba(46, 139, 87, 0.3);
  border: 1px solid #d1e7dd;

  @media (max-width: 768px) {
    height: 300px;
    width: 100%;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  background: #f9fdfa;
  border-radius: 12px;
  padding: 20px;
  color: #1a3d2e;
  overflow-y: auto;
  max-height: 650px;
  border: 1px solid #d1e7dd;

  @media (max-width: 768px) {
    max-height: 300px;
    margin-top: 20px;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #175c43;
`;

const IncidentItem = styled.div`
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-left: 6px solid
    ${({ status }) =>
      status === "Resolved"
        ? "#388e3c"
        : status === "In Progress"
        ? "#1976d2"
        : "#f9a825"};

  &:hover {
    background-color: #d0e8d8;
  }
`;

const IncidentTitle = styled.h4`
  margin: 0 0 6px;
  color: #2e7d32;
`;

const IncidentStatus = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 15px;
  background-color: ${({ status }) =>
    status === "Resolved"
      ? "#388e3c"
      : status === "In Progress"
      ? "#1976d2"
      : "#f9a825"};
  color: #fff;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 22px;
  font-size: 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(46, 125, 50, 0.5);
  transition: background-color 0.3s;

  &:hover {
    background-color: #1b4d23;
  }
`;

const center = {
  lat: 22.9734,
  lng: 78.6569,
};

const zoom = 4;

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
    <>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Container>
        <MapWrapper>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%", minHeight: "450px" }}
              center={center}
              zoom={zoom}
              options={{ streetViewControl: false, mapTypeControl: false,  gestureHandling: "greedy"}}
            >
              {incidents.map((incident) => (
                <MarkerF
                  key={incident.id}
                  position={{ lat: incident.location.lat, lng: incident.location.lng }}
                  onClick={() => setSelectedIncident(incident)}
                  icon={{
                    url:
                      incident.status === "Resolved"
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : incident.status === "In Progress"
                        ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                  }}
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
                  <div
                    style={{
                      backgroundColor: "#e8f5e9",
                      color: "#175c43",
                      padding: "12px",
                      borderRadius: "12px",
                      maxWidth: "240px",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    <h3 style={{ marginBottom: "8px", fontWeight: "700" }}>
                      {selectedIncident.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", margin: "0 0 8px" }}>
                      {selectedIncident.description}
                    </p>
                    {selectedIncident.status && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 14px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          borderRadius: "15px",
                          marginBottom: "8px",
                          backgroundColor:
                            selectedIncident.status === "Resolved"
                              ? "#388e3c"
                              : selectedIncident.status === "In Progress"
                              ? "#1976d2"
                              : "#f9a825",
                          color: "white",
                        }}
                      >
                        {selectedIncident.status}
                      </span>
                    )}
                    {selectedIncident.imageUrl && selectedIncident.imageUrl !== "" && (
                      <img
                        src={selectedIncident.imageUrl}
                        alt="incident"
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          marginTop: "8px",
                          objectFit: "cover",
                          maxHeight: "160px",
                        }}
                      />
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </MapWrapper>

        <Sidebar>
          <Title>Ongoing Incidents</Title>
          {incidents.length === 0 && <p>No incidents reported yet.</p>}
          {incidents.map((incident) => (
            <IncidentItem
              key={incident.id}
              status={incident.status}
              onClick={() => setSelectedIncident(incident)}
              title={`Click to view details: ${incident.title}`}
            >
              <IncidentTitle>{incident.title}</IncidentTitle>
              <IncidentStatus status={incident.status}>{incident.status}</IncidentStatus>
            </IncidentItem>
          ))}
        </Sidebar>
      </Container>
    </>
  );
};

export default Dashboard;
