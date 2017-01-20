(function() {
  'use strict';

  const renderFlowerCards = (flowers) => {
      const $flowers = $('#flowers');

      for (const flower of flowers) {
        const $anchor = $('<a>')
          .attr({
            href: `/details.html?id=${flower.id}`,
            'data-delay': '50',
            'data-tooltip': flower.name
          })
          .tooltip()
          .addClass('indexPageCards');
        const $img = $('<img>')
          .addClass('card-img-top')
          .attr({ src: flower.picture_url_s, alt: flower.name });
        const $cardText = $('<div>')
          .addClass('card-block');
        const $name = $('<h5>')
          .addClass('card-title text-center')
          .text(flower.name);
        const $price = $('<h5>')
          .addClass('card-text text-center nameOnCardIndex')
          .text(`Price: $${flower.price}`);

        $name.appendTo($cardText);
        $price.appendTo($cardText);
        $anchor.append($img, $cardText);
        $flowers.append($anchor);
      }
    }


  const eventListeners = (flowers) => {

    $('.navCategories').on('click', 'li', (event) => {

      let category = $(event.currentTarget.attributes[1]).val();

      $('.navCategories > li > a').removeClass('active');
      $(event.target).addClass('active');

      $.ajax(`/flowers/categories/${category}`)
        .done((flowers) =>{
          console.log('flowers on client' + flowers);
          $('#flowers').empty();
          renderFlowerCards(flowers);
        })
        .fail(() => {
          const errDialog = bootbox.dialog({
            message: `<h5 class="text-center modalError"><strong> Sorry: Nothing to show on this category choose another one</strong></h5>`,
            closeButton: true
          });
          errDialog.modal('hide');
        })
    })

    // <============ Event listener for button Log In ==============>
        $('#signInButton').on('click', (event) => {
          event.preventDefault();
          $.ajax('/login.html')
            .done((html) => {
              $(html).appendTo('main');

              $('#modalLogIn').modal();
              eventListeners(flowers);
            })
            $.ajax('/signup.html')
              .done((html) => {
                $(html).appendTo('main');
              })
        });
    // <============ Event listener for button cart on NavBar ==============>
        $('#navCartButton').on('click', (event) => {
          event.preventDefault();
          window.location.href = '/cart.html';
        });

    // <============ Event listener for button Log In(inside of modal) ==============>
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
          $('#modalLogIn').modal('hide');
          eventListeners(flowers);
          window.location.href = '/index.html';
          // const $divAlert = $('<div>')
          //   .addClass('alert alert-warning alert-dismissible fade show')
          //   .attr({ role: "alert" })
          //   .text(`Thank you for sign in ${data.firstName} ${data.lastName}`);
          // const $strong = $('<strong>').text('Well done!')
          // $divAlert.append($strong);
          // $('main').append($divAlert);
          // $('[data-toggle="popover"]').popover();
        })
        .fail((err) => {
          const errDialog = bootbox.dialog({
            message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
            closeButton: true
          });
          return errDialog.modal('hide');
        })
      });

    // <============ Event listener for button LOG OUT ==============>
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
        const errDialog = bootbox.dialog({
          message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
          closeButton: true
        });
        return errDialog.modal('hide');
      })
    });

    $('#buttonRegister').on('click', (event) => {
      event.preventDefault();
      $('#modalLogIn').modal('hide');
      $('#signUpModal').modal();
      signUp();
    });

  const signUp = function() {
    $('#btnSignUp').on('click', (event) => {
      const first_name = $('#firstNameSignUp').val().trim();
      const last_name = $('#firstNameSignUp').val().trim();
      const email = $('#emailSignUp').val().trim();
      const password = $('#passwordSignUp').val().trim();
      const address1 = $('#address1SignUp').val().trim();
      const address2 = $('#address2SignUp').val().trim();
      const city = $('#citySignUp').val().trim();
      const state = $('#stateSignUp').val().trim();
      const country = $('#countrySignUp').val().trim();
      const phone = $('#phoneSignUp').val().trim();
      const zipcode = $('#zipcodeSignUp').val().trim();

      const postCustomer = {
        contentType: 'application/json',
        data: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          address1,
          address2,
          city,
          state,
          country,
          phone,
          zipcode
        }),
        type: 'POST',
        url: '/customers'
      };

      $.ajax(postCustomer)
        .done(() => {
          // log customer in as soon as he registers
          const postToken = {
            contentType: 'application/json',
            data: JSON.stringify({
              email,
              password
            }),
            type: 'POST',
            url: '/token'
          };
          $.ajax(postToken)
            .done(() => {
              $('#signUpModal').modal('hide');
              window.location.href = '/index.html';
            })
            .fail((err) => {
              const errDialog = bootbox.dialog({
                message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
                closeButton: true
              });
              errDialog.modal('hide');
            })
          })

        .fail((err) => {
          const errDialog = bootbox.dialog({
            message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
            closeButton: true
          });
          errDialog.modal('hide');
        });
      })
    };
  };
$.getJSON('/flowers')
    .done((flowers) => {
      eventListeners(flowers);
      renderFlowerCards(flowers);
      $.getJSON('/token')
        .done((isLoggedIn) => {
          if (!isLoggedIn) {
            $('#singOutButton').hide();
            $('#navCartButton').hide();
            return;
          }
          $('#signInButton').hide();
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
    })
    .fail(() => {
      const errDialog = bootbox.dialog({
        message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
        closeButton: true
      });
      errDialog.modal('hide');
    });
})();
