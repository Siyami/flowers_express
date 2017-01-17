(function() {
  'use strict';

  function modelLogin() {
    const $labelEmail = $('<label>')
      .addClass('form-control-label')
      .attr({
        for: email
      });
    const $inputEmail = $('<input>')
      .addClass('form-control')
      .attr({
        type: email,
        id: email
      });
    const $divEmail = $('<div>')
      .addClass('form-group');
    const $labelPassword = $('<label>')
      .addClass('form-control-label')
      .attr({
        for: password
      });
    const $inputPassword = $('<input>')
      .addClass('form-control')
      .attr({
        type: password,
        id: password
      });
    const $divPassword = $('<div>')
      .addClass('form-group');
    const $form = $('<form>');
    const $divModalBody = $('div')
      .addClass('modal-body');

    const $span = $('<span>')
      .attr({
        'aria-hidden': true
      });
    const $button = $('<button>')
      .addClass('close')
      .attr({
        type: button,
        'data-dismiss': modal,
        'aria-label': Close
      });
    const $h5 = $('<h5>')
      .addClass('modal-title')
      .attr({
        id: exampleModalLabel
      });
    const $divModalHeader = $('<div>')
      .addClass('modal-header');

    const $buttonSecondary = $('<button>')
      .addClass('btn btn-secondary')
      .attr({
        type: button,
        'data-dismiss': modal
      });
    const $buttonPrimary = $('<button>')
      .addClass('btn btn-primary')
      .attr({
        type: button
      });
    const $divModalFooter = $('<div>')
      .addClass('modal-footer');

    $divModalContent = $('<div>')
      .addClass('modal-content');

    $divModalDialog = $('<div>')
      .addClass('modal-dialog');

    $divModalFade = $('<div>')
      .addClass('modal fade')
      .attr({
        id: "exampleModal",
        tabindex: "-1",
        role: "dialog",
        'aria-labelledby': "exampleModalLabel",
        'aria-hidden': "true"
      });


    $divEmail.append($labelEmail, $inputEmail);
    $divPassword.append($labelPassword, $inputPassword);
    $form.append($divEmail, $divPassword);
    $divModalBody.append($form);

    $button.append($span);
    $divModalBody.append($h5, $button);
    $divModalFooter.append($buttonSecondary, $buttonPrimary);

    $divModalContent.append($divModalHeader, $divModalBody,
      $divModalFooter);

    $divModalDialog.append($divModalContent);

    $divModalFade.append($divModalDialog);

  };
  })();
