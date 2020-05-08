// Contain all the backend side operations
var utils = require('./utils')
const {exec} = require('child_process')
var getDataFromFileNames = utils.getDataFromFileNames
var getSearchStrings = utils.getSearchStrings
const FolderInformation = utils.FolderInformation

// app.post('/play', function(req, res){
//     exec('vlc '+req.body.filePath)
// })

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
    return filePaths

}



playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 