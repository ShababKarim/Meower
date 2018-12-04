const form = document.querySelector('form');
let loadingElement = document.querySelector('.loading');
let mewsElement = document.querySelector('.mews');
const API_URL = "http://localhost:5000/mews"; //post request here

loadingElement.style.display = '';

listAllMews();

form.addEventListener('submit', function(event){
    event.preventDefault(); //usually button click refreshes page
    let formData = new FormData(form);
    let name = formData.get('name');
    let content = formData.get('content');

    let mew = {
        name,
        content
    };

    form.style.display = 'none';
    loadingElement.style.display = '';
    //fetching data to send to server on the post request
    //will get cors error, need to allow access to server
    fetch(API_URL,{
        method: "POST",
        body: JSON.stringify(mew),
        headers:{
            "content-type": "application/json"
        }
    }).then(response => response.json())
        .then(createdMew => { //LEARN PROMISES AND THIS FUNCTION SYNTAX
        form.reset();
        setTimeout(() => {
            form.style.display = ''; //hide form 30 seconds before another input
        }, 30000);
        listAllMews();
    });
});

function listAllMews(){ //using get request this time
    mewsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
            console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                let div = document.createElement('div');

                let header = document.createElement('h3');
                header.textContent = mew.name;

                let contents = document.createElement('p');
                contents.textContent = mew.content;

                let date = document.createElement('small');
                date.textContent = new Date(mew.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                mewsElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}