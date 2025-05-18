import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

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
  background: #fff;
`;

const ReportTitle = styled.h3`
  color: #0077cc;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #333;
`;

const StatusSelect = styled.select`
  margin-top: 0.5rem;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #aaa;
`;

const DonationButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #005fa3;
  }
`;

const DonationActiveLabel = styled.p`
  margin-top: 10px;
  color: #2e7d32;
  font-weight: 600;
`;

const AdminReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);

  // Simple admin check (replace with more secure logic as needed)
  const isAdmin = currentUser?.email === "sab027957@gmail.com";

  useEffect(() => {
    const fetchReports = async () => {
      const snapshot = await getDocs(collection(db, "incidents"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    };
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "incidents", id), { status });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const enableDonationCampaign = async (incidentId) => {
    try {
      // Update incident to mark donation campaign enabled
      await updateDoc(doc(db, "incidents", incidentId), {
        hasDonationCampaign: true,
      });

      // Create a new donation campaign document
      await addDoc(collection(db, "donations"), {
        incidentId,
        goalAmount: 10000, // default goal amount; can be updated later via UI
        collectedAmount: 0,
        createdAt: new Date(),
        createdBy: currentUser.uid,
      });

      // Update local state to reflect change
      setReports((prev) =>
        prev.map((r) =>
          r.id === incidentId ? { ...r, hasDonationCampaign: true } : r
        )
      );
    } catch (error) {
      console.error("Error enabling donation campaign:", error);
    }
  };

  if (!isAdmin)
    return (
      <Container>
        <p>Access denied. Admins only.</p>
      </Container>
    );

  return (
    <Container>
      <Title>Admin Reports</Title>
      {reports.map((report) => (
        <ReportCard key={report.id}>
          <ReportTitle>{report.title}</ReportTitle>
          <Description>{report.description}</Description>

          <StatusSelect
            value={report.status || "Pending"}
            onChange={(e) => updateStatus(report.id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </StatusSelect>

          {!report.hasDonationCampaign ? (
            <DonationButton
              onClick={() => enableDonationCampaign(report.id)}
            >
              Enable Donation Campaign
            </DonationButton>
          ) : (
            <DonationActiveLabel>Donation Campaign Active</DonationActiveLabel>
          )}
        </ReportCard>
      ))}
    </Container>
  );
};

export default AdminReports;
