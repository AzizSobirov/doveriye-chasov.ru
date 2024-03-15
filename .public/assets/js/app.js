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

class Filter {
  constructor() {
    this.minSlider = document.querySelector("#slider-min");
    this.maxSlider = document.querySelector("#slider-max");
    this.collectionEl = document.querySelectorAll("#filter-collection li");
    this.statusEl = document.querySelectorAll("#filter-status li");
    this.brandEl = document.querySelectorAll("#filter-brand a");
    this.priceEl = document.querySelector("#filter-price");
    this.productsEl = document.querySelector("#catalog-products");
    this.products = null;
    this.collection = null;
    this.status = null;
    this.price_from = 0;
    this.price_to = 0;
    this.minPrice = 0;
    this.maxPrice = 10000000;
  }
  init() {
    let url = new URL(window.location);

    // collection
    let collection = url.searchParams.get("collection");
    if (collection) {
      let isExists = false;
      this.collectionEl.forEach((item) => {
        if (item.innerHTML == collection) {
          this.collection = collection;
          item.classList.add("active");
          isExists = true;
        } else {
          item.classList.remove("active");
        }
      });

      if (!isExists) {
        this.collection = this.collectionEl[0].innerHTML;
        this.collectionEl[0].classList.add("active");
      }
    } else {
      this.collection = this.collectionEl[0].innerHTML;
      this.collectionEl[0].classList.add("active");
    }

    // status
    let status = url.searchParams.get("status");
    if (status) {
      let isExists = false;
      this.statusEl.forEach((item) => {
        if (item.innerHTML == status) {
          this.status = status;
          item.classList.add("active");
          isExists = true;
        } else {
          item.classList.remove("active");
        }
      });

      if (!isExists) {
        this.status = this.statusEl[0].innerHTML;
        this.statusEl[0].classList.add("active");
      }
    } else {
      this.status = this.statusEl[0].innerHTML;
      this.statusEl[0].classList.add("active");
    }

    // brand
    this.brandEl.forEach((item) => {
      let href = new URL(item.href);
      if (url.pathname == href.pathname) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // price from
    let priceFrom = url.searchParams.get("from");
    if (priceFrom) {
      this.price_from = priceFrom;
    } else {
      this.price_from = this.minPrice;
    }

    let priceTo = url.searchParams.get("to");
    if (priceTo) {
      this.price_to = priceTo;
    } else {
      this.price_to = this.maxPrice;
    }
    this.minSlider.value = (this.price_from * 100) / this.maxPrice;
    this.maxSlider.value = (this.price_to * 100) / this.maxPrice;

    this.save();
    this.watch();
    this.render();
  }
  watch() {
    this.collectionEl.forEach((item) => {
      item.addEventListener("click", () => {
        this.collection = item.innerHTML;
        this.collectionEl.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        this.save();
        this.render();
      });
    });
    this.statusEl.forEach((item) => {
      item.addEventListener("click", () => {
        this.status = item.innerHTML;
        this.statusEl.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        this.save();
        this.render();
      });
    });
    this.brandEl.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.save(e.target.href);
      });
    });

    // price inputs

    const updatePrice = () => {
      let gap = this.maxPrice - this.minPrice;
      let fromValue = (gap * this.minSlider.value) / 100 + this.minPrice;
      let toValue = (gap * this.maxSlider.value) / 100 + this.minPrice;

      this.price_from = Math.floor(fromValue);
      this.price_to = Math.floor(toValue);

      this.save();

      // document.querySelector("#from").textContent = `$${Math.floor(fromValue)}`;
      // document.querySelector("#to").textContent = `$${Math.floor(toValue)}`;
    };

    this.maxSlider.addEventListener("input", () => {
      let minValue = parseInt(this.minSlider.value);
      let maxValue = parseInt(this.maxSlider.value);
      if (maxValue < minValue + 5) {
        this.minSlider.value = maxValue - 5;
        if (minValue === parseInt(this.minSlider.min)) {
          this.maxSlider.value = 5;
        }
      }
      updatePrice();
    });

    this.minSlider.addEventListener("input", () => {
      let minValue = parseInt(this.minSlider.value);
      let maxValue = parseInt(this.maxSlider.value);
      if (minValue > maxValue - 5) {
        this.maxSlider.value = minValue + 5;
        if (maxValue === parseInt(this.maxSlider.max)) {
          this.minSlider.value = parseInt(this.maxSlider.max) - 5;
        }
      }
      updatePrice();
    });
  }
  render() {
    //
  }
  save(href) {
    let url = new URL(href || window.location);
    url.searchParams.set("collection", this.collection);
    url.searchParams.set("status", this.status);
    url.searchParams.set("from", this.price_from);
    url.searchParams.set("to", this.price_to);
    window.history.pushState({}, "", url);
    href && window.location.reload();
  }
}
const filter = new Filter();

window.addEventListener("load", () => {
  filter.init();
});
