(function() {
  'use strict';
  let deliveryDate = '';
// <============ function Create cart items ==============>
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
      const $tdPrice = $('<td>').text(`$ ${item.price}`).addClass('align-middle');
      const $tdQty = $('<td>').text('1').addClass('align-middle');
      const $tdTotal = $('<td>').text(`$ ${item.price}`).addClass('align-middle');

      $cardText.append($delButton);
      $card.append($img, $cardText);
      $th.append($card, $h5);
      $tr.append($th, $tdPrice, $tdQty, $tdTotal);
      $('.listItem').append($tr);

    }
    getTotal(); //creating total price

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
        getTotal();
      })
      .fail((err) => {
        console.log('Error :' + err.responseText +
        '  Error status: ' + err.status);
      });
    });
  };
// <============ function Create subTotal and total order ==============>
let totalPrice = 0;
    const getTotal = () => {
      let priceSubtotal = 0;
      let qtySubtotal = 0;
      let totalSubtotal = 0;

      let priceTax = 0;
      let totalTax = 0;

      let qtyTotal = 0;
      let totalTotal = 0;

      $.getJSON('/token')
        .done((isLoggedIn) => {
          $.getJSON(`/cart/${isLoggedIn.id}`)
            .done((data) => {

              for (const item of data) {
                qtySubtotal += 1;
                qtyTotal += 1;

                priceSubtotal += parseFloat(item.price);
              }
              totalSubtotal = priceSubtotal;
              priceTax = priceSubtotal * 0.096; // tax applied 9.6%
              totalTax = totalSubtotal * 0.096;
              qtyTotal = qtySubtotal;
              totalTotal = totalSubtotal + totalTax;
              totalPrice = totalTotal;
              console.log(totalPrice);

              $('.subtotalPrice').text(`$ ${priceSubtotal.toFixed(2)}`);
              $('.subtotalQty').text(`${qtySubtotal}`);
              $('.subtotalTotal').text(`$ ${totalSubtotal.toFixed(2)}`);

              $('.taxPrice').text(`$ ${priceTax.toFixed(2)}`);
              $('.taxTotal').text(`$ ${totalTax.toFixed(2)}`);

              $('.qtyTotal').text(`${qtyTotal}`);
              $('.totalTotal').text(`$ ${totalTotal.toFixed(2)}`);
            })
            .fail(() => {
              console.error('Problem to getting data from cart to total field');
            });
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
    };

// <============ function for eventListeners ==============>
  const attachListener = (data) => {

    $('#buttonContinue').on('click', (event) => {
      event.preventDefault();
      window.location.href = '/index.html';
    });

// <============ Event listener for button "Checkout" ==============>
    $('#buttonCheckout').on('click', (event) => {
      event.preventDefault();
      let flower_id = [];
      let flowerCode = [];
      let flowerPrice = totalPrice.toFixed(2);
      const recipient_id = 1;
      const customer_id = data[0].customer_id;

      for (const cartItem of data) {
        flower_id.push(cartItem.flower_id);
        flowerCode.push(cartItem.code);
      }
// <============ Posting cart items to Orders table ==============>
      const reqPostOrder = {
        contentType: 'application/json',
        data: JSON.stringify({ flower_id, flowerCode, flowerPrice, deliveryDate, customer_id, recipient_id }),
        dataType: 'json',
        type: 'POST',
        url: `/order`
      }
      $.ajax(reqPostOrder)
        .done((dataOrder) => {
          console.log(dataOrder);
          // window.location.href = '/cardMessage.html';
        })
        .fail((err) => {
          console.error('Error :' + err.responseText +
          '  Error status: ' + err.status);
        });
// <============ Cleanup cart ==============>
      for (const cartItem of data) {
        const deleteItem = {
          contentType: 'application/json',
          type: 'DELETE',
          url: `/cart/${cartItem.id}`
        };

        $.ajax(deleteItem)
        .done((data) => {
        })
        .fail((err) => {
          console.log('Error :' + err.responseText +
          '  Error status: ' + err.status);
        });
      }
    });
// <============ Event listener for button "Check delivery date" ==============>
  $('#delDatesForm').hide();
  $('.btnDeliveryDate').hide();

    $('#btnZipDelivery').on('click', (event) => {
        event.preventDefault();
        const zipCode = $('#zipDelivery').val().trim();
        const reqDelDate = {
          contentType: 'application/json',
          data: JSON.stringify({ zip: zipCode }),
          dataType: 'json',
          type: 'POST',
          url: '/apiRequest'
        }
        $.ajax(reqDelDate)
          .done((data) => {
            if (data.DATES) {
              $('#delDatesForm').show();
              $('.btnDeliveryDate').show();

              for (const dateDay of data.DATES) {
                let string = moment(dateDay, 'MM/DD/YYYY').format("DD-MMM-YYYY");
                const $option = $('<option>').text(string);
                $('#delDatesForm').append($option);
              }
            }
            else {
              alert(data.errors[0]);
            }
          })
          .fail((err) => {
          });
      })
// <============ Event listener for button "Confirm delivery date" ==============>
    $('.btnDeliveryDate').on('click', (event) => {
        event.preventDefault();
        const dateChoosed = $('#delDatesForm').val();
        deliveryDate = moment(dateChoosed, 'DD-MMM-YYYY').format("YYYY-MM-DD");

        $('#formDelivery').hide();
        const $h5 = $('<h5>')
          .addClass('text-right red')
          .css('color', 'red')
          .text(`Delivery date choosen : ${dateChoosed}`);
        $('#mainContainer').append($h5);
    })

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
          getTotal()
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
