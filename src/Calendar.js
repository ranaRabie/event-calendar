import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { ExtensionContext } from '@looker/extension-sdk-react';
import { Filters } from './Filters';
import eventsDummy from './data.json'; 

export const CustomCalendar = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const [date, setDate] = useState(new Date());
    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [eventsFilterList, setEventsFilterList] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [filterData, setFilterData] = useState(null);

    useEffect(() => {
        const { firstDateOfMonth, lastDateOfMonth } = getMonthStartEndDate(new Date());

        fetchData(firstDateOfMonth, lastDateOfMonth);
    }, []);

    const fetchData = async (startDate, endDate) => {
        setSelectedEvents(null);
        // RUN INLINE QUERY
        // select action_date, action_type, company_full_name, industry, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_corporate_actions_materialized` limit 1000
        // const response = await sdk.ok(
        //     sdk.run_inline_query({
        //         result_format: 'json',
        //         limit: null,
        //         body: {
        //             model: 'client_stg_test_data',
        //             view: 'v_corporate_actions_materialized',
        //             fields: [
        //                 'v_corporate_actions_materialized.action_date',
        //                 'v_corporate_actions_materialized.action_type',
        //                 'v_corporate_actions_materialized.company_full_name',
        //                 'v_corporate_actions_materialized.industry',
        //                 'v_corporate_actions_materialized.isin',
        //                 'v_corporate_actions_materialized.symbol',
        //                 'v_corporate_actions_materialized.Count',
        //                 'v_corporate_actions_materialized.action_description'],

        //             filters: {
        //                 "v_corporate_actions_materialized.action_date": `${moment(startDate).format("YYYY/MM/DD")} to ${moment(endDate).format("YYYY/MM/DD")}`
        //             },
        //             filter_expression: null,
        //             total: false,
        //         }
        //     })
        // );

        setEventsList(eventsDummy);
        
        if (eventsDummy) {
            setEventsFilterList(eventsDummy); // Set it when set eventsList

            const filterDataArr = {
                companyName: [...new Set(eventsDummy.map(event => event['v_corporate_actions_materialized.company_full_name']))],
                symbol: [...new Set(eventsDummy.map(event => event['v_corporate_actions_materialized.symbol']))],
                industry: [...new Set(eventsDummy.map(event => event['v_corporate_actions_materialized.industry']))],
                actionType: [...new Set(eventsDummy.map(event => event['v_corporate_actions_materialized.action_type']))]
            }
    
            setFilterData(filterDataArr);
        }
    }

    const handleSelectDate = value => {
        setSelectedEvents(null);
        const filteredEvents = eventsFilterList.filter(event => event['v_corporate_actions_materialized.action_date'] === moment(value).format("YYYY-MM-DD"));

        if (filteredEvents.length > 0) {
            setSelectedEvents(filteredEvents);
            selectedEvents.map(event => {

            });
        } else {
            setSelectedEvents(null);
        }

    };


    const handleDateChange = ({ activeStartDate }) => {
        const { firstDateOfMonth, lastDateOfMonth } = getMonthStartEndDate(activeStartDate);
        
        fetchData(firstDateOfMonth, lastDateOfMonth);
    };


    const getMonthStartEndDate = (currentDate) => {
        const firstDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return { firstDateOfMonth: firstDateOfMonth(currentDate), lastDateOfMonth: lastDateOfMonth(currentDate) };
    }

    const onFiltersUpdate = (filtersList) => {
        setSelectedEvents(null);
        const filteredEvents = eventsList.filter(event => 
            (!filtersList.companyName || event['v_corporate_actions_materialized.company_full_name'] === filtersList.companyName) &&
            (!filtersList.symbol || event['v_corporate_actions_materialized.symbol'] === filtersList.symbol) &&
            (!filtersList.industry || event['v_corporate_actions_materialized.industry'] === filtersList.industry) &&
            (!filtersList.actionType || event['v_corporate_actions_materialized.action_type'] === filtersList.actionType)
        );

        setEventsFilterList(filteredEvents);
    }

    return (
        <div className='app-wrapper'>
            <Filters filterData={filterData} onFiltersUpdate={onFiltersUpdate} />
            <div className='calendar-wrapper'>
                <Calendar
                    style={{ height: 500 }}
                    onChange={setDate}
                    value={date}
                    onClickDay={handleSelectDate}
                    onActiveStartDateChange={handleDateChange}
                    tileClassName={({ date, view }) => {
                        if (eventsFilterList && eventsFilterList.find(event => event['v_corporate_actions_materialized.action_date'] === moment(date).format("YYYY-MM-DD"))) {
                            return 'highlight'
                        }
                    }}
                >
                </Calendar>
            </div>

            <div className='events-wrapper'>
                {selectedEvents ? (
                    <div className='events-list'>
                        <h3>Corporate Action - Standard</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Symbol</th>
                                    <th>Action Type</th>
                                    <th>Action Description</th>
                                    <th>Action Date</th>
                                    <th>Industry</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedEvents.map((event, idx) => (
                                    <tr className='single-event' key={idx}>
                                        <td>{
                                            event['v_corporate_actions_materialized.company_full_name'] ? event['v_corporate_actions_materialized.company_full_name'] : '-'    
                                        }</td>
                                        <td>{
                                            event['v_corporate_actions_materialized.symbol'] ? event['v_corporate_actions_materialized.symbol'] : '-'
                                        }</td>
                                        <td>{
                                            event['v_corporate_actions_materialized.action_type'] ? event['v_corporate_actions_materialized.action_type'] : '-'    
                                        }</td>
                                        <td>{
                                            event['v_corporate_actions_materialized.action_description'] ? event['v_corporate_actions_materialized.action_description'] : '-' 
                                        }</td>
                                        <td>{
                                            event['v_corporate_actions_materialized.action_date'] ? event['v_corporate_actions_materialized.action_date'] : '-'
                                        }</td>
                                        <td>{
                                            event['v_corporate_actions_materialized.industry'] ? event['v_corporate_actions_materialized.industry'] : '-'
                                        }</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : ''}
            </div>
        </div>
    );
};