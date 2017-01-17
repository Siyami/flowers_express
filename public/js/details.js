(function() {
  'use strict';

  const flowerId = (window.location.search).slice(4);
  if (!flowerId) {
    window.location.href = '/index.html';
  }

  const detailsflower = function(flower) {
    $('#name').text(flower.name);
    $('#dimensions').text(flower.dimensions);
    $('#description').text(flower.description);
    $('#price').text(flower.price);
    $('#big_image').attr({
      src: flower.picture_url_l,
      alt: flower.name
    });
  };

  const attachListener = (flower) => {
    // <============ function for adding to cart ==============>
    const postToCart = (number) => {
      const postReq = {
        contentType: 'application/json',
        data: JSON.stringify({
          id: flower.id,
          price: flower.price,
          customer_id: number
        }),
        type: 'POST',
        url: `/cart`
      };
      $.ajax(postReq)
        .done(() => {
          window.location.href = '/cart.html';
        })
        .fail(() => {
          console.error('Error for posting flower to cart');
        });
    };
    // <============ Event listener for button Add To Cart ==============>
    $('#addToCart').on('click', (event) => {
      event.preventDefault();
      // <============ Check validation for sigh in or sign out ==============>
      $.getJSON('/token')
        .done((isLoggedIn) => {
          console.log(isLoggedIn);
          if (!isLoggedIn) {
            // <============ Calling modal for Sign In  ==============>
            $('#modalLogIn').modal();
            return console.error('ERRROOOOOORRRR!!!!!!');
          }
          console.log(isLoggedIn.id);
          postToCart(isLoggedIn.id)
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
    });
    // <============ Event listener for button Log In ==============>
    $('#buttonLogIn').on('click', (event) => {
      event.preventDefault();
      const email = $('#emailLogIn').val().trim();
      const password = $('#passLogIn').val();

      const postReqToken = {
        contentType: 'application/json',
        data: JSON.stringify({
          email, password
        }),
        type: 'POST',
        url: `/token`
      };
      $.ajax(postReqToken)
        .done((data) => {
          console.log(data);
          postToCart(data.id);
        })
        .fail((err) => {
          return console.log('Error :' + err.responseText +
            '  Error status: ' + err.status);
        });
    });

    // <============ Event listener for button Sign Up ==============>
    $('#buttonSignUp').on('click', (event) => {
      event.preventDefault();

    });

    // <============ Event listener for button Sign Out ==============>
    $('#singOutButton').on('click', (event) => {
      event.preventDefault();

      const deleteToken = {
        contentType: 'application/json',
        type: 'DELETE',
        url: `/token`
      };
      $.ajax(deleteToken)
        .done((data) => {
          console.log(data);
        })
        .fail((err) => {
          console.log('Error :' + err.responseText +
            '  Error status: ' + err.status);
        });

    });
  };
  // <============ Request for loading page ==============>
  $.getJSON(`/flowers/${flowerId}`)
    .done((flower) => {
      $.ajax('/login.html')
        .done((html) => {
          $(html).appendTo('main');

          attachListener(flower);
        })
      detailsflower(flower);
    })
    .fail(() => {
      // bootstrap.toast('Unable to retrieve book', 3000);
    });
})();
