(function() {
  'use strict';

  let cardMessageInfo = '';
  let recipientInfo = {};
  let recipient_id;

  // <============ function Create cart items ==============>
  const renderCartItems = (data) => {
    for (const item of data) {
      const $tr = $('<tr>').attr({
        id: `cart${item.id}`
      });
      const $th = $('<th>').addClass('text-center');
      const $card = $('<div>')
        .attr({
          style: "width: 12rem;"
        })
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
      const $tdPrice = $('<td>').text(`$ ${item.price}`).addClass(
        'align-middle');
      const $tdQty = $('<td>').text('1').addClass('align-middle');
      const $tdTotal = $('<td>').text(`$ ${item.price}`).addClass(
        'align-middle');

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
            console.error(
              'Problem to getting data from cart to total field');
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
    // <============ Event listener for button cart on NavBar ==============>
    $('#navCartButton').on('click', (event) => {
      event.preventDefault();
      window.location.href = '/cart.html';
    });

    // <============ function for posting to Orders Table ==============>
    function postToOrderTable(recipient_id) {

      console.log('data is: ' + data);
      let flower_id = [];
      let flowerCode = [];
      let flowerPrice = totalPrice.toFixed(2);
      let deliveryDate = [];

      // const recipient_id = 1;
      const customer_id = data[0].customer_id;

      for (const cartItem of data) {
        flower_id.push(cartItem.flower_id);
        flowerCode.push(cartItem.code);
        deliveryDate.push(data.deliveryDate);
      }

      // <============ Posting cart items to Orders table ==============>
      console.log('delivery date is: ' + deliveryDate);
      console.log('card message is: ' + cardMessageInfo);
      const reqPostOrder = {
        contentType: 'application/json',
        data: JSON.stringify({
          flower_id, flowerCode, flowerPrice, deliveryDate,
          customer_id, recipient_id, deliveryDate
        }),
        dataType: 'json',
        type: 'POST',
        url: `/order`
      }
      $.ajax(reqPostOrder)
        .done((dataOrder) => {
          console.log('dataOrder is: ' + dataOrder);
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
          .done((data) => {})
          .fail((err) => {
            console.log('Error :' + err.responseText +
              '  Error status: ' + err.status);
          });
      }
    }
    // <============ Event listener for button "Checkout" ==============>
    $('#buttonCheckout').on('click', (event) => {
      event.preventDefault();
      if (data.deliveryDate === '') {
        return alert(' Choose delivery date first');
      }
      window.location.href = '/cardMessage.html';
      attachListener(data);

    });

    // <============ Event listener for button "Send card message" ==============>
    $('#btnSendCardMessage').on('click', (event) => {
      event.preventDefault;

      cardMessageInfo = $('#cardMessage').val();
      window.location.href = '/address.html';
    })

    // <============ Event listener for button "Submit Delivery Address" ==============>
    $('#btnSubmitDeliveryAddress').on('click', (event) => {
      event.preventDefault;

      let name = $('#name').val().trim();
      let institution = $('#institution').val().trim();
      let address1 = $('#address1').val().trim();
      let address2 = $('#address2').val().trim();
      let city = $('#city').val().trim();
      let state = $('#state').val().trim();
      let country = $('#country').val().trim();
      let phone = $('#phone').val().trim();
      let zipcode = $('#zipcode').val().trim();
      const customer_id = data[0].customer_id;

      const reqPostRecipients = {
        contentType: 'application/json',
        data: JSON.stringify({
          customer_id, name, institution, address1, address2,
          city, state,
          country, phone, zipcode, cardMessageInfo
        }),
        dataType: 'json',
        type: 'POST',
        url: `/recipients`
      }
      $.ajax(reqPostRecipients)
        .done((dataRecipient) => {
          // console.log(dataRecipient);
          recipient_id = dataRecipient.id;
          // window.location.href = '/cart.html';
          postToOrderTable(recipient_id);
        })
        .fail((err) => {
          console.error('Error :' + err.responseText +
            '  Error status: ' + err.status);
        });
    })

    // <============ Event listener for button "Check delivery date" ==============>
    $('#delDatesForm').hide();
    $('.btnDeliveryDate').hide();

    $('#btnZipDelivery').on('click', (event) => {
        event.preventDefault();
        const zipCode = $('#zipDelivery').val().trim();
        const reqDelDate = {
          contentType: 'application/json',
          data: JSON.stringify({
            zip: zipCode
          }),
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
                let string = moment(dateDay, 'MM/DD/YYYY').format(
                  "DD-MMM-YYYY");
                const $option = $('<option>').text(string);
                $('#delDatesForm').append($option);
              }
            } else {
              alert(data.errors[0]);
            }
          })
          .fail((err) => {});
      })
      // <============ Event listener for button "Confirm delivery date" ==============>
    $('.btnDeliveryDate').on('click', (event) => {
      event.preventDefault();
      const dateChoosed = $('#delDatesForm').val();

      let deliveryDate = moment(dateChoosed, 'DD-MMM-YYYY').format(
        "YYYY-MM-DD");

      $('#formDelivery').hide();
      const $h5 = $('<h5>')
        .addClass('text-right red')
        .css('color', 'red')
        .text(`Delivery date choosen : ${dateChoosed}`);
      $('#mainContainer').append($h5);

      for (const cartItem of data) {
        const patchDeliveryDate = {
          data: JSON.stringify({
            deliveryDate
          }),
          contentType: 'application/json',
          type: 'PATCH',
          url: `/cart/${cartItem.id}`
        };
        $.ajax(patchDeliveryDate)
          .done((dataPatch) => {
            console.log(dataPatch);
            attachListener(dataPatch)
              // window.location.href = '/index.html';
          })
          .fail((err) => {
            console.log('Error text: ' + err.responseText +
              '  Error status: ' + err.status);
          });
      }
    })

    // <============ Event listener for Order Completed Modal at the end ==============>
    $('#btnSubmitDeliveryAddress').on('click', (event) => {
      $('#orderCompleteModal').modal();
      // window.location.href = '/index.html';
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
