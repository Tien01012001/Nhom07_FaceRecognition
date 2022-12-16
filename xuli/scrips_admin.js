const fs = require('fs')
const path = require('path')

const container = document.querySelector("#containerAdmin");
const mySelect = document.getElementById("mySelect");
const btnAdd = document.getElementById("add");
const btnDelete = document.getElementById("delete");

async function init(container){
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../models')
    await faceapi.nets.faceExpressionNet.loadFromUri('../models');

    let pathNameLabel = path.join(__dirname, '../data')
    const labels=[]
    if( fs.existsSync(pathNameLabel) ) {
        fs.readdirSync(pathNameLabel).forEach(async function(label,index){
            labels.push(label);
        });  
    }
 
    for(const label of labels){
        var newop = document.createElement('OPTION')
        
        var newopval = document.createTextNode(label)
        newop.appendChild(newopval);
        mySelect.insertBefore(newop,mySelect.firstChild)
    }
    loadImage(labels[0],container)
}
init(container)



async function loadImage(label,container){
    
    let folderLabel = path.join(__dirname, '../data/',label)
    let count = fs.readdirSync(folderLabel).length

    for(let i = 1; i<=count;i++){
        const image = await faceapi.fetchImage(`../data/${label}/${i}.jpg`);
        console.log(typeof(image))
        if(image == undefined){
            console.log(`ảnh ${i}.jpg của folder ${label} không tìm thấy khuôn mặt`)
        }
        else{
            container.append(image)
        }
    }
    
}

async function loadAllbyLabel(){
    container.innerHTML="";
    const mySelectValue = document.getElementById("mySelect").value;

    loadImage(mySelectValue,container)

    
}

mySelect.addEventListener('change', async (e) =>{
    loadAllbyLabel()
})
btnAdd.addEventListener("click",async function(){
    const file = fileImage.files[0].path;
    let label = document.getElementById("mySelect").value;

    
    let pathName = path.join(__dirname, '../data/',label)
    const length = fs.readdirSync(pathName).length+1
    let dcimage= path.join(pathName,String(length)+".jpg")
    fs.readFile(file,function(err,data){
        fs.writeFile(dcimage,data,function(err){
            if(err){
                return console.log(err)
            }
            console.log("thanh cong")
            loadAllbyLabel()
        })
    })
})

btnDelete.addEventListener('click',()=>{
    let label = document.getElementById("mySelect").value;
    let pathNameDelete = path.join(__dirname, '../data/',label)
    // fs.rmdir(pathNameDelete,(err) => {
    //     if(err) throw err;
    //     console.log('myText.txt was deleted');
    // });
    // var deleteFolderRecursive = function(pathNameDelete) {
        if( fs.existsSync(pathNameDelete) ) {
          fs.readdirSync(pathNameDelete).forEach(function(file,index){
            var curPath = pathNameDelete + "/" + file;
            console.log(file)
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(pathNameDelete);
          alert("xóa thành công")
        }

        setTimeout(loadAllbyLabel, 5000)
})

