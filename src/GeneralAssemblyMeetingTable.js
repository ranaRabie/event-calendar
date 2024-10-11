import React from "react";

export const GeneralAssemblyMeetingTable = ({ list }) => {
    return (
        <div className='events-list'>
            <h3>Corporate Action - General Assembly Meeting</h3>
            <table>
                <thead>
                    <tr>
                        <th>type of assembly</th>
                        <th>agm date</th>
                        <th>holding site</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((listItem, idx) => (
                        <tr className='single-event' key={idx}>
                            <td>{
                                listItem['v_corporate_actions.gam_type_of_assembly'] ? listItem['v_corporate_actions.gam_type_of_assembly'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.gam_agm_date'] ? listItem['v_corporate_actions.gam_agm_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.gam_holding_site'] ? listItem['v_corporate_actions.gam_holding_site'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions.gam_status'] ? listItem['v_corporate_actions.gam_status'] : '-'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}