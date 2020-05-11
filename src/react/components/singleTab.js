import React from 'react'
import { Component } from 'react';
import { Card, Button, Carousel } from 'react-bootstrap'
import { channels } from '../../shared/constants'
const { ipcRenderer } = window 
//import axios from 'axios'

/*{
    index,
    isFile,
    dir_path,
    fileName,
    folderEmpty, only if folder,
    searchResults
}*/

class SingleTab extends Component {
    
    componentWillMount(){
        const { item } = this.props
    }

    performAction = (filePath) => {
        if(filePath.dirPath){
            ipcRenderer.send(channels.EXPLORE_FOLDER, filePath.dirPath)
        }
        else{
            ipcRenderer.send(channels.PLAY_VIDEO, filePath.filePath)
        }
    }

    doThisAsWell = (e) => {
        console.
        e.preventDefault()
    }

    displayTab = () => {
        
        return (
            <div style={{verticalAlign: 'middle'}}>
            <Card style={{height: '380px', width: '250px'}}>
            
            <Button style={{
                    position: "absolute",
                    top:"45%",
                    left:"41%",
                    opacity:2
                }} onClick={event => this.performAction(this.props.item)}>
                {this.props.item.isFile? "Play": "Open"}
            </Button>
            <Card.Img 
                variant="top" 
                src={this.props.item.searchResults['Poster']}
                style={{height: "100%", width: "100%", objectFit: "cover"}} 
            />

            </Card>
        </div>
        )  
    }

    render(){
        return(
            <div style={{display:"inline-block"}}>
                {this.displayTab()}
            </div>
        )
    }
}

export default SingleTab