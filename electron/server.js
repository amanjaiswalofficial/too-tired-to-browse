// Contain all the backend side operations
// Library imports
const {exec} = require('child_process')

// Custom imports
const utils = require('./utils')

// Definitions
var getDataFromFileNames = utils.getDataFromFileNames
var getSearchStrings = utils.getSearchStrings
const FolderInformation = utils.FolderInformation


getVideoData = async (folderPath) => {    
    
    let usageWordCount = 3 // how many words to use to make search strings

    const folderInfo = new FolderInformation()
    let filePaths = folderInfo.getPaths(folderPath)

    filePaths = filePaths.filter((object) => {
        if(!object['folderEmpty']){
            return object
        }
    })
    
    filePaths.forEach((object) => {
        getSearchStrings(object, usageWordCount)
    })

    

    for(let i=0;i<filePaths.length;i++){
        filePaths[i]['searchResults'] = await getDataFromFileNames(filePaths[i])
    }
    console.log(filePaths)
    return filePaths

}



playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 