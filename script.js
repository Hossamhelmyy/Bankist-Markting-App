'use strict';

///////////////////////////////////////
// Modal window

// selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const logo = document.querySelector('.nav__logo');
const btnScroll = document.querySelector('.btn--scroll-to');
const links = document.querySelector('.nav__link');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const dotsContainer = document.querySelector('.dots');
// End

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

[...btnsOpenModal].forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// smoth scroll to section one
btnScroll.addEventListener('click', function (e) {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});
// nav events
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    console.log(section);
    section.scrollIntoView({
      behavior: 'smooth',
    });
  }
});
// tabs logic

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (clicked) {
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    const id = clicked.getAttribute('data-tab');
    tabsContent.forEach(content => {
      content.classList.remove('operations__content--active');
    });
    document
      .querySelector(`.operations__content--${id}`)
      .classList.add('operations__content--active');
  } else {
    return;
  }
});

// hover event
function handleEvent(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const otherLinks = link.closest('.nav').querySelectorAll('.nav__link');
    // const logoo = link.closest('.nav').querySelector('img');
    otherLinks.forEach(el => {
      if (el !== link) {
        el.style.opacity = `${this.opacity} `;
      }
      logo.style.opacity = `${this.opacity}`;
    });
  }
}
nav.addEventListener('mouseover', handleEvent.bind({ opacity: 0.5 }));
nav.addEventListener('mouseout', handleEvent.bind({ opacity: 1 }));
const recordS1 = section1.getBoundingClientRect();
const recordNav = nav.getBoundingClientRect();

function stickyNav(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
}
const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-recordNav.height}px`,
});
observer.observe(header);

function sectionsObserve(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}

const sectionsObserver = new IntersectionObserver(sectionsObserve, {
  root: null,
  threshold: 0.3,
});
sections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

//   lazy images observe
function imagesObserve(entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', `${entry.target.getAttribute('data-src')}`);
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imagesObserver = new IntersectionObserver(imagesObserve, {
  root: null,
  threshold: 0,
  rootMargin: '-210px',
});
images.forEach(image => {
  imagesObserver.observe(image);
});
// slider Logic and Functions

const sliderFuncs = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliderFuncs();
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
window.addEventListener('DOMContentLoaded', function (e) {
  e.preventDefault();
  console.log('hey', e);
});
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY, recordS1);
//   if (window.scrollY > recordS1.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// function handleObserver(entries, observer) {
//   entries.forEach(entry => console.log(entry));
// }
// const options = {
//   route: null,
//   threshold: 0,
// };
// const observer = new IntersectionObserver(handleObserver, options);
// observer.observe(section1);
// const logoo = link.closest('.nav').querySelector('img');
// console.log(window.pageXOffset, window.pageYOffset);
// console.log(section1.getBoundingClientRect());
// window.scrollTo({
//   left: scrolbounding.left,
//   top: scrolbounding.top,
//   behavior: 'smooth',
// });
// console.log(getComputedStyle(logo).transform);
// logo.style.transform = 'translateY(50px)';
// logo.addEventListener('mouseenter', function () {
//   logo.style.backgroundColor = 'red';
// });

// logo.addEventListener('mouseleave', function () {
//   logo.style.backgroundColor = `#f3f3f3`;
// });
