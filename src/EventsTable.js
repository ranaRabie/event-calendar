import React from "react";

export const EventsTable = ({ list }) => {
    return (
        <div className='events-list'>
            <h3>Standard</h3>
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
                    {list.map((listItem, idx) => (
                        <tr className='single-event' key={idx}>
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