var handleOpenURL = function(url) { setTimeout(function() { miTrans.translate(url.substring(10)); }, 0); };

var miTrans = {

    jqXHR: null,

    service: {

        baidu: {
            uri: 'http://openapi.baidu.com/public/2.0/bmt/translate?client_id=tdtoPMy8Y2GG0GPYkrWfhSr6&q=',
            query: '&from={from}&to={to}',
            result: 'trans_result[0].dst',
            datatype: 'jsonp',
            type: 'GET',
            lang: { chinese: 'zh', english: 'en' },
            enabled: true
        },

        bing: {
            uri: 'https://api.microsofttranslator.com/v2/Ajax.svc/Translate?appid=66A8CA727C20371BED579D93DC7E476479EAC832&oncomplete=miTrans.callback&text=',
            query: '&from={from}&to={to}',
            result: '',
            datatype: 'jsonp',
            type: 'GET',
            lang: { chinese: 'zh-CHS', english: 'en' },
            enabled: true
        },

        systran: {
            uri: 'http://www.systranet.com/sai?gui=text&service=urlmarkuptranslate',
            query: '&lp={from}_{to}',
            result: '',
            datatype: 'text',
            type: 'POST',
            lang: { chinese: 'zh', english: 'en' },
            enabled: true
        },

        transcloud: {
            uri: 'http://translation-cloud.com/wp-content/themes/translationcloud/ajax/free_translator.php?text=',
            query: '&src={from}&dst={to}',
            result: '',
            datatype: 'text',
            type: 'GET',
            lang: { chinese: 'zh-CHS', english: 'en' },
            enabled: false
        },

        youdao: {
            uri: 'http://fanyi.youdao.com/openapi.do?keyfrom=friskfly&key=1410212834&type=data&doctype=jsonp&version=1.1&q=',
            query: '',
            result: 'translation[0]',
            datatype: 'jsonp',
            type: 'GET',
            lang: {},
            enabled: true
        }

    },

    isphonegap: false,
    clipdata: '',
    timer: '',
    data: '',
    response: '',
    from: '',
    to: '',

    provider: 'baidu',

    regex: new RegExp('[^\x00-\x80]+'),

    isJSON: function(val) {
        try {
            JSON.parse(val);
            return true;
        } catch (e) {
            return false;
        }
    },

    callback: function(response) {
        miTrans.data = response;
        if (document.location.hash === "#debug") { console.log('response: ' + data); }
        if (miTrans.service[miTrans.provider].result.length > 0) {
            miTrans.response = eval('miTrans.data.' + miTrans.service[miTrans.provider].result);
        } else {
            miTrans.response = miTrans.data;
        }
        $('#translatedText .iscroll-content').text(decodeURIComponent(miTrans.response));
        $('#translatedText').iscrollview('refresh');
        miTrans.loader(false);
        miTrans.setclip(miTrans.response);
    },

    ajaxOptions:  function(uri, datatype, type, data){
        return {
            url: uri,
            type: (type != null ? type : "GET"),
            data: (data != null ? data : ""),
            dataType: datatype,
            cache: false,
            async: true,
            processData: (type == "POST" ? false : true),
            jsonpCallback: 'miTrans.callback'
        };
    },

    translate: function(toTrans) {
        miTrans.loader(true);
        if (toTrans && typeof(toTrans) == 'string' && toTrans.length > 0) { $('#translateText').val(unescape(toTrans)); }
        var text = $('#translateText').val();
        if (text.length > 0) {
            if (miTrans.service[miTrans.provider].query.length > 0) {
                if (miTrans.regex.test(text)) {
                    miTrans.from = miTrans.service[miTrans.provider].lang.chinese;
                    miTrans.to = miTrans.service[miTrans.provider].lang.english;
                } else {
                    miTrans.from = miTrans.service[miTrans.provider].lang.english;
                    miTrans.to = miTrans.service[miTrans.provider].lang.chinese;
                }
                var qsVal = (miTrans.service[miTrans.provider].query).replace(/{from}/gi, miTrans.from).replace(/{to}/gi, miTrans.to);
                if (miTrans.service[miTrans.provider].type === "POST") {
                    var fullURI = miTrans.service[miTrans.provider].uri + qsVal;
                } else {
                    var fullURI = miTrans.service[miTrans.provider].uri + encodeURIComponent(text) + qsVal;
                }
            } else {
                var fullURI = miTrans.service[miTrans.provider].uri + encodeURIComponent(text);
            }
            var data = (miTrans.service[miTrans.provider].type == "POST") ? encodeURIComponent(text) : "";
            var options = miTrans.ajaxOptions(fullURI, miTrans.service[miTrans.provider].datatype, miTrans.service[miTrans.provider].type, data);
            miTrans.jqXHR = $.ajax(options)
                .done(function(data) { miTrans.callback(data); })
                .fail(function(jqXHR, statusText, error) { miTrans.loader(false); });
        }
        return false;
    },
    
    /* TODO: replace with Modernizr.load() */
    loadscript: function(script) {
        if ($("script[src$='" + script + "']").length == 0) {          
            var tag = document.createElement("script");
            tag.setAttribute('src', script);            
            $("head")[0].appendChild(tag);
        }
        return true;
    },

    select: function(e, elem) {
        e.preventDefault();
        if ($(elem).val().length > 0) {
            elem.selectionStart = 0;
            elem.selectionEnd = elem.value.length;
        }
        return false;
    },

    clear: function() {
        $('#translateText').val('');
        $('#translatedText .iscroll-content').empty();
    },

    setprovider: function(e, p) {
        //e.preventDefault();
        if (p) {
            miTrans.provider = p;
            $('#provider_image_' + miTrans.provider).attr('src', 'img/providers/' + miTrans.provider + '.png');
        }
    },

    notify: function(msg, elem, autohide) {
        var autohide = (typeof (autohide) == 'undefined') ? true : false;
        if (typeof (msg) == 'string') {
            var elem = ((elem == null || typeof (elem) == 'undefined') && $('#translateText').text().length > 0) ? $(elem) : 'window';
            $('#message').html(msg).popup('open', { transition: 'fade', positionTo: elem });
            if (autohide) { setTimeout(function() { $('#message').popup('close', { transition: 'fade' }); }, 3000); }
        }
    },

    providers: function() {
        $('#navbar').append('<ul id="providers" data-corners="true"></ul>');
        $.each(miTrans.service, function(provider) {
            if (miTrans.service[provider].enabled) {
                $('#providers').append('<li><a rel="' + provider.toLowerCase() + '" class="provider" data-theme="a"><div id="provider_' + provider.toLowerCase() + '"></div></a></li>');
            }
        });
        $('#navbar').navbar();
        $('#providers a[rel=' + miTrans.provider + ']').addClass('ui-btn-active');
    },

    events: function() {
        var uriText = $.url(false).param('text');
        if (typeof(uriText) == 'string' && uriText.length > 0) {
            miTrans.translate(uriText);
        }
        $('#translateText')
            .on('blur', function(e) { $.mobile.silentScroll(0); })
            .on('change', function(e) { miTrans.translate(); })
            .on('keydown', function(e) {
                clearTimeout(miTrans.timer);
                if ($(this).val().trim().length == 0) { $(this).val(''); }
            })
            .on('keyup', function(e) {
                clearTimeout(miTrans.timer);
                if (e.keyCode == 13) { miTrans.translate(); }
                else { miTrans.timer = setTimeout(function() { miTrans.translate(); }, 500); }
            })
            .on('click', function(e) { miTrans.select(e, this); });

        $('#navbar a.provider').on('touchstart click', function(e) {
            miTrans.setprovider(e, $(this).attr('rel'));
            miTrans.translate();
        });
    },

    getclip: function() {
        //if (miTrans.isphonegap) {
        try {
            cordova.exec(function(data){
                if ($.trim(data).length > 0) {
                    miTrans.clipdata = $.trim(data);
                    miTrans.translate(miTrans.clipdata);
                }
            }, function(){}, 'ClipboardPlugin', 'getText', []);
        } catch(ex) {}
        //}
    },

    setclip: function(data) {
        //if (miTrans.isphonegap) {
        try {
            if (data && $.trim(data).length > 0) {
                cordova.exec(function(){}, function(){}, 'ClipboardPlugin', 'setText', [data]);
            }
        } catch(ex) {
            console.log(ex);
        }
        //}
    },

    loader: function(on)  {
        if (on) { $('#header #logo #loader').fadeIn('fast'); }
        else { $('#header #logo #loader').fadeOut('slow'); }
    },
    
    defaults: function() {
        $.support.cors = true;
        $.extend($.mobile, { allowCrossDomainPages: true });
    },

    init: function() {
        miTrans.defaults();
        miTrans.providers();
        miTrans.events();
        $('#page').fadeIn('slow');
        $('#translateText').width($('#content').width()+6);
        $('#content').height($('#content').height()-95);
        setTimeout(function(){ miTrans.getclip(); }, 0);
    }

};

$(document)
    .on('touchmove', function(e) { e.preventDefault(); })
    .on('pageinit', function(e) { miTrans.init(); });