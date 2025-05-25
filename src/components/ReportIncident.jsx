import React, { useState } from "react";
import styled, {keyframes} from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Styled Components
const floatBlob = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

export const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 4rem 1rem;
  background: linear-gradient(to left, #b2dfdb 0%, #e0f2f1 40%, #ffffff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    z-index: 0;
    animation: ${floatBlob} 12s ease-in-out infinite;
  }

  &::before {
    width: 320px;
    height: 320px;
    background: #81d4fa;
    top: -80px;
    left: -120px;
  }

  &::after {
    width: 280px;
    height: 280px;
    background: #ffe082;
    bottom: -100px;
    right: -100px;
    animation-delay: 3s;
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  background: #fdfdfd;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0077cc;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  font-size: 1rem;

  &:focus {
    border-color: #0077cc;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  background: #fff;
  color: #333;
  font-size: 1rem;

  &:focus {
    border-color: #0077cc;
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #005fa3;
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
`;

export const ImagePreview = styled.img`
  margin-top: 10px;
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
`;

export const RemoveImageBtn = styled.button`
  margin-top: 10px;
  background-color: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Message = styled.p`
  margin-top: 1rem;
  font-weight: 500;
  color: ${(props) => (props.error ? "#e53935" : "#2e7d32")};
`;

const ReportIncident = () => {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const storage = getStorage();

  const handleMapClick = (e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !description) {
      setMessage("Please fill out all required fields.");
      return;
    }

    if (!currentUser) {
      setMessage("You must be logged in to report an incident.");
      return;
    }

    setSubmitting(true);
    let imageUrl = "";

    try {
      if (image) {
        const imageRef = ref(storage, `incidentImages/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "incidents"), {
        title,
        description,
        location,
        imageUrl,
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        status: "Pending",
        hasDonationCampaign: false, // New field to track donation eligibility
      });

      // Add notification
      await addDoc(collection(db, "notifications"), {
        title: "New Incident Reported",
        message: `User ${currentUser.email} reported: ${title}`,
        read: false,
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        incidentTitle: title,
      });

      setMessage("Incident reported successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      setLocation({ lat: 28.6139, lng: 77.209 });
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("Error submitting report. Please try again.");
    }

    setSubmitting(false);
  };

  return (
  <PageWrapper>
    
    <Container>
    <Title><AlertCircle size={24} /> Report an Incident</Title>
      {message && <Message error={message.includes("Error")}>{message}</Message>}

      <form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short title (e.g. Flood in Delhi)"
          required
        />

        <Label>Description</Label>
        <TextArea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident in detail"
          required
        />

        <Label>Location (Click on the map to select)</Label>
        <MapContainer>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={location}
              zoom={10}
              onClick={handleMapClick}
            >
              <MarkerF position={location} />
            </GoogleMap>
          </LoadScript>
        </MapContainer>

        <Label>Upload an image (optional)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {image && (
          <>
            <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />
            <RemoveImageBtn type="button" onClick={() => setImage(null)}>
              Remove Image
            </RemoveImageBtn>
          </>
        )}

        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </SubmitButton>
      </form>
    </Container>
  </PageWrapper>    
  );
};

export default ReportIncident;
