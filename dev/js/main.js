
$(document).ready(function () {
  var menu = new MENU (
    ".menu",
    [".navigation__burger", ".menu__burger"],
    ".menu .ordered-list-custom__item",
    ".menu__submenu"
  );

  var callback = new CALLBACK (
    ".callback",
    ".header__callback",
    [".navigation__burger", ".callback__burger"]
  );

  // Event listeners
  $('.navigation__burger').click(function() {
    if (callback.opened) {
      console.log(callback.opened);
      callback.close();
    } else {
      menu.clickBurger();
    }
  });

  $('.menu__burger').click(function() {
    menu.clickBurger();
  });

  $('.callback__burger').click(function() {
    callback.close();
  });


  // CALLBACK INPUTS
  $('.callback__input input').focus(function () {
    $(this).siblings().css("top", "-10px");
  });

  $('.callback__input input').blur(function () {
    $(this).siblings().css("top", "50%");
  });

  // SWIPERS INIT
  var advantagesSwiper = new Swiper ('.advantages__swiper', {
    // Optional parameters
    navigation: {
      nextEl: '.advantages__slider-buttons .slider-buttons__next',
      prevEl: '.advantages__slider-buttons .slider-buttons__previous',
    },
    effect: 'fade',
    loop: true
  });

  var partnersSwiper = new Swiper ('.partners__swiper', {
    // Optional parameters
    navigation: {
      nextEl: '.partners__slider-buttons .slider-buttons__next',
      prevEl: '.partners__slider-buttons .slider-buttons__previous',
    },
    effect: 'fade',
    speed: 500,
    loop: true
  });

  var newsSwiper = new Swiper ('.news__swiper', {
    // Optional parameters
    navigation: {
      nextEl: '.news__slider-buttons .slider-buttons__next',
      prevEl: '.news__slider-buttons .slider-buttons__previous',
    },
    speed: 500,
    slidesPerView: 2,
    spaceBetween: 49,
    loop: true
  });

  if ($(window).width() <= 1500) {
    var newsSwiper = new Swiper ('.news__swiper', {
      // Optional parameters
      navigation: {
        nextEl: '.news__slider-buttons .slider-buttons__next',
        prevEl: '.news__slider-buttons .slider-buttons__previous',
      },
      speed: 500,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true
    });
  } else {
    var newsSwiper = new Swiper ('.news__swiper', {
      // Optional parameters
      navigation: {
        nextEl: '.news__slider-buttons .slider-buttons__next',
        prevEl: '.news__slider-buttons .slider-buttons__previous',
      },
      speed: 500,
      slidesPerView: 2,
      spaceBetween: 49,
      loop: true
    });
  }


  $(window).resize(function () {
    if ($(window).width() <= 1500) {
      newsSwiper.params.slidesPerView = 1;
      newsSwiper.params.spaceBetween = 49;
    } else {
      newsSwiper.params.slidesPerView = 2;
    }
  });
});

function MENU(menu, burger, mainList, subList) {
  var menu = $(menu);
  var mainList = $(mainList);
  var subList = $(subList);
  var burger = burger;
  var opened = false;

  function open() {
    menu.show();
    burger.forEach(function (item) {
      $(item).addClass('is-active');
    });
    opened = true;
  }

  function close() {
    menu.hide();
    burger.forEach(function (item) {
      $(item).removeClass('is-active');
    });
    mainList.removeClass('is-active');
    subList.hide();
    opened = false;
  }

  this.clickBurger = function () {
    if (opened) {
      close();
    } else {
      open();
    }
  };


  function showSublist() {
    var attr = $(this).attr('href');
    var index = $(this).index();

    subList.hide();
    mainList.removeClass('is-active');
    
    if (typeof attr === typeof undefined || attr === false) {
      subList.eq(index).show();
      $(this).addClass('is-active');
    }
  }

  mainList.click(showSublist); 
}

// CALLBACK
function CALLBACK(callback, openButton, closeButton) {
  var callback = $(callback);
  var openButton = $(openButton);
  var closeButton = closeButton;

  this.opened = false;

  this.open =  function() {
    this.opened = true;
    test = true;

    callback.show();

    closeButton.forEach(function (item) {
      $(item).addClass('is-active');
    });
  };

  this.close =  function() {
    this.opened = false;
    test = false;

    callback.hide();

    closeButton.forEach(function (item) {
      $(item).removeClass('is-active');
    });
  };

  // Event listeners
  openButton.click(this.open.bind(this));
}
