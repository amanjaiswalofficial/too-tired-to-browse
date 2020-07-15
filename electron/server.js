// Contain all the backend side operations
// Library imports
const {exec} = require('child_process')
const fs = require('fs')

// Custom imports
const utils = require('./utils')


getVideoData = async (folderPath) => {    

    // read all available files from folderPath
    // for each file path, execute ffmpeg to generate thumbnail
    // for each thumbnail generated, save it into a folder
    // for each such thumbnail file, create a base64
    // along with it, get the file name
    // create an object of file name & base64 of the thumbnail
    // send a collection of these objects as response
        
}



playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 