import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [pincode, setPincode] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [pincodeDetails, setPincodeDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isEmailOTPVisible, setIsEmailOTPVisible] = useState(false);
  const [isPhoneOTPVisible, setIsPhoneOTPVisible] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const isEmailValid = (email) => {
    // Simple email validation regex (checks for basic format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isPhoneValid = (phone) => {
    // Simple phone number validation regex (checks for basic format with optional country code)
    const phoneRegex = /^\+?\d{1,}$/;
    return phoneRegex.test(phone);
  };

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
    setPincodeDetails(null); // Reset pincode details when pincode changes
  };

  const handlePincodeLookup = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;

      // Check if the API response indicates success
      if (data[0].Status === 'Success') {
        const pincodeData = data[0].PostOffice[0];
        // Update pincodeDetails with retrieved data
        setPincodeDetails({
          city: pincodeData.Block,
          district: pincodeData.District,
          state: pincodeData.State,
          postal: pincodeData.Pincode,
        });
        setError(null); // Reset error state
      } else {
        setError('Pincode not found'); // Set error message for invalid pincode
        setPincodeDetails(null);
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
      setError('An error occurred. Please try again later.'); // Set error message for network error
      setPincodeDetails(null);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!isEmailValid(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      // Send a request to your backend to send an email with OTP
      await axios.post('http://localhost:3001/sendEmailOTP', { email });
      alert('OTP sent to your email address. Please check your inbox.');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
    setIsEmailOTPVisible(true);
  };

  const handleSendPhoneOTP = async () => {
    if (!isPhoneValid(phoneNumber)) {
      setError('Invalid phone number format');
      return;
    }

    try {
      // Send a request to your backend to send an SMS with OTP
      await axios.post('http://localhost:3001/sendPhoneOTP', { phoneNumber });
      alert('OTP sent to your phone number.');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
    setIsPhoneOTPVisible(true);
  };

  const handleEmailVerification = async () => {
    try {
      // Send a request to your backend to verify the OTP
      const response = await axios.post('http://localhost:3001/verifyEmailOTP', { email, emailOTP });

      if (response.data.verified) {
        setIsOTPVerified(true);
        alert('Email OTP verified!');
      } else {
        alert('Invalid Email OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying Email OTP:', error);
    }
  };

  const handlePhoneVerification = async () => {
    try {
      // Send a request to your backend to verify the OTP
      const response = await axios.post('http://localhost:3001/verifyPhoneOTP', { phoneNumber, phoneOTP });

      if (response.data.verified) {
        setIsOTPVerified(true);
        alert('Phone OTP verified!');
      } else {
        alert('Invalid Phone OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying Phone OTP:', error);
    }
  };

  const handleSubmit = () => {
    // Check if all fields are filled and OTPs are verified
    if (name && email && phoneNumber && dob && isOTPVerified) {
      alert(`Welcome, ${name}`);
    } else {
      alert('Please fill in all fields and verify OTPs.');
    }
  };
  

  return (
    <div className="App">
      <h1>User Registration</h1>
      <div className="registration-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isEmailOTPVisible ? (
          <>
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={emailOTP}
              onChange={(e) => setEmailOTP(e.target.value)}
            />
            <button onClick={handleEmailVerification}>Verify Email OTP</button>
          </>
        ) : (
          <button onClick={handleSendEmailOTP}>Send Email OTP</button>
        )}
        <input
          type="tel"
          placeholder="Phone"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
        />
        {isPhoneOTPVisible ? (
          <>
            <input
              type="text"
              placeholder="Enter Phone OTP"
              value={phoneOTP}
              onChange={(e) => setPhoneOTP(e.target.value)}
            />
            <button onClick={handlePhoneVerification}>Verify Phone OTP</button>
          </>
        ) : (
          <button onClick={handleSendPhoneOTP}>Send Phone OTP</button>
        )}
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={handlePincodeChange}
        />
        <button onClick={handlePincodeLookup}>Lookup</button>
        {error && <p className="error">{error}</p>}
        {pincodeDetails && !error && (
          <div>
            <p>City: {pincodeDetails.city}</p>
            <p>District: {pincodeDetails.district}</p>
            <p>State: {pincodeDetails.state}</p>
            <p>Postal Code: {pincodeDetails.postal}</p>
          </div>
        )}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default App;
