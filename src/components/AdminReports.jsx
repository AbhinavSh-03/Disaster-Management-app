import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: linear-gradient(to right, #e0f7fa, #b2ebf2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #007c91;
  text-align: center;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-3px);
  }
`;

const ReportTitle = styled.h3`
  color: #007c91;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #444;
  font-size: 0.95rem;
`;

const StatusSelect = styled.select`
  margin-top: 0.7rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #90caf9;
  background-color: #e3f2fd;
  font-weight: 500;
  color: #01579b;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: ${({ danger }) => (danger ? "#ff5252" : "#00acc1")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 10px;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ danger }) => (danger ? "#e53935" : "#00838f")};
  }
`;

const DonationActiveLabel = styled.p`
  margin-top: 10px;
  color: #2e7d32;
  font-weight: bold;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const ConfirmBox = styled.div`
  background: #ffffff;
  color: #333;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const AdminReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const adminEmails = ["sab027957@gmail.com", "amardeeprana2905@gmail.com"];
  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

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
      toast.error("Failed to update status");
    }
  };

  const enableDonationCampaign = async (incidentId) => {
    try {
      await updateDoc(doc(db, "incidents", incidentId), {
        hasDonationCampaign: true,
      });
      await addDoc(collection(db, "donations"), {
        incidentId,
        goalAmount: 10000,
        collectedAmount: 0,
        createdAt: new Date(),
        createdBy: currentUser.uid,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.id === incidentId ? { ...r, hasDonationCampaign: true } : r
        )
      );
    } catch (error) {
      toast.error("Failed to enable campaign");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "incidents", id));
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
      setConfirmDeleteId(null);
    } catch (error) {
      toast.error("Error deleting report");
    }
  };

  if (!isAdmin) {
    return (
      <Container>
        <p style={{ color: "#ff1744", textAlign: "center", fontWeight: "bold" }}>
          🚫 Access denied. Admins only.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🔧 Admin Incident Reports</Title>
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
            <Button onClick={() => enableDonationCampaign(report.id)}>
              ➕ Enable Donation Campaign
            </Button>
          ) : (
            <DonationActiveLabel>✅ Donation Campaign Active</DonationActiveLabel>
          )}

          <Button danger onClick={() => setConfirmDeleteId(report.id)}>
            🗑️ Delete Report
          </Button>
        </ReportCard>
      ))}

      {confirmDeleteId && (
        <ConfirmOverlay>
          <ConfirmBox>
            <p>Are you sure you want to delete this report?</p>
            <div style={{ marginTop: "1rem" }}>
              <Button onClick={() => handleDelete(confirmDeleteId)} danger>
                Yes, Delete
              </Button>
              <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
            </div>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Container>
  );
};

export default AdminReports;
