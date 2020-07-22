import React, {Component} from 'react'
import SpinningLoader from '../../components/loader'
import SingleTab from '../../components/singleTab'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { channels } from '../../../shared/constants';
import goBackIcon from '../../assets/images/go_back_icon.png'

const { ipcRenderer } = window 
class MainWindow extends Component {

    componentWillMount = () => {        
        this.setState({
            gotData: false, 
            highlightedTab: null, 
            folderLevel: 0,
            coordinates: null
        })
        this.getInformation() 
    }

    displayFetchedInformation = (data) => {
        this.setState({items: data})
    }

    getInformation = async () => {
        /*
         Called on page load, and every time when a open folder is clicked
         Saves response in localStorage to access later on back button press
         */
        ipcRenderer.send(channels.GET_INFO)
        ipcRenderer.on(channels.GET_INFO, (event, arg) => {

            let videoObjects = []
            let counter = 0
            for(var i=0; i < arg.info.length; i++){
                if(arg.info[i].imageEncode){
                    counter+=1
                    arg.info[i].index = counter
                    videoObjects.push(arg.info[i])
                }

            }

            this.displayFetchedInformation(videoObjects)
            this.setState({gotData: true})

            // cache current response in localStorage with a count to access later
            localStorage.setItem(this.state.folderLevel, JSON.stringify(arg.info))
        })
    } 

    setHighlighted = (item) => {
        // mouse has entered a tab
        this.setState({highlightedTab: {[item.index]: true}})
    }

    removeHighlighted = () => {
        // mouse has left either a tab or left all the tabs
        this.setState({highlightedTab: undefined})
    }

    increaseFolderLevel = () => {
        // every time 'open folder' is clicked, 
        // increase the count to save next upcoming response
        const {folderLevel} = this.state
        this.setState({folderLevel: folderLevel+1}) 
    }

    decreaseFolderLevel = () => {

        // every time 'back button' is pressed, decrease the count to 
        // remove the topmost item stored, like Stack
        const {folderLevel} = this.state
        this.setState({folderLevel: folderLevel-1})

    }

    playVideo = (item) => {
        ipcRenderer.send(channels.PLAY_VIDEO, item.filePath)
    }

    openFolder = (item) => {

        ipcRenderer.send(channels.EXPLORE_FOLDER, item.dirPath)
        this.increaseFolderLevel()

    }

    handleButtonClick = (item) => {

        // if a folder then open otherwise play the video
        return item.dirPath ? this.openFolder(item) : this.playVideo(item)

    }

    handleBackButtonClick = () => {
        /*
         Load the previous result stored from localStorage
         Remove the current Folder info from localStorage
         Decrease folderLevel for next time 
         */
        let previousResult = JSON.parse(localStorage.getItem(this.state.folderLevel-1))
        this.displayFetchedInformation(previousResult)
        localStorage.removeItem(this.state.folderLevel)
        this.decreaseFolderLevel()
    }

    displayTabs = () => {
        
        let itemDisplayPane = this.state.items.map((singleItem) => {
            return (<div key={singleItem.index}>
                            <SingleTab 
                            item={singleItem} 
                            setHighlighted={this.setHighlighted}
                            removeHighlighted={this.removeHighlighted}
                            highlightedTab={this.state.highlightedTab}
                            handleButtonClick={this.handleButtonClick}
                            />
                    </div>)
        })

        return <div style={{
            display: "flex",
            justifyContent: "left",
            flexWrap: "wrap",
            marginLeft: "14.4%",
            marginRight: "14.4%",
            alignCcontent: "center"
        }}>{itemDisplayPane}</div>
    }

    render(){

        return(
            <center>
                <a href="#">
                <img 
                alt=""
                src={goBackIcon} 
                class={this.state.folderLevel > 0 ? 'img-style-yes-display' : 'img-style-no-display'}
                onClick={this.handleBackButtonClick}/>
                </a>
                {this.state.gotData?this.displayTabs():<SpinningLoader/>}
            </center>
        )
    }
}

export default MainWindow