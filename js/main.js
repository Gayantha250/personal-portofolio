// import {LocalDateTime, DateTimeFormatter} from '@js-joda/core';
import {DateTimeFormatter, LocalDateTime} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';


const tabLinks = document.getElementsByClassName('tab-links');
const tabContents = document.getElementsByClassName('tab-contents');

const p1 = $('#p1');
const p2 = $('#p2');
const p3 =$('#p3');
const btnClose = $('#btnClose');
const btnOpen = $('#btnOpen');

p1.addEventListener('click', function() {
    opentab('skills');
});

p2.addEventListener('click', function() {
    opentab('experience');
});

p3.addEventListener('click', function() {
    opentab('education');
});
btnClose.addEventListener('click', function() {
    closemenu();
});

btnOpen.addEventListener('click', function() {
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
const txtMessage = $('#textarea-message');
const btnSubmit = $('#btnSubmit');



btnSubmit.addEventListener('click', function(eventData) {
    eventData.preventDefault();

    const date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")).toString();
    const name = txtName.value.trim();
    const email = txtEmail.value.trim();
    const messages = txtMessage.value.trim();

    const message = {
      date,name,email,messages
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
        txtName.value = '';
        txtEmail.value = '';
        txtMessage.value = '';
    }
}

function showToast(toastType, header, message) {
    const toast =$("#toast .toast");
    toast.classList.remove("text-bg-success", "text-bg-warning", "text-bg-danger");
    switch (toastType) {
        case 'success':
            toast.classList.add('text-bg-success');
            break;
        case 'warning':
            toast.classList.add('text-bg-warning');
            break;
        case 'error':
            toast.classList.add('text-bg-danger');
            break;
        default:
            break;
    }
    $("#toast .toast-header > strong").textContent = header;
   $("#toast .toast-body").textContent = message;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 5000);
}







