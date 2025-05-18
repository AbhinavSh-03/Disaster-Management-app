import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Container = styled.div`
  max-width: 900px;
  margin: 80px auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0077cc;
`;

const CampaignCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const CampaignImage = styled.img`
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const CampaignInfo = styled.div`
  flex-grow: 1;
`;

const CampaignTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #004a99;
`;

const CampaignDescription = styled.p`
  margin: 0 0 0.75rem;
  color: #333;
  font-size: 0.95rem;
`;

const DonateButton = styled.button`
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #005fa3;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #fff;
  color: black;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  font-size: 1rem;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background: #ccc;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  background: #0077cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const DonationCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const q = query(collection(db, "incidents"), where("hasDonationCampaign", "==", true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setCampaigns(data);
            } catch (error) {
                console.error("Error fetching donation campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const handleDonateClick = (campaign) => {
        setSelectedCampaign(campaign);
    };

    const handlePayment = () => {
        const amount = parseFloat(donationAmount);
        if (!amount || amount < 1) {
            alert("Please enter a valid amount (minimum ₹1)");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            name: selectedCampaign.title,
            description: selectedCampaign.description || "Donation Campaign",
            image: selectedCampaign.imageUrl || undefined,
            handler: async function (response) {
                try {
                    await addDoc(collection(db, "donations"), {
                        campaignId: selectedCampaign.id,
                        campaignTitle: selectedCampaign.title,
                        amount: amount,
                        paymentId: response.razorpay_payment_id,
                        timestamp: serverTimestamp(),
                    });
                    alert("Donation successful and recorded! Payment ID: " + response.razorpay_payment_id);
                } catch (error) {
                    console.error("Error saving donation:", error);
                    alert("Donation successful, but failed to record in database.");
                }
            },
            prefill: {
                name: "Donor",
                email: "donor@example.com",
                contact: "",
            },
            theme: {
                color: "#0077cc",
            },
            method: {
                netbanking: true,
                card: true,
                upi: true,
                wallet: true,
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        setSelectedCampaign(null);
        setDonationAmount("");
    };

    if (loading) return <Container>Loading donation campaigns...</Container>;

    if (campaigns.length === 0)
        return <Container>No active donation campaigns available.</Container>;

    return (
        <Container>
            <Title>Active Donation Campaigns</Title>
            {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id}>
                    <CampaignImage
                        src={campaign.imageUrl || "https://via.placeholder.com/150x100?text=No+Image"}
                        alt={campaign.title}
                    />
                    <CampaignInfo>
                        <CampaignTitle>{campaign.title}</CampaignTitle>
                        <CampaignDescription>{campaign.description}</CampaignDescription>
                        <DonateButton onClick={() => handleDonateClick(campaign)}>Donate</DonateButton>
                    </CampaignInfo>
                </CampaignCard>
            ))}

            {selectedCampaign && (
                <ModalOverlay>
                    <ModalBox>
                        <h3>Enter Donation Amount</h3>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            min="1"
                        />
                        <ModalActions>
                            <CancelButton onClick={() => setSelectedCampaign(null)}>Cancel</CancelButton>
                            <ConfirmButton onClick={handlePayment}>Donate</ConfirmButton>
                        </ModalActions>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default DonationCampaigns;
