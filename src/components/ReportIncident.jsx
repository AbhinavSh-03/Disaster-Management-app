import React, { useState } from "react";
import styled from "styled-components";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { db, storage } from "../firebaseConfig"; // Adjust path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Container = styled.div`
  max-width: 800px;
  margin: 100px auto 40px;
  padding: 2rem;
  background: #6a6767;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #00aaff;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const SubmitButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #005fa3;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1rem;
`;

const ImagePreview = styled.img`
  margin-top: 10px;
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
`;

const RemoveImageBtn = styled.button`
  margin-top: 10px;
  background-color: #e53935;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${(props) => (props.error ? "red" : "green")};
`;

const ReportIncident = () => {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);
    let imageUrl = "";

    try {
      if (image) {
        const imageRef = ref(storage, `incidentImages/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "incidents"), {
        title,
        description,
        location,
        imageUrl,
        timestamp: serverTimestamp(),
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
    <Container>
      <Title>Report a Disaster Incident</Title>
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
            <RemoveImageBtn onClick={() => setImage(null)}>Remove Image</RemoveImageBtn>
          </>
        )}

        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </SubmitButton>
      </form>
    </Container>
  );
};

export default ReportIncident;
