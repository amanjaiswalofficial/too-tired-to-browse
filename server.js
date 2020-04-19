var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors')
const { exec } = require('child_process');
const ThumbnailGenerator = require('video-thumbnail-generator').default;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var utils = require('./backend/utils')
var getDataFromFileNames = utils.getDataFromFileNames
var getFileNamesFromPath = utils.getFileNamesFromPath
var getSearchStrings = utils.getSearchStrings
const FolderInformation = utils.FolderInformation

let folderPath = null
//to disable
folderPath = "/home/aman/Videos"
let fileNameArray = []



//EITHER THIS
app.use(cors())
app.options('*', cors());

//OR THIS is WORKING
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
//   });

//get folder path from the electron application
app.post('/', function(req, res) {
    folderPath = req.body.folder_path.filePaths[0]
    console.log(folderPath)
    fs.readdirSync(folderPath).forEach(file => {
        console.log(file);
      });
});


app.post('/play', function(req, res){
    exec('vlc '+req.body.filePath)
})

//
app.get('/test', async function(req, res){
    
    
    let usageWordCount = 3 // how many words to use to make search strings

    const folderInfo = new FolderInformation()
    let filePaths = folderInfo.getPaths(folderPath)
    
    filePaths.forEach((object) => {
        getSearchStrings(object, usageWordCount)
    })

    for(let i=0;i<filePaths.length;i++){
        filePaths[i]['searchResults'] = await getDataFromFileNames(filePaths[i])
    }

    res.send(filePaths)    
    
    //Play video
    //exec('vlc '+folderPath+"/'"+fileNames[1]+"'")




    //Working
    // for(i=0;i<searchStrings.length;i++){

    //     finalResult.push(await getDataFromFileNames(searchStrings[i]))

    // }
    // res.send(finalResult)


    // let sampleResponse = [
    //     {
    //         "movie": {
    //             Poster: "https://m.media-amazon.com/images/M/MV5BMTI3OTMyMjQ2OV5BMl5BanBnXkFtZTcwOTY3ODI0MQ@@._V1_SX300.jpg",
    //             Year: "2004",
    //             Title: "Demon Slayer",
    //             Path: folderPath+"/'"+fileNames[1]+"'"
    //         },
    //         "series":{
    //             Poster: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_SX300.jpg",
    //             Title: "Demon Slayer: Kimetsu No Yaiba",
    //             Year: "2019-",
    //             Path: folderPath+"/'"+fileNames[1]+"'"

    //         }
    //     }
    // ]
    // res.send(sampleResponse)

})


app.listen(3002, function(err) {
    if (err) {
        return console.error(err);
    }
})


/*
Procfile config
react: npm start
electron: npm run electron
node: nodemon server
*/



/*
get all file names from a folder -> store it in array DONE
take one file name, find all possible words, and then make single strings based on combination of those words based on no of words like A,A+B
get the first 3 or 5 such searchstrings from every file name -> DONE
for each make 2 hits one for movie and one for tv show, if both exist, store data from both or else save from the one that exist, dont make any more hits if match found
store all the information for all the files in a location and then return it to the frontend
*/