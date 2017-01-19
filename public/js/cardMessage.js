(function() {
  'use strict';

  // <============ Event Listener for Continue Button ==============>
  // const attachListener(data) = {
  //
  // };

  $('#btnSendCardMessage').on('click', (event) => {
    event.preventDefault();

    const cardMessage = $('#cardMessage').val().trim();

    const sendCard = {
      contentType: 'application/json',
      data: JSON.stringify({
        cardMessage
      }),
      dataType: 'json',
      type: 'PATCH',
      url: '/orders'
    };

    $.ajax(sendCard)
      .done(() => {
        window.location.href = '/address.html';
      })
      .fail(($xhr) => {
        // Materialize.toast($xhr.responseText, 3000);
      });
  });

  // <============ Request for loading page ==============>
  $.getJSON('/token')
    .done((isLoggedIn) => {
      if (!isLoggedIn) {
        // <============ Calling modal for Sign In  ==============>
        $('#modalLogIn').modal();
        return console.error('ERRROOOOOORRRR!!!!!!');
      }

      $.getJSON(`/cardMessage/${isLoggedIn.id}`)
        .done((data) => {
          console.log(data);
          attachListener(data);
        })
        .fail(() => {
          // bootstrap.toast('Unable to retrieve book', 3000);
        });
    })
    .fail((err) => {
      console.error('Here is problem with token');
      console.log('Error :' + err.responseText +
        '  Error status: ' + err.status);
    });

})();
