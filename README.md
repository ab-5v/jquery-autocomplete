jQuery Autocomplete Plugin
==========================

##Usage

    $('input#search').autocomplete(options);

###Options

```
options = {

    /**
     * Callback for building HTML for menu
     * @param {Array} data
     * @param {Object} query
     */
    render: $.noop,

    /**
     * Callback for making requests
     * @param {Object} query
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
    itemsSelector: '.js-autocomplete-item',

    /**
     * Mark active (and hovered) items with this class
     * @type String
     */
    activeClass: 'b-autocomplete__item_active'
}
```