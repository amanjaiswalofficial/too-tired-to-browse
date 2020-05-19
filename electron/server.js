// Contain all the backend side operations
// Library imports
const {exec} = require('child_process')

// Custom imports
const utils = require('./utils')
const models = require('./models')
const DataSequelizeModel = models.DataSequelizeModel

// Definitions
var getDataFromFileNames = utils.getDataFromFileNames
var searchDB = utils.searchDB
var getSearchStrings = utils.getSearchStrings
const FolderInformation = utils.FolderInformation


getVideoData = async (folderPath) => {    

    // TODO: Refactor code to only have a single loop
    let usageWordCount = 3 // how many words to use to make search strings
    
    const folderInfo = new FolderInformation()
    const model = new DataSequelizeModel()
    let filePaths = folderInfo.getPaths(folderPath)

    for(var index=0; index<filePaths.length; index++){

        if(!filePaths[index]['folderEmpty']){
            // if folder isn't empty, make it's searchStrings and then search for it in OMDB
            getSearchStrings(filePaths[index], usageWordCount)
            //searchDB(model, filePaths)
            await getDataFromFileNames(filePaths[index])
        }
        else
        {
            // otherwise, i.e. the folder is empty, hence remove it
            delete filePaths[index]
        }
        
    }
    return filePaths

}



playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 