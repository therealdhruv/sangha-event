import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addDays from 'date-fns/addDays';
import '../styles/event.css';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [recurringDays, setRecurringDays] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const convertedEvents = parsedEvents.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      setEvents(convertedEvents);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvents = [...events, { eventName, startDate, endDate, recurringDays }];
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
    setEventName('');
    setRecurringDays([]);
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleRecurringDaysChange = (e) => {
    const day = e.target.value;
    if (e.target.checked) {
      setRecurringDays([...recurringDays, day]);
    } else {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    }
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    setEvents([]); // Clear the events state as well
  };

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
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/dd/yyyy"
          minDate={new Date()}
          maxDate={addDays(new Date(), 7)}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="MM/dd/yyyy"
          minDate={startDate}
          maxDate={addDays(new Date(), 7)}
        />
        <div>
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
        {events.map((event, index) => (
          <div key={index} className="event-box">
            <h3>{event.eventName}</h3>
            <p>
              Start Date: {event.startDate.toLocaleDateString()}
              <br />
              End Date: {event.endDate.toLocaleDateString()}
              <br />
              Recurring Days: {event.recurringDays.join(', ')}
            </p>
          </div>
        ))}
      </div>
      <button onClick={handleClearLocalStorage}>Clear Local Storage</button>
    </div>
  );
};

export default EventForm;
