(function($) {

    /* SETTINGS */

    var charNb = 6; // amount of characters for code <input>
    var soundPlay = 'autoplay'; // false, true, 'autoplay' (with quotes)
    var marioJump = 48; // Mario jump height (in pixels)
    var marioJumpDuration = marioJump * 4; // Mario jump duration (1000 = 1s)
    
    /* END SETTINGS */


    var $formario = $('#formario'),
        $codeBox = $('#code'),
        $codeLabel = $codeBox.parent();
        $codeBoxHTML = $codeBox[0].outerHTML;


    // generate hidden blocks
    var hiddenBlocksStr = '<span class="hidden__blocks">',
        hiddenCoinsStr = '<span class="hidden__coins">',
        audioCoinStr = '
            <audio id="soundpipe"><source src="./sound/smb_pipe.wav"></audio>
            <audio id="soundjump"><source src="./sound/smb_jump-small.wav"></audio>
            <audio id="soundcoin"><source src="./sound/smb_coin.wav"></audio>
            <audio id="soundbill"><source src="./sound/smb_fireworks.wav"></audio>';
    for (var i = 0; i < charNb; i++) {
        hiddenBlocksStr += '<img src="./img/smb-hidden-block.png"/>';
        // hiddenCoinsStr += '<img src="./img/smb-coin.png"/>';
        hiddenCoinsStr += '<span class="hidden__coins--coin"></span>';
    };
    hiddenBlocksStr += '</span>';
    hiddenCoinsStr += '</span>';
    $codeBox.after('<div class="secret__blocks">' + hiddenCoinsStr + hiddenBlocksStr + '</div>' + audioCoinStr);


    // sound party
    var $soundpipe = $('#soundpipe')[0],
        $soundjump = $('#soundjump')[0],
        $soundcoin = $('#soundcoin')[0],
        $soundbill = $('#soundbill')[0];


    // pipe
    $formario.append('<img class="pipe" src="./img/smb-pipe.png">');
    if(soundPlay == false)
        $formario.find('h1').css('margin-top: 0');


    // Mario's coming from the pipe, wouhou!
    $codeBox.parent().append('<div class="mario"></div>');
    var $mario = $('.mario'),
        $hiddenBlocks = $('.hidden__blocks'),
        $hiddenCoins = $('.hidden__coins'),
        marioH = $mario.height(),
        marioCurrentR, // Mario position from right
        marioCurrentB, // Mario position from bottom
        codeboxLength = $codeBox.val().length,
        codeboxLengthNew;
    $mario
        .addClass(function() {
            $(this).addClass('walkright');
            $soundpipe.play();
        })
        .animate(
            {
                'right': 88,
            },
            4000, 'linear', function () {
                $(this).removeClass('walkright');
            });


    // animation on code entry (mario jumps, block & coins appear, sounds play)
    $codeBox.on('keyup', function(e) {
        codeboxLengthNew = $(this).val().length;

        if(codeboxLengthNew > codeboxLength) {
            // move Mario to the right
            if(codeboxLengthNew < charNb + 1) {
                if(e.which > 63 && e.which < 98) {
                    marioCurrentR = parseInt($mario.css('right'));
                    marioCurrentB = parseInt($mario.css('bottom'));

                    $mario
                        .addClass(function() {
                            $(this).addClass('jumping');
                            $soundjump.play();
                        })
                        .animate(
                            {
                                'bottom': (marioCurrentB + marioJump),
                                'right': (marioCurrentR - marioH/2),
                            },
                            marioJumpDuration, 'linear', function() {
                                $hiddenBlocks.children().eq(codeboxLengthNew-1)
                                    .css('opacity', 1)
                                    .animate(
                                        {
                                            'bottom': 4
                                        },
                                    100, 'linear', function() {
                                        $soundcoin.play();
                                        $hiddenCoins.children().eq(codeboxLengthNew-1)
                                            .addClass('coinflip')
                                            .on('animationend webkitAnimationEnd', function(e) {
                                                $(this).removeClass('coinflip');
                                            });
                                    })
                                    .animate(
                                        {
                                            'bottom': 0
                                        },
                                    100, 'linear', function() {});
                            })
                        .animate(
                            {
                                'right': (marioCurrentR - marioH),
                                'bottom': marioCurrentB
                            },
                            marioJumpDuration, 'linear', function() {
                                $(this).removeClass('jumping');
                            });
                }
            }
        }
        else if(codeboxLengthNew < codeboxLength && codeboxLengthNew > -1) {
            // move Mario to the left
            marioCurrentR = parseInt($mario.css('right'));
            $mario.animate({'right': (marioCurrentR + marioH) }, 300, 'linear', function() { $hiddenBlocks.children().eq(codeboxLengthNew).css('opacity', 0); });
        }

        codeboxLength = codeboxLengthNew;
    });


    // AJAX THINGS
        $formario.on('submit', function(e) {
            e.preventDefault();
            checkSave = $.post($(this).attr('action'),
                $(this).serialize() + '&ajax=1',
                function(resp, status) {
                if(status == 'success') {
                    // current code <input> value
                    codeBoxVal = $codeBox.val();
                    resp = JSON.parse(resp);

                    if(resp.status === 1) {
                        $formario.after('<p>Wouhou!</p>');
                        // complete me
                    }
                    else {
                        $codeLabel.html(resp.error + $codeBoxHTML);
                        $codeBox = $('#code');
                        $codeBox.val(codeBoxVal);
                    }
                }
            });
        });

    // MUSIC, PLEASE!
        if(soundPlay != false) {
            SC.initialize({ client_id: '9b7d8663aa9d1e8e2afdfbe72898a57f' });
            var $mariotrack,
                $mariotrackCtrl,
                $shroomCloud;
        }

        // stream a random track from soundcloud
        function mariotrack() {
            SC.get('/tracks', { q: 'Super Mario' },
                function(tracks) {

                    // choose a random track & store some of its properties
                    var random = Math.floor(Math.random() * 20),
                        soundtitle = tracks[random].title,
                        playState,
                        ctrlBgPos,
                        shroomCloudAttr = {
                            link: tracks[random].permalink_url,
                            title: tracks[random].title + ' by ' + tracks[random].user.username
                        };

                    // background-position & text for Play/Pause button
                    if(soundPlay != 'autoplay') {
                        playState = 'Play';
                        ctrlBgPos = '0 50%';
                    }
                    else {
                        playState = 'Pause';
                        ctrlBgPos = '-25px 50%';
                    }

                    // init or fill soundbox
                    if(typeof($mariotrack) == 'undefined') {
                        $('form').prepend(
                            '<p class="mariotrack">
                                <a  class="mariotrack-ctrl"
                                    href="#"
                                    title="' + playState + '"
                                    style="background-position:' + ctrlBgPos + ';">' + playState + '</a>
                                <span>On air: ' + soundtitle.substring(0,20) + '</span>
                                <a  class="mariotrack-shroomcloud"
                                    href="' + shroomCloudAttr.link + '"
                                    title="' + shroomCloudAttr.title + '"
                                    target="_blank"><img src="./img/smb-shroomcloud.png">
                                </a>
                            </p>');
                        $mariotrack = $('.mariotrack');
                        $mariotrackCtrl = $mariotrack.find('.mariotrack-ctrl');
                        $shroomCloud = $mariotrack.find('.mariotack-shroomcloud');
                    }
                    else {
                        $mariotrack.find('span').html('On air: ' + soundtitle.substring(0,20));
                        $shroomCloud.attr({
                            'href': shroomCloudAttr.link,
                            'title': shroomCloudAttr.title
                        });
                    }

                    // start streaming! WARNING IT SEEMTS THAT SC.stream() FORCE SWF PLAYER INSTEAD BUT WE NEED HTML5 !
                    SC.stream('/tracks/' + tracks[random].id,
                        {
                            // Let's listen to another amazing track!
                            onfinish: function() {
                                mariotrack();
                            }
                        },
                        function(sound) {
                            if(soundPlay == true) {
                                sound.pause();
                                soundPlay = 'autoplay';
                            }
                            else
                                sound.play();

                            // toggle Play/Pause
                            $mariotrackCtrl.on('click', function(e) {
                                e.preventDefault();
                                if($(this).html() == 'Pause') {
                                    $(this)
                                        .css('background-position', '0 50%')
                                        .attr('title', 'Play')
                                        .html('Play');
                                    // sound.pause();
                                }
                                else {
                                    $(this)
                                        .css('background-position', '-25px 50%')
                                        .attr('title', 'Pause')
                                        .html('Pause');
                                    // sound.resume();
                                }
                                sound.togglePause();
                            });
                    });
                }
            );
        }

        if(soundPlay != false) {
            mariotrack();
        }

})(jQuery);