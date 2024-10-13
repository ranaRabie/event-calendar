import React, { useRef, useImperativeHandle, forwardRef } from "react";

export const Filters = forwardRef(({filterData, onFiltersUpdate}, ref) => {
    const companyRef = useRef();
    const symbolRef = useRef();
    const industry_group_enRef = useRef();
    const actionTypeRef = useRef();
    // const dateRangeRef = useRef();

    const updateFilters = (e) => {
        e.preventDefault();

        const selectedFilters = {
            'industry_group_en': companyRef.current.value !== 'all' && companyRef.current.value,
            'symbol': symbolRef.current.value !== 'all' && symbolRef.current.value,
            'industry_group_en': industry_group_enRef.current.value !== 'all' && industry_group_enRef.current.value,
            'actionType': actionTypeRef.current.value !== 'all' && actionTypeRef.current.value,
            // 'dateRange': 'q'
        }

        onFiltersUpdate(selectedFilters);
    }

    const clearFilters = () => {
        companyRef.current.value = 'all';
        symbolRef.current.value = 'all';
        industry_group_enRef.current.value = 'all';
        actionTypeRef.current.value = 'all';
    }

    const onSelectCompanyChange = () => {
        if (companyRef.current.value != 'all') {
            symbolRef.current.value = 'all';
            industry_group_enRef.current.value = 'all';

            symbolRef.current.disabled = true;
            industry_group_enRef.current.disabled  = true;
        } else {
            symbolRef.current.disabled = false;
            industry_group_enRef.current.disabled  = false;
        }
    }

    useImperativeHandle(ref, () => ({
        clearForm() {
            clearFilters();
        }
    }))
    
    return (
        <form className="filters">
            <div>
                <label>Company Name</label>
                <select ref={companyRef} onChange={onSelectCompanyChange}>
                    <option value="all">all</option>
                    {filterData && filterData.industry_group_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Symbol</label>
                <select ref={symbolRef}>
                    <option value="all">all</option>
                    {filterData && filterData.symbol.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Industry</label>
                <select ref={industry_group_enRef}>
                    <option value="all">all</option>
                    {filterData && filterData.industry_group_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Action Type</label>
                <select ref={actionTypeRef}>
                    <option value="all">all</option>
                    {filterData && filterData.actionType.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <button onClick={updateFilters}>Update</button>
            <button onClick={clearFilters}>clear</button>
        </form>
    )
})