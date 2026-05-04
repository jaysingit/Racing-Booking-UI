import { useEffect, useState } from "react";

type Session = {
  id: number;
  trackName: string;
  startTime: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
};

const apiBaseUrl = "http://localhost:5129";

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSessions() {
    const response = await fetch(`${apiBaseUrl}/api/sessions`);

    if (!response.ok) {
      throw new Error("Failed to load sessions");
    }

    const data = await response.json();
    setSessions(data);
    setCustomerName("");
    setCustomerEmail("");
  }

  async function bookSession(sessionId: number) {
    setError("");
    setMessage("");

    
    if(!customerName.trim()) {
      setError("Please enter name");
      return;
    }
    else if(!customerEmail.trim()) {
      setError("Please enter email");
      return;
    }    

    if (!customerName.trim() && !customerEmail.trim()) {
      setError("Please enter both name and email");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          RacingSessionID: sessionId,
          customerName,
          customerEmail
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setMessage("Booking created successfully.");
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    }
  }

  useEffect(() => {
    loadSessions().catch(err =>
      setError(err instanceof Error ? err.message : "Could not load sessions")
    );
  }, []);

  return (
    <>
    <main style={{ backgroundColor: "#f0f0f0", padding: "24px", fontFamily: "Arial" }}>
      <h1>Race Sessions</h1>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Customer name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />

        <input
          placeholder="Customer email"
          value={customerEmail}
          onChange={e => setCustomerEmail(e.target.value)}
          style={{ marginLeft: "8px" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {sessions.map(session => (
        <div
          key={session.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px"
          }}
        >
          <h2>{session.trackName}</h2>
          <p>Start: {new Date(session.startTime).toLocaleString()}</p>
          <p>
            Seats: {session.availableSeats} / {session.capacity} available
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
    </>
  );
}

export default App;