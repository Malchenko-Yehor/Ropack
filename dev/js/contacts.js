$(document).ready(function () {

  jQuery.scrollSpeed(200, 800);

  $(window).scroll(function(){
    changeLogo();
    scrollMenu();
  });

    // Parallax
  $(function() {
    var $el = $('.content--start');
    $(window).on('scroll', function () {
        var scroll = $(document).scrollTop();
        $el.css({
            'background-position':'0 '+(+.3*scroll)+'px'
        });
    });
  });

    // CALLBACK INPUTS
  $('.callback__input input').focus(function () {
    $(this).prev().css("top", "-10px");
  });

  $('.callback__input input').blur(function () {
    if ($(this).val() == "") {
      $(this).prev().css("top", "50%");
    }
  });

  // FEEDBACK INPUTS

  $('.feedback__input input').focus(function () {
    $(this).prev().css("top", "-10px");
  });

  $('.feedback__input input').blur(function () {
    if ($(this).val() == "") {
      $(this).prev().css("top", "50%");
    }
  });

  // Callback validation
  $('.callback__form').submit(function prevent(e) {
    $('.callback__error').text('');
    $('.callback__input input').css('borderBottom', '2px solid #cedde2');

    if (validator.isEmpty($('.callback__name').val())) {
      $('.callback__error--name').text('Введите имя');
      $('.callback__name').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    }

    if (validator.isEmpty($('.callback__phone').val())) {
      $('.callback__error--phone').text('Введите номер');
      $('.callback__phone').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    } else if (!validator.isMobilePhone($('.callback__phone').val(), 'any')) {
       $('.callback__error--phone').text('Неверный формат номера');
      $('.callback__phone').css('borderBottom', '2px solid #ff4d4d');
       e.preventDefault();
    }
  });

  // Feedback validation
  $('.feedback').submit(function prevent(e) {
    $('.feedback__error').text('');
    $('.feedback__input input').css('borderBottom', '2px solid #cedde2');
    e.preventDefault();

    // Company name check
    if (validator.isEmpty($('.feedback__company').val())) {
      $('.feedback__error--company').text('Введите название фирмы');
      $('.feedback__company').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    }

    // Name check
    if (validator.isEmpty($('.feedback__name').val())) {
      $('.feedback__error--name').text('Введите ФИО');
      $('.feedback__name').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    }

    // Phone check
    if (validator.isEmpty($('.feedback__phone').val())) {
      $('.feedback__error--phone').text('Введите номер');
      $('.feedback__phone').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    } else if (!validator.isMobilePhone($('.feedback__phone').val(), 'any')) {
       $('.feedback__error--phone').text('Неверный формат номера');
      $('.feedback__phone').css('borderBottom', '2px solid #ff4d4d');
       e.preventDefault();
    }

    // E-mail check
    if (validator.isEmpty($('.feedback__mail').val())) {
      $('.feedback__error--mail').text('Введите E-mail');
      $('.feedback__mail').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    } else if (!validator.isEmail($('.feedback__mail').val())) {
       $('.feedback__error--mail').text('Неверный формат email');
      $('.feedback__mail').css('borderBottom', '2px solid #ff4d4d');
       e.preventDefault();
    }

    // Application check
    if (validator.isEmpty($('.feedback__application').val())) {
      $('.feedback__error--application').text('Заполните поле заявки');
      $('.feedback__application').css('borderBottom', '2px solid #ff4d4d');
      e.preventDefault();
    }
  });




  // Animated bar
  $('.animated-bar').on('inview', function(event, isInView) {
    if (isInView) {
      $(this).playKeyframe({
        name: 'animated-bar', // name of the keyframe you want to bind to the selected element
        duration: '1s', // [optional, default: 0, in ms] how long you want it to last in milliseconds
        timingFunction: 'linear', // [optional, default: ease] specifies the speed curve of the animation
        // iterationCount: 'infinite', //[optional, default:1]  how many times you want the animation to repeat
        fillMode: 'forwards', //[optional, default: 'forward']  how to apply the styles outside the animation time, default value is forwards
      });
    }
  });

  $.keyframe.define([{
    name: 'animated-bar',
    '0%' : {
      'transform': 'translateY(-200px) scale(0)',
      'opacity': '0'
    },

    '50%' : {
      'transform': 'translateY(-200px) scale(1,80)',
      'opacity': '1'
    },

    '98%' : {
      'transform': 'translateY(0) scale(1)',
      'opacity': '1'
    },

    '100%' : {
      'opacity' : '0'
    }
  }]);


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

function changeLogo () {
  var scroll = $(window).scrollTop();
  if (scroll != 0) {
    $(".navigation__logo").css({
      "width" : "71px",
      "height" : "64px"
    });
  } else {
    $(".navigation__logo").css({
      "width" : "84px",
      "height" : "77px"
    });
  }
};

function scrollMenu () {
  var $sections = $('.screen');
  var currentScroll = $(this).scrollTop();
  var $currentSection;

  $('.scroll-menu__item').eq(0).addClass('is-active');
  
  $sections.each(function(){
    var divPosition = $(this).offset().top;
    
    if( divPosition - 100 < currentScroll ){
      $currentSection = $(this);    
    }

    var title = $currentSection.attr('data-screen-name');
    var id = $currentSection.attr('id');
    $('.scroll-menu__title').text(title);
    $('.scroll-menu__item').removeClass('is-active');
    $('.scroll-menu__item[href="##'+id + '"]').addClass('is-active');
    
  })
}

(function($) {
    
    jQuery.scrollSpeed = function(step, speed, easing) {
        
        var $document = $(document),
            $window = $(window),
            $body = $('html, body'),
            option = easing || 'default',
            root = 0,
            scroll = false,
            scrollY,
            scrollX,
            view;
            
        if (window.navigator.msPointerEnabled)
        
            return false;
            
        $window.on('mousewheel DOMMouseScroll', function(e) {
            
            var deltaY = e.originalEvent.wheelDeltaY,
                detail = e.originalEvent.detail;
                scrollY = $document.height() > $window.height();
                scrollX = $document.width() > $window.width();
                scroll = true;
            
            if (scrollY) {
                
                view = $window.height();
                    
                if (deltaY < 0 || detail > 0)
            
                    root = (root + view) >= $document.height() ? root : root += step;
                
                if (deltaY > 0 || detail < 0)
            
                    root = root <= 0 ? 0 : root -= step;
                
                $body.stop().animate({
            
                    scrollTop: root
                
                }, speed, option, function() {
            
                    scroll = false;
                
                });
            }
            
            if (scrollX) {
                
                view = $window.width();
                    
                if (deltaY < 0 || detail > 0)
            
                    root = (root + view) >= $document.width() ? root : root += step;
                
                if (deltaY > 0 || detail < 0)
            
                    root = root <= 0 ? 0 : root -= step;
                
                $body.stop().animate({
            
                    scrollLeft: root
                
                }, speed, option, function() {
            
                    scroll = false;
                
                });
            }
            
            return false;
            
        }).on('scroll', function() {
            
            if (scrollY && !scroll) root = $window.scrollTop();
            if (scrollX && !scroll) root = $window.scrollLeft();
            
        }).on('resize', function() {
            
            if (scrollY && !scroll) view = $window.height();
            if (scrollX && !scroll) view = $window.width();
            
        });       
    };
    
    jQuery.easing.default = function (x,t,b,c,d) {
    
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    };
    
})(jQuery);