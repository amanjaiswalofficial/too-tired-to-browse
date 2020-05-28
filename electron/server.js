// Contain all the backend side operations
// Library imports
const {exec} = require('child_process')
const fs = require('fs')

// Custom imports
const utils = require('./utils')
const models = require('./models')
const DataSequelizeModel = models.DataSequelizeModel

// Definitions
var insertDB = utils.insertDB
var searchDB = utils.searchDB
var combineDataWithResponse = utils.combineDataWithResponse
const TextMethods = utils.TextMethods
const FolderMethods = utils.FolderMethods
const APIMethods = utils.APIMethods


getVideoData = async (folderPath) => {    

    // TODO: Refactor code to only have a single loop
    let usageWordCount = 3 // how many words to use to make search strings
    
    const folderMethods = new FolderMethods()
    const model = new DataSequelizeModel()
    model.defineSchemas()
    const apiMethods = new APIMethods()
    const textMethods = new TextMethods()
    let filePaths = folderMethods.getPaths(folderPath)
    let fileSearchStringsArray = []
    let dataForFileNames = []


    for(var index=0; index<filePaths.length; index++){

        // if folder isn't empty, make it's searchStrings and then search for it in OMDB
        let currentFileItem = filePaths[index]
        if(!currentFileItem['folderEmpty']){

            let searchStringsForFile = textMethods.getSearchStrings(currentFileItem, usageWordCount)
            fileSearchStringsArray.push(
            {
                searchStrings: searchStringsForFile
            })
        }
        
    }

    searchDB(model, fileSearchStringsArray)
    filePaths = filePaths.filter((filePath) => {
        return !filePath['folderEmpty']
    })

    dataForFileNames = await apiMethods.getDataFromFileNames(model, fileSearchStringsArray)

    let finalResponse = combineDataWithResponse(filePaths, dataForFileNames)
    return finalResponse

}



playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 