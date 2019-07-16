const API_PATH ='https://jsonplaceholder.typicode.com/posts'

// get All prospect records
const getAll = () => 
    fetch(`${API_PATH}`)
    .then(res => res.json())
    .then(json => console.log(json))
    .then(prospects => prospects.results)
    .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
/*
// Browse to find a specific prospect
const search = (query) =>
  fetch(`${API_PATH}/search`, {
    method: 'POST',
    body: JSON.stringify({ query })
  }).then(res => res.json())
    .then(data => data.prospects)      
*/
export { getAll };