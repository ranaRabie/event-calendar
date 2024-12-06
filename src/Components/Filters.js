import React, { useContext, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import { ExtensionContext } from '@looker/extension-sdk-react';
import filterDummy from '../Data/filters.json'
import Select from 'react-select';

export const Filters = forwardRef(({handleFilterChange}, ref) => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const endDateRange = new Date();
    const startDateRange = new Date(endDateRange);
    startDateRange.setDate(endDateRange.getDate() - 1);

    const [filterData, setFilterData] = useState(null);
    const [dateRange, setDateRange] = useState([new Date(startDateRange), new Date(endDateRange)]);
    const [startDate, endDate] = dateRange;
    const [error, setError] = useState(null);

    const companyRef = useRef("all");
    const symbolRef = useRef("all");
    const industry_group_enRef = useRef("all");
    const actionTypeRef = useRef("all");
    const companyShortRef = useRef("all");
    const isinRef = useRef("all");

    const [isCompanySelected, setIsCompanySelected] = useState(false);
    const [isSymbolSelected, setIsSymbolSelected] = useState(false);
    
    useEffect(() => {
        fetchFilterData();
    }, []);

    const fetchFilterData = async () => {
        setError(null);
        
        // Run Inline Query to get Filters Data from Looker
        // Companies, Symbols, Industries, ActionTypes
        try {
            // RUN INLINE QUERY
            // select action_date, action_type, company_full_name, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_looker_corporate_actions_filters` limit 1000
            // const response = await sdk.ok(
            //     sdk.run_inline_query({
            //         result_format: 'json',
            //         limit: null,
            //         body: {
            //             model: 'client_stg_test_data',
            //             view: 'v_looker_corporate_actions_filters',
            //             fields: [
            //                 'v_looker_corporate_actions_filters.action_type',
            //                 'v_looker_corporate_actions_filters.company_full_name',
            //                 'v_looker_corporate_actions_filters.industry_group_en',
            //                 'v_looker_corporate_actions_filters.symbol'
            //             ],

            //             filters: null,
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            if (filterDummy) {
                // Remove nulls, duplication and group by each field
                RemoveDataDuplicatesAndNulls(filterDummy);
            }

        } catch (error) {
            setError('something went wrong loading filters');
        }

    }

    const RemoveDataDuplicatesAndNulls = (data) => {
        const filterDataArr = {
            company_full_name: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.company_full_name'] !== null).map(event => {
                return {"label": event['v_looker_corporate_actions_filters.company_full_name'], "value": event['v_looker_corporate_actions_filters.company_full_name']}
            }))],

            symbol: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.symbol'] !== null).map(event =>  {
                return {"label": event['v_looker_corporate_actions_filters.symbol'], "value": event['v_looker_corporate_actions_filters.symbol']}
            }))],

            industry_group_en: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.industry_group_en'] !== null).map(event => {
                return {"label": event['v_looker_corporate_actions_filters.industry_group_en'], "value": event['v_looker_corporate_actions_filters.industry_group_en']}
            }))],

            actionType: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.action_type'] !== null).map(event => {
                return {"label": event['v_looker_corporate_actions_filters.action_type'], "value": event['v_looker_corporate_actions_filters.action_type']}
            }))],

            company_short_name: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.company_short_name'] !== null).map(event => {
                return {"label": event['v_looker_corporate_actions_filters.company_short_name'], "value": event['v_looker_corporate_actions_filters.company_short_name']}
            }))],

            isin: [{"label": "all", "value": "all"}, ...new Set(data.filter(event => event['v_looker_corporate_actions_filters.isin'] !== null).map(event => {
                return {"label": event['v_looker_corporate_actions_filters.isin'], "value": event['v_looker_corporate_actions_filters.isin']}
            }))]
        }

        setFilterData(filterDataArr);
    }

    const updateFilters = (e, startDate = dateRange[0], endDate = dateRange[1]) => {
        e.preventDefault();

        const selectedFilters = {
            'company_full_name': companyRef.current !== 'all' && companyRef.current,
            'symbol': symbolRef.current !== 'all' && symbolRef.current,
            'industry_group_en': industry_group_enRef.current !== 'all' && industry_group_enRef.current,
            'actionType': actionTypeRef.current !== 'all' && actionTypeRef.current,
            'startDate': `${moment(startDate).format("YYYY/MM/DD")}`,
            'endDate': `${moment(endDate).format("YYYY/MM/DD")}`,
            'company_short_name': companyShortRef.current !== 'all' && companyShortRef.current,
            'isin': isinRef.current !== 'all' && isinRef.current
        }

        handleFilterChange(selectedFilters);
    }

    const clearFilters = (e) => {
        e.preventDefault();
        companyRef.current = 'all';
        symbolRef.current = 'all';
        industry_group_enRef.current = 'all';
        actionTypeRef.current = 'all';
        companyShortRef.current = 'all';
        isinRef.current = 'all';

        const currentDateRange = [new Date(startDateRange), new Date(endDateRange)]

        setDateRange(currentDateRange);

        setIsCompanySelected(false);
        setIsSymbolSelected(false);

        updateFilters(e, currentDateRange[0], currentDateRange[1]);
    }

    const handleSelectChange = (e, field) => {
        if (field === 'company') {
            setIsCompanySelected(e.value !== "all");
            setIsSymbolSelected(false);

            companyRef.current = e.value;
        } else if (field === 'symbol') {
            setIsSymbolSelected(e.value !== "all");
            setIsCompanySelected(false);

            symbolRef.current = e.value;
        } else if (field === 'industry') {
            industry_group_enRef.current = e.value;
        } else if (field === 'actionType') {
            actionTypeRef.current = e.value;
        } else if (field === 'companyShortName') {
            companyShortRef.current = e.value;
        } else if (field === 'isin') {
            isinRef.current = e.value;
        }
    };

    useImperativeHandle(ref, () => ({
        clearForm() {
            clearFilters();
        },
        getFilterDates() {
            return {startDate: `${moment(startDateRange).format("YYYY/MM/DD")}`, endDate: `${moment(endDateRange).format("YYYY/MM/DD")}`}
        }
    }))
    
    return (
        <>
            {error && <div className='error'>{error}</div>}
            
            <form className="filters">
                <div>
                    <label>Company Name</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.company_full_name} 
                            onChange={(e) => handleSelectChange(e, 'company')}
                            isDisabled={isSymbolSelected}
                            defaultValue={filterData.company_full_name[0]}
                            value={
                                {
                                  label: companyRef.current,
                                  value: companyRef.current,
                            }}
                        />
                    }
                </div>
                <div>
                    <label>Company Short Name</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.company_short_name} 
                            onChange={(e) => handleSelectChange(e, 'companyShortName')}
                            defaultValue={filterData.company_short_name[0]}
                            value={
                                {
                                  label: companyShortRef.current,
                                  value: companyShortRef.current,
                            }}
                        />
                    }
                </div>
                <div>
                    <label>Symbol</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.company_short_name} 
                            onChange={(e) => handleSelectChange(e, 'symbol')}
                            defaultValue={filterData.symbol[0]}
                            isDisabled={isCompanySelected}
                            value={
                                {
                                  label: symbolRef.current,
                                  value: symbolRef.current,
                            }}
                        />
                    }
                </div>
                <div>
                    <label>Industry</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.industry_group_en} 
                            onChange={(e) => handleSelectChange(e, 'industry')}
                            defaultValue={filterData.industry_group_en[0]}
                            isDisabled={isCompanySelected}
                            value={
                                {
                                  label: industry_group_enRef.current,
                                  value: industry_group_enRef.current,
                            }}
                        />
                    }
                </div>
                <div>
                    <label>Action Type</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.actionType} 
                            onChange={(e) => handleSelectChange(e, 'actionType')}
                            defaultValue={filterData.actionType[0]}
                            value={
                                {
                                  label: actionTypeRef.current,
                                  value: actionTypeRef.current,
                            }}
                        />
                    }
                </div>
                <div>
                    <label>ISIN</label>
                    {filterData && 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData.isin} 
                            onChange={(e) => handleSelectChange(e, 'isin')}
                            defaultValue={filterData.isin[0]}
                            value={
                                {
                                  label: isinRef.current,
                                  value: isinRef.current,
                            }}
                        />
                    }
                </div>
                <div className="date-picker-wrapper">
                    <label>Date Range</label>
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                    />
                </div>
                <button className="submit-filters" onClick={updateFilters}>Apply</button>
                <button className="clear-filters" onClick={clearFilters}>Clear</button>
            </form>
        </>
    )
})