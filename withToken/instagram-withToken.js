/*!
 * FC Instagram - Development FCV Team
 * Website:
 * Document Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api
 */

var FCInstagram = window.FCInstagram || {};
FCInstagram.name = "FC Instagram";
FCInstagram.version = "2.0.0";

// Info
console.info(
    "%c " + FCInstagram.name + " %c v" + FCInstagram.version + " %c",
    "margin-left: 5px; padding: 1px; color: #FEFEFE; font-size: 12px; line-height: 15px; background: #F79433; border-radius: 3px 0 0 3px;",
    "padding: 1px; color: #FEFEFE; font-size: 12px; line-height: 15px; background: #FF5722; border-radius: 0 3px 3px 0;",
    "background: transparent;"
);

// Utility for older browsers
if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {
        }

        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document, undefined) {
    var Instagram = {
        API_URL: "https://graph.instagram.com/me/media?fields=",
        API_FIELDS: "caption,media_url,media_type,permalink,timestamp,username",

        /**
         * Initializes the plugin.
         * @param {object} options
         * @param {jQuery Object} elem
         */
        initialize: function (options, elem) {
            this.elem = elem;
            this.$elem = $(elem);
            (this.accessToken = $.fn.FCInstagram.accessData.accessToken),
                (this.options = $.extend({}, $.fn.FCInstagram.options, options));

            this.messages = {
                defaultImageAltText: "Instagram Photo",
                notFound: "This user account is private or doesn't have any photos.",
            };

            this.fetchContent();

        },

        /**
         * Calls the fetch function and work with the response.
         */
        fetchContent: function () {
            var self = this;
            //   messages = null;

            self.fetch().done(function (results) {
                if (results.data) {
                    self.populateData(results);
                } else if (results.error.message) {
                    $.error("FCInstagram.js - Error: " + results.error.message);
                } else {
                    $.error("FCInstagram.js - Error: user does not have photos.");
                }
            });
        },

        /**
         * Makes the ajax call and returns the result.
         */
        fetch: function () {
            var getUrl =
                this.API_URL + this.API_FIELDS + "&access_token=" + this.accessToken;

            return $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: getUrl,
            });
        },

        /**
         * Populate data
         * @param {object} results
         */
        populateData: function (results) {
            var $element,
                images = [],
                videos = [],
                $video,
                retriveType = this.options.retriveType,
                hasCaption,
                imageGroup = [],
                imageCaption,
                autoplay,
                max;

            max =
                this.options.max >= results.data.length
                    ? results.data.length
                    : this.options.max;

            if (results.data === undefined || results.data.length === 0) {
                this.$elem.append(this.messages.notFound);
                return;
            }

            for (var i = 0; i < max; i++) {
                let currentData = results.data[i];
                let currentMediaType = currentData.media_type;

                if ((currentMediaType == "IMAGE") || currentMediaType == "CAROUSEL_ALBUM") {
                    images.push(currentData);
                } else if (retriveType == 'video' && currentMediaType == VIDEO) {
                    videos.push(currentData);
                }
            }

            if (retriveType == 'image') {
                this.displayPhotos(images);
            } else if (retriveType == 'video') {
                this.displayVideos(videos);
            }

            if (typeof this.options.complete === "function") {
                this.options.complete.call(this, results.data);
            }
        },

        /* put photos to dom
          @param {object} data
         */
        displayPhotos: function (photos) {
            let instagram = [];
            photos.forEach(el => {
               let hasCaption =
                    el.caption !== null ||
                    el.caption !== undefined;
                let caption = hasCaption?hasCaption:'';

                const a = `<a href="${el.permalink}" class="instagram-photos__link" target="_blank" rel="noopener noreferrer">
                        <img src="${el.media_url}" alt="${caption}" class="instagram-photos__link--image"/>
                    </a>`;
                instagram.push(a);
            });

            let instagramWrapper = `
            <div class="column-single">
                <div class="instagram-photos__item first">${instagram[0]}</div>
                <div class="instagram-photos__item second">${instagram[1]}</div>
            </div>
            <div class="column-double">
                <div class="instagram-photos__item third">${instagram[2]}</div>
            </div>
            <div class="column-single">
                <div class="instagram-photos__item fourth">${instagram[3]}</div>
                <div class="instagram-photos__item fifth">${instagram[4]}</div>
            </div>
            <div class="column-single">
                <div class="instagram-photos__item sixth">${instagram[5]}</div>
                <div class="instagram-photos__item seventh">${instagram[6]}</div>
            </div>
            <div class="column-double">
                <div class="instagram-photos__item eighth">${instagram[7]}</div>
            </div>
        `;

            this.$elem.html(instagramWrapper);

            /*
                hasCaption =
                    data.caption !== null ||
                    data.caption !== undefined;

                imageCaption = hasCaption
                    ? $("<span>").text(data.caption).html()
                    : this.messages.defaultImageAltText;

                $element = $("<a>", {
                    href: data.permalink,
                    target: "_blank",
                    title: imageCaption,
                    style:
                        "background:url(" +
                        results.data[i].media_url +
                        ") no-repeat center / cover;",
                    rel: "nofollow",
                });

                // Add item
                imageGroup.push($element);

             */
        },

        displayVideos: function (data) {
            let $element;

            /*
            autoplay =
                this.options.autoplay == true
                    ? "autoplay muted loop playsinline"
                    : "";

            $source = $("<source>", {
                src: data.media_url,
                type: "video/mp4",
            });

            $video = $("<video " + autoplay + ">").append($source);

            $element = $("<a>", {
                href: data.permalink,
                target: "_blank",
                title: imageCaption,
                rel: "nofollow",
            }).append($video);
*/
        }


    };


    /**
     * FCInstagram Plugin Definition.
     */
    jQuery.fn.FCInstagram = function (options) {
        if (jQuery.fn.FCInstagram.accessData.accessToken) {
            this.each(function () {
                var instagram = Object.create(Instagram);

                instagram.initialize(options, this);
            });
        } else {
            $.error("You must define an accessToken on jQuery.FCInstagram");
        }
    };

    // Plugin Default Options.
    jQuery.fn.FCInstagram.options = {
        complete: null,
        max: 9,
        autoplay: false,
        retriveType: '',
    };

    // Instagram Access Data.
    jQuery.fn.FCInstagram.accessData = {
        accessToken: null,
    };

})(jQuery, window, document);
