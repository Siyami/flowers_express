(function() {
  'use strict';

  $.getJSON('/flowers')
    .done((flowers) => {
      const $flowers = $('#flowers');

      for (const flower of flowers) {
        const $anchor = $('<a>')
          .attr({
            href: `/details.html?id=${flower.id}`,
            'data-delay': '50',
            'data-tooltip': flower.description
          })
          .tooltip();

        const $img = $('<img>')
          .addClass('card-img-top')
          .attr({ src: flower.picture_url_s, alt: flower.name });
        const $cardText = $('<div>')
          .addClass('card-block');
        const $name = $('<h4>')
          .addClass('card-title text-center')
          .text(flower.name);
        const $price = $('<h5>')
          .addClass('card-text text-center')
          .text(`Price: $${flower.price}`);
        const $cardFooter = $('<div>')
          .addClass('card-footer');
        const $footerText = $('<small>')
          .addClass('text-muted text-center')
          .text('Click for details');

        $name.appendTo($cardText);
        $price.appendTo($cardText);
        $footerText.appendTo($cardFooter);
        $anchor.append($img, $cardText, $cardFooter);
        $flowers.append($anchor);
      }
    })
    .fail(() => {
      // Materialize.toast('Unable to retrieve books', 3000);
    });
})();
