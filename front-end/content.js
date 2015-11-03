$(function() {
    // alert("Hey");

    var create_alert = function(text, alert_type){
        // alert_type can be 'alert-success' 'alert-info' 'alert-warning' 'alert-danger'
        var html_content = '<div class="alert '+alert_type+' alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        text +
        '</div>';
        $('#alert-area').append(html_content);
    };

    fill_profile = function(){
        Twitch.api({method: 'user'}, function(err, res){
            if(err) {
                console.log('fill_profile error');
                console.log(err);
            } else {
                console.log('fill_profile success');
                // console.log(res);

                var html_content = '<img src="'+res.logo+'" alt="Logo" class="img-responsive">' +
                    '<h4>'+res.display_name+'</h4>';
                $('.profile').html(html_content);
            }
        });
    };

    fill_user_data = function(){
        Twitch.api({method: 'channel'}, function(err, res){
            if (err) {
                console.log('fill_user_data error');
                console.log(err);
            } else {
                console.log('fill_user_data success');
                console.log(res);
                $('.user-data-content #username').text('Username: '+res.name);
                $('.user-data-content #email').text('Email: '+res.email);
                $('.user-data-content #followers').text('Followers: '+res.followers);
                $('.user-data-content #views').text('Views: '+res.views);
                $('.user-data-content #stream-key').text('Stream Key: '+res.stream_key);
            }
        });
    };


    window.CLIENT_ID = 'n5t974xr5w5tw69lv8roafnqmmh49wt';
    Twitch.init({clientId: CLIENT_ID}, function(error, status) {
        if (status.authenticated) {
            // we're logged in :)
            $('#twitch-connect').hide();
            $('#logout').show();
            $('.user-data').show();
            create_alert('<strong>Logged in!</strong>', 'alert-success');
            fill_profile();
            fill_user_data();
            // Show the data for logged-in users
        } else {
            $('#logout').hide();
            $('#twitch-connect').show();
            $('.user-data').hide();
            create_alert('<strong>Not Logged in!</strong>', 'alert-danger');
            // Show the twitch connect button
        }
        console.log(error);
        console.log(status);
    });

    $('#twitch-connect').click(function() {
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    });

    $('#logout button').click(function() {
        Twitch.logout();
        window.location = window.location.pathname;
    })



    // window.onPlayerEvent = function (data) {
    //     data.forEach(function(event) {
    //         if (event.event == "playerInit") {
    //             var player = $("#twitch_embed_player")[0];
    //             player.playVideo();
    //             player.mute();
    //         }
    //     });
    // }

    // swfobject.embedSWF("//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf", "twitch_embed_player", "640", "400", "11", null,
    //     { "eventsCallback":"onPlayerEvent",
    //         "embed":1,
    //         "channel":"day9tv",
    //         "auto_play":"true"},
    //         { "allowScriptAccess":"always",
    //             "allowFullScreen":"true"});
});