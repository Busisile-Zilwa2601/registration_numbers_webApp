$('#townBox').change(function () {
    $('.searchTownForm').submit();
});
$('.row-clickable span').click(function () {
    var href = $(this).find("a").attr("href");

    if (href) {
        window.location = href;
    }
});