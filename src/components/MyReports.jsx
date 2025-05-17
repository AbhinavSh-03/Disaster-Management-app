import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 100px 1rem 2rem;
  background: linear-gradient(to left, #b2dfdb 0%, #e0f2f1 40%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 960px;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #004d40;
  margin-bottom: 2rem;
`;

const ReportCard = styled.div`
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.08);;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;

const ReportTitle = styled.h3`
  color: #00695c;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #424242;
  margin: 0.5rem 0 1rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 250px;
  margin-top: 1rem;
  border-radius: 10px;
  overflow: hidden;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  background-color: ${({ status }) =>
    status === "Resolved"
      ? "#2e7d32"
      : status === "In Progress"
      ? "#0288d1"
      : "#f57c00"};
  color: white;
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
    <PageWrapper>
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
              <StatusBadge status={report.status || "Pending"}>
                {report.status || "Pending"}
              </StatusBadge>
              <Description>{report.description}</Description>
              {report.imageUrl && <ImagePreview src={report.imageUrl} alt="Incident" />}
              {report.location && (
                <MapContainer>
                  <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={report.location}
                      zoom={10}
                      options={{ mapTypeControl: false, streetViewControl: false }}
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
    </PageWrapper>
  );
};

export default MyReports;
