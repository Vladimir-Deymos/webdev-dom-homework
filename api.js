import { DOM } from "./dom.js";

export const API = {
  url: "https://wedev-api.sky.pro/api/v1/vladimir-novikov/comments",

  
  getComments() {
  
      return fetch(this.url)
        .then((response) => {
          if (response.status === 500) {
            throw new Error("Сервер упал");
          }
          if (response.status === 200) {
            return response.json();
          }
        })
  },

  postComment(text, name) {
    return fetch(this.url,
      {
        method: "POST",
        body: JSON.stringify({
          text: text.sanitize(),
          name: name.sanitize(),
          // forceError: true,
        }),
      })
      .then(response => {
        DOM.addForm.classList.remove('hidden');
        DOM.loaderForm.innerText = '';
 
        if (response.status === 201) {
          return response.json();
        }
        if (response.status === 500) {
          throw new Error("Сервер упал");
        };
        if (response.status === 400) {
          throw new Error("Короткие вводимые данные");
        }
      })
      .then(() => {
        return this.getComments();
      })
  },

  handleError(error) {
    if (error.message === 'Failed to fetch') {
      alert("Кажется что-то пошло не так, попробуйте позже");
    };
    if (error.message === "Сервер упал") {
      alert('Сервер сломался, попробуйте позже');
    };
    if (error.message === "Короткие вводимые данные") {
      alert('Имя и комментарий должны быть не короче 3х символов');
    };
  },
}
