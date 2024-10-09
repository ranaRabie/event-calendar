import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { ExtensionContext } from '@looker/extension-sdk-react';
import { Filters } from './Filters';
import eventsDummy from './data.json'; 
import { EventsTable } from './EventsTable';
import { DividendTable } from './DividendTable';
import { GeneralAssemblyMeetingTable } from './GeneralAssemblyMeetingTable';
import { BoardOfDirectorsSessionTable } from './BoardOfDirectorsSessionTable';
import { AnnouncementTable } from './AnnouncementTable';

export const CustomCalendar = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const [date, setDate] = useState(new Date());
    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [eventsFilterList, setEventsFilterList] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [actionTypes, setActionTypes] = useState(null);

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

            const actionTypesData = {
                'Dividend': [],
                'General Assembly Meeting': [],
                'Board of Directors Session': [],
                'Announcement': []
            };
            filteredEvents.map(event => {
                if (event['v_corporate_actions_materialized.entry_type'] === 'Action' && event['v_corporate_actions_materialized.action_type'] === 'Dividend') {
                    actionTypesData['Dividend'].push(event);
                } else if (event['v_corporate_actions_materialized.entry_type'] === 'Event' && event['v_corporate_actions_materialized.action_type'] === 'General Assembly Meeting') {
                    actionTypesData['General Assembly Meeting'].push(event);
                } else if (event['v_corporate_actions_materialized.entry_type'] === 'Event' && event['v_corporate_actions_materialized.action_type'] === 'Board of Directors Session') {
                    actionTypesData['Board of Directors Session'].push(event);
                } else if (event['v_corporate_actions_materialized.entry_type'] === 'Announcement') {
                    actionTypesData['Announcement'].push(event);
                }
            });

            setActionTypes(actionTypesData);
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
                    <>
                        <EventsTable list={selectedEvents}></EventsTable>
                        
                        {
                            actionTypes && actionTypes['Dividend'].length > 0 ?
                            <DividendTable list={actionTypes['Dividend']}></DividendTable> : ''
                        }

                        {
                            actionTypes && actionTypes['General Assembly Meeting'].length > 0 ?
                            <GeneralAssemblyMeetingTable list={actionTypes['General Assembly Meeting']}></GeneralAssemblyMeetingTable> : ''
                        }

                        {
                            actionTypes && actionTypes['Board of Directors Session'].length > 0 ?
                            <BoardOfDirectorsSessionTable list={actionTypes['Board of Directors Session']}></BoardOfDirectorsSessionTable> : ''
                        }

                        {
                            actionTypes && actionTypes['Announcement'].length > 0 ?
                            <AnnouncementTable list={actionTypes['Announcement']}></AnnouncementTable> : ''
                        }
                    </>
                ) : ''}
            </div>
        </div>
    );
};