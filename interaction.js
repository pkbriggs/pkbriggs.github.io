$(document).ready(function() {
  $('.navbar').scrollupbar();
  // $("#nav-underline").width($("#about-nav-link").width());
  // $("#nav-underline").css("left", $("#home-nav-link").offset().left);

  if (location.pathname.replace(/^\//, '') != "") {
    // not empty/#?
  }

  // $(window).scroll(function () {
  //   var y = $(this).scrollTop();

  //   // add 'navbar_active' class to clicked navbar links
  //   $('.navbar_link').each(function (event) {
  //     if (y >= $($(this).attr('href')).offset().top - 60*2) { // 60 for navbar, 60*2 for a little breathing room
  //       if (!$(this).hasClass("navbar_active")) {
  //         $('.navbar_item').not(this).removeClass('navbar_active');
  //         $(this).addClass('navbar_active');
  //       }
  //     }
  //   });
  // });


  // smooth scrolling (with negative scroll for header)
  $('a[href*=#]:not([href=#])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: (target.offset().top - 60*2)
        }, 850);
        return false;
      }
    }
  });

  var currDate = new Date()
  $("#footer-year").text(currDate.getFullYear())

});