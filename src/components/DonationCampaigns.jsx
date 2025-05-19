import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DonImage from "../assets/donat.jpg";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Container = styled.div`
  max-width: 1920px;
  margin: 0;
  padding: 80px 24px;
  min-height: 100vh;
  background-color: #f8fafc;

  background-image: 
    radial-gradient(
      circle at top right,
      rgba(48, 255, 245, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(32, 178, 170, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    );

  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-position: top right, bottom left;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #005fa3;
  text-align: center;
`;

// New grid container for cards
const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  // 3 columns on desktop
  gap: 2rem;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;  // 1 column on mobile/tablet
  }
`;

const CampaignCard = styled.div`
  background-color: #f8fafc;

  background-image: 
    radial-gradient(
      circle at top right,
      rgba(48, 255, 245, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(32, 178, 170, 0.25) 0%,
      rgba(32, 178, 170, 0.15) 20%,
      rgba(32, 178, 170, 0.05) 40%,
      transparent 60%
    );

  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-position: top right, bottom left;
  width: 100%;
  border: 2px solid rgba(4, 71, 68, 0.05);
  max-width: 500px;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CampaignImage = styled.img`
  width: 250px;
  height: 150px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 1rem;
`;

const CampaignInfo = styled.div`
  width: 100%;
`;

const CampaignTitle = styled.h3`
  margin: 0 0 0.75rem;
  color: #004a99;
  font-size: 1.6rem;
`;

const CampaignDescription = styled.p`
  margin: 0 0 1.25rem;
  color: #444;
  font-size: 1.05rem;
  line-height: 1.6;
`;

const DonateButton = styled.button`
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
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

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
        justifyItems: "center",
      }}
    >
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id}>
          <CampaignImage
            src={campaign.imageUrl ? campaign.imageUrl : DonImage}
            alt={campaign.title}
          />
          <CampaignInfo>
            <CampaignTitle>{campaign.title}</CampaignTitle>
            <CampaignDescription>{campaign.description}</CampaignDescription>
            <DonateButton onClick={() => handleDonateClick(campaign)}>
              Donate
            </DonateButton>
          </CampaignInfo>
        </CampaignCard>
      ))}
    </div>

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
            <CancelButton onClick={() => setSelectedCampaign(null)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handlePayment}>Donate</ConfirmButton>
          </ModalActions>
        </ModalBox>
      </ModalOverlay>
    )}
  </Container>
);

};

export default DonationCampaigns;
