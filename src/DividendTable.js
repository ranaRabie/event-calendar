import React from "react";

export const DividendTable = ({ list }) => {
    return (
        <div className='events-list'>
            <h3>Corporate Action - Dividend</h3>
            <table>
                <thead>
                    <tr>
                        <th>announcement date</th>
                        <th>eligibility date</th>
                        <th>distribution method</th>
                        <th>distribution amount</th>
                        <th>ex date</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((listItem, idx) => (
                        <tr className='single-event' key={idx}>
                            <td>{
                                listItem['v_corporate_actions_materialized.dividends_announcement_date'] ? listItem['v_corporate_actions_materialized.dividends_announcement_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.dividends_eligibility_date'] ? listItem['v_corporate_actions_materialized.dividends_eligibility_date'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.dividends_distribution_method'] ? listItem['v_corporate_actions_materialized.dividends_distribution_method'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.dividends_distribution_amount'] ? listItem['v_corporate_actions_materialized.dividends_distribution_amount'] : '-'
                            }</td>
                            <td>{
                                listItem['v_corporate_actions_materialized.dividends_ex_date'] ? listItem['v_corporate_actions_materialized.dividends_ex_date'] : '-'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}