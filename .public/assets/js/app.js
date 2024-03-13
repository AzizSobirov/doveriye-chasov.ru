//** popup */
class Popup {
  constructor(name, data) {
    this.popup = document.querySelector(name);
    this.popupContent = this.popup.querySelector(".popup__content");
    this.body = document.querySelector("body");
    this.data = data;
  }
  open() {
    this.popup.style.display = "flex";
    setTimeout(() => {
      this.popupContent.style.opacity = "1";
      this.popupContent.style.transform = "scale(1)";
      this.body.classList.add("overflow-hidden");
    }, 50);
  }
  close() {
    this.popupContent.style.opacity = "0";
    this.popupContent.style.transform = "scale(0.85)";
    this.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      this.popup.style.display = "none";
    }, 500);
  }
}

const openPopup = (name, data) => {
  new Popup(`.popup--${name}`, data).open();
};

const closePopup = (name, data) => {
  new Popup(`.popup--${name}`, data).close();
};
// ** end popup

//** input mask **/
[].forEach.call(document.querySelectorAll(".v-mask"), function (input) {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      newValue = newValue.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue;
    if (event.type == "blur" && this.value.length < 5) this.value = "";

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = "true";
    } else {
      input.dataset.numbervalid = "false";
    }
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

//** sticky header **/
const header = document.querySelector(".header");
window.addEventListener("scroll", function () {
  header.classList.toggle("header-sticky", window.scrollY > 0);
});

//** form **//
const form = document.querySelector("#form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = form.querySelector("#name");
  let phone = form.querySelector("#phone");

  if (phone.dataset.numbervalid === "true") {
    successSend("form");
  }
});

const popupForm = document.querySelector(".popup--form form");
popupForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = popupForm.querySelector("#name");
  let phone = popupForm.querySelector("#phone");

  if (phone.dataset.numbervalid === "true") {
    // alert("Спасибо за заявку. В ближайшее время с вами свяжутся.");
    successSend();
  }
});

function successSend(parent) {
  let content = document.querySelector(".popup--form #form-content");
  let success = document.querySelector(".popup--form #form-success");

  content.style.display = "none";
  success.style.display = "flex";

  if (parent == "form") {
    openPopup("form");
  }

  setTimeout(() => {
    closePopup("form");
    setTimeout(() => {
      content.style.display = "flex";
      success.style.display = "none";
    }, 500);
  }, 3000);
}
