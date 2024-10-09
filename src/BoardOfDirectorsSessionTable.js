import React from "react";

export const BoardOfDirectorsSessionTable = ({ list }) => {
    return (
        <div className='events-list'>
            <h3>Corporate Action - Board of Directors Session</h3>
            <table>
                <thead>
                    <tr>
                        <th>start date</th>
                        <th>end date</th>
                        <th>session type</th>
                        <th>number of board of directors</th>
                        <th>application start date</th>
                        <th>application end date</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((listItem, idx) => (
                        <tr className='single-event' key={idx}>
                            <td>{
                                listItem['v_corporate_actions_materialized.bods_start_date'] ? listItem['v_corporate_actions_materialized.bods_start_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.bods_end_date'] ? listItem['v_corporate_actions_materialized.bods_end_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.bods_session_type'] ? listItem['v_corporate_actions_materialized.bods_session_type'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.bods_number_of_board_of_directors'] ? listItem['v_corporate_actions_materialized.bods_number_of_board_of_directors'] : '-'
                            }</td>
                             <td>{
                                listItem['v_corporate_actions_materialized.bods_application_start_date'] ? listItem['v_corporate_actions_materialized.bods_application_start_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.bods_application_end_date'] ? listItem['v_corporate_actions_materialized.bods_application_end_date'] : '-'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}