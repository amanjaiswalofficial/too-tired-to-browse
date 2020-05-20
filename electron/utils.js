const axios = require('axios')
const path = require('path');
const fs = require('fs')

const {SEARCH_STRING_FOR_MOVIE, SEARCH_STRING_FOR_SERIES, 
    VALID_FILE_FORMATS, NOT_FOUND_IMAGE_URL} = require('./constants')


/*

http://www.omdbapi.com/?apikey=948a2d08&&type=[movie/series/episode]&&t=Demon+Slayer

 */
class APIMethods {

    getRequiredData = (singleObject) => {

        if(!singleObject['Poster']){
            singleObject['Poster'] = NOT_FOUND_IMAGE_URL
        }

        let data = {
            'Title': singleObject['Title'],
            'Year': singleObject['Year'],
            'Poster': singleObject['Poster']
        }
    
        return data
    }
    
    formatAPIResponse = (APIResponseArray) => {
    
        let fileSearchResponseArray = []
        //For each file, compare it's 2 results
        for(var index = 0; index < APIResponseArray.length; index+=2){
    
            let movieResponse = APIResponseArray[index].data
            let seriesResponse = APIResponseArray[index+1].data
    
            if(!movieResponse && seriesResponse){
                
                fileSearchResponseArray.push(this.getRequiredData(seriesResponse))
    
            }
            else if(movieResponse && !seriesResponse){
    
                fileSearchResponseArray.push(this.getRequiredData(seriesResponse))
    
            }
            else{
                // TODO: Fix below
                // IMP: This is also running when the data for both series and response is None
                if(parseInt(movieResponse['imdbVotes']) > parseInt(seriesResponse['imdbVotes']))
                {
                    fileSearchResponseArray.push(this.getRequiredData(movieResponse))
                }
                else{
                    fileSearchResponseArray.push(this.getRequiredData(seriesResponse))
                }
    
            }
        
        }
        return fileSearchResponseArray
    }
    
    getDataFromFileNames = async (arrayObject) => {
    
        let axiosCallArray = []
        let finalAPIResponse = []
        arrayObject.forEach((fileSearchStringsObject) => {
    
            let searchStrings = fileSearchStringsObject['searchStrings']
            let title = searchStrings[searchStrings.length -2]
            const movieQueryStringForAPI = SEARCH_STRING_FOR_MOVIE + title
            const seriesQueryStringForAPI = SEARCH_STRING_FOR_SERIES + title
            axiosCallArray.push(axios.get(movieQueryStringForAPI))
            axiosCallArray.push(axios.get(seriesQueryStringForAPI))
        })
        
        // contains 2 response for each file -> one for it's search in movies and another in DB
        // Hence, if 6 such files, then 12 results
        finalAPIResponse = await axios.all(axiosCallArray).then((response) =>{return response})
        
        return this.formatAPIResponse(finalAPIResponse)
    
    }
}
class FolderMethods {

    getFilePathFromFolders(pathArray){

        let firstFile = null
        let allFiles = null
        for(let i=0; i<pathArray.length;i++){
            if(!pathArray[i]['isFile']){
                allFiles = fs.readdirSync(pathArray[i]['dirPath'])
                firstFile = allFiles.filter((singleObject) => {
                    return VALID_FILE_FORMATS.includes(singleObject.slice(-3))
                })[0]
                if(firstFile){
                    pathArray[i]['filePath'] = pathArray[i]['dirPath']+'/"'+firstFile+'"'
                    pathArray[i]['fileName'] = firstFile
                }
                else{
                    pathArray[i]['folderEmpty'] = true
                }
            }
        }
    
    }
    
    getPaths(folderPath){
    
        // [ {index: 0, type: file/folder, path: "..."}]
        /* if type == folder, find firstFile in it and add it to object
        {
            file: "..."
        }
        else add another flag
        {
            folderEmpty: true
        }
        */
        let pathArray = []
        let isDirectory = null
        let pathCounter = 0
    
        fs.readdirSync(folderPath).forEach(file => {
    
            //check if the path is for a file or folder
            isDirectory = fs.lstatSync(folderPath+'/'+file).isDirectory()
            if(isDirectory || VALID_FILE_FORMATS.includes(file.slice(-3))){
                let info = {}
                info['index'] = pathCounter
                info['isFile'] = !isDirectory

                if(isDirectory){
                    info['dirPath'] = folderPath+'/'+file
                }
                else{
                    info['filePath'] = folderPath+'/"'+file+'"'
                }
                info['fileName'] = file
                pathCounter+=1
                pathArray.push(info)
            }   
          });
        this.getFilePathFromFolders(pathArray)
        return pathArray
    }

}

class TextMethods {

    /*
    * get possible n searchStrings from the given file name
    */
    getSearchStrings = (currentObject, n=5) => {

        let resultArray = []
        let arrayOfWords = this.getWordsFromFileName(currentObject['fileName'])
        resultArray = this.createSearchStrings(arrayOfWords, n)
        return resultArray

    }

    /*
    * Accept a file name and return all possible words from it in an array
    */
    getWordsFromFileName = (fileName) => {

        return fileName.match(/[A-Za-z0-9]+/g)

    }

    /*
    * Extract Search strings from a file's name, upto n such strings
    * Ex: 'file_name_this.mp4' will be ['file', 'file+name', 'file+name+this']
    */
    createSearchStrings = (ArrayOfAllWordsInTitle, length) => {
        let ArrayOfAllPossibleSearchStrings = []
        if(ArrayOfAllWordsInTitle){
            let lengthToSearch = ArrayOfAllWordsInTitle.length <= length ? ArrayOfAllWordsInTitle.length : length
            for(var i=1;i<=lengthToSearch;i++){
                let item = ArrayOfAllWordsInTitle.slice(0,i).join('+')
                    ArrayOfAllPossibleSearchStrings.push(item)
            }
        }
        return ArrayOfAllPossibleSearchStrings
        //Ex-['a', 'a+b', 'a+b+c']
    }
}



searchDB = async (model, filePaths) => {
    model.defineSchemas()
    let searchTagModel = model.searchTag
    let APIInfoModel = model.APIFetchedInfo
    model.syncSchema(searchTagModel)
    model.syncSchema(APIInfoModel)
    

    // filePaths.forEach((filePath) => {
        
    // })

    // const items = await model.getAllItems(schema)
    // items.forEach((item) => {
    //   console.log(item.data)
    //   console.log(item.searchStrings)
    // })
}

combineDataWithResponse = (filePaths, dataFromAPIResponse) => {
    console.log(filePaths)
    for(var index=0; index<filePaths.length; index++){
        let singleFile = filePaths[index]
        singleFile['searchResults'] = dataFromAPIResponse[index]
    }
    return filePaths
}

exports.APIMethods = APIMethods
exports.FolderMethods = FolderMethods
exports.TextMethods = TextMethods
exports.searchDB = searchDB
exports.combineDataWithResponse = combineDataWithResponse
