import './singleTab.css' 
import React from 'react'
import { Component } from 'react';
import { Card, Button} from 'react-bootstrap'

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

    setHighlighted = (item) => {
        this.props.setHighlighted(item)
    }

    removeHighlighted = () => {
        this.props.removeHighlighted()
    }

    getClassName = (item) => {

        // if mouse on any Tab
        if(this.props.highlightedTab){

            // if mouse on this tab, highlight this, and fade the rest
            return this.props.highlightedTab[item.index] ? 'tab-no-hover': 'tab-yes-hover'

        } 
        else{

            // if mouse on no tab, then fade none
            return 'tab-no-hover'
        }
    }

    handleButtonClick = (item) => {

        this.props.handleButtonClick(item)

    }


    displayTab = () => {
        
        return (
            <div style={{verticalAlign: 'middle'}}>
            <Card 
            className={this.getClassName(this.props.item)}
            id={this.props.item.index}
            onMouseEnter={e => this.setHighlighted(this.props.item)}
            onMouseLeave={this.removeHighlighted}>
            
            <Button style={{
                    position: "absolute",
                    top:"45%",
                    left:"41%",
                    opacity:2
                }} onClick={event => this.handleButtonClick(this.props.item)}>
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