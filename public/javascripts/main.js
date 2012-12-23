$(function() {
    // ultra-cheap tabs implementation (no point pulling in jquery.ui for this)
    var current_tab = $('#tabs a.active');
    var current_window = $($('iframe.project-window')[0]);

    $('#tabs a.tab').on('click', function() {
        console.log('click on ' + this.href);
        current_window.css({zIndex: 0});
        current_window = $('#iframe-' + this.attributes.href.value);
        current_window.css({zIndex: 30});
        current_tab.removeClass('active');
        current_tab = $(this);
        current_tab.addClass('active');
        return false;
    });
});