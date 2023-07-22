// import {LocalDateTime, DateTimeFormatter} from '@js-joda/core';
import {DateTimeFormatter, LocalDateTime} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';


const tabLinks = document.getElementsByClassName('tab-links');
const tabContents = document.getElementsByClassName('tab-contents');
const p1 = $('#p1');
const p2 = $('#p2');
const p3 =$('#p3');
const btnClose = $('#btnClose');
const btnOpen = $('#btnOpen');
const btnUpload = $('#btn-upload');
const btnImageSelection = $('#btn-image-selection');
const btnFileSelection=$('#btn-file-selection');
const fileInput = $('#fileInput');
const fileAdd = $("#file-save");
const progressBarElm = $('#pgp');
let length="";
let changeEventCount=0;
let changeFileCount=0;
const barElm=$('.pgp');
let upload=true;
let uploadImg=true;



btnImageSelection.on('click',(event)=>{

    fileInput.trigger('click') ;
    event.preventDefault();

});

btnFileSelection.on('click',(event)=>{

   fileInput.trigger('click');
   event.preventDefault();
});
fileInput.on('change',(event)=>{
changeEventCount++;
changeFileCount++;
// .filter(file=>file.type.startsWith("image/"));
    const AllFiles = event.target.files;
    const allfile = Array.from(AllFiles);
    const imageFiles = allfile.filter(file => true);
    console.log(imageFiles);
  //  deleteImage(imageFiles);



    length = imageFiles.length;
    if(length===1){
        if(changeEventCount===1){
            imageFiles.forEach(images=>{
                uploadImages(images,changeEventCount);
                upload=false;
            });

        }else {
            imageFiles.forEach(images=>{
                uploadImages(images,changeEventCount*2);
                upload=false;
            });
        }
    }

});
p1.on('click', function() {
    opentab('skill');
});

p2.on('click', function() {
    opentab('experience');

});

p3.on('click', function() {
    opentab('education');
});
btnClose.on('click', function() {
    closemenu();
});

btnOpen.on('click', function() {
    openmenu();
});

fileAdd.on('click','.close',function (eventData) {
    const fileName = $(this).siblings('.file').text();
    deleteFile(fileName);
    $(this).closest('.elementDiv').remove();

});



// function deleteImage(imageArray){
//     let AllImages=[];
// imageArray.forEach(images=>{
//     AllImages.push(images);
// })
//
//     return AllImages;
// }

function opentab(tabname) {
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active-link');
    }
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active-tab');
    }
    event.currentTarget.classList.add('active-link');
    document.getElementById(tabname).classList.add('active-tab');
}

// JavaScript code for opening and closing the side menu
var sidemenu = document.getElementById('sidemenu');

function openmenu() {
    sidemenu.style.right = '0';
}

function closemenu() {
    sidemenu.style.right = '-150px';
}

const txtName = $('#input-name');
const  txtEmail = $('#input-email');
const txtComments = $('#comments');
const txtOrganization=$('#organization');
const btnSubmit = $('#btnSubmit');




btnSubmit.on('click', function(eventData) {
    upload=true;
    eventData.preventDefault();
    resetFiles();

    const date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")).toString();
    const name = txtName.val();
    const email = txtEmail.val();
    const messages = txtComments.val();
    const organization = txtOrganization.val();

   if(validation()) {

       const message = {
           date, name, email, messages, organization
       };

       const xhr = new XMLHttpRequest();

       xhr.addEventListener('readystatechange', function () {
           if (xhr.readyState === 4) {
               if (xhr.status === 201) {
                   resetForm(true);


                   txtName.focus();
                   showToast('success', 'Saved','Saved Successfully');
                   console.log("inside submit")
               } else {
                   const errorObj = JSON.parse(xhr.responseText);
                   showToast('error', 'Failed to send', errorObj.message);
                   console.log("else error inside xhr");
               }
           }
       });


       xhr.open('POST', 'http://localhost:8080/app/messages', true);

       xhr.setRequestHeader('Content-Type', 'application/json');
       console.log(message);
       xhr.send(JSON.stringify(message));
       uploadImages();

   }else {
       showToast('error', 'Failed to send', 'fields can not be empty or add correct values');
       console.log("else error");
   }
});


