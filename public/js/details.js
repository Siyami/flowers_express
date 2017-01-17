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
    $('#big_image').attr({ src: flower.picture_url_l, alt: flower.name });
    // $('#addToCart').attr('href', `/cart.html?id=${flower.id}`);
  };


    const attachListener = (flower) => {
      $('#addToCart').on('click', (event) => {
        event.preventDefault();
// <============ Check validation for sigh in or sign out ==============>
      $.getJSON('/token')
        .done((isLoggedIn) => {
          if (!isLoggedIn) {
            $('#modalLogIn').modal();
            return console.error('ERRROOOOOORRRR!!!!!!');
          }
// <============ POST request for creating row on carts table ==============>

          const postReq = {
            contentType: 'application/json',
            data: JSON.stringify({
              id: flower.id,
              price: flower.price,
              customer_id: 1
            }),
            type: 'POST',
            url: `/cart`
          };
          $.ajax(postReq)
          .done(() => {
            console.log('posted to cart' + postReq);
            // window.location.href = '/cart.html';
          })
          .fail(() => {
            console.error('Error for posting flower to cart');
            // Materialize.toast('Unable to delete book', 3000);
          });
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
    });

    $('#buttonLogIn').on('click', (event) => {
      event.preventDefault();
      const email = $('#emailLogIn').val().trim();
      const password = $('#passLogIn').val();
      if (!email) {

      }
      if (!password) {

      }

      const postReqToken = {
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        type: 'POST',
        url: `/token`
      };
      $.ajax(postReqToken)
        .done((data) => {
         console.log(data);
        })
        .fail((err) => {
         console.log('Error :' + err.responseText + '  Error status: ' + err.status);
        });
    });
  };

  $.getJSON(`/flowers/${flowerId}`)
    .done((flower) => {
      detailsflower(flower);
      attachListener(flower);
    })
    .fail(() => {
      // bootstrap.toast('Unable to retrieve book', 3000);
    });
  })();
