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

    constructor(props) {
        super(props)
        this.setState ({
            cursorSide: null
        })
    }

    setHighlighted = (element) => {
        //console.log(window.innerHeight-element.pageY)
        const cursorSide = element.pageX<window.innerWidth/2 ? "left": "right"
        this.setState({cursorSide})
        console.log(this.state)
        this.props.setHighlighted(this.props.item)
    }

    removeHighlighted = () => {
        this.props.removeHighlighted()
    }

    getMetaClass = () => {
     
        // if mouse on any Tab
        if(this.props.highlightedTab){

            // if mouse on this tab, highlight this, and fade the rest
            return this.props.highlightedTab[this.props.item.index] ? `meta-yes-hover-${this.state.cursorSide}`: 'meta-no-hover'

        } 
        else{

            // if mouse on no tab, then fade none
            return 'meta-no-hover'
        }

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

    formatFileName = () => {

        let fileName = this.props.item.name
        let nameLength = Math.floor(this.props.item.name.length / 26)
        let formattedName = ""
        // 0, 26
        // 26,52
        // 52, 
        for(let index = 0; index <= nameLength; index ++){
            formattedName = formattedName + fileName.substring(index*26, (index+1)*26) + "\n"
        }
        return formattedName
    }

    displayTab = () => {
        
        return (
            <div className={this.getClassName()}
                id={this.props.item.index}
                onMouseEnter={this.setHighlighted}
                onMouseLeave={this.removeHighlighted}>
                <div style={{float:"left"}}><img className="img-basic-css"
                    src={`data:image/png;base64,${this.props.item.imageEncode}`} alt=""/></div>
                <div className={this.getMetaClass()}>{this.formatFileName()}</div>
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