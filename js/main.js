// import {LocalDateTime, DateTimeFormatter} from '@js-joda/core';
import {DateTimeFormatter, LocalDateTime} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';


const tabLinks = document.getElementsByClassName('tab-links');
const tabContents = document.getElementsByClassName('tab-contents');
console.log($===jQuery);
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
const barElm=$('.pgp');




btnImageSelection.on('click',(event)=>{
    console.log(event);
    fileInput.trigger('click') ;
    event.preventDefault();

});

btnFileSelection.on('click',(event)=>{

   fileInput.trigger('click');
   event.preventDefault();
});
fileInput.on('change',(event)=>{
changeEventCount++;

    const AllFiles = event.target.files;
    const imageFiles = Array.from(AllFiles).filter(file=>file.type.startsWith("image/"));

    length = imageFiles.length;
    if(length>0){
        if(changeEventCount===1){
            uploadImages(imageFiles,changeEventCount);
        }else {
            uploadImages(imageFiles,changeEventCount*2);
        }

        console.log(changeEventCount);
    }else{
        const pdfFiles = Array.from(AllFiles).filter(file=>file.type.startsWith("pdf/"));
        uploadFiles(pdfFiles)
    }

});
p1.on('click', function() {
    opentab('skills');
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
    eventData.preventDefault();

    const date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")).toString();
    const name = txtName.val().trim();
    const email = txtEmail.val().trim();
    const messages = txtComments.val().trim();
    const organization = txtOrganization.val().trim();

    const message = {
      date,name,email,messages,organization
    };

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                resetForm(true);
                    txtName.focus();
                showToast('success', 'Saved', 'Message sent successfully');
            } else {
                const errorObj = JSON.parse(xhr.responseText);
                showToast('error', 'Failed to send', errorObj.message);
            }
        }
    });



    xhr.open('POST', 'http://localhost:8080/app/messages', true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log(message);
    xhr.send(JSON.stringify(message));
    console.log(message);
});



function resetForm(clearData) {
    if (clearData) {
        console.log(clearData);
       txtName.val("");
        txtEmail.val("");
       txtComments.val("");
       txtOrganization.val("");

    }
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
    }, 5000);
}

function uploadImages(images,size){

    const formData = new FormData();

    const selectedImage = images[0];
    console.log(selectedImage);
    if(!selectedImage) return;
    const fileName = selectedImage.name;
    const closeElm=$('<div class="close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">\n' +
        '  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>\n' +
        '</svg></div>')
    const outerDiv = $('<div class="elementDiv"></div>').attr('style', `margin-top: ${size}px`);
    const nameDiv = $('<div class="file"></div>').text(fileName);
    const progressBarElmContainer = $('<div class="pgb-container"></div>').css('display','inline-block');
    const progressBarElm = $('<div class="pgb"></div>').css('display','inline-block');

    progressBarElmContainer.append(progressBarElm);
    console.log(progressBarElmContainer);
    outerDiv.append(nameDiv, progressBarElmContainer,closeElm);
    fileAdd.append(outerDiv);
    //fileAdd.append($('<div class="file"></div>').append($('<div class="pgp"></div>')).attr('style', `margin-top: ${size}px`).text(fileName));

   console.log(size);
    formData.append("iamgeKey",images);

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange',function (event){

    });
    xhr.addEventListener('progress',function (event){
        console.log("inside progress")
        const loadedFileSize = event.loaded;
        const totalFileSize = event.total;
        const progressPercentage=(loadedFileSize/totalFileSize*100).toFixed(2)  + "%";
        progressBar(progressBarElm,progressPercentage);

    });

    xhr.open('POST','http://localhost:8080/app/messages',true);

    xhr.send(formData);


}



function progressBar(element,value){
    console.log("ok");
    element.css('width',value);

}







