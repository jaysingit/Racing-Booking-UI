import { useState, useEffect } from "react";

type Session = {
  id: number;
  trackName: string;
  startTime: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
};

const apiBaseUrl = "http://localhost:5129/api";
export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSessions() {
    const response = await fetch(`${apiBaseUrl}/sessions`);

    if (!response.ok) setError("Failed to load sessions");

    const data = await response.json();
    setSessions(data);
    setCustomerEmail("");
    setCustomerName("");
  }

  async function bookSession(sessionId: number) {
    setError("");
    setMessage("");

    if (!customerName.trim()) {
      setError("Enter Name");
      return;
    }

    if (!customerEmail.trim()) {
      setError("Enter Email");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RacingSessionID: sessionId,
          customerEmail,
          customerName,
        }),
      });

      if (!response.ok) {
        const errortext = await response.text();
        setError(errortext);
        return;
      }

      setMessage("Booking Created Succefully");
      loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking Failed");
    }
  }

  useEffect(() => {
    loadSessions().catch((err) =>
      setError(err instanceof Error ? err.message : "Could not load sessions"),
    );
  }, []);

  return (
    <main style={{ padding: "24px", backgroundColor: "#f0f0f0" }}>
      <h1>Race Sessions</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          style={{ marginRight: "20px" }}
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        ></input>

        <input
          style={{ marginRight: "20px" }}
          type="text"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        ></input>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {sessions.map((session) => (
        <div
          key={session.id}
          style={{
            padding: "12px",
            marginBottom: "12px",
            border: "1px solid #ccc",
          }}
        >
          <h2>{session.trackName}</h2>
          <p>Start Time : {new Date(session.startTime).toDateString()}</p>
          <p>
            Seats:{session.availableSeats} / {session.capacity} available
          </p>
          <button
            disabled={session.availableSeats <= 0}
            onClick={() => bookSession(session.id)}
          >
            Book
          </button>
        </div>
      ))}
    </main>
  );
}
