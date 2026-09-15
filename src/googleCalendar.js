import { useEffect, useState } from "react";
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

  const fetchCalendarEvents = async (token) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        timeMin: new Date().toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "20",
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        // Access token expired/invalid -> back to login to re-authenticate
        sessionStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch Google Calendar events");
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err) {
      setError(err.message);
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