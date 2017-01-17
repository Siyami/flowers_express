(function() {
  'use strict';

  const flowerId = (window.location.search).slice(4);
console.log(flowerId);
  // if (!flowerId) {
  //   window.location.href = '/index.html';
  // }

  const detailsflower = function(flower) {
    $('#name').text(flower.name);
    $('#dimensions').text(flower.dimensions);
    $('#description').text(flower.description);
    $('#price').text(flower.price);
    $('#big_image').attr({ src: flower.picture_url_l, alt: flower.name });
    // $('#addToCart').attr('href', `/cart.html?id=${flower.id}`);
  };


    const attachListener = (flower) => {
      console.log('before ev list');
      $('#addToCart').on('click', (event) => {
        event.preventDefault();
        console.log('before token');
// <============ Check validation for sigh in or sign out ==============>
      $.getJSON('/token')
        .done((isLoggedIn) => {
          if (!isLoggedIn) {
            console.log(isLoggedIn);
            throw console.error('ERROR!!!!!!!!!');;
            $('#exampleModal').modal();
          }
        })
        .fail(($xhr) => {
          console.error('Here is problem with token');
        });

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
            console.log(postReq);
            // window.location.href = '/cart.html';
          })
          .fail(() => {
            console.error('Error for posting flower to cart');
            // Materialize.toast('Unable to delete book', 3000);
          });
// <============ Check validation for sigh in or sign out ==============>

      // $('#exampleModal').on('show.bs.modal', function (event) {
      //   var button = $(event.relatedTarget)
      //   var customer = button.data('whatever')
      //   var modal = $(this)
      //   modal.find('.modal-title').text('New message to ' + customer)
      //   modal.find('.modal-body input').val(customer)
      // });
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
