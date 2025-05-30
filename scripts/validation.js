const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = errorMessage;
  inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = "";
  inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableBtn = (btnElement) => {
  btnElement.disabled = true;
  btnElement.classList.add("modal__save-btn_inactive");
};

const resetValidation = (formElement, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input);
  });
};

const toggleBtnState = (inputList, btnElement) => {
  if (hasInvalidInput(inputList)) {
    disableBtn(btnElement);
  } else {
    btnElement.disabled = false;
    btnElement.classList.remove("modal__save-btn_inactive");
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const btnElement = formElement.querySelector(".modal__save-btn");

  toggleBtnState(inputList, btnElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleBtnState(inputList, btnElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();
