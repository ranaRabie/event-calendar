import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { Filters } from './Filters'

const eventsDummy = [
    {
        "v_corporate_actions_materialized.action_date": "2024-08-28",
        "v_corporate_actions_materialized.action_type": "Free template",
        "v_corporate_actions_materialized.company_full_name": "A L1",
        "v_corporate_actions_materialized.industry": "Materials",
        "v_corporate_actions_materialized.isin": null,
        "v_corporate_actions_materialized.symbol": 1115
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-22",
        "v_corporate_actions_materialized.action_type": "Free template",
        "v_corporate_actions_materialized.company_full_name": "Saudi Fisheries Co.",
        "v_corporate_actions_materialized.industry": "Food and Beverages",
        "v_corporate_actions_materialized.isin": "SA0007879600",
        "v_corporate_actions_materialized.symbol": 6050
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-22",
        "v_corporate_actions_materialized.action_type": "Free template",
        "v_corporate_actions_materialized.company_full_name": "Qassim Cement Co.",
        "v_corporate_actions_materialized.industry": "Materials",
        "v_corporate_actions_materialized.isin": "SA0007879493",
        "v_corporate_actions_materialized.symbol": 3040
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-22",
        "v_corporate_actions_materialized.action_type": "Free template",
        "v_corporate_actions_materialized.company_full_name": "Alwasail Industrial Co.",
        "v_corporate_actions_materialized.industry": "Capital Goods",
        "v_corporate_actions_materialized.isin": "SA15GG9KKQH9",
        "v_corporate_actions_materialized.symbol": 9525
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-22",
        "v_corporate_actions_materialized.action_type": "Free template",
        "v_corporate_actions_materialized.company_full_name": "Lazurde Company for Jewelry",
        "v_corporate_actions_materialized.industry": "Consumer Durables and Apparel",
        "v_corporate_actions_materialized.isin": "SA1430IHULH1",
        "v_corporate_actions_materialized.symbol": 4011
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-18",
        "v_corporate_actions_materialized.action_type": "Bonus Shares",
        "v_corporate_actions_materialized.company_full_name": "Balady Poultry Trading Co.",
        "v_corporate_actions_materialized.industry": "Food and Beverages",
        "v_corporate_actions_materialized.isin": "SA15OHDKLBH0",
        "v_corporate_actions_materialized.symbol": 9559
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-17",
        "v_corporate_actions_materialized.action_type": "Dividend",
        "v_corporate_actions_materialized.company_full_name": "A L R N1",
        "v_corporate_actions_materialized.industry": "REITs",
        "v_corporate_actions_materialized.isin": null,
        "v_corporate_actions_materialized.symbol": 1118
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-16",
        "v_corporate_actions_materialized.action_type": "Acquisition",
        "v_corporate_actions_materialized.company_full_name": "A L C 1",
        "v_corporate_actions_materialized.industry": "Closed-end Fund",
        "v_corporate_actions_materialized.isin": null,
        "v_corporate_actions_materialized.symbol": 1122
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-15",
        "v_corporate_actions_materialized.action_type": "Announcement of SAMA's Approval for insurance products",
        "v_corporate_actions_materialized.company_full_name": "A L1",
        "v_corporate_actions_materialized.industry": "Materials",
        "v_corporate_actions_materialized.isin": null,
        "v_corporate_actions_materialized.symbol": 1115
    },
    {
        "v_corporate_actions_materialized.action_date": "2024-08-15",
        "v_corporate_actions_materialized.action_type": "Announcement of Results of the Rump Offering and the Allotment of the Right Issues",
        "v_corporate_actions_materialized.company_full_name": "A L1",
        "v_corporate_actions_materialized.industry": "Materials",
        "v_corporate_actions_materialized.isin": null,
        "v_corporate_actions_materialized.symbol": 1115
    }
];

export const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [eventsList, setEventsList] = useState(eventsDummy); // Should use setEventsList when calling API
  const [selectedEvents, setSelectedEvents] = useState(null);

  useEffect(() => { 
    const {firstDateOfMonth, lastDateOfMonth} = getMonthStartEndDate(new Date());
    console.log(firstDateOfMonth);
    console.log(lastDateOfMonth);

    // handleDateChange();
  })

  const handleSelectDate = value => {
    setSelectedEvents(null);
    const filteredEvents = eventsList.filter(event => event['v_corporate_actions_materialized.action_date'] === moment(value).format("YYYY-MM-DD"));

    if (filteredEvents) {
      setSelectedEvents(filteredEvents);
    }
  };

  const handleDateChange = ({activeStartDate}) => {
    const {firstDateOfMonth, lastDateOfMonth} = getMonthStartEndDate(activeStartDate);
    console.log(firstDateOfMonth);
    console.log(lastDateOfMonth);
  };

  const getMonthStartEndDate = (currentDate) => {
    const firstDateOfMonth = (date = new Date()) =>
        new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDateOfMonth = (date = new Date()) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {firstDateOfMonth: firstDateOfMonth(currentDate), lastDateOfMonth: lastDateOfMonth(currentDate)};
  }

  const onFiltersUpdate = (filtersList) => {
    alert('Update');
    console.log(filtersList);
  }


  return (
    <div>
      <h3>Calendar</h3>

      <Filters onFiltersUpdate={onFiltersUpdate} />
      <Calendar
        style={{ height: 500 }}
        onChange={setDate}
        value={date}
        onClickDay={handleSelectDate}
        onActiveStartDateChange={handleDateChange}
        tileClassName={({ date, view }) => {
          if (eventsList.find(event => event['v_corporate_actions_materialized.action_date'] === moment(date).format("YYYY-MM-DD"))) {
            return 'highlight'
          }
        }}
      >
      </Calendar>

      {selectedEvents ? (
        selectedEvents.map((event, idx) => (
          <div className='single-event' key={idx}>
            <h3>{event['v_corporate_actions_materialized.company_full_name']} | <small>{event['v_corporate_actions_materialized.action_date']}</small></h3>
            <p>{event['v_corporate_actions_materialized.industry']}</p>
          </div>
        ))
      ) : ''}
    </div>
  );
};