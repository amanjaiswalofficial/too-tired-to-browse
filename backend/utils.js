const axios = require('axios')
const fs = require('fs')

const BASE_SEARCH_STRING = "http://www.omdbapi.com/?apikey=948a2d08&&"
const SEARCH_STRING_FOR_MOVIE = `${BASE_SEARCH_STRING}type=movie&&t=`
const SEARCH_STRING_FOR_SERIES = `${BASE_SEARCH_STRING}type=series&&t=`

/*

http://www.omdbapi.com/?apikey=948a2d08&&type=[movie/series/episode]&&t=Demon+Slayer

 */

getDataFromFileName = async (title, checkForMovie, checkForSeries) => {

    let APIResponseForMovies
    let APIResponseForSeries
    if(checkForMovie){
        const movieQueryStringForAPI = SEARCH_STRING_FOR_MOVIE + title
        APIResponseForMovies = await axios.get(movieQueryStringForAPI, {timeout: 10000}).then((response) =>{ return response})
    }
    if(checkForSeries){
        const seriesQueryStringForAPI = SEARCH_STRING_FOR_SERIES + title
        APIResponseForSeries = await axios.get(seriesQueryStringForAPI).then((response) =>{ return response})
        
    }
    return [APIResponseForMovies, APIResponseForSeries]
}

getDataFromFileNames = async (singleObject) => {

    
    let responses = []
    let movieResponse = {}
    let seriesResponse = {}
    let checkForMovie = true
    let checkForSeries = true
    let finalMovieResponse = null
    let finalSeriesResponse = null
    let arrayOfWords = singleObject['searchStrings']
    console.log(singleObject)
    if(arrayOfWords.length && singleObject['isFile'] || !singleObject['isFile'] && singleObject['filePath']){
        for(var index=arrayOfWords.length-1;index>=0;index--){
            let movie = null
            let series = null
            responses = await getDataFromFileName(arrayOfWords[index], checkForMovie, checkForSeries)
            if(responses){
                // get the movie and series response from the hit
                movie = responses[0]
                series = responses[1]
                
                //If a movie is found, then stop looking for more movies
                if(typeof movie != 'undefined' && 'Title' in movie.data && checkForMovie){
                    checkForMovie = false
                    movieResponse = movie.data        
                }
                //If a series is found then stop looking for more series
                if(typeof series != 'undefined' && 'Title' in series.data && checkForSeries){
                    checkForSeries = false
                    seriesResponse = series.data
                }
            }
            
        }

    }
    finalMovieResponse = {
        'Title': movieResponse['Title'],
        'Year': movieResponse['Year'],
        'Poster': movieResponse['Poster']
    }

    finalSeriesResponse = {
        'Title': seriesResponse['Title'],
        'Year': seriesResponse['Year'],
        'Poster': seriesResponse['Poster']
    }
    delete singleObject['searchStrings']

    // currently returning the more famous response
    if(movieResponse['imdbVotes'] > seriesResponse['imdbVotes']){
        return movieResponse
    }else{
        return seriesResponse
    }
    //return [finalMovieResponse, finalSeriesResponse]
}


getSearchStrings = (currentObject, n=5) => {

    let resultArray = []
    if(currentObject['isFile']){
        let arrayOfWords = getWordsFromFileName(currentObject['fileName'])
        resultArray = createSearchStrings(arrayOfWords, n)
    }
    currentObject['searchStrings'] = resultArray

}

//Accept a file name and return all possible words from it in an array
getWordsFromFileName = (fileName) => {

    return fileName.match(/[A-Za-z0-9]+/g)

}

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



class FolderInformation {

    getFilePathFromFolders(pathArray){

        let firstFile = null
        for(let i=0; i<pathArray.length;i++){
            if(!pathArray[i]['isFile']){
                firstFile = fs.readdirSync(pathArray[i]['dirPath'])[0]
                console.log(firstFile)
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
        let directoryFlag = {
            true: "folder",
            false: "file"
        }
    
        fs.readdirSync(folderPath).forEach(file => {
    
            //check if the path is for a file or folder
            isDirectory = fs.lstatSync(folderPath+'/'+file).isDirectory()
            
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
          });
        
        
        this.getFilePathFromFolders(pathArray)
    
        return pathArray
    
    }

}





exports.getDataFromFileNames = getDataFromFileNames
exports.getSearchStrings = getSearchStrings
exports.FolderInformation = FolderInformation
