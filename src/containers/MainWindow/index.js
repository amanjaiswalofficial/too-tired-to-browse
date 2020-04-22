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
            items: response.data
        })
        this.setState({
            gotData: true
        })
    } 

    displayTabs = () => {
        
        let itemDisplayPane = this.state.items.map((singleItem) => {
            return (<li style={{float: "left", display: "inline", listStyleType: "none"}}>
                <SingleTab item={singleItem}/>
                </li>)
        })

        return <ul>{itemDisplayPane}</ul>
    }

    render(){

        return(
            <div className="App">
                <header className="App-header">
                    {this.state.gotData?this.displayTabs():<SpinningLoader/>}
                </header>
                
            </div>
        )
    }
}

export default MainWindow