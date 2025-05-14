import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 100px auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const ReportCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: #fff;
`;

const ReportTitle = styled.h3`
  color: #0077cc;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const Description = styled.p`
  margin-bottom: 0.5rem;
  color: #333;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 0.5rem;
  object-fit: cover;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 250px;
  margin-top: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case "Resolved":
        return "#2e7d32";
      case "In Progress":
        return "#0288d1";
      default:
        return "#f57c00";
    }
  }};
  border-radius: 12px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MyReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      console.log("No current user.");
      setReports([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "incidents"), where("userId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Reports:", data);
        setReports(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Container>
      <Title>My Reports</Title>
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        reports.map((report) => (
          <ReportCard key={report.id}>
            <ReportTitle>{report.title}</ReportTitle>
            <StatusBadge status={report.status || "Pending"}>{report.status || "Pending"}</StatusBadge>
            <Description>{report.description}</Description>
            {report.imageUrl && <ImagePreview src={report.imageUrl} alt="Incident Image" />}
            {report.location && (
              <MapContainer>
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={report.location}
                    zoom={10}
                  >
                    <MarkerF position={report.location} />
                  </GoogleMap>
                </LoadScript>
              </MapContainer>
            )}
          </ReportCard>
        ))
      )}
    </Container>
  );
};

export default MyReports;
