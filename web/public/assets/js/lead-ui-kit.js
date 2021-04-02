$(".dropdown").on("show.bs.dropdown", function (e) {
  $(this).find(".dropdown-menu").first().stop(true, true).slideDown(400);
});
$(".dropdown").on("hide.bs.dropdown", function (e) {
  $(this).find(".dropdown-menu").first().stop(true, true).slideUp(400);
});
