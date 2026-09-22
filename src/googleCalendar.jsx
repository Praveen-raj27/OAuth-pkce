import { useEffect, useState } from "react";
import api from './axiosClient'
import { useNavigate } from "react-router-dom";

export default function GoogleCalendar() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAccessToken = () => sessionStorage.getItem("access_token");

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      // No session -> send them back to log in
      navigate("/login");
      return;
    }

    fetchCalendarEvents(token);
  }, []);

const fetchCalendarEvents = async () => {
  try {
    setLoading(true);
    setError("");

    const params = {
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 20,
    };

    const response = await api.get(
      "/events",
      { params }
    );

    setEvents(response.data.items || []);
  } catch (err) {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("access_token");
      navigate("/login");
      return;
    }

    setError(
      err.response?.data?.error?.message ||
      err.message ||
      "Failed to fetch Google Calendar events"
    );
  } finally {
    setLoading(false);
  }
};

  const formatEventDate = (event) => {
    const date = event.start?.dateTime || event.start?.date;
    if (!date) return "";
    return new Date(date).toUTCString();
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Google Calendar</h2>

      <button onClick={() => fetchCalendarEvents(getAccessToken())}>
        Refresh Calendar
      </button>

      <h3>Upcoming Events</h3>

      {loading && <p>Loading events...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && events.length === 0 && (
        <p>No upcoming events found.</p>
      )}

      <div>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h4>{event.summary || "Untitled event"}</h4>
            <p>{formatEventDate(event)}</p>
            {event.location && <p>📍 {event.location}</p>}
            {event.description && <p>{event.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}