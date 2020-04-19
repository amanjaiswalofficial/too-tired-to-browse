import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const SpinningLoader = () => {

    //timeout={3000} property to add to stop in n seconds

    return(
        <Loader
           type="Puff"
           color="#00BFFF"
           height={100}
           width={100} 
        />
    )
}

export default SpinningLoader