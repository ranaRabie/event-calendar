import React, { useState, useContext, useEffect, useRef } from 'react';
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
    const filtersRef = useRef();
    const [date, setDate] = useState(new Date());
    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [eventsFilterList, setEventsFilterList] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [actionTypes, setActionTypes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { firstDateOfMonth, lastDateOfMonth } = getMonthStartEndDate(new Date());

        fetchData(firstDateOfMonth, lastDateOfMonth);
    }, []);

    const fetchData = async (startDate, endDate) => {
        setIsLoading(true);
        setSelectedEvents(null);
        setError(null);
        filtersRef.current.clearForm();
        try {
            // RUN INLINE QUERY
            // select action_date, action_type, long_name_en, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_corporate_actions` limit 1000
            // const response = await sdk.ok(
            //     sdk.run_inline_query({
            //         result_format: 'json',
            //         limit: null,
            //         body: {
            //             model: 'client_stg_test_data',
            //             view: 'v_corporate_actions',
            //             fields: [
            //                 'v_corporate_actions.action_date',
            //                 'v_corporate_actions.action_type',
            //                 'v_corporate_actions.long_name_en',
            //                 'v_corporate_actions.industry_group_en',
            //                 'v_corporate_actions.isin',
            //                 'v_corporate_actions.symbol',
            //                 'v_corporate_actions.Count',
            //                 'v_corporate_actions.action_description'],

            //             filters: {
            //                 "v_corporate_actions.action_date": `${moment(startDate).format("YYYY/MM/DD")} to ${moment(endDate).format("YYYY/MM/DD")}`
            //             },
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            setEventsList(eventsDummy);

            if (eventsDummy) {
                setEventsFilterList(eventsDummy); // Set it when set eventsList

                // [...new Set(events.filter(event => event.name !== null).map(event => event.name))]



                const filterDataArr = {
                    long_name_en: [...new Set(eventsDummy.filter(event => event['v_corporate_actions.long_name_en'] !== null).map(event => event['v_corporate_actions.long_name_en']))],
                    symbol: [...new Set(eventsDummy.filter(event => event['v_corporate_actions.symbol'] !== null).map(event => event['v_corporate_actions.symbol']))],
                    industry_group_en: [...new Set(eventsDummy.filter(event => event['v_corporate_actions.industry_group_en'] !== null).map(event => event['v_corporate_actions.industry_group_en']))],
                    actionType: [...new Set(eventsDummy.filter(event => event['v_corporate_actions.action_type'] !== null).map(event => event['v_corporate_actions.action_type']))]
                }

                setFilterData(filterDataArr);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('something went wrong');
            console.error(error);
        }
    }

    const handleSelectDate = value => {
        setSelectedEvents(null);
        const filteredEvents = eventsFilterList.filter(event => event['v_corporate_actions.action_date'] === moment(value).format("YYYY-MM-DD"));

        if (filteredEvents.length > 0) {
            setSelectedEvents(filteredEvents);

            const actionTypesData = {
                'Dividend': [],
                'General Assembly Meeting': [],
                'Board of Directors Session': [],
                'Announcement': []
            };
            filteredEvents.map(event => {
                if (event['v_corporate_actions.action_type'] === 'Dividend') {
                    actionTypesData['Dividend'].push(event);
                } else if (event['v_corporate_actions.action_type'] === 'General Assembly Meeting') {
                    actionTypesData['General Assembly Meeting'].push(event);
                } else if (event['v_corporate_actions.action_type'] === 'Board of Directors Session') {
                    actionTypesData['Board of Directors Session'].push(event);
                } else if (event['v_corporate_actions.entry_type'] === 'Announcement') {
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
            (!filtersList.long_name_en || event['v_corporate_actions.long_name_en'] === filtersList.long_name_en) &&
            (!filtersList.symbol || event['v_corporate_actions.symbol'] === parseInt(filtersList.symbol)) &&
            (!filtersList.industry_group_en || event['v_corporate_actions.industry_group_en'] === filtersList.industry_group_en) &&
            (!filtersList.actionType || event['v_corporate_actions.action_type'] === filtersList.actionType)
        );

        setEventsFilterList(filteredEvents);
    }

    return (
        <div className='app-wrapper'>
            <Filters filterData={filterData} onFiltersUpdate={onFiltersUpdate} ref={filtersRef} />
            <div className='calendar-wrapper'>
                {error && <div className='error'>{error}</div>}
                {isLoading ? (
                    <div class="loader">
                        <div class="loaderBar"></div>
                    </div>
                ) : ''}
                <Calendar
                    style={{ height: 500 }}
                    onChange={setDate}
                    value={date}
                    onClickDay={handleSelectDate}
                    onActiveStartDateChange={handleDateChange}
                    tileClassName={({ date, view }) => {
                        if (eventsFilterList && eventsFilterList.find(event => event['v_corporate_actions.action_date'] === moment(date).format("YYYY-MM-DD"))) {
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