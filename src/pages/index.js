import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import { Api } from "../scripts/utils/Api.js";
import { setButtonText } from "../scripts/utils/helpers.js";

const modals = document.querySelectorAll(".modal");

const editAvatarButton = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#profile-avatar-modal");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarFormEl = editAvatarModal.querySelector(".modal__form");
const editAvatarLinkInput = editAvatarModal.querySelector(
  "#avatar-image-input"
);
const profileAvatarEl = document.querySelector(".profile__avatar");

const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSaveButton = newPostModal.querySelector(".modal__save-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostFormEl = newPostModal.querySelector(".modal__form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteFormEl = deleteModal.querySelector(".delete__form");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

let selectedCard;
let selectedCardId;

deleteCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.addEventListener("click", function () {
    openModal(previewModal);
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
  });

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  return cardElement;
}

function handleLike(evt, id) {
  const likeBtn = evt.currentTarget;

  const isLiked = likeBtn.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(id, !isLiked)
    .then((data) => {
      likeBtn.classList.toggle("card__like-btn_active", data.isLiked);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteBtn = evt.submitter;
  setButtonText(deleteBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(deleteBtn, false, "Delete");
    });
}

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteFormEl.addEventListener("submit", handleDeleteSubmit);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "170a408c-64bb-42ab-a792-bc39b74e6c6f",
    "Content-Type": "application/json",
  },
});

api
  .getInitialData()
  .then(([initialCards, userInfo]) => {
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;

    initialCards.forEach(function (card) {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

editAvatarButton.addEventListener("click", () => {
  resetValidation(editAvatarModal, [editAvatarLinkInput], settings);
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

function handleEditAvatarProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveBtn = evt.submitter;
  setButtonText(saveBtn, true);

  api
    .editUserAvatar({
      avatar: editAvatarLinkInput.value,
    })
    .then((data) => {
      profileAvatarEl.src = data.avatar;

      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(saveBtn, false);
    });
}

editAvatarFormEl.addEventListener("submit", handleEditAvatarProfileFormSubmit);

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileModal,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const saveBtn = evt.submitter;
  setButtonText(saveBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(saveBtn, false);
    });
}

editProfileFormEl.addEventListener("submit", handleEditProfileFormSubmit);

newPostButton.addEventListener("click", () => {
  resetValidation(
    newPostModal,
    [newPostLinkInput, newPostCaptionInput],
    settings
  );
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();

  const saveBtn = evt.submitter;
  setButtonText(saveBtn, true);

  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };

  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);

      cardsList.prepend(cardElement);

      closeModal(newPostModal);

      evt.target.reset();
      disableBtn(newPostSaveButton, settings);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(saveBtn, false);
    });
}

newPostFormEl.addEventListener("submit", handleNewPostFormSubmit);

enableValidation(settings);
