// Importing necessary modules
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addMonths from "date-fns/addMonths";
import "../styles/event.css";

const EventForm = () => {
  // State for the form inputs and the events
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [recurringDays, setRecurringDays] = useState([]);
  const [events, setEvents] = useState([]);

  // Loading events from local storage when the component mounts
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const convertedEvents = parsedEvents.map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
      setEvents(convertedEvents);
    }
  }, []);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvents = [
      ...events,
      { eventName, startDate, endDate, recurringDays },
    ];
    setEvents(newEvents);
    localStorage.setItem("events", JSON.stringify(newEvents));
    setEventName("");
    setRecurringDays([]);
  };

  // Days of the week for the checkboxes
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Handler for checkbox change
  const handleRecurringDaysChange = (e) => {
    const day = e.target.value;
    if (e.target.checked) {
      setRecurringDays([...recurringDays, day]);
    } else {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    }
  };

  // Handler for clearing local storage
  const handleClearLocalStorage = () => {
    localStorage.clear();
    setEvents([]); // Clear the events state as well
  };

  // The JSX returned by the component
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Event Name"
          required
        />
        {/* Date pickers for start and end dates */}
        FROM - {""}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/dd/yyyy"
          minDate={new Date()}
          maxDate={addMonths(new Date(), 5)} // Updated maxDate
        />{" "}
        <br />
        TO - {""}
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="MM/dd/yyyy"
          minDate={startDate}
          maxDate={addMonths(new Date(), 5)} // Updated maxDate
        />
        <div>
          {/* Checkboxes for recurring days */}
          {daysOfWeek.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={recurringDays.includes(day)}
                onChange={handleRecurringDaysChange}
              />
              {day}
            </label>
          ))}
        </div>
        <button type="submit">Add Event</button>
      </form>
      <div>
        {/* List of events */}
        {events.map((event, index) => (
          <div key={index} className="event-box">
            <h3>{event.eventName}</h3>
            <p>
              Start Date: {event.startDate.toLocaleDateString()}
              <br />
              End Date: {event.endDate.toLocaleDateString()}
              <br />
              Recurring Days: {event.recurringDays.join(", ")}
            </p>
          </div>
        ))}
      </div>{" "}
      <br /> <br />
      <button onClick={handleClearLocalStorage}>Clear Local Storage</button>
    </div>
  );
};

export default EventForm;
