let zTop = 1;
$('a').on('click', function (e) {
  e.preventDefault();
    // Animate up or down based on DOM index
  const index = $($(this).attr('href')).index();
  const wh = $(window).height();
  $('section').each(function () {
    const $tgt = $(this);
    const idx = $tgt.index();
    $tgt.removeClass();
    if (index === idx) {
      $tgt.stop(true, true).animate({ top: 0 }, 'linear').addClass('active')
      .css({ 'z-index': zTop }); }
    if (index < idx) { $tgt.stop(true, true).animate({ top: wh }, 'linear').addClass('below'); }
    if (index > idx) { $tgt.stop(true, true).animate({ top: -wh }, 'linear').addClass('above'); }
  });
  zTop++;
});

// Trigger first section animation
$('a[href="#form"]').trigger('click');

// Set height
$(window).on('resize', () => {
  const wh = $(window).height();
  $('article, section').height(wh);
  $('.active').css({ top: 0 });
  $('.above').css({ top: -wh });
  $('.below').css({ top: wh });
}).trigger('resize');
