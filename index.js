let fileApi = require('./concat');
const conf = require('./config');
const path = require('path');
const logFileName = "log.txt";
// get files
let files = fileApi.getFiles();

function log(msg){
    fileApi.appendLogFile(logFileName, msg);
    console.log(msg);
}


files.forEach((file)=>{
    if (!path.parse(file).ext){
        return
    }
    log(`---------------Processing ${file} file---------------------`);
    let envs = fileApi.read(file);
    log(`${file} has ${envs.length} evironments`);
    let oldEnvs = envs.filter(envir => envir.TopologyInstanceName.endsWith("old"));
    log('Removing old environments..');
    if (oldEnvs && oldEnvs.length > 0) {
        envs = envs.filter(envir => !envir.TopologyInstanceName.endsWith("old"));
        log('These environments were deleted');
        oldEnvs.forEach((env)=>{
            log(env.TopologyInstanceName)
        });
    } else{
        log('No old environments found');
    }

    if (envs.length<=conf.splitCount){
        log(`Split is not requred for ${file}. Count of environemtns ${envs.length} is less than defined split count`);
        return;
    }

    log(`Spliting environments to ${conf.splitCount} ...`);
    let appendixToFileName = 1;

    let envCount = conf.splitCount;
    let start = 0;
    let end = envCount;
    while (start < envs.length) {
        let data = envs.slice(start, end);
        let splitedEnvsFileName = path.parse(file).name + "_part" + appendixToFileName + path.parse(file).ext;
        fileApi.write(data, splitedEnvsFileName)
        log(`Wrote ${data.length} environments to ${splitedEnvsFileName}..`);
        start += envCount;
        end += envCount;
        appendixToFileName+=1;
    }
});
