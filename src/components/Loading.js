import React from 'react';
import styled from "styled-components";
import ReactLoading from 'react-loading';

/*
    const Loading = () => (
      <div>
        <h1>L</h1>< br/>
        <h1>L</h1>< br/>
        <h1>L</h1>< br/>
        <h1>L</h1>< br/>
        <i className="fa fa-spinner fa-spin" /> Loading...
        <h1>L</h1>< br/>
        <i className="fa fa-spinner fa-spin" /> Loading...
        <h1>L</h1>< br/>
        <i className="fa fa-spinner fa-spin" /> Loading...
        <h1>L</h1>< br/>
        <i className="fa fa-spinner fa-spin" /> Loading...
        <i className="fa fa-spinner fa-spin" /> Loading...
        <i className="fa fa-spinner fa-spin" /> Loading...
        <i className="fa fa-spinner fa-spin" /> Loading...
        <i className="fa fa-spinner fa-spin" /> Loading...
           </div>
    );
*/

    const Loading = ({ type, color }) => (
	<ReactLoading type={'bars'} color={'#6bd2c9'} height={667} width={375} />);
        
   
    export default Loading;

    /*<i className="fa fa-spinner fa-spin" /> Loading...*/