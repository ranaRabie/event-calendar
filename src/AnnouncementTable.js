import React from "react";

export const AnnouncementTable = ({ list }) => {
    return (
        <div className='events-list'>
            <h3>Corporate Action - Announcement</h3>

            {list.map((listItem, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{__html: listItem['v_corporate_actions_materialized.announcement_details']}}/>
            ))}

        </div>
    )
}