// Contain all the backend side operations
var utils = require('./utils')
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
    
    filePaths.forEach((object) => {
        getSearchStrings(object, usageWordCount)
    })

    filePaths = filePaths.filter((object) => {
        if(!object['folderEmpty']){
            return object
        }
    })

    for(let i=0;i<filePaths.length;i++){
        filePaths[i]['searchResults'] = await getDataFromFileNames(filePaths[i])
    }

    //console.log(filePaths)
    return filePaths

}

exports.getVideoData = getVideoData 