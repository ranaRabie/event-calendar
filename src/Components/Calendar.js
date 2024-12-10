import React, { useState, useContext, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { ExtensionContext } from '@looker/extension-sdk-react';
import { Filters } from './Filters';
import eventsDummy from '../Data/data.json';
import { EventsTable } from './Tables/EventsTable';
import { DividendTable } from './Tables/DividendTable';
import { GeneralAssemblyMeetingTable } from './Tables/GeneralAssemblyMeetingTable';
import { BoardOfDirectorsSessionTable } from './Tables/BoardOfDirectorsSessionTable';
import { AnnouncementTable } from './Tables/AnnouncementTable';
import { IPOTable } from './Tables/IPOTable';
import { OtherTable } from './Tables/OtherTable';

export const CustomCalendar = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API
    const filtersRef = useRef();
    const [date, setDate] = useState(new Date());
    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const filterDates = filtersRef.current.getFilterDates();
        
        fetchData({
            "company_full_name": false,
            "company_short_name": false,
            "symbol": false,
            "industry_group_en": false,
            "actionType": false,
            "isin": false,
            "startDate": filterDates.startDate,
            "endDate": filterDates.endDate
        });
    }, []);

    const fetchData = async (filters) => {
        setIsLoading(true);
        setSelectedEvents(null);
        setError(null);
        
        const currentFilters = {};

        // eslint-disable-next-line
        filters.company_full_name ? 
            currentFilters["v_corporate_actions.company_full_name"] = filters.company_full_name : '';
        
        // eslint-disable-next-line
        filters.company_short_name ? 
            currentFilters["v_corporate_actions.company_short_name"] = filters.company_short_name : '';

        // eslint-disable-next-line
        filters.symbol ? 
            currentFilters["v_corporate_actions.symbol"] = `${filters.symbol}` : '';

        // eslint-disable-next-line
        filters.industry_group_en ? 
            currentFilters["v_corporate_actions.industry_group_en"] = filters.industry_group_en : '';

        // eslint-disable-next-line
        filters.actionType ? 
            currentFilters["v_corporate_actions.action_type"] = filters.actionType : '';

        // eslint-disable-next-line
        filters.startDate && filters.endDate ? 
            currentFilters["v_corporate_actions.action_date"] = `${filters.startDate} to ${filters.endDate}` : '';

        // eslint-disable-next-line
        filters.isin ? 
            currentFilters["v_corporate_actions.isin"] = `${filters.isin}` : '';


        try {
            // RUN INLINE QUERY
            // select action_date, action_type, company_full_name, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_corporate_actions` limit 1000
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
            //                 'v_corporate_actions.company_full_name',
            //                 'v_corporate_actions.industry_group_en',
            //                 'v_corporate_actions.isin',
            //                 'v_corporate_actions.symbol',
            //                 'v_corporate_actions.Count',
            //                 'v_corporate_actions.action_description'],

            //             filters: {
                                // filters: currentFilters,
            //             },
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            setEventsList(eventsDummy);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('something went wrong');
            console.error(error);
        }
    }

    const handleSelectDate = value => {
        setSelectedEvents(null);
        setSelectedItem(null);

        const filteredEvents = eventsList.filter(event => event['v_corporate_actions.action_date'] === moment(value).format("YYYY-MM-DD"));

        if (filteredEvents.length > 0) {
            setSelectedEvents(filteredEvents);
        } else {
            setSelectedEvents(null);
        }

    };

    const getMonthStartEndDate = (currentDate) => {
        const firstDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth(), 1);

        // const lastDateOfMonth = (date = new Date()) =>
        //     new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const lastDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth() + 2, 0);

        return { firstDateOfMonth: firstDateOfMonth(currentDate), lastDateOfMonth: lastDateOfMonth(currentDate) };
    }

    const handleFilterChange = (filtersList) => {
        fetchData(filtersList);
    }

    const handleClosePopup = () => {
        setSelectedItem(null);
    };

    const handleRowClick = (listItem) => {
        setSelectedItem(listItem);
    };

    return (
        <div className='app-wrapper'>
            <Filters handleFilterChange={handleFilterChange} ref={filtersRef} />
            
            <div className='calendar-wrapper'>
                {error && <div className='error'>{error}</div>}
                {isLoading ? (
                    <div class="loader">
                        <div class="loaderBar"></div>
                    </div>
                ) : ''}
                <Calendar
                    style={{ height: 500 }}
                    showDoubleView
                    onChange={setDate}
                    value={date}
                    onClickDay={handleSelectDate}
                    tileClassName={({ date, view }) => {
                        if (eventsList && eventsList.find(event => event['v_corporate_actions.action_date'] === moment(date).format("YYYY-MM-DD"))) {
                            return 'highlight'
                        }
                    }}
                >
                </Calendar>
            </div>
            
            {selectedEvents ? (
                <div className='events-wrapper'>
                    <EventsTable list={selectedEvents} onClickItem={handleRowClick}></EventsTable>

                    <div className='filter-result'>
                        {selectedItem && <button onClick={handleClosePopup} className="close-button">X</button>}
                        {
                            selectedItem && selectedItem['v_corporate_actions.action_type'] === 'Dividend' ?
                                <DividendTable listItem={selectedItem}></DividendTable> : ''
                        }
                        
                        {
                            selectedItem && selectedItem['v_corporate_actions.action_type'] === 'Board of Directors Session' ?
                                <BoardOfDirectorsSessionTable listItem={selectedItem}></BoardOfDirectorsSessionTable> : ''
                        }

                        {
                            selectedItem && selectedItem['v_corporate_actions.action_type'] === '(AGM) General Assembly' ?
                                <GeneralAssemblyMeetingTable listItem={selectedItem}></GeneralAssemblyMeetingTable> : ''
                        }
                        
                        {
                            selectedItem && selectedItem['v_corporate_actions.action_type'] === 'IPO' ?
                                <IPOTable listItem={selectedItem}></IPOTable> : ''
                        }

                        {
                            selectedItem && selectedItem['v_corporate_actions.entry_type'] === 'Announcement' ?
                                <AnnouncementTable listItem={selectedItem}></AnnouncementTable> : ''
                        }

                        {
                            selectedItem && 
                            selectedItem['v_corporate_actions.action_type'] !== 'Dividend' && 
                            selectedItem['v_corporate_actions.action_type'] !== 'Board of Directors Session' && 
                            selectedItem['v_corporate_actions.action_type'] !== '(AGM) General Assembly' &&
                            selectedItem['v_corporate_actions.action_type'] !== 'IPO' &&
                            selectedItem['v_corporate_actions.entry_type'] !== 'Announcement' ?
                                <OtherTable listItem={selectedItem}></OtherTable> : ''
                        }
                    </div>
                </div>
            ) : ''}
        </div>
    );
};