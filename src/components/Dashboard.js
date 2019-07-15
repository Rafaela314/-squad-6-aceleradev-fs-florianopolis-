import React from 'react';
import {getAll} from '../services/funcionarios'

class Dashboard extends React.Component {
    async componentDidMount() {
        try {
            const prospects = await getAll();
            this.props.addProspects(prospects);
        } catch (error) {
            console.log(error)
        }

    }
    
    render() {
        return (
           <div>
                <h1>Dashboard</h1>
                <ol className="books-grid">
                    {this.props.prospects && 
                    this.props.prospects.map(p => <p>{this.props.title}</p>)}
                </ol>
            </div>
        );
    }
}

export default Dashboard; 