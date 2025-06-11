# 🌍 Crowd-Sourced Disaster Management System

A responsive web app built with React + Firebase that empowers users to report disasters in real-time. Users can submit incident reports with descriptions, locations, and images—helping authorities and volunteers make timely, informed decisions. Admins can moderate reports, and donation campaigns can be associated with verified incidents.

---

## 🚀 Features

- 📍 **Geolocation-based Reporting**
- 🗺️ **Interactive Google Map with Marker Selection**
- 🖼️ **Optional Image Upload (Firebase Storage)**
- 🔐 **Authentication using Firebase Auth**
- 🗃️ **Firestore Database for Reports & Notifications**
- 🛠️ **Admin Dashboard for Report Moderation**
- 💳 **Donation Integration via Razorpay**
- 🔔 **Real-time Notification System**
- 📱 **Mobile-Responsive UI**
- 🌐 **Deployed using Firebase Hosting**

---

## 🛠️ Tech Stack

| Layer       | Technology                                   |
|-------------|-----------------------------------------------|
| Frontend    | React.js, Vite, Styled-Components             |
| Backend     | Firebase Cloud Functions                      |
| Database    | Firebase Firestore                            |
| Auth        | Firebase Authentication                       |
| Storage     | Firebase Storage                              |
| Maps        | Google Maps JavaScript API                    |
| Payments    | Razorpay API                                  |
| Deployment  | Firebase Hosting                              |
| Version Control | Git & GitHub                              |

---


## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or later recommended)
- Firebase CLI (`npm install -g firebase-tools`)
- Google Maps API key
- Razorpay key (if payment integration is active)

---

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/disaster-management-system.git
cd disaster-management-system

# Add environment variables
touch .env

# Sample .env file:
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Run the app in development
npm run dev

# Install dependencies
npm install


