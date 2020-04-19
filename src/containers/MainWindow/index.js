import React, {Component} from 'react'
import SpinningLoader from '../../components/loader'
import SingleTab from '../../components/singleTab'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'




class MainWindow extends Component {

    componentWillMount = () => {
        this.setState({gotData: false})
        this.getInformation()
    }

    //TO MOVE
    

    getInformation = async () => {
        const response = await axios.get('http://localhost:3002/test')
        console.log('response is: ',response)
        this.setState({
            item: response.data
        })
        this.setState({
            gotData: true
        })
    } 

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <button onClick={this.getInformation}>Click Here</button>
                </header>
                
            </div>
        )
    }
}

export default MainWindow