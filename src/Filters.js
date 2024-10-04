import React, { useRef } from "react";

export const Filters = ({filterData, onFiltersUpdate}) => {
    const companyRef = useRef();
    const symbolRef = useRef();
    const industryRef = useRef();
    const actionTypeRef = useRef();
    // const dateRangeRef = useRef();

    const updateFilters = (e) => {
        e.preventDefault();

        const selectedFilters = {
            'companyName': companyRef.current.value !== 'all' && companyRef.current.value,
            'symbol': symbolRef.current.value !== 'all' && symbolRef.current.value,
            'industry': industryRef.current.value !== 'all' && industryRef.current.value,
            'actionType': actionTypeRef.current.value !== 'all' && actionTypeRef.current.value,
            // 'dateRange': 'q'
        }

        onFiltersUpdate(selectedFilters);
    }

    const clearFilters = (e) => {
        e.preventDefault();

        companyRef.current.value = 'all';
        symbolRef.current.value = 'all';
        industryRef.current.value = 'all';
        actionTypeRef.current.value = 'all';

        onFiltersUpdate({});
    }
    
    return (
        <form>
            <select ref={companyRef}>
                <option value="all">all</option>
                {filterData && filterData.companyName.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
            </select>
            <select ref={symbolRef}>
                <option value="all">all</option>
                {filterData && filterData.symbol.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
            </select>
            <select ref={industryRef}>
                <option value="all">all</option>
                {filterData && filterData.industry.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
            </select>
            <select ref={actionTypeRef}>
                <option value="all">all</option>
                {filterData && filterData.actionType.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
            </select>
            <button onClick={updateFilters}>Update</button>
            <button onClick={clearFilters}>clear</button>
        </form>
    )
}