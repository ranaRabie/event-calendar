import React, { useState, useEffect } from "react";

export const EventsTable = ({ list, onClickItem }) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        isAsc: false
    });
  
    let sortableItems = [...list];
    
    if (sortConfig.key !== null) {
        if (sortConfig.isAsc) {
            sortableItems.sort((a, b) =>
              a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase() ? -1 : 1
            );
        } else {
            sortableItems.sort((a, b) =>
                a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase() ? -1 : 1
            );
        }
    }
    

    const onRowClick = (listItem) => {
        onClickItem(listItem);
    }

    return (
        <div className='events-list'>
            <h3>Standard</h3>
            <table>
                <thead>
                    <tr>
                        <th>
                            <button className="sort-btn" type="button" onClick={() => setSortConfig({key: 'v_corporate_actions.company_full_name', isAsc: !sortConfig.isAsc})}>
                                <span>Company Name</span>
                                <i className="fa fa-sort"></i>
                            </button>
                        </th>
                        <th>
                            Symbol
                        </th>
                        <th>
                            <button className="sort-btn" type="button" onClick={() => setSortConfig({key: 'v_corporate_actions.action_type', isAsc: !sortConfig.isAsc})}>
                                <span>Action Type</span>
                                <i className="fa fa-sort"></i>
                            </button>
                        </th>
                        <th>Action Description</th>
                        <th>Action Date</th>
                        <th>
                            <button className="sort-btn" type="button" onClick={() => setSortConfig({key: 'v_corporate_actions.industry_group_en', isAsc: !sortConfig.isAsc})}>
                                <span>Industry</span>
                                <i className="fa fa-sort"></i>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortableItems.map((listItem, idx) => (
                        <tr className='single-event' key={idx} onClick={() => onRowClick(listItem)}>
                            <td>{
                                listItem['v_corporate_actions.company_full_name'] ? listItem['v_corporate_actions.company_full_name'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.symbol'] ? listItem['v_corporate_actions.symbol'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.action_type'] ? listItem['v_corporate_actions.action_type'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.action_description'] ? listItem['v_corporate_actions.action_description'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.action_date'] ? listItem['v_corporate_actions.action_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.industry_group_en'] ? listItem['v_corporate_actions.industry_group_en'] : '-'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}