const fs = require('fs')
const conf = require('./config')
const path = require('path');

exports.read = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(conf.pathFrom + "/" + filename));
    } catch (error) {
        console.error(error);
    }
}

exports.writeJson = (data, filename) => {
    const jsonString = JSON.stringify(data)
    try{
        fs.writeFileSync(filename, jsonString)
    } catch(err){
        console.error(err);
    }
}

exports.writeFile = (data, filename) => {
    try{
        fs.writeFileSync(filename, data.join("\r\n"))
    } catch(err){
        console.error(err);
    }
}

exports.getFiles = () => {
    return fs.readdirSync(conf.pathFrom);
}

exports.appendFile = (filename, msg) => {
    fs.appendFileSync(filename, msg+"\r\n")
}

exports.createFolders = () => {
    makeFolder(conf.batchFolder)
    makeFolder(conf.redeployFolder)
    makeFolder(conf.fullFilteredFilesFolder)
}

function makeFolder(directory){
    if (fs.existsSync(directory)){
        clearFolder(directory)
    }else{
        fs.mkdirSync(directory);
    }
}

function clearFolder(directory){
    directory = __dirname + directory.slice(1, directory.length)
    let files = fs.readdirSync(directory);
    for (let file of files){
        fs.unlinkSync(path.join(directory, file))
    }
}

