import React from "react";

export const EventsTable = ({ list }) => {
    return (
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
                    {list.map((listItem, idx) => (
                        <tr className='single-event' key={idx}>
                            <td>{
                                listItem['v_corporate_actions_materialized.company_full_name'] ? listItem['v_corporate_actions_materialized.company_full_name'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.symbol'] ? listItem['v_corporate_actions_materialized.symbol'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.action_type'] ? listItem['v_corporate_actions_materialized.action_type'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.action_description'] ? listItem['v_corporate_actions_materialized.action_description'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.action_date'] ? listItem['v_corporate_actions_materialized.action_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.industry'] ? listItem['v_corporate_actions_materialized.industry'] : '-'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}