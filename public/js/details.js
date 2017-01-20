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
            const infoDialog = bootbox.dialog({
              message: `<h5 class="text-center modalError"><strong>Registred area you have to sign in</strong></h5>`,
              closeButton: true
            });

            return infoDialog.modal('hide');;
          }
          postToCart(isLoggedIn.id)
        })
        .fail(() => {
          console.error('Here is problem with token');
        });
    });
// <============ Event listener for button cart on NavBar ==============>
    $('#navCartButton').on('click', (event) => {
      event.preventDefault();
      window.location.href = '/cart.html';
    });


// <============ Event listener for button Log In ==============>
    $('#signInButton').on('click', (event) => {
      event.preventDefault();
          $('#modalLogIn').modal();
    });

// <============ Event listener for button Log In(inside modal) ==============>
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
          $('#modalLogIn').modal('hide');
          window.location.href = '/details.html';
        })
        .fail((err) => {
          const errDialog = bootbox.dialog({
            message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
            closeButton: true
          });
          errDialog.modal('hide');
        });
    });

    // <============ Function for Signing Up ==============>
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
                window.location.href = '/details.html';
              })
              .fail((err) => {
                const errDialog = bootbox.dialog({
                  message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
                  closeButton: true
                });
                errDialog.modal('hide');
              });
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

    // <============ Event listener for button Sign Up ==============>
    $('#buttonRegister').on('click', (event) => {
      event.preventDefault();
      $('#modalLogIn').modal('hide');
      $('#signUpModal').modal();
      signUp();
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
          window.location.href = '/details.html';
        })
        .fail((err) => {
          const errDialog = bootbox.dialog({
            message: `<h5 class="text-center modalError">Error ${err.status}: <strong>  ${err.responseText}</strong></h5>`,
            closeButton: true
          });
          errDialog.modal('hide');
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
      $.ajax('/signup.html')
        .done((html) => {
          $(html).appendTo('main');
        })

        detailsflower(flower);

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
