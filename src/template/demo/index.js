import './assets/css/normalize.css';
import './assets/css/bootstrap-grid.min.css';
import './assets/css/index.css';
import './assets/resources/swiper3.4.2/swiper.min.css';
import './assets/js/jquery.js';
import './assets/resources/swiper3.4.2/swiper.min.js';

$(function () {
    if (self != top) {
        $(".swiper-container").addClass("swiper-no-swiping")
    }
    $(".swiper-wrapper").attr("style", "")
    $(".swiper-container_bigImage").attr("style", "")
    $(".swiper-slide").attr("style", "")
    $(".swiper-slide").removeAttr("data-swiper-slide-index")
    var swiperCss = ["swiper-slide-prev", "swiper-slide-active", "swiper-slide-next", "active-nav", "swiper-slide-duplicate-prev", "swiper-slide-duplicate", "swiper-slide-duplicate-next", "swiper-slide-duplicate-active"]
    do {
        $("." + swiperCss[0]).removeClass(swiperCss[0])
        swiperCss.splice(0, 1)
    } while (swiperCss.length);
    var viewSwiper = new Swiper('.swiper-container', {
        nextButton: '#btn-next',
        prevButton: '#btn-prev',
        slidesPerView: 3,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 20,
        breakpoints: {
            1200: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            767: {
                slidesPerView: 1,
                spaceBetween: 12
            }
        }
    });
})



window.onload = function () {
    var timeValue = document.getElementById("whh-countDown").classList.value.split(" ").filter(function (i) { return /^et/.test(i) })[0].split("|")[1]
    var hours = parseInt(timeValue.split(":")[0])
    var minutes = parseInt(timeValue.split(":")[1])
    var seconds = parseInt(timeValue.split(":")[2])
    var hourDom = document.getElementById("whh-hour")
    var minuteDom = document.getElementById("whh-minute")
    var secondDom = document.getElementById("whh-second")
    console.log(hours, minutes, seconds)
    var counterDown = setInterval(function () {
        if (hours || minutes || seconds) {
            computeTime()
        } else {
            console.log("close")
            clearInterval(counterDown);
        }
    }, 1000);
    function computeTime() {
        if (seconds === 0) {
            if (minutes !== 0) {
                minutes--
                seconds = 59
            }
        } else {
            seconds--
        }
        if (minutes === 0) {
            if (hours !== 0) {
                hours--
                seconds = 59
                minutes = 59
            }
        }
        renderTime()
    }
    function renderTime() {
        hourDom.innerHTML = hours <= 9 ? "0" + hours : hours
        minuteDom.innerHTML = minutes <= 9 ? "0" + minutes : minutes
        secondDom.innerHTML = seconds <= 9 ? "0" + seconds : seconds
    }
}




$(function () {
    var addBtns = $(".l-question-click-cont");
    var addBox = $(".l_question-item");
    var anserText = $(".l_anser-text");

    var _loop = function _loop(i) {
        addBox[i].onclick = function () {
            for (var j = 0; j < addBtns.length; j++) {
                if (j == i) {
                    if (addBtns[j].innerHTML == '—') {
                        anserText[j].style.cssText = 'display:none';
                        addBtns[j].innerHTML = '+';
                    } else {
                        addBtns[j].innerHTML = '—';
                        anserText[j].style.cssText = 'display:block';
                    }
                } else {
                    anserText[j].style.cssText = 'display:none';
                    addBtns[j].innerHTML = '+';
                }
            }
        };
    };

    for (var i = 0; i < addBtns.length; i++) {
        _loop(i);
    }
})



$(document).scroll(function () {
    var $elem = $('.footer');
    var $window = $(window);
    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();
    var elemTop = $elem.offset().top;

    if (elemTop >= (docViewBottom + 20) || (elemTop + $('#call-btn').height()) >= (docViewBottom + 134)) {
        $('#call-btn').css('position', 'fixed');
    } else {
        $('#call-btn').css({ 'position': 'relative' });
    }
});



$(".nav-item.modal a").map(function () {
    $(this).click(function () {
        event.preventDefault()
        var iframeUrl = $(this).attr('href')
        $("#modalIframe").attr("src", iframeUrl)
        $("#modal").fadeIn()
        $("#mask").show()
    })
})
$(".closeBox svg").click(function () {
    $("#modal").fadeOut()
    $("#mask").hide()
})
$(".banner").css("margin-top", $("header.header").outerHeight() + "px")
$(function () {
    $("a").each(function () {
        var url = $(this).attr('href')
        var result = url.match(/#([^?]+)/);
        if (result) {
            $(this).attr('href', result[0])
        }
    })
})


import "./index.css";
