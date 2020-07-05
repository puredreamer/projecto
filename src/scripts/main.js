$(document).ready(function(){

    let user_id = '1';
    ///Load products from API
    var products_arr = $.parseJSON($.ajax({
        type: 'GET',
        url: '/api/product/read.php',
        dataType: "json", 
        async: false,
        success: function(){}
    }).responseText); // This will wait until you get a response from the ajax request.

    var insertFavorites = $.ajax({
        type: 'GET',
        url: '/api/product/readFavorites.php',
        //data: user_id,
        dataType: "json", 
        async: false,
        success: function(result){
            for(var i=0; i < products_arr.records.length; i++){
                for(var j=0; j < result.records.length; j++){
                    if( products_arr.records[i].id == result.records[j].products_id ){
                        products_arr.records[i]['favorite'] = '1';
                        break;
                    } else {
                        products_arr.records[i]['favorite'] = '0';
                    }
                }
            }
        }
    });

    ///Build Home chart
    if($('#myChart').length != 0){
        buildChart();
    }

    ///Generate products on products_page
    let grid_products = $('#grid');
    if( grid_products != null && grid_products!= undefined ){
        for(var i = 0 ; i < products_arr.records.length ; i++){
            generateProduct(i+1, products_arr.records[i].favorite, products_arr.records[i].name, products_arr.records[i].price, grid_products);
        }
    }
    
    ////Generate slider chart
    if($('#slider').length != 0){
        checkHighlight(products_arr);
    }
    
    

    ////Toggle Favorites

    $("#check_fav").on('change', function(){
        if( $(this).is(':checked') ){
            for(var i = 0 ; i < products_arr.records.length ; i++){
                if( products_arr.records[i].favorite == 0){
                    $('.product:nth-child('+ (i+1) +')').hide();
                }
            }
        }
        else{
            $('.product').show();
        }
    });


    ///Start Home Slider
    $('#slider').slick({
        infinite: true,
        slidesToShow: 3, // Shows a three slides at a time
        slidesToScroll: 1, // When you click an arrow, it scrolls 1 slide at a time
        arrows: true, // Adds arrows to sides of slider
        dots: true // Adds the dots on the bottom
    });

    ///Open orders modal
    $('.orders').on('click', function(){
        $('.modal').css('display','block');
    });
    $('.upcomingOrders').on('click', function(){
        $('.modal').css('display','block');
    });
    ///Close Modal
    $('.modal-close').on('click', function(){
        $('.modal').css('display','none');
    });

    ///Open create product modal
    $('.create-product').on('click',function(){
        $('.modal').css('display','block');
    })

    //Show Profile Options
    $('.profile').on('click',function(){showProfile()});

    ///Show cart modal
    $('.icon').on('click',function(){showCart()});

    ///Close cart modal
    $('#cart-close').on('click',function(){
        showCart();
    });

    ///Get orders reference for PDF
    $('.icons').on('click', function(e){
        var reference = $(this).siblings('.ref').text();
        e.preventDefault();
        //window.open(invoice.php, '_blank');
    });

    $('.pdf').on('click',function() {
        console.log('click');
        generatePDF()});

    ////Toggle Password Icon Dots to letters
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        console.log('entrou')
        if(showPass == 0) {
            $('.form-password').attr('type','text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        }
        else {
            $('.form-password').attr('type','password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }
    });

    ///Login Register Page - Switch form
    $(function() {

        $('#login-form-link').click(function(e) {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
    
    });    
});




///Toggle cart modal
function showCart(){
    $('.cart-body').toggleClass('show');
}

///Toggle Profile modal
function showProfile(){
    $('.user-settings').toggleClass('show');
}

///Home chart function
function buildChart(){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
            datasets: [{
                label: 'Gastos Mensais',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//Generate Products
function generateProduct(i, f, n, p, l){
    /*
    i = position
    f = favourite
    n = name
    p =  price
    l = location
    */

    $(l).append('<div class="product"></div>');
    $('.product:nth-child('+ i +')').append('<div class="favorite"></div>')
    if(f != 0){
        $('.product:nth-child('+ i +') .favorite').append('<i class="favorite-icon fas fa-star"></i>');
    }else{
        $('.product:nth-child('+ i +') .favorite').append('<i class="favorite-icon far fa-star"></i>');
    }
    $('.product:nth-child('+ i +')')
        .append('<img class="image"/>')
        .append('<div class="productName">' + n + '</div>')
        .append('<div class="productPrice">' + p + '</div>')
        .append('<button class="add">Adicionar <i class="fas fa-shopping-cart"></i></button>');
}

function checkHighlight(products_arr){
    for(var i = 0; i < products_arr.records.length; i++){
        if(products_arr.records[i].highlight == 1){
            generateProduct(i+1, 1, products_arr.records[i].name, products_arr.records[i].price, '#slider')
        }
    }
}