$(function() { // JD: 9
    // alert("Hey"); // JD: 10

    var create_alert = function(text, alert_type){ // JD: 9, 11
        // alert_type can be 'alert-success' 'alert-info' 'alert-warning' 'alert-danger'
        var html_content = '<div class="alert '+alert_type+' alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        text +
        '</div>'; // JD: 12, 13, 16
        $('#alert-area').append(html_content);
    };

    fill_profile = function(){ // JD: 9, 11, 15
        Twitch.api({method: 'user'}, function(err, res){ // JD: 9, 11
            if(err) { // JD: 14
                create_alert('fill_profile error', 'alert-danger');
                console.log(err);
            } else {
                console.log('fill_profile success');
                // console.log(res); // JD: 10

                var html_content = '<img src="'+res.logo+'" alt="Logo" class="img-responsive">' +
                    '<h4>'+res.display_name+'</h4>'; // JD: 13, 16
                $('.profile').html(html_content);
            }
        });
    };

    fill_user_data = function(){ // JD: 9, 11, 15
        Twitch.api({method: 'channel'}, function(err, res){ // JD: 9, 11
            if (err) {
                create_alert('fill_user_data error', 'alert-danger');
                console.log(err);
            } else {
                console.log('fill_user_data success');
                // console.log(res); // JD: 10
                $('.user-data-content #username').text('Username: '+res.name); // JD: 16
                $('.user-data-content #email').text('Email: '+res.email); // JD: 16
                $('.user-data-content #followers').text('Followers: '+res.followers);
                $('.user-data-content #views').text('Views: '+res.views); // JD: 16
                $('.user-data-content #stream-key').text('Stream Key: '+res.stream_key); // JD: 16
            }
        });
    };


    window.CLIENT_ID = 'n5t974xr5w5tw69lv8roafnqmmh49wt'; // JD: 17
    Twitch.init({clientId: CLIENT_ID}, function(error, status) { // JD: 9, 11
        // JD: 18
        if (status.authenticated) {
            // we're logged in :)
            $('#twitch-connect').hide();
            $('.logout').show();
            $('.user-data').show();
            $('.logged-out').hide();
            $('.logged-in').show();
            create_alert('<strong>Logged in!</strong>', 'alert-success');
            fill_profile();
            fill_user_data();
            // Show the data for logged-in users
        } else {
            $('.logout').hide();
            $('#twitch-connect').show();
            $('.user-data').hide();
            $('.logged-out').show();
            $('.logged-in').hide();
            create_alert('<strong>Not Logged in!</strong>', 'alert-danger');
            // Show the twitch connect button
        }
        console.log(error);
        console.log(status);
    });

    $('#twitch-connect').click(function() { // JD: 9
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    });

    $('#logout').click(function() { // JD: 9
        Twitch.logout();
        window.location = window.location.pathname;
    });

    $('#view-profile').click(function() { // JD: 9
        // JD: 2
        create_alert('<strong>View Profile not implemented.</strong> Contact <a href="https://www.twitter.com/sirseim">@SirSeim</a> to finish it.', 'alert-danger');
    });

    $('#view-subscriptions').click(function() { // JD: 9
        // JD: 2
        create_alert('<strong>View Subscriptions not implemented.</strong> Contact <a href="https://www.twitter.com/sirseim">@SirSeim</a> to finish it.', 'alert-danger');
    });



    // JD: 19
    // window.onPlayerEvent = function (data) {
    //     data.forEach(function(event) {
    //         if (event.event == "playerInit") {
    //             var player = $("#twitch_embed_player")[0];
    //             player.playVideo();
    //             player.mute();
    //         }
    //     });
    // }

    // JD: 19
    // swfobject.embedSWF("//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf", "twitch_embed_player", "640", "400", "11", null,
    //     { "eventsCallback":"onPlayerEvent",
    //         "embed":1,
    //         "channel":"day9tv",
    //         "auto_play":"true"},
    //         { "allowScriptAccess":"always",
    //             "allowFullScreen":"true"});
});
