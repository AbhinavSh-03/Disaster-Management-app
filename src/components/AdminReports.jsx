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
  position: relative;
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

const Button = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background-color: ${({ danger }) => (danger ? "#e53935" : "#0077cc")};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 10px;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ danger }) => (danger ? "#c62828" : "#005fa3")};
  }
`;

const DonationActiveLabel = styled.p`
  margin-top: 10px;
  color: #2e7d32;
  font-weight: 600;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmBox = styled.div`
  background: white;
  color: black;
  padding: 1.5rem;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
`;

const AdminReports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
        <p>Access denied. Admins only.</p>
      </Container>
    );
  }

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
            <Button onClick={() => enableDonationCampaign(report.id)}>
              Enable Donation Campaign
            </Button>
          ) : (
            <DonationActiveLabel>Donation Campaign Active</DonationActiveLabel>
          )}

          <Button danger onClick={() => setConfirmDeleteId(report.id)}>
            Delete Report
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
