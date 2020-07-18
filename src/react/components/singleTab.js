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

    setHighlighted = () => {
        this.props.setHighlighted(this.props.item)
    }

    removeHighlighted = () => {
        this.props.removeHighlighted()
    }

    getClassName = () => {

        // if mouse on any Tab
        if(this.props.highlightedTab){

            // if mouse on this tab, highlight this, and fade the rest
            return this.props.highlightedTab[this.props.item.index] ? 'tab-yes-hover': 'tab-no-hover'

        } 
        else{

            // if mouse on no tab, then fade none
            return 'tab-yes-hover'
        }

        //className={this.getClassName(this.props.item)}
    }

    handleButtonClick = (item) => {

        this.props.handleButtonClick(item)
    }


    displayTab = () => {
        
        return (
            <div>
                <Card 
                className={this.getClassName()}
                id={this.props.item.index}
                onMouseEnter={this.setHighlighted}
                onMouseLeave={this.removeHighlighted}>
                
                {/* <Button style={{
                        position: "absolute",
                        top:"45%",
                        left:"41%",
                        opacity:2
                    }} onClick={event => this.handleButtonClick(this.props.item)}>
                    {this.props.item.isFile? "Play": "Open"}
                </Button> */}

                <Card.Img
                    className="img-basic-css"
                    src={`data:image/png;base64,${this.props.item.imageEncode}`} 
                />

                </Card>
                <div>
                    {this.props.item.name[1]}
                </div>
            </div>
        )  
    }

    render(){
        return(
            <div>
                {this.displayTab()}
            </div>
        )
    }
}

export default SingleTab