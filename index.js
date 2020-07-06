let fileApi = require('./fileApi');
const conf = require('./config');
const path = require('path');
const logFileName = "log.txt";
// get files
let files = fileApi.getFiles();

function log(msg){
    fileApi.appendFile(conf.pathTo+"/"+logFileName, msg);
    console.log(msg);
}

// creates folder in ouput folder
fileApi.createFolders();

files.forEach((file)=>{
    if (!path.parse(file).ext){
        return
    }
    log(`---------------Processing ${file} file---------------------`);
    let envs = fileApi.read(file);
    log(`${file} has ${envs.length} evironments`);
    let oldEnvs = envs.filter(envir => envir.TopologyInstanceName.endsWith("old"));
    log('Removing old environments...');
    if (oldEnvs && oldEnvs.length > 0) {
        envs = envs.filter(envir => !envir.TopologyInstanceName.endsWith("old"));
        log(`Found ${oldEnvs.length} old environment(s) and removed them from the list:`);
        oldEnvs.forEach((env)=>{
            log(env.TopologyInstanceName)
        });
    } else{
        log('No old environments found');
    }

    let fullFileName = conf.fullFilteredFilesFolder+"/full_" + file
    fileApi.writeJson(envs, fullFileName)
    log(`Saved all ${envs.length} the environments without old ones to ${fullFileName}`)

    log('Saving file for Topology - Redeploy GA')
    let topologyRedepEnvs = []
    for (let env of envs){
        topologyRedepEnvs.push(`${env.TopologyInstanceName},TRUE,FALSE,TRUE,FALSE,FALSE,FALSE`)
    }
    let csvFileName = conf.redeployFolder+"/"+path.parse(file).name + ".csv";
    fileApi.writeFile(topologyRedepEnvs, csvFileName)
    log(`Saved environments for Topology Redeploy GA in  ${csvFileName}`)


    if (envs.length<=conf.splitCount){
        log(`Split is not required for ${file}. Count of environemtns ${envs.length} is less than defined split count ${conf.splitCount}`);
        let fileName = conf.batchFolder+"/" + file
        fileApi.writeJson(envs, fileName)
        log(`Saved environments in ${fileName}..`);
    } else{
        log(`Spliting environments to ${conf.splitCount} ...`);
        let appendixToFileName = 1;
    
        let envCount = conf.splitCount;
        let start = 0;
        let end = envCount;
        while (start < envs.length) {
            let data = envs.slice(start, end);
            let splitedEnvsFileName = conf.batchFolder + "/" + path.parse(file).name + "_part" + appendixToFileName + path.parse(file).ext;
            fileApi.writeJson(data, splitedEnvsFileName)
            log(`Saved ${data.length} environments in ${splitedEnvsFileName}..`);
            start += envCount;
            end += envCount;
            appendixToFileName+=1;
        }
    }
});
