// Contain all the backend side operations
// Library imports
const exec = require('await-exec')
const fs = require('fs')
var path = require('path')
const imageToBase64 = require('image-to-base64');

// Custom imports
 
const isVideo = (fileName) => {
    let acceptable = [".mp4", ".mkv"]
    let fileExtension = path.extname(fileName)
    if(acceptable.includes(fileExtension)){
        return true
    }
    return false
}

const checkVideoFromDir = (folderPath, name) => {


    let videoObject = {
        "path":`${folderPath}/'${name}'`,
        "name": name,
        "isVideo":false,
    }

    fs.readdirSync(`${folderPath}/${name}`).forEach(item => {
        
        if(fs.lstatSync(`${folderPath}/${name}/${item}`).isFile() && isVideo(item)){
            videoObject.name = item
            videoObject.path = `${folderPath}/'${name}'/'${item}'`
            videoObject.isVideo = true
        }

    })

    return videoObject
}

const checkFileForVideo = (folderPath, name) => {

    let videoObject = {
        "path":`${folderPath}/'${name}'`,
        "name": name,
        "isVideo":false,
    }
    if(isVideo(name)){
        videoObject.isVideo = true
    }
    return videoObject

}

const generateThumbnail = async (command) => {

    await exec(command, (err, stdout, stdin) => {
       if(err){
        console.log(err)
       }    
    })

}

const getVideoData = async (folderPath) => {    
    
    let isItemAFile = {
        true: checkFileForVideo,
        false: checkVideoFromDir
    }

    let videoFiles = []

    // iterate over each file
    fs.readdirSync(folderPath).forEach(item => {
            
            let typeStatus = fs.lstatSync(`${folderPath}/${item}`).isFile()     
            let fileStatus = isItemAFile[typeStatus](folderPath, item)
            videoFiles.push(fileStatus)

      });

    for(var index = 0; index < videoFiles.length; index++){

        let videoObject = videoFiles[index]
        if(videoObject.isVideo){

            let filename = 
            videoObject.name.match(/[A-Za-z0-9]+/g).join("-")
            let saveDirPath = `/home/aman/Desktop/thumbnail/${filename}-thumbnail.png`
            let ffmpegThumbnailCommand = `ffmpeg -y -i ${videoObject.path} -ss 00:00:01.000 -vframes 1 ${saveDirPath}`
            
            // TODO: to check status of command execution
            if(!fs.existsSync(saveDirPath)){
                await generateThumbnail(ffmpegThumbnailCommand)
            }
            
            
            // exec(ffmpegThumbnailCommand, (error, stdout, stderr) => {
            //     if (error) {
            //         console.error(`exec error: ${error}`);
            //         return;
            //     }
            //     return "abc"
            // }); 
            

            videoObject.imageEncode = 
            await imageToBase64(saveDirPath).then((response) => {
                return response
            })
        }

    }
    return videoFiles
        
}



const playVideo = (videoPath) => {

    exec('vlc -d '+videoPath)

}

exports.getVideoData = getVideoData
exports.playVideo = playVideo 