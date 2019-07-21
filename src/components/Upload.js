import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 150px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Upload = () => {
  return (
    <div>
      <h1>Upload CSV file</h1>
      <Wrapper>
        <input type="file" id="file" name="FileCSV" />
        <label for="file">Choose a file</label>
        <button>confirm</button>
      </Wrapper>
    </div>
  );
};

export default Upload;
