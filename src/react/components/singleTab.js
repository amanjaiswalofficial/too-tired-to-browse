import React from 'react'
import { Component } from 'react';
import { Card, Button, Carousel } from 'react-bootstrap'
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
        console.log(this.props.item)
    }

    doThis = (filePath) => {
    //     axios.post('http://localhost:3002/play', {
    //     filePath: filePath
    // })
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
                }} onClick={event => this.doThis(this.props.item['filePath'])}>Play</Button>
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


{/* <div style={{display:"inline-block"}}   >
                <Card style={{height: "300px", width: "200px", verticalAlign: 'middle'}}>
                <Card.Img variant="top" src={this.props.item.searchResults['Poster']} style={{objectFit: 'cover'}}/>
                <Card.Body>
                <Button style={{
                    position: "absolute",
                    top:"45%",
                    left:"41%",
                    opacity:2
                }} onClick={event => this.doThis(this.props.item['filePath'])}>Play</Button>
                </Card.Body>
                </Card>
            </div> */}