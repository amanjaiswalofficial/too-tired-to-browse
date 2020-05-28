import React, {Component} from 'react'
import SpinningLoader from '../../components/loader'
import SingleTab from '../../components/singleTab'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { channels } from '../../../shared/constants';
const { ipcRenderer } = window 




class MainWindow extends Component {

    componentWillMount = () => {
        this.setState({gotData: false})
        this.getInformation() 
    }

    setHighlighted = (item) => {
        this.setState({highlightedIndex: item.index})
    }
 
    getInformation = async () => {
        ipcRenderer.send(channels.GET_INFO)
        ipcRenderer.on(channels.GET_INFO, (event, arg) => {
            this.setState({
            items: arg.info
        })
            this.setState({
            gotData: true
        })
        })
    } 

    displayTabs = () => {
        
        let itemDisplayPane = this.state.items.map((singleItem) => {
            return (<li style={{float: "left", display: "inline", listStyleType: "none"}}>
                <SingleTab 
                item={singleItem} 
                setHighlighted={this.setHighlighted}/>
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