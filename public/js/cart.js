(function() {
  'use strict';

const renderCartItems = (data) => {

  for (const item of data) {
    const $tr = $('<tr>').attr({ id: `cart${item.id}` });
    const $th = $('<th>').addClass('text-center');
    const $card = $('<div>')
      .attr({ style: "width: 12rem;" })
      .addClass('list-inline-item');
    const $img = $('<img>')
      .attr({
        src: item.picture_url_s,
        height: "40%",
        width: "40%"
      });
    const $cardText = $('<div>');
    const $h5 = $('<h5>')
      .text(item.name)
      .addClass('list-inline-item align-middle nameItemCart');
    const $delButton = $('<button>')
      .attr({
        type: "button",
        val: item.id
      })
      .addClass('btn btn-secondary btn-sm buttonDelItem')
      .text('delete item');
    const $tdPrice = $('<td>').text(item.price).addClass('align-middle');
    const $tdQty = $('<td>').text('1').addClass('align-middle');
    const $tdTotal = $('<td>').text(item.price).addClass('align-middle');

    $cardText.append($delButton);
    $card.append($img, $cardText);
    $th.append($card, $h5);
    $tr.append($th, $tdPrice, $tdQty, $tdTotal);
    $('tbody').append($tr);
  }

  // <============ Event listener for button Delete Item ==============>
  $('.buttonDelItem').on('click', (event) => {
    event.preventDefault();
    const itemId = event.currentTarget.attributes['1'].value;
    const deleteItem = {
      contentType: 'application/json',
      type: 'DELETE',
      url: `/cart/${itemId}`
    };
    $.ajax(deleteItem)
    .done((data) => {
      $(`#cart${data.id}`).remove(); //removing DOM element (item from cart)
    })
    .fail((err) => {
      console.log('Error :' + err.responseText +
      '  Error status: ' + err.status);
    });
  });
}
  const attachListener = (data) => {

    $('#buttonContinue').on('click', (event) => {
      event.preventDefault();
      window.location.href = '/index.html';
    });

    // <============ Event listener for button "Checkout" ==============>
    $('#buttonCheckout').on('click', (event) => {
      event.preventDefault();
      // <============ Check validation for sigh in or sign out ==============>
      $.getJSON('/flowers')
        .done((data) => {
          if (!isLoggedIn) {
            // <============ Calling modal for Sign In  ==============>
            $('#modalLogIn').modal();
            return console.error('ERRROOOOOORRRR!!!!!!');
          }
          postToCart(isLoggedIn.id)
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
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
          window.location.href = '/index.html';
        })
        .fail((err) => {
          console.log('Error text: ' + err.responseText +
            '  Error status: ' + err.status);
        });
    });
}
// <============ Request for loading page ==============>
  $.getJSON('/token')
    .done((isLoggedIn) => {
      if (!isLoggedIn) {
// <============ Calling modal for Sign In  ==============>
        $('#modalLogIn').modal();
        return console.error('ERRROOOOOORRRR!!!!!!');
      }

      $.getJSON(`/cart/${isLoggedIn.id}`)
        .done((data) => {
          console.log(data);
          renderCartItems(data);
          attachListener(data);
        })
        .fail(() => {
          // bootstrap.toast('Unable to retrieve book', 3000);
        });
    })
    .fail(() => {
      console.error('Here is problem with token');
    });
})();
