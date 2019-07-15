import React from 'react';
export const MyContext = React.createContext()
//sample data:
//{
//    "userId": 1, //AKA id
//    "id": 5, //AKA salary
//    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",//AKA name
//    "completed": false // AKA is client?
//  },

class index extends React.Component {
    constructor(){
        super();
        this.state = {
            prospects:[],
            twentyk:[],
            twentyknotclient:[],
              addProspects: prospects => {
                const twentyk = prospects.filter(prospect => prospect.id >= 5); //prospect.salary >=20.000
                const twentyknotclient = prospects.filter(prospect => prospect.id >=5 && prospect.completed == false);// prospect.salary >=20.000 and Isclient == false
                this.setState({ prospects, twentyk, twentyknotclient });
            },
/*
            updateList: (prospect) => {
                const allProspects = this.state.prospects.map(p => {
                    return (<h1>p</h1>)
                })
            }*/
        };


    }

  render() {
    return (
    <MyContext.Provider value={{ ...this.state }}>
      {this.props.children}
    </MyContext.Provider>
    )
  }
}

export default index