import React from 'react';

const Prospect = ({prospect}) => {
    return(
        <div>
            <p>{prospect.id}</p>
            <p>{prospect.title}</p>
        </div>
        
    );
}

export default Prospect;