
let forLoadArea = document.getElementById('for-load');
let fileArea =  document.getElementById('file-zone');
let form = document.getElementById('form');
let buttonUploadFiles = document.getElementById('imageUpload');
let progress = 0;
let maxSize = 32 * 1024 * 1024;
let allFilesCollect = [];
const addLightColor = () => {
    forLoadArea.classList.add('load-file-zone-active');
}
const deleteLightColor = () => {
    forLoadArea.classList.remove('load-file-zone-active');
}
function uploadFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080', true);
    xhr.onprogress = ((ev) => {
       progress = (100 * ev.loaded / ev.total);
       if (progress > 0) {
           let indicator = document.createElement('progress');
           let indicatorText = document.createElement('p');
           form.appendChild(indicator);
           form.appendChild(indicatorText);
           indicatorText.innerHTML += progress + '%';
           indicator.setAttribute('max','100');
           indicator.setAttribute('value' , progress);
           indicator.classList.add('style-progress');
           setTimeout((() => {
                if (progress === 100) {
                    indicator.style.display = 'none';
                    indicatorText.style.display = 'none';
                }
           }),200); 
       }
    })
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('good');
      }
      else if (xhr.readyState == 4 && xhr.status != 200) {
        console.log('error');
      }
    xhr.send(file);
}

const dropedFile = (buttonFile) => {
    let data = event.dataTransfer; 
    let files = data.files;
    if (files[0].size < maxSize) {
        let fileZone = document.createElement('div');
        fileArea.insertBefore(fileZone,fileArea.firstChild );
        fileArea.setAttribute('draggable','true');
        let nameFile = document.createElement('p');
        let imgFile = document.createElement('img');
        imgFile.setAttribute('src' , './img/folder.png');
        fileZone.appendChild(imgFile);
        fileZone.appendChild(nameFile);
        fileZone.style.display = 'flex';
        fileZone.style.flexDirection = 'column';
        fileZone.style.alignItems = 'center';
        nameFile.marginTop = '2%';
        fileZone.setAttribute('draggable','true');
        fileZone.style.cursor = 'pointer';
        fileZone.classList.add('file');
        nameFile.innerHTML += files[0].name.substring(0,5);
        allFilesCollect.unshift(fileZone);
        uploadFile(files);
        let checkposition = new CheckPosition(fileZone);
        checkposition.leftMove();
        checkposition.dropLeft();
        checkposition.rightMove();
        checkposition.dropRight();
    }
    else {
        alert('Over size file!')
    }
}
let dragX = false;
class CheckPosition {
    constructor(item) {
        this.item = item;
    }
    leftMove() {
        let currentItem;
        this.item.addEventListener('mousemove' , ((event) => {
            currentItem = this.item.getBoundingClientRect();
            currentItem = currentItem.right;
            event.preventDefault();
        }),false);
        this.item.addEventListener('mouseleave' , ((event) => {
            if (event.clientX > currentItem) {
                dragX = true;
                console.log(dragX);
            }
            event.preventDefault();
        }),false)
    }
    dropLeft() {
            this.item.addEventListener('mousedown' , ((event) => {
                event.preventDefault();
            }),false);
            this.item.addEventListener('mouseup' , ((event) => {
                    let rightItem =  this.item.previousSibling;
                    console.log(1);
                    if (dragX) {
                        fileArea.insertBefore(this.item, rightItem);
                    }
                    event.preventDefault();  
            }),false)
        }
    rightMove() {
        let currentItem;
        this.item.addEventListener('mousemove' , ((event) => {
            currentItem = this.item.getBoundingClientRect();
            currentItem = currentItem.right;
        event.preventDefault();
        }),false);
        this.item.addEventListener('mouseleave' , ((event) => {
            if (event.clientX < currentItem) {
                dragX = false;
                console.log(dragX);
            }
        event.preventDefault();
        }),false)
        }
    dropRight() {
        this.item.addEventListener('mousedown' , ((event) => {
                event.preventDefault();
            }),false);
            this.item.addEventListener('mouseup' , ((event) => {
                    let rightItem =  this.item.nextSibling;
                    console.log(1);
                    if (dragX == false) {
                        fileArea.insertBefore(rightItem, this.item);
                    }
                    event.preventDefault();  
            }),false)
    }
}
const buttonUpload = () => {
    if (buttonUploadFiles.files[0].size < maxSize) {
        let buttonFiles = buttonUploadFiles.files[0].name.substring(0,5);
        let fileZone = document.createElement('div');
        fileArea.insertBefore(fileZone,fileArea.firstChild );
        let nameFile = document.createElement('p');
        let imgFile = document.createElement('img');
        imgFile.setAttribute('src' , './img/folder.png');
        imgFile.style.height = '40px';
        imgFile.style.width = '40px';
        fileZone.appendChild(imgFile);
        fileZone.appendChild(nameFile);
        fileZone.style.display = 'flex';
        fileZone.style.flexDirection = 'column';
        fileZone.style.alignItems = 'center';
        fileZone.setAttribute('draggable','true');
        fileZone.style.cursor = 'pointer';
        fileZone.classList.add('file');
        allFilesCollect.unshift(fileZone);
        nameFile.marginTop = '2%';
        nameFile.innerHTML += buttonFiles;
        uploadFile(buttonUploadFiles);
        let checkposition = new CheckPosition(fileZone);
        checkposition.leftMove();
        checkposition.dropLeft();
        checkposition.rightMove();
        checkposition.dropRight();
    }
    else {
        alert('Over size file!')
    }
}
forLoadArea.addEventListener('dragover',  ((event) => {
    addLightColor();
    event.preventDefault();
}) , false);
forLoadArea.addEventListener('dragleave',  ((event) => { 
    deleteLightColor();
    event.preventDefault();
}) , false);
const drop = () => {
    forLoadArea.addEventListener('drop', ((event) => {
    event.preventDefault();
    event.stopPropagation();
    deleteLightColor();
    dropedFile();
}) ,false);
}
drop();