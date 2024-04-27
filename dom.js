import { API } from "./api.js";

export const DOM = {
  nameInputElement: document.querySelector(".add-form-name"),
  textInputElement: document.querySelector(".add-form-text"),
  buttonElement: document.querySelector(".add-form-button"),
  addForm: document.querySelector(".add-form"),
  loaderComment: document.querySelector(".preloader"),
  loaderForm: document.querySelector(".loader"),
  listElement: document.getElementById("list"),

  comments: [],

  getComments() {
    API.getComments()
      .then((responseData) => {
        this.comments = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            date: new Date(comment.date).format(),
            text: comment.text,
            likeCount: 0,
            isLiked: false,
          };
        });
        this.loaderComment.classList.add("hidden");
        this.renderComments();
      })

      .catch(API.handleError);
  },

  // удаление последнего комментария
  deleteLastComment() {
    document
      .getElementById("add-button-delete")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        this.comments.pop();
        this.renderComments();
      });
  },

  // массив пользователей
  renderComments() {
    this.listElement.innerHTML = this.comments
      .map((comment, index) => {
        const classButton = comment.isLiked ? "-active-like" : "";
        return `<li data-index="${index}" class="comment">
           <div class="comment-header">
             <div>${comment.name}</div>
             <div>${comment.date}</div>
           </div>
           <div class="comment-body">
             <div class="comment-text" data-index="${index}">
               ${comment.text}
             </div>
           </div>
           <div class="comment-footer">
             <div class="likes">
               <span class="likes-counter" data-index="${index}">${comment.likeCount}</span>
               <button class="like-button ${classButton}" data-index="${index}"></button>
             </div>
           </div>
         </li>`;
      })
      .join("");

    this.initEventList();
    this.reply();
  },

  // функция лайка
  initEventList() {
    const likeButtonElements = document.querySelectorAll(".like-button");
    for (const likeButtonElement of likeButtonElements) {
      likeButtonElement.addEventListener("click", () => {
        const index = likeButtonElement.dataset.index;
        if (this.comments[index].isLiked) {
          this.comments[index].isLiked = !this.comments[index].isLiked;
          this.comments[index].likeCount--;
        } else {
          this.comments[index].isLiked = !this.comments[index].isLiked;
          this.comments[index].likeCount++;
        }
        this.renderComments();
      });
    }
  },

  // функция ответа на комментарий
  reply() {
    const commentsForms = document.querySelectorAll(".comment-text");

    for (const commentForm of commentsForms) {
      commentForm.addEventListener("click", () => {
        const index = commentForm.dataset.index;
        this.textInputElement.value = `BEGIN_QUOTE ${this.comments[index].text} : ${this.comments[index].name} QUOTE_END`;
        this.textInputElement.focus();
      });
    }
  },

  // ввод комментария через "Enter"
  clickButtonEnter() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        this.buttonElement.click();
        e.preventDefault()
        e.stopPropagation()
      }
    });
  },

  emptyString() {
    this.nameInputElement.addEventListener("input", () => {
      if (this.nameInputElement.value === "") {
        this.buttonElement.disabled = true;
        return;
      } else {
        this.buttonElement.disabled = false;
      }
    });
  },

  clickButton() {
    this.buttonElement.addEventListener("click", () => {
      this.nameInputElement.classList.remove("error");
      this.textInputElement.classList.remove("error");
      if (
        this.nameInputElement.value.trim() === "" ||
        this.textInputElement.value.trim() === ""
      ) {
        this.nameInputElement.classList.add("error");
        this.textInputElement.classList.add("error");
        return;
      }
      this.addForm.classList.add("hidden");
      this.loaderForm.innerText = "Идет отправка на сервер...";

      API.postComment(this.textInputElement.value, this.nameInputElement.value)
        .then(() => {
          this.nameInputElement.value = "";
          this.textInputElement.value = "";

          this.getComments();
        })
        .catch((error) => {
          API.handleError(error);

          this.addForm.classList.remove("hidden");
          this.loaderForm.innerText = "";
        });
    });
  },

  
  start() {
    this.buttonElement.disabled = true;
    this.emptyString();
    this.clickButton();
    this.clickButtonEnter();
    this.reply();
    this.deleteLastComment();
    this.getComments();
  },
};
