import React from 'react';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './index.css';
import { CustomCalendar } from './Components/Calendar';

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
