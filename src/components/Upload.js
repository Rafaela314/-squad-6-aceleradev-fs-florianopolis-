import React from "react";
import Prospect from './Prospect';



const getprospects = (prospects) => {
    let newList = prospects;
    if (newList.length > 0) {
        return newList.map((item, index) => <Prospect key={index} prospect={item} />);
    }
    return <h2><strong>OOoooOOOooops!</strong> </h2>
}

const Upload = ({prospects=[]}) => (
    <div>
        <h1>Upload CSV page</h1>
        {getprospects(prospects)}   
        {console.log(prospects.results)}
            
    </div>

    )




export default Upload;
