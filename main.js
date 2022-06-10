//https://docs.thecatapi.com/

const api = axios.create({ baseURL: 'https://api.thecatapi.com/v1' });
api.defaults.headers.common['x-api-key'] = 'a97e3d9e-9679-47e3-9eb0-cd4806ed88ef';

const api_url = 'https://api.thecatapi.com/v1/images/search?limit=4';
const api_url_favorites = 'https://api.thecatapi.com/v1';
const api_url_upload = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('spanError');
const spanMessage = document.getElementById('spanMessage');

const buttonReload = document.getElementById('reload');
const buttonSave2 = document.getElementById('button2');
const buttonSave3 = document.getElementById('button3');

//Random Cats
const catsRandom = async() => {
    
    const { data, status } = await api('/images/search?limit=4');
    
    if (status !== 200) {
        spanError.innerHTML = `Ups... hubo un error. ${status}. ${data.message}`
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const img4 = document.getElementById('img4');
        
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;
        
        const buttonSave1 = document.getElementById('button1');
        buttonSave1.onclick = () => saveFavoriteCats(data[0].id);
        
        const buttonSave2 = document.getElementById('button2');
        buttonSave2.onclick = () => saveFavoriteCats(data[1].id);
        
        const buttonSave3 = document.getElementById('button3');
        buttonSave3.onclick = () => saveFavoriteCats(data[2].id);
        
        const buttonSave4 = document.getElementById('button4');
        buttonSave4.onclick = () => saveFavoriteCats(data[3].id);
    }

    console.log('Random:', data);
}
catsRandom();

//Favorite Cats
const favoriteCats = async() => {

    const { data, status } = await api('/favourites');

    console.log('Favoritos:', data);
    if (status !== 200) {
        spanError.innerHTML = `Ups... hubo un error. ${status}. ${data.message}`
    } else {
        const section = document.getElementById('favoriteImages');
        section.innerHTML = '';
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Imágenes Favoritas');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(element => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const button = document.createElement('button');
            const buttonText = document.createTextNode('Eliminar de Favoritos');
            
            section.appendChild(article);
            article.appendChild(img);
            article.appendChild(button);
            button.appendChild(buttonText);
            
            //Create to button delete
            button.onclick = () => deleteFavoriteCats(element.id);

            img.src = element.image.url;
            
        });
    }
}
favoriteCats();

//Save in Favorites
const saveFavoriteCats = async(id) => {

    const { data, status } = await api.post('/favourites', { image_id: id });

    if (status !== 200) {
        spanError.innerHTML = `Ups... hubo un error. ${status}. ${data.message}`;
    } else {
        spanMessage.innerHTML = '¡Imagen guardada correctamente!';
        favoriteCats();
    }

}

//Delete Favorites
const deleteFavoriteCats = async(id) => {

    const { data, status } = await api.delete(`/favourites/${id}`, { image_id: 'id' });

    if (status !== 200) {
        spanError.innerHTML = `Ups... hubo un error. ${status}. ${data.message}`;
    } else {
        spanMessage.innerHTML = '¡Imagen eliminada correctamente!';
        favoriteCats();
    }
}

//Upload imagen
const uploadImageCat = async() => {
    
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    // const { data, status } = await api.post('/images/upload', { file: file });

    const res = await fetch(api_url_upload, {
        method: 'POST',
        headers: { 'x-api-key': 'a97e3d9e-9679-47e3-9eb0-cd4806ed88ef' },
        body: formData,
    });
    const data = await res.json();
    
    if (res.status !== 201) {
        spanError.innerHTML = `Ups... hubo un error. ${res.status}. ${data.message}. Recarga la página y verifica que has seleccionado un archivo con formato JPG`;
    } else {
        spanMessage.innerHTML = '¡Foto subida exitosamente!';
        console.log({data});
        console.log(data.url);
        saveFavoriteCats(data.id);
    }

}

buttonReload.onclick = catsRandom;
