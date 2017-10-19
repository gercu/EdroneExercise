/* INPUTS */

var productNameHolder = $('#product-name');
var bigImage = $('#big-photo-img');
var addToCartButton = $('#addToCart');
var orderNavButton = $('#orderNavButton');

/* DOCUMENT READY */

$(document).ready(function () {
    readyMagnificPopup();
    readyOwlCarousel();
    refreshBasket();
    clickFirstProduct();

    $('#order-form').on('submit', function (e) {
        console.log($(this).serialize());
        console.log(localStorage.getItem("edrone_basket"));
        e.preventDefault();
        $.post({
            url: 'edrone.php',
            dataType: 'text',
            data: {
                formData: $(this).serialize(),
                edroneBasket: localStorage.getItem("edrone_basket")
            },
            success: function (data) {
                successPopup();
            },
            error: function (jqXHR, errorText, errorThrown) {
            }
        });
    });
});

$('.item').on('click', function () {
    if (!$(this).hasClass('selected')) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        loadProduct(this);
    }
});

addToCartButton.on('click', function () {
    add_to_cart();
});

/* INITIAL FUNCTIONS */

function readyMagnificPopup() {
    orderNavButton.magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#firstName',
        removalDelay: 300,
        mainClass: 'mfp-fade',
        callbacks: {
            beforeOpen: function () {
                if ($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#firstName';
                }
            }
        }
    });
}

function readyOwlCarousel() {
    $(".owl-carousel").owlCarousel({
        nav: true,
        dots: false
    });
}

function refresh_basket() {
    var basket = JSON.parse(localStorage.getItem("edrone_basket"));
    var count = 0;
    for (var i = 0; i < basket.length; i++) {
        count++;
        orderNavButton.removeClass('invisible');
    }
    orderNavButton.html('Zrealizuj zamówienie(' + count + ')');
}

function clickFirstProduct() {
    var productId = getURLParameter('id');
    $.each($('.item'), function () {
        if ($(this).attr('data-id') == productId) {
            $(this).click();
        }
    });
}

/* EDRONE FUNCTIONS */

function product_view() {
    var product = $('.item.selected');
    var productId = product[0].dataset['id'];
    window._edrone = window._edrone || {};
    _edrone.app_id = '59e76a6c9774f';
    _edrone.version = '1.0.0';
    _edrone.action_type = 'product_view';
    _edrone.platform_version = '1.1.26';
    _edrone.platform = 'custom';
    _edrone.product_ids = productId;
    _edrone.product_titles = product[0].dataset['title'];
    _edrone.product_images = product[0].children[0].src;
    _edrone.product_category_ids = '1';
    _edrone.product_category_names = 'Wszystkie produkty';
    _edrone.product_urls = window.location.protocol + "//" + window.location.host + "/edrone/?id=" + productId;
    _edrone.init();
}

function add_to_cart() {
    var product = $('.item.selected');
    console.log(product[0].dataset);
    var productId = product[0].dataset['id'];
    _edrone.app_id = '59e76a6c9774f';
    _edrone.version = '1.0.0';
    _edrone.action_type = 'add_to_cart';
    _edrone.platform_version = '1.1.26';
    _edrone.platform = 'custom';
    _edrone.product_ids = productId;
    _edrone.product_titles = product[0].dataset['title'];
    _edrone.product_images = product[0].children[0].src;
    _edrone.product_category_ids = '1';
    _edrone.product_category_names = 'Wszystkie produkty';
    _edrone.product_urls = window.location.protocol + "//" + window.location.host + "/edrone/?id=" + productId;
    _edrone.init();

    var basket = JSON.parse(localStorage.getItem("edrone_basket"));
    var item = {
        "product_id": product[0].dataset['id'],
        "product_image": product[0].children[0].src,
        "product_title": product[0].dataset['title'],
        "product_url": window.location.protocol + "//" + window.location.host + "/edrone/?id=" + productId,
        "product_count": 1,
        "product_category_id": product[0].dataset['category-id'],
        "product_category_name": product[0].dataset['category-name']
    };

    basket.push(item);

    localStorage.setItem("edrone_basket", JSON.stringify(basket));

    refresh_basket();
}

/* OTHER FUNCTIONS */

function loadProduct(product) {
    var imageSource = product.children[0].src;
    var productName = product.dataset['title'];

    bigImage.attr('src', imageSource);
    productNameHolder.html(productName);

    product_view();
}

function refreshBasket() {
    localStorage.removeItem('edrone_basket');
    if (!localStorage.getItem('edrone_basket')) {
        localStorage.setItem('edrone_basket', JSON.stringify([]));
    }
}

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
    return 1;
}

function successPopup() {
    $.magnificPopup.open({
        items: {
            type: 'inline',
            src: $('#successPopup'),
            removalDelay: 300,
            mainClass: 'mfp-fade'
        }
    });
}