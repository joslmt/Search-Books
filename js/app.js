const screen = document.querySelector("#screen");
const search = document.querySelector("#search");

//Función para acceder a la REST API de Google Books.
const getBook = async (query) => {
  const api = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=6`
  );
  const data = await api.json();
  const wrapperSearch = document.querySelector("#wrapper-search");

  screen.value = "";
  wrapperSearch.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    let title = data.items[i].volumeInfo.title;
    let imagen = data.items[i].volumeInfo.imageLinks.smallThumbnail;
    wrapperSearch.innerHTML += `
                <div id='book'>
                    <h3>${title}</h3>
                    <img src="${imagen}" alt="coverBook">
                </div>`;
  }
};
const getBooksVolume = async (vol, index = 0) => {
  //console.log(vol); //fantasy, fiction, art, romance, crime ...
  const api = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:${vol}&startIndex=${index}&maxResults=4`
  );
  const data = await api.json();
  buildingVolume(data, vol);  
};

const buildingVolume = (data, vol) => {
  const wrapper = document.querySelector(".wrapper" + vol); //Donde se mostrará la información, concatenamos wrapper+vol
  for (let i = 0; i < data.items.length; i++) {
    let objeto = data.items[i].volumeInfo; 
    let title = data.items[i].volumeInfo.title;
    let description = data.items[i].volumeInfo.description;
    let imagen = data.items[i].volumeInfo.imageLinks.smallThumbnail;
    let enlace = data.items[i].volumeInfo.canonicalVolumeLink;

    //Control de errores
    if (
      objeto.hasOwnProperty("description") ||
      objeto.hasOwnProperty("pagesNumber") ||
      objeto.hasOwnProperty("smallThumbnail")
    ) {
    } else {
      description =
        "Control de errores => Descripción no disponible por el momento.";
      pagesNumber =
        "Control de errores => Número de páginas no disponible por el momento.";
      imagen = data.items[i].volumeInfo.imageLinks.thumbnail;
    }
    wrapper.innerHTML += `
            <div id='wrapper-2'>
                <h3>${title}</h3>
                <a href=${enlace} target='blank' >
                    <img src="${imagen}" alt="coverBook" id='miIMG'>
                </a>
            </div>`;
  }
};
const destroyVolume = (subject) => {
  let books = document.querySelectorAll(`.wrapper>.wrapper${subject} div`);
  books.forEach((book) => {
    book.style.display = "none";
  });
};
//Click en fward/next, primero borra los elementos, después te muestra los siguientes.
let startIndex = 0;
const fward = (subject) => {
  destroyVolume(subject);
  startIndex += 4;
  getBooksVolume(subject, startIndex);
};
const back = (subject) => {
  destroyVolume(subject);
  startIndex -= 4;
  getBooksVolume(subject, startIndex);
  if (startIndex < 0) {
    getBooksVolume(subject, (startIndex = 0));
  }
};

getBooksVolume("cooking");
getBooksVolume("fantasy");
getBooksVolume("fiction");
getBooksVolume("poetry");
getBooksVolume("romance");
getBooksVolume("art");
getBooksVolume("crime");
getBooksVolume("anthologies");
getBooksVolume("business");

search.onclick = () => getBook(screen.value);

let up = document.querySelector("#top");
up.onclick = () =>{
    window.scrollTo(0, 0);
}