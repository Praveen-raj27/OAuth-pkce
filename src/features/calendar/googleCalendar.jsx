import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/axiosClient";
import { addNotification } from "../../features/notifications/notificationSlice";

export default function GoogleCalendar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stores event IDs from the previous successful fetch
  const previousEventIds = useRef(null);

  const getAccessToken = () => {
    return sessionStorage.getItem("access_token");
  };

  // Initial fetch
  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCalendarEvents(false);
  }, []);

  const fetchCalendarEvents = async (isRefresh = false) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 20,
      };

      const response = await api.get("/events", { params });

      const newEvents = response.data.items || [];

      const currentEventIds = new Set(
        newEvents.map((event) => event.id)
      );

      // ------------------------------------
      // First successful fetch
      // ------------------------------------
      if (previousEventIds.current === null) {
        previousEventIds.current = currentEventIds;
        setEvents(newEvents);
        return;
      }

      const previousIds = previousEventIds.current;

      // ------------------------------------
      // Detect added events
      // ------------------------------------
      const addedEvents = newEvents.filter(
        (event) => !previousIds.has(event.id)
      );

      // ------------------------------------
      // Detect deleted events
      // ------------------------------------
      const deletedEventIds = [...previousIds].filter(
        (id) => !currentEventIds.has(id)
      );

      // ------------------------------------
      // New event
      // ------------------------------------
      if (addedEvents.length > 0) {
        dispatch(
          addNotification({
            type: "success",
            message:
              addedEvents.length === 1
                ? "New event added!"
                : `${addedEvents.length} new events added!`,
            duration: 3000,
            dedupeKey: "event-added",
          })
        );
      }

      // ------------------------------------
      // Deleted event
      // ------------------------------------
      if (deletedEventIds.length > 0) {
        dispatch(
          addNotification({
            type: "warning",
            message:
              deletedEventIds.length === 1
                ? "Event deleted!"
                : `${deletedEventIds.length} events deleted!`,
            duration: 3000,
            dedupeKey: "event-deleted",
          })
        );
      }

      // ------------------------------------
      // Refresh but nothing changed
      // ------------------------------------
      if (
        isRefresh &&
        addedEvents.length === 0 &&
        deletedEventIds.length === 0
      ) {
        dispatch(
          addNotification({
            type: "info",
            message: "No new events added!",
            duration: 3000,
            dedupeKey: "no-new-event",
          })
        );
      }

      // Update previous IDs
      previousEventIds.current = currentEventIds;

      setEvents(newEvents);
    } catch (err) {
      console.error("Failed to fetch calendar events", err);
      setError("Failed to load calendar events.");
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

      <button
        onClick={() => fetchCalendarEvents(true)}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Calendar"}
      </button>

      <h3>Upcoming Events</h3>

      {loading && <p>Loading events...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

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
            <h4>
              {event.summary || "Untitled event"}
            </h4>

            <p>{formatEventDate(event)}</p>

            {event.location && (
              <p>📍 {event.location}</p>
            )}

            {event.description && (
              <p>{event.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