function  deleteFile(fileName){

    console.log("inside the uploadUrl");
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange',(evt)=>{
            if(xhr.status===204 && xhr.readyState===4){
                showToast('warning','Deleted','File Deleeted Successfully');
            }
        });
        xhr.open('DELETE', `http://localhost:8080/app/messages/images/${fileName}`, true)
        xhr.send();
}



function validation(){
let validate=true;
    const name = txtName.val();
    const email = txtEmail.val();
    const messages = txtComments.val();
    const organization = txtOrganization.val();


    if(!name){

        validate=false;
    }else if (/^[A-Za-z]+ $/.test(name)){
        validate=false;
    }

    if(!email){
        validate=false;
    }

    if(!messages){
    validate=false;
    }else if(/^[A-Za-z]+ $/.test(messages)){
        validate=false;
    }

    if(!organization){
       validate=false;
    }else if(/^[A-Za-z]+ $/.test(organization)){

        validate=false;
    }
    return validate;
}
function resetForm(clearData) {
    if (clearData) {

       txtName.val("");
        txtEmail.val("");
       txtComments.val("");
       txtOrganization.val("");

    }
}

function resetFiles() {
    fileAdd.find('.elementDiv').each(function() {
        $(this).remove();
    });
}

function showToast(toastType, header, message) {
    const toast =$("#toast .toast");
    toast.removeClass("text-bg-success", "text-bg-warning", "text-bg-danger");
    switch (toastType) {
        case 'success':
            toast.addClass('text-bg-success');
            break;
        case 'warning':
            toast.addClass('text-bg-warning');
            break;
        case 'error':
            toast.addClass('text-bg-danger');
            break;
        default:

    }
    $("#toast .toast-header > strong").text(header);
   $("#toast .toast-body").text(message);
        toast.addClass('show');

    setTimeout(function() {
        toast.removeClass('show');
    }, 2000);
}

function uploadImages(images,size){

    const formData = new FormData();

    // var files= images[0].files;

    const  selectedImage = images;

    if(!selectedImage){
        uploadImg=false;
        return;
    }
    const fileName = selectedImage.name;

    const closeElm=$('<div class="close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">\n' +
        '  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>\n' +
        '</svg></div>')
   const  outerDiv = $('<div class="elementDiv"></div>').attr('style', `margin-top: ${size}px`);
    const nameDiv = $('<div class="file"></div>').text(fileName);
    const progressBarElmContainer = $('<div class="pgb-container"></div>').css('display','inline-block');

    const progressBarElm = $('<div class="pgb"></div>').css('display','inline-block');

    progressBarElmContainer.append(progressBarElm);
    outerDiv.append(nameDiv, progressBarElmContainer,closeElm);
    fileAdd.append(outerDiv);


    formData.append("imageKey",selectedImage);

    const xhr = new XMLHttpRequest();
    const xhrUploading = xhr.upload;

    xhr.addEventListener('readystatechange',function (event){

        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 201) {

                console.log("inside upload image")

              progressBarElm.css('width','100%');
            } else {
                const errorObj = JSON.parse(xhr.responseText);
                console.log("inside else in upload image");
                showToast('error', 'Failed to send Image', errorObj.message);
                progressBarElm.css('width','10%');
            }
        }
    });


    xhrUploading.addEventListener('progress',function (event){

        const loadedFileSize = event.loaded;
        const totalFileSize = event.total;
        const progressPercentage=(loadedFileSize/totalFileSize*100).toFixed(2)  + "%";
        // progressBarElm.css('width',progressPercentage);
        progressBarElm.css('transition', 'width 1s ease-in-out');
        console.log(progressPercentage);
    });
        xhr.open('POST','http://localhost:8080/app/messages',true);
        xhr.send(formData);
}









