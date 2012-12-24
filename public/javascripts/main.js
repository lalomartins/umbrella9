$(function() {
    // ultra-cheap tabs implementation (no point pulling in jquery.ui for this)
    var current_tab = $('#tabs a.active');
    var current_window = $($('iframe.project-window')[0]);

    $('#tabs a.tab').on('click', function() {
        var project = this.attributes.href.value;
        console.log('click on ' + project + ' tab');
        current_window.css({zIndex: 0});
        current_window = $('#iframe-' + project);
        current_window.css({zIndex: 30});
        current_tab.removeClass('active');
        current_tab = $(this);
        current_tab.addClass('active');
        if(project_down[project])
            $('#close').hide();
        else
            $('#close').show();
        return false;
    });

    var project_down = {};

    $('iframe.project-window').on('load', function() {
        var project = this.id.substr(7);
        console.log('load from ' + project);
        project_down[project] = false;
        if(current_tab.attr('href') == project)
            setTimeout(function() {
                var project = current_tab.attr('href');
                if(project_down[project])
                    $('#close').hide();
                else
                    $('#close').show();
            }, 500);
    });

    window.project_ping = function(project) {
        console.log('ping from ' + project);
        setTimeout(function() {
            project_down[project] = true;
            if(current_tab.attr('href') == project)
                $('#close').hide();
        }, 200);
    };

    window.project_states = function() {return project_down;};

    $('#close').on('click', function() {
        var project = current_tab.attr('href');
        $.ajax({
            type: "POST",
            url: project,
            data: {action: 'stop'}
        }).done(function(msg) {
            setTimeout(function() {
                current_window.attr('src', project);
            }, 200);
        });
    });
});