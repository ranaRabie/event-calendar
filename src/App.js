import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './index.css';
import moment from 'moment';
import { ExtensionProvider40 } from '@looker/extension-sdk-react';

const eventsDummy = [
  {
    title: 'Meeting with Team',
    date: '04-09-2024',
    description: 'Discuss project milestones and deliverables.'
  },
  {
    title: 'Meeting with Team 2',
    date: '04-09-2024',
    description: 'Discuss project milestones and deliverables.'
  },
  {
    title: 'Product Launch',
    date: '05-09-2024',
    description: 'Launch the new product line.'
  },
];

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [eventsList, setEventsList] = useState(eventsDummy); // Should use setEventsList when calling API
  const [selectedEvents, setSelectedEvents] = useState(null);

  const handleSelectDate = value => {
    setSelectedEvents(null);
    const filteredEvents = eventsList.filter(event => event.date === moment(value).format("DD-MM-YYYY"));

    if (filteredEvents) {
      setSelectedEvents(filteredEvents);
    }
  };

  return (
    <div>
      <h3>Calendar</h3>

      <Calendar
        style={{ height: 500 }}
        onChange={setDate}
        value={date}
        onClickDay={handleSelectDate}
        tileClassName={({ date, view }) => {
          if (eventsList.find(event => event.date === moment(date).format("DD-MM-YYYY"))) {
            return 'highlight'
          }
        }}
      >
      </Calendar>

      {selectedEvents ? (
        selectedEvents.map((event, idx) => (
          <div className='single-event' key={idx}>
            <h3>{event.title} | <small>{event.date}</small></h3>
            <p>{event.description}</p>
          </div>
        ))
      ) : ''}
    </div>
  );
};



// import React from 'react';
// import { useState } from 'react';
// import { Calendar, ComponentsProvider, Box, Text } from '@looker/components';

// // Sample event data
// const events = [
//   {
//     title: 'Meeting with Team',
//     date: '2024-09-12',
//     description: 'Discuss project milestones and deliverables.'
//   },
//   {
//     title: 'Product Launch',
//     date: '2024-09-20',
//     description: 'Launch the new product line.'
//   },
// ];

// const MyEventCalendar2 = ({
//   onSelectDate,
//   selectedDate,
//   viewMonth: viewMonthProp = new Date(),
//   ...args
// }) =>  {
//   const [date, setDate] = useState(selectedDate)
//   const handleSelect = (newDate) => {
//     onSelectDate?.(newDate)
//     alert('select');
//     setDate(newDate)
//   }
//   const [viewMonth, setViewMonth] = useState(viewMonthProp)
//   return (
//     <ComponentsProvider>
//       <Calendar
//         {...args}
//         onSelectDate={handleSelect}
//         selectedDate={date}
//         viewMonth={viewMonth}
//         onMonthChange={setViewMonth}
//       />
//     </ComponentsProvider>
//   )
// }

// const MyEventCalendar = () => {
//   return (
//     <Box p="large">
//       <Text fontSize="large" mb="medium">Upcoming Events</Text>
//       <ComponentsProvider>
//         <Calendar
//           events={events.map(event => ({
//             ...event,
//             date: new Date(event.date),
//           }))}
//           renderEvent={(event) => (
//             <Box p="small" border="1px solid" borderColor="grey">
//               <Text fontWeight="bold">{event.title}</Text>
//               <Text>{event.description}</Text>
//             </Box>
//           )}
//         />
//       </ComponentsProvider>
//     </Box>
//   );
// };

function App() {
  return (
    <div className="App">
      {/* <ExtensionProvider40 chattyTimeout={-1}> */}
        <CustomCalendar />
      {/* </ExtensionProvider40> */}
    </div>
  );
}

export default App;
