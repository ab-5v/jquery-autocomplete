/**
 * jQuery Autocomplete plugin
 *
 * @example
 *  $('input#search').autocomplete(options);
 *
 * @author Artur Burtsev <artjock@gmail.com>
 * @version 0.0.1
 */

;(function($) {

var KEY = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESC: 27
};

var namespace = '.ac19';

var defaults = {

    /**
     * Callback for building HTML for menu
     * @param {Array} data
     * @param {Object} request
     */
    render: $.noop,

    /**
     * Callback for making requests
     * @param {Object} request
     * @param {Function} callback for drawing menu
     */
    oninput: $.noop,

    /**
     * Callback for replacing inputs value
     * with selected one
     * @param {Object} result
     * @type String
     */
    onselect: $.noop,

    /**
     * Which element the menu should be appended to
     * @type Any valid jQuery selector
     */
    appendTo: 'body',

    /**
     * Selector for each item in menu
     * @type String
     */
    itemsSelector: 'li',

    /**
     * Mark active (and hovered) items with this class
     * @type String
     */
    activeClass: 'active'
};

var autocomplte = {

    /**
     * Init autocomplete instance
     * @param {jQuery} $el
     * @param {Object} options
     */
    init: function($el, options) {
        var that = this;

        this.$el = $el;
        this.options = options;

        this.$menu = $('<div/>').appendTo( options.appendTo );
        this.activeIndex = -1;

        // data recived from server
        this.data = null;

        // bind input events
        $.each(this.inputEvents, function(event, callback) {
            that.$el.on(event + namespace, $.proxy(callback, that));
        });

        // bind menu item event
        $.each(this.itemEvents, function(event, callback) {
            that.$menu.on(event, options.itemsSelector, $.proxy(callback, that));
        });
    },

    /**
     * Search input events
     * @type Object
     */
    inputEvents: {

        /**
         * oninput event
         * requests data and draws menu
         * @param {Event} e
         */
        'input': function(e) {
            var that = this;
            var query = this.$el.val();
            var options = this.options;

            // don't request anything on empty query
            if (!query) {
                return this.clear();
            }

            // request for data on every symbol
            options.oninput({q: query}, function(data) {
                // save result
                that.data = data;
                // remove old items
                that.clear();
                // add new items
                $( options.render(data, {q: query}) ).appendTo(that.$menu);
                // cache menu items
                that.$items = that.$menu.find(options.itemsSelector);
                // bind global click for closing menu
                $(window).on('click' + namespace, function(e) {
                    var $src = $(e.target);
                    // click outside autocomplete
                    if (!$src.closest(that.$el)[0] && !$src.closest(that.$menu)[0]) {
                        that.clear();
                    }
                });
            });
        },

        /**
         * keydown event
         * handles keys UP, DOWN, ENTER, ESC
         */
        'keydown': function(e) {
            // no keys without menu
            if (!this.$items) {
                return;
            }

            switch (e.which) {
                case KEY.UP:
                    e.preventDefault();
                    this.moveSelectionUp();
                break;

                case KEY.DOWN:
                    e.preventDefault();
                    this.moveSelectionDown();
                break;

                case KEY.ENTER:
                    e.preventDefault();
                    this.select();
                break;

                case KEY.ESC:
                    this.clear();
                break;
            }
        }
    },

    /**
     * Menu item events
     * handles mouseenter/mouseleave and click
     */
    itemEvents: {
        'mouseenter': function(e) {
            this.activeIndex = $.inArray(e.currentTarget, this.$items.get());
            this.activate();
        },
        'mouseleave': function(e) {
            this.activeIndex = -1;
            this.activate();
        },
        'click': function(e) {
            this.activeIndex = $.inArray(e.currentTarget, this.$items.get());
            this.select();
        }
    },


    /**
     * Activates item previous to current active one
     * if no active item or first item is active -
     * moves selection to the last one
     */
    moveSelectionUp: function() {
        var last = this.$items.length - 1;
        var index = this.activeIndex;

        if (index === -1 || index <= 0) {
            this.activeIndex = last;
        } else {
            this.activeIndex = index-1;
        }

        this.activate();
    },

    /**
     * Activates item next to current active one
     * if no active item or last item is active -
     * moves selection to the first one
     */
    moveSelectionDown: function() {
        var last = this.$items.length - 1;
        var index = this.activeIndex;

        if (index === -1 || index >= last) {
            this.activeIndex = 0;
        } else {
            this.activeIndex = index+1;
        }

        this.activate();
    },

    /**
     * Activate element by activeIndex
     * and deactivate last active
     */
    activate: function() {
        var activeClass = this.options.activeClass;

        this.$items.removeClass(activeClass);

        if (this.activeIndex !== -1) {
            this.$items.eq(this.activeIndex).addClass(activeClass);
        }
    },

    /**
     * Selects active item and returns data for this item
     */
    select: function() {
        if (this.activeIndex === -1) {
            return;
        }

        var data = this.data[this.activeIndex];
        // call onselect callback
        var value = this.options.onselect(data);

        this.$el.val(value);
        this.clear();
    },

    /**
     * Empties menu and resets active element
     * unbinds events
     */
    clear: function() {
        this.activeIndex = -1;
        this.$menu.empty();
        this.$items = null;
        $(window).off('click' + namespace);
    }
};

$.fn.autocomplete = function(options) {
    options = $.extend(defaults, options || {});
    autocomplte.init(this, options);

    return this;
};

})(jQuery);
