import React from 'react';

class AddForm extends React.Component {
    state = {
        id: 0,
        name: " ",
        position: " ",
        email:" "
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
      }

      submitFormAdd = e => {
        e.preventDefault()

        this.props.addUserState();
        /*fetch('http://localhost:3000/crud', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            position: this.state.position,
           
          })
        })
          .then(response => response.json())
          .then(user => {
            if(Array.isArray(user)) {
              this.props.addUserState(user[0])
           } else {
              console.log('failure')
            }
          })
          .catch(err => console.log(err))*/
      }
      
     /* componentDidMount(){
          // if item exists, populate the state with proper data
          if(this.props.user) {
              const {id, name, email, position} = this.props.user
              this.setState({ id, name, position, email})
          }
      }*/
      render() {
    
          return(
              <form onSubmit={this.submitFormAdd}>
                  <label>
                     Id:
                    <input type="text" name="id" onChange={this.onChange} />
                  </label>
                  <label>
                     Name:
                    <input type="text" name="name"  onChange={this.onChange}/>
                  </label>
                  <label>
                     Position:
                    <input type="text" name="position" onChange={this.onChange}/>
                  </label>
                  <label>
                     Email:
                    <input type="text" name="email" onChange={this.onChange}/>
                  </label>
                  <input type="submit" value="Submit" />
              </form>
          );

      }
}

export default AddForm;