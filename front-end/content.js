$(function() {
    // alert("Hey");
    window.CLIENT_ID = 'n5t974xr5w5tw69lv8roafnqmmh49wt';
    Twitch.init({clientId: CLIENT_ID}, function(error, status) {
        if (status.authenticated) {
            // we're logged in :)
            $('#status').text('Logged in! Allowed scope: ' + status.scope);
            $('#twitch-connect').hide();
            $('#logout').show();
            // Show the data for logged-in users
        } else {
            $('#status').text('Not Logged in! Better connect with Twitch!');
            $('#logout').hide();
            $('#twitch-connect').show();
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