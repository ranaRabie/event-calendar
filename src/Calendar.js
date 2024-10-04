import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import { ExtensionContext } from '@looker/extension-sdk-react';
import { Filters } from './Filters';

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
        //                 'v_corporate_actions_materialized.Count'],

        //             filters: {
        //                 "v_corporate_actions_materialized.action_date": `${moment(startDate).format("YYYY/MM/DD")} to ${moment(endDate).format("YYYY/MM/DD")}`
        //             },
        //             filter_expression: null,
        //             total: false,
        //         }
        //     })
        // );

        setEventsList(eventsDummy);
        
        if (eventsList) {
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

        if (filteredEvents) {
            setSelectedEvents(filteredEvents);
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
        <div>
            <h3>Calendar</h3>
            <Filters filterData={filterData} onFiltersUpdate={onFiltersUpdate} />
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

            {selectedEvents ? (
                selectedEvents.map((event, idx) => (
                    <div className='single-event' key={idx}>
                        <h3>{event['v_corporate_actions_materialized.company_full_name']} | <small>{event['v_corporate_actions_materialized.action_date']}</small></h3>
                        <p>{event['v_corporate_actions_materialized.industry']}</p>
                        <p>{event['v_corporate_actions_materialized.action_type']}</p>
                        <p>{event['v_corporate_actions_materialized.isin']}</p>
                        <p>{event['v_corporate_actions_materialized.symbol']}</p>
                    </div>
                ))
            ) : ''}
        </div>
    );
};