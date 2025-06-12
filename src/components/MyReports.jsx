import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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
  border: 2px solid rgba(4, 71, 68, 0.075);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  padding: 1.25rem 1.5rem;
  padding-top: 2.5rem; // Add extra top padding to avoid overlap
  margin-bottom: 2rem;
  position: relative;
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

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f44336;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
`;

// MapWrapper component WITHOUT LoadScript
const MapWrapper = ({ location }) => {
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setTimeout(() => {
      window.google.maps.event.trigger(map, "resize");
    }, 250);
  };

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={location}
        zoom={10}
        onLoad={handleMapLoad}
        options={{ mapTypeControl: false, streetViewControl: false, gestureHandling: "greedy" }}
      >
        <MarkerF position={location} />
      </GoogleMap>
    </MapContainer>
  );
};

const MyReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(collection(db, "incidents"), where("userId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (reportId) => {
    const confirm = window.confirm("Are you sure you want to delete this report?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "incidents", reportId));
      toast.success("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  return (
    <PageWrapper>
      <Toaster position="top-right" />
      <Container>
        <Title>My Reports</Title>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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
                {report.location && <MapWrapper location={report.location} />}
                <DeleteButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(report.id)}
                >
                  Delete
                </DeleteButton>
              </ReportCard>
            ))
          )}
        </LoadScript>
      </Container>
    </PageWrapper>
  );
};

export default MyReports;
