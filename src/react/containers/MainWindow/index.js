import React, {Component} from 'react'
import SpinningLoader from '../../components/loader'
import SingleTab from '../../components/singleTab'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { channels } from '../../../shared/constants';
const { ipcRenderer } = window 




class MainWindow extends Component {

    componentWillMount = () => {
        this.setState({gotData: false, highlightedTab: null})
        this.getInformation() 
    }

    setHighlighted = (item) => {
        this.setState({highlightedTab: 
            {
                [item.index]: true
            }})
    }

    removeHighlighted = () => {
        this.setState({highlightedTab: undefined})
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
                setHighlighted={this.setHighlighted}
                removeHighlighted={this.removeHighlighted}
                highlightedTab={this.state.highlightedTab}
                />
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