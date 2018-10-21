const form = document.querySelector('form');
let loadingElement = document.querySelector('.loading');

loadingElement.style.display = 'none';

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
    console.log(mew);
});