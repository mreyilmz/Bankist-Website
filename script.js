"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  // Scroll pozisyonlarını verir.
  console.log("current scroll (X/Y)", window.scrollX, window.scrollY);

  // Sayfayı gördüğümüz ekranın yüksekliğini ve genişliğini verir.
  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  /*   window.scrollTo(
    s1coords.left + window.scrollX,
    s1coords.top + window.scrollY
  ); */

  // Object girerek scrolling
  /*   window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: "smooth",
  }); */

  // Modern scrolling
  section1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////////////////////////////////////////////////
// 3 element için problem olmaz fakat 1000 element için bu yöntem
// performans kaybına yol açar
// Bu yüzden event delegation kullanmamız gerekiyor.
/* document.querySelectorAll(".nav__link").forEach(function (elm) {
  elm.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
}); */

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  console.log(e.target);
  e.preventDefault();
  // Matching Strategy
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("nav__link--btn")
  ) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////////////////////////////////////////////////
// Tabs Transition
tabsContainer.addEventListener("click", function (e) {
  // Buton içinde span elementi olduğu için span'e tıklayınca spani seçiyordu. .operations__tab butonun kendisi old. için butona tıkladığımız zaman kendisini seçecek. Span'e tıklarsak operations__tab class'ına sahip en yakın parenti buton olduğu için yine butonu seçmiş olucaz
  const clicked = e.target.closest(".operations__tab");
  //console.log(clicked);

  // Eğer click null veya falsy value döndürürse, function boş olarak return edicek ve sonlanacak. Funcition sonlandığı için alttaki kod çalışmayacak
  // Guard Clause => Modern Çözüm
  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active Tab
  clicked.classList.add("operations__tab--active");
  // Traditional method: Çok fazla condition olabileceği için, modern yöntem daha pratik
  //if(clicked) {
  //  clicked.classList.add("operations__tab--active");
  //}

  // Activate content area
  //console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

////////////////////////////////////////////////////////////////////////
////////// Menu Fade Animation
////////// Yöntem 1 - Klasik Yöntem
const handleHover = function (e, opacity) {
  // closest kullanamamamızın sebebi nav__link'lerin içinde tıklanacak başka element olmaması.
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((elm) => {
      if (elm !== link) elm.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
// mouseenter bubble yapmadığı için aynısı olan mouseover kullanıyoruz.
// mouseenter'ın zıttı mouseleave ------ mouseover'ın zıttı mouseout
nav.addEventListener("mouseover", (e) => handleHover(e, 0.5));
nav.addEventListener("mouseout", (e) => handleHover(e, 1));

///////////////////////////////////////////////////////////////////////////
///////// Yöntem 2 - Closures Yöntemi
/* const handleHover = function (o) {
  return function (e) {
    if (e.target.classList.contains("nav__link")) {
      const link = e.target;
      const siblings = link.closest(".nav").querySelectorAll(".nav__link");
      const logo = link.closest(".nav").querySelector("img");
      siblings.forEach((el) => {
        if (el !== link) el.style.opacity = o;
      });
      logo.style.opacity = o;
    }
  };
};
nav.addEventListener("mouseover", handleHover(0.5));
nav.addEventListener("mouseout", handleHover(1)); */

///////////////////////////////////////////////////////////////////////////
///////// Yöntem 3 - Bind Yöntemi
/* const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
 */

//////////////////////////// Sticky navigation ////////////////////////
///////////  - Kötü Yöntem
/* window.addEventListener("scroll", function () {
  const s1coords = section1.getBoundingClientRect();

  if (s1coords.top <= 0) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}); */

//////////////////////////// Sticky navigation ////////////////////////
///////// - Modern ve iyi yöntem
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

// This callback func will get called each time that the observed element, so our target element, is intersecting the root element at the threshold that we defined
const obsCallback = function (entries) {
  entries.forEach(function (entry) {
    //console.log(entry);
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  });
};
const obsOptions = {
  // root: is the element that the target intersecting.
  // null olursa viewport'un tamamıyla olan kesişimine eşit olur
  root: null,
  // threshold: is basically the percentage of intersection at which the observer callback will be called
  // 0.1 = 10%
  //threshold: [0],
  // rootMargin header div'ine yaklaşırken -${navHeight}px mesafe kaldığı zaman hemen callback function'ı çalıştırıcak.
  rootMargin: `-${navHeight}px`,
};

//obsCallback ve obsOptions'ı direkt observer içine yazabilirdik. Fakat böyle daha temiz görünüyor
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

/////////////////////// Reveal Sections /////////////////////////////////
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    // Performans açısından bir kez observe edildikten sonra observe etmeyi .unobserve koduyla kestik.
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((sec) => {
  sec.classList.add("section--hidden");
  sectionObserver.observe(sec);
});

////////////////////// Lazy loading Images ///////////////////////////////
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

////////////////////////// Slider ///////////////////////////////////////
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = +e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
});
