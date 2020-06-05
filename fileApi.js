const fs = require('fs')
const conf = require('./config')

exports.read = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(conf.pathFrom + "/" + filename));
    } catch (error) {
        console.error(error);
    }
}

exports.write = (data, filename) => {
    const jsonString = JSON.stringify(data)
    try{
        fs.writeFileSync(conf.pathTo + "/" + filename, jsonString)
    } catch(err){
        console.error(err);
    }
    
}

exports.getFiles = () => {
    return fs.readdirSync(conf.pathFrom);
}

exports.appendLogFile = (filename, msg) => {
    fs.appendFileSync(conf.pathTo + "/" + filename, msg+"\r\n")
}