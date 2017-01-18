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

        if (!first_name) {
          // alert('Please enter first name');
          // signUp();
        }
        if (!last_name) {

        }
        if (!email) {

        }
        if (email.indexOf('@') < 0) {

        }
        if (!password || password.length < 8) {

        }
        if (!address1) {

        }
        if (!address2) {

        }
        if (!city) {

        }
        if (!state) {

        }
        if (!country) {

        }
        if (!phone) {

        }
        if (!zipcode) {

        }

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
                // window.location.href = '/index.html';
              })
              .fail((err) => {
                console.log('Error :' + err.responseText +
                  '  Error status: ' + err.status);
              });
          })
          .fail((err) => {
            console.log('Error :' + err.responseText +
              '  Error status: ' + err.status);
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
      $.ajax('/signup.html')
        .done((html) => {
          $(html).appendTo('main');

        })
      detailsflower(flower);
    })
    .fail(() => {
      // bootstrap.toast('Unable to retrieve book', 3000);
    });
})();
