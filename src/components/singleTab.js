import React from 'react'
import { Component } from 'react';
import { Card, Button, Carousel } from 'react-bootstrap'
import axios from 'axios'

/*{
    movie:{},
    series:{}
}*/

class SingleTab extends Component {
    

    componentWillMount(){
        console.log(this.props.item)
    }

    doThis = (filePath) => {
        axios.post('http://localhost:3002/play', {
        filePath: filePath
    })
    }

    displayTabs = () => {
        return this.props.item.map((singleItem) => {

            if(singleItem){
                return <div style={{display:"inline-block"}} onClick={event => this.doThis(singleItem.series['Path'])}>
                <Card style={{height: "400px", width: "300px"}}>
                <Carousel interval="false">
                    <Carousel.Item>
                        <img
                        style={{
                    width:"100%",
                    height:"398px",
                    objectFit: "cover"}}
                        src={singleItem.movie['Poster']}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        style={{
                    width:"100%",
                    height:"398px",
                    objectFit: "cover"}}
                        src={singleItem.series['Poster']}
                        />
                    </Carousel.Item>
                </Carousel>
                <Button style={{
                    position: "absolute",
                    top:"90.5%",
                    left:"66%",
                    width: "10%;"
                }}>Click Here</Button>
            </Card></div>
            }
            
        })
    }

    render(){
        return(
            <div style={{display:"inline-block"}}>
                {this.displayTabs()}
            </div>
        )
    }
}

export default SingleTab