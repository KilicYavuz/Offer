$ = $jqMolla;
window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  wrapTable: function() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset: function() {
    var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    if(src.indexOf('@') != -1){
      var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)?\@\d{1,2}x|\d{1,4}x\d{0,4}?@\d{1,2}x|x\d{1,4}?\@\d{1,2}x)[_\.@]/);
    }else{
      var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
    }
    if (match !== null) {
      return match[1];
    } else {
      return null;
    }
  }
  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size == null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match != null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  function getName(path) {
    return _.first(_.last(path.split('/')).split('.'));
  }

  function bgSet(imgOjb) {
    var image = imgOjb;
    var url = image.src;
    var fileExt = _.last(url.split('.'));
    var aspect_ratio = image.width/image.height;
    var bgurl = '';
    bgurl += image.width > 180 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_180x.'+fileExt))+' 180w '+ Math.round(180 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 360 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_360x.'+fileExt))+' 360w '+ Math.round(360 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 540 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_540x.'+fileExt))+' 540w '+ Math.round(540 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 720 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_720x.'+fileExt))+' 720w '+ Math.round(720 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 900 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_900x.'+fileExt))+' 900w '+ Math.round(900 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 1080 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_1080x.'+fileExt))+' 1080w '+ Math.round(1080 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 1296 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_1296x.'+fileExt))+' 1296w '+ Math.round(1296 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 1512 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_1512x.'+fileExt))+' 1512w '+ Math.round(1512 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 1728 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_1728x.'+fileExt))+' 1728w '+ Math.round(1728 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 1950 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_1950x.'+fileExt))+' 1950w '+ Math.round(1950 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 2100 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_2100x.'+fileExt))+' 2100w '+ Math.round(2100 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 2260 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_2260x.'+fileExt))+' 2260w '+ Math.round(2260 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 2450 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_2450x.'+fileExt))+' 2450w '+ Math.round(2450 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 2700 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_2700x.'+fileExt))+' 2700w '+ Math.round(2700 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 3000 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_3000x.'+fileExt))+' 3000w '+ Math.round(3000 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 3350 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_3350x.'+fileExt))+' 3350w '+ Math.round(3350 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 3750 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_3750x.'+fileExt))+' 3750w '+ Math.round(3750 / aspect_ratio) +'h,' : '';
    bgurl += image.width > 4100 ? theme.Images.removeProtocol(url.replace('.'+fileExt, '_4100x.'+fileExt))+' 4100w '+ Math.round(4100 / aspect_ratio) +'h,' : '';
    bgurl += imgOjb.src+' '+ image.width+'w '+image.height+'h';
    return bgurl;
  }
  function imgFit(width, height) {
    var fit = '';
    var aspect_ratioW = parseFloat(theme.strings.aspect_ratio.split('/')[0]),
        aspect_ratioH = parseFloat(theme.strings.aspect_ratio.split('/')[1]),
        aspect_cs = aspect_ratioW / aspect_ratioH;
    var aspect_image = width * 1.00 / height;
    if (aspect_ratioW < aspect_ratioH){
      if (width == height ){
        fit = "nonheight_ nonwidth";
      }
      else{
        if (aspect_cs >= aspect_image ){
          fit = "nonheight";
        } else {
          fit = "nonwidth";
        }
      }
    } else if (aspect_ratioW > aspect_ratioH){
      if (width == height ){
        fit = "nonheight nonwidth_";
      } else{
        if (aspect_cs <= aspect_image ){
          fit = "nonwidth";
        } else {
          fit = "nonheight";
        }
      }
    } else {
      fit = "nonheight nonwidth_";
    }
    return fit;
  }
  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol,
    getName: getName,
    bgSet: bgSet,
    imgFit: imgFit
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || theme.moneyFormat);
    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      // if (dollarsAmount !== '0') {
      //   dollarsAmount = dollarsAmount.replace(/\d(\.+\d\d\d)$/g, parseFloat(dollarsAmount.match(/\d(\.+\d\d\d)$/g)).toFixed() + '.000')
      // }
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';
      // if (centsAmount !== '') {
      //   dollarsAmount = (dollarsAmount + centsAmount).replace(/\d(\.+\d\d)$/g, parseFloat((dollarsAmount + centsAmount).match(/\d(\.+\d\d)$/g)).toFixed() + '.00')
      // }

      return dollarsAmount + centsAmount;
    }
    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }
    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  }
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();
    this.template = this.originalSelectorId.replace('#ProductSelect-','');

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {

      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      if($('.color_sw.selected .swatch').length != 0){
        var firstVariantImage = $('.color_sw.selected .swatch').css( 'background-image' ).replace('_small_crop_center','').replace(/(url\(|\)|'|")/gi, '');
      }
      var variantImage = variant.featured_image || {};
      var currentVariantImage = $('.product-single__photos-'+this.template + '.SlickPhotoswipGallery .swiper-slide-active').attr('data-src') || {};
      if (!variant.featured_image && firstVariantImage == undefined || variantImage.src === currentVariantImage && firstVariantImage == undefined) {
        return;
      }
      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
      
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }
      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    }
  });

  return Variants;
})();


/* ================ GLOBAL ================ */

window.theme = theme || {}; 

theme.getScrollbarWidth = (function(){
  let $inner = $('#getScrollbarWidth'),
      $outer = $('#getScrollbarWidthChild');
  let width1 = $inner[0].offsetWidth;
  $outer.css('overflow', 'scroll');
  let width2 = $outer[0].clientWidth;
  // $outer.remove();
  return (width1 - width2);
});

/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.MenuReposive = (function() {
  var selectors = {
    body: 'body',
    header: '#header',
    headerOntop: '#header-ontop',
    navigation: '#header .main-navigation',
    siteNavHasDropdown: '.site-nav--has-dropdown',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.show-submenu',
    siteNavLinkMain: '.site-nav__link--main'
  };

  var config = {
    activeClass: 'show-submenu',
    childLinkClass: 'site-nav__child-link'
  };
  
  function is_mobile(){
    var isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Opera Mobile|Kindle|Windows Phone|PSP|AvantGo|Atomic Web Browser|Blazer|Chrome Mobile|Dolphin|Dolfin|Doris|GO Browser|Jasmine|MicroB|Mobile Firefox|Mobile Safari|Mobile Silk|Motorola Internet Browser|NetFront|NineSky|Nokia Web Browser|Obigo|Openwave Mobile Browser|Palm Pre web browser|Polaris|PS Vita browser|Puffin|QQbrowser|SEMC Browser|Skyfire|Tear|TeaShark|UC Browser|uZard Web|wOSBrowser|Yandex.Browser mobile/i.test(navigator.userAgent)) isMobile = true;
    return isMobile;
  }
  function init(){
    if(theme.is_mobile == false){
      $(document).on('mouseenter','.kt-nav '+selectors.siteNavHasDropdown,function(){
        if($(this).hasClass(config.activeClass) == false ){$(this).addClass(config.activeClass);}
      })
      $(document).on('mouseleave','.kt-nav '+selectors.siteNavHasDropdown,function(){
        if($(this).hasClass(config.activeClass)){$(this).removeClass(config.activeClass);}
      })
    }
    load_content_mega_item();
  }
  
  function unload() {
    $(window).off(selectors.siteNavHasDropdown+' a');
    $(selectors.siteNavHasDropdown).off(selectors.siteNavHasDropdown+' a');
    $(selectors.body).off(selectors.siteNavHasDropdown+' a');
  }
  
  /* ---------------------------------------------
   Height Full
   --------------------------------------------- */
  function js_height_full(){
    var height = $(window).outerHeight();
    $(".full-height").css("height",height);
  }
  function js_width_full(){
    var width = $(window).outerWidth();
    $(".full-width").css("width",width);
  }
 
  function clone_main_menu() {
    // Mobile Menu toggle children menu
    $(document).on('click','.mmenu-btn', function (e) {
      var $parent = $(this).closest('li'),
          $targetUl = $parent.find('ul').eq(0);

          if ( !$parent.hasClass('open') ) {
            $targetUl.slideDown(300, function () {
              $parent.addClass('open');
            });
          } else {
            $targetUl.slideUp(300, function () {
              $parent.removeClass('open');
            });
          }

      e.stopPropagation();
      e.preventDefault();
    });

    function action_addClass() {
      let scrollTop = $(window).scrollTop();
      $(selectors.body).addClass('mmenu-active');
      $('#bg-overlay').addClass('menu-mb-overlay').removeClass('menu-overlay');
      return false;
    }

    function action_removeClass() {
      $(selectors.body).removeClass('mmenu-active');
      anime({targets: '#bg-overlay.menu-mb-overlay',backgroundColor: 'rgba(0,0,0,0)', duration: 300,easing: 'linear',complete: function(anim) {
        $('#bg-overlay').removeAttr('style class');
      }})
      return false;
    }

    $(document).on('click', ".menu-toggle", function(){
      action_addClass();
    })
    $(document).on('click touchstart', ".mobile-menu-close, #bg-overlay.menu-mb-overlay", function(){
      action_removeClass();
    })
  }

  function clone_header_ontop(){
    var width = $(window).width();
    if(width >= 375){
      if($('#header-ontop .header').length > 0){return false};
      if( $(selectors.header).length > 0 && $(selectors.headerOntop).length > 0 && $(selectors.headerOntop).hasClass('is-sticky') && !$(selectors.headerOntop).hasClass('cloned')){
        $(selectors.headerOntop).addClass('cloned');
        if(typeof Swiper === 'function'){
          $.each($(selectors.header).find('.swiper-container-initialized'), function(index, val) {
            var mySwiper = this.swiper;
            mySwiper.destroy(true, true);
          })
        }
        var content = $(selectors.header).clone();
        content.removeAttr('id');
        content.find(".not-sticky,style").remove();
        content.find(".box-search").removeClass('show focus loaded');
        content.find(".livesearch").html();
        content.find(".dropdown.show .dropdown-menu.show").removeClass('show');
        content.find(".dropdown.show .dropdown-toggle").attr('aria-expanded',false);
        content.find(".dropdown.show").removeClass('show');
        content.find(".header").css('margin-top', '-500px');
        content.appendTo(selectors.headerOntop);
        theme.ResizeNavMega.init('header-ontop');
        setTimeout(function(){
          theme.DropdownReposive.init('.kiti--DropWindow','.header-control .kiti--DropItem','.kiti--DropInner');
        },200)        
        if ($(selectors.header).find('.swiper-container').length > 0) {
          KT.loadScript('swiper', function(e,l){
            theme.Swiper.init($('[data-section-id="header"]')[0]);
          })
        }
      }else{
        setTimeout(function(){
          theme.DropdownReposive.init('.kiti--DropWindow','.header-control .kiti--DropItem','.kiti--DropInner');
        },200)
      }
    }else{
      $(selectors.headerOntop).removeClass('cloned').html('');
      return false;
    }    
    if ($('header[data-header-sticky]').data('header-sticky') === true) {theme.StickyMenu.init();}
  }

  function load_content_mega_item(){
    let _item = '.megaload';
    $(document).on('mouseenter', _item+".load", function(event) {
      event.preventDefault();
      let _this = $(this);
      _this.removeClass('load').addClass('animated-background');
      $.get(_this.attr('data-mega'), function(data) {
        _this.parent().append(data.split('<!-- start -->')[1].split('<!-- end -->')[0]);
        _this.removeClass('animated-background');
      });
    });
  }
  return {
    init: init,
    is_mobile: is_mobile,
    js_height_full: js_height_full,
    js_width_full: js_width_full,
    clone_main_menu: clone_main_menu,
    clone_header_ontop: clone_header_ontop,
    unload: unload
  };
})();

window.theme = window.theme || {};

theme.StickyMenu = (function() {
  var selectors = {
    headerId: '#header',
    headerTop: '.header-top',
    headerAnnouncement: '.header-announcement:not(.none_sticky)',
    headerClassProp: '.header',
    stickyHeaderTop: '#header-ontop',
    headerClassPropTop: ''
  };
  var previousScroll = currentScroll = headerOrgOffset = wrapStickOrgOffset = headerHeight = headerTopHeight = headerTopAnnouncement = 0;
  let $body = $('body');
  let $bodynotonhide = $('body:not(.onhide)');
  let $windowWidth = $(window).width();
  let closeAnnouncement = '.close-header-announcement';
  function init(){
    if($(selectors.stickyHeaderTop + ' ' +selectors.headerClassProp).length <= 0){ return true };
    selectors.headerClassPropTop = $('#header-ontop .header');
    headerOrgOffset = $(selectors.headerId).offset().top + ($(selectors.headerId).outerHeight() * 2);
    wrapStickOrgOffset = $(selectors.headerId).offset().top;
    headerHeight = selectors.headerClassPropTop.outerHeight() || 0;
    headerTopHeight = $(selectors.stickyHeaderTop+' '+selectors.headerTop).outerHeight() || 0;
    headerTopAnnouncement = $(selectors.stickyHeaderTop+' '+selectors.headerAnnouncement).outerHeight() || 0;
    if($(selectors.headerId).length > 0 && $windowWidth >= 375){
      $(window).scroll(function() {
        currentScroll = $(window).scrollTop();
        if(currentScroll <= headerOrgOffset && $bodynotonhide.hasClass('onsticky')) {
          $body.removeClass('onsticky').removeClass('onup');
        }
      })
      $(window).scroll($.throttle( 100, scroll));
      $(window).resize(function() {
        $windowWidth = $(window).width();
        headerHeight = selectors.headerClassPropTop.outerHeight() || 0;
        headerTopHeight = $(selectors.stickyHeaderTop+' '+selectors.headerTop).outerHeight() || 0;
        headerTopAnnouncement = $(selectors.stickyHeaderTop+' '+selectors.headerAnnouncement).outerHeight() || 0;
      });
    }
    if ( $(closeAnnouncement).length ) {
      $(document).on('click', closeAnnouncement, function(e) {
        headerTopAnnouncement = 0;
      });
    }
  }
  function scroll() {
    headerHeight = selectors.headerClassPropTop.outerHeight() || 0;
    if (currentScroll > headerOrgOffset && $windowWidth >= 375 && $body.hasClass('onsticky') === false) {
      if ($windowWidth >= 768) {
        selectors.headerClassPropTop.animate({'margin-top': (headerTopHeight * -1) + (headerTopAnnouncement * -1)}, 150);
      }
      else {
        selectors.headerClassPropTop.animate({'margin-top': headerHeight * -1 - 10}, 150);
      }
      $body.addClass('onsticky');
    }
    if (currentScroll > headerOrgOffset) {
      if(previousScroll > currentScroll + 80 && $bodynotonhide.hasClass('onsticky') && $body.hasClass('onup') === false){
        $body.addClass('onup');
        selectors.headerClassPropTop.animate({'margin-top': 0}, 150);
          $('.kt-stickyAddCart.fixed .position-fixed.top').css('top', headerHeight);
      }
      else if(previousScroll <= currentScroll - 50 && $bodynotonhide.hasClass('onsticky') && $body.hasClass('onup')){
        $body.removeClass('onup');
        if ($windowWidth >= 768) {
          selectors.headerClassPropTop.animate({'margin-top': (headerTopHeight * -1) + (headerTopAnnouncement * -1)}, 150);
        }
        else {
          selectors.headerClassPropTop.animate({'margin-top': headerHeight * -1 - 10}, 150);
        $('.kt-stickyAddCart.fixed .position-fixed.top').css('top', 0);
        }
      }
    }
    previousScroll = currentScroll;
  }
  return {
    init: init
  };
})(jQuery);

window.theme = window.theme || {};

theme.ResizeNavMega = (function() {
  function init(headId){
    var selectors = {
      headerIsVisible: headId !== undefined ? '#header-ontop .main-header' : '#header .main-header',
      itemMega: '.item-megamenu',
      contentItemMega: '.sub-menu'
    };
    var window_size = jQuery('body').innerWidth();
    window_size += theme.scrollbarWidth || theme.getScrollbarWidth();
    var _data_width = $('#header .main-navigation').data('width'),
        _data_layout = $('#header .main-navigation').data("layout");
    if( window_size > _data_width ){
      if( $(selectors.headerIsVisible).length > 0){
        var container = $(selectors.headerIsVisible);
        if( container!= 'undefined'){
          var container_width = 0;
          container_width = container.innerWidth();
          var container_offset = container.offset();
          var container_left = container_offset.left;
          var container_right = (container_left + container_width);
          if (_data_layout === 'vertical'){
            let offset = $('.vertical-menu .main-header').offset().top - $(window).scrollTop();
            $(selectors.headerIsVisible+' .menu-item[data-block]>.sub-menu').addClass('megaMaxscroll').css({'height': $(window).height(),'max-width': $(window).width() * 0.8,'top': -1 * (offset)});
          }
          setTimeout(function(){
            $(selectors.headerIsVisible+' '+selectors.itemMega).each(function(index,element){
              if (_data_layout !== 'vertical') {
                $(element).children(selectors.contentItemMega).css({'max-width':container_width+'px'});
                var sub_menu_width = $(element).children(selectors.contentItemMega).outerWidth();
                var item_width = $(element).outerWidth();
                $(element).children(selectors.contentItemMega).css('left','-'+(sub_menu_width/2 - item_width/2)+'px');
                var item_left = $(element).offset().left;
                var overflow_left = (sub_menu_width/2 > (item_left - container_left));
                var overflow_right = ((sub_menu_width/2 + item_left) > container_right);
                if( overflow_left ){
                  var left = (item_left - container_left);
                  $(element).children(selectors.contentItemMega).css('left', -left+'px');
                }
                if( overflow_right && !overflow_left ){
                  var left = (item_left - container_left);
                  left = left - (container_width - sub_menu_width);
                  $(element).children(selectors.contentItemMega).css('left', -left+'px');
                }
              }
            })
            $(selectors.headerIsVisible+' .drop_to_right').each(function(index,element){
              var item_left = $(element).offset().left;
              var overflow_left = (550 > (item_left - container_left));
              var overflow_right = ((550 + item_left) > container_right);
              if( overflow_left ){
                var left = (item_left - container_left);
                $(element).addClass('drop_to_right').removeClass('drop_to_left');
              }
              if( overflow_right && !overflow_left ){
                $(element).addClass('drop_to_left').removeClass('drop_to_right');
              }
            });
          },100);
        }
      }
    }
  }
  return {
    init: init
  };
})(jQuery);

window.theme = window.theme || {};

theme.DropdownReposive = (function() {
  function init(window,item,box){
    var selectors = {
      headerIsVisibleDesktop: '.kiti-DropWindowDesktop',
      headerIsVisible: window,
      itemMega: item,
      contentItemMega: box
    };
    var window_size = jQuery('body').innerWidth();
    window_size += theme.scrollbarWidth;
    var headerIsVisible = selectors.headerIsVisibleDesktop;
    if( window_size <= 480 || $(selectors.headerIsVisible).innerWidth() <= 480 ){
      headerIsVisible = selectors.headerIsVisible;
    }
    if( $(headerIsVisible).length >0){
      setTimeout(function(){
        $(selectors.itemMega).each(function(index,element){
          var container = $(element).closest(headerIsVisible);
          if(container.length <= 0){ return true };
          if($(element).find(selectors.contentItemMega).length <= 0){ return true };
          var itemwidth_css = parseFloat(getComputedStyle($(element).find(selectors.contentItemMega)[0]).width);
          if (itemwidth_css > $(element).closest(selectors.headerIsVisible).outerWidth()) {
            itemwidth_css = $(element).closest(selectors.headerIsVisible).outerWidth();
          }
          var container_width = container.innerWidth() < itemwidth_css ? itemwidth_css : container.innerWidth();
          var container_offset = container.offset();
          $(element).children(selectors.contentItemMega).css({'max-width':container_width,'left':'','right':''});
          var sub_menu_width = $(element).children(selectors.contentItemMega).outerWidth();
          var item_width = $(element).outerWidth();
          $(element).children(selectors.contentItemMega).css({'left':'-'+(sub_menu_width/2 - item_width/2)});
          var container_left = container_offset.left;
          var container_right = (container_left + container_width);
          var item_left = container.innerWidth() < itemwidth_css ? $(element).find(selectors.contentItemMega).offset().left : $(element).offset().left;

          var overflow_left = (sub_menu_width/2 > (item_left - container_left));
          var overflow_right = ((sub_menu_width + item_left) > container_right);
          if( overflow_left){
            // console.log(1)
            var left = (item_left - container_left); 
            $(element).children(selectors.contentItemMega).css({'left':-left});
          }
          if( overflow_right && !overflow_left ){
            var left = (item_left - container_left);
            if(!(sub_menu_width/2 > (item_left + item_width - container_left)) && $(element).find(selectors.contentItemMega).hasClass('inline')){
              let item_right = ((container_left + container_width) - (item_left + item_width))
              if ((item_right + sub_menu_width) > container_width) {
                let maxWidth = container_width - item_right;
                $(element).children(selectors.contentItemMega).css({'max-width':maxWidth});
                sub_menu_width = $(element).children(selectors.contentItemMega).outerWidth();
                left = left + item_right;
              } else {
                left = left + item_right;
              }
            }
            left = left - ( container_width - sub_menu_width );
            $(element).children(selectors.contentItemMega).css({'left':-left});
          }
        })
      },100);
    }
    if(theme.is_mobile === true){
      $(selectors.itemMega).addClass('kiti-DropisMobile').removeClass('kiti-DropisDesktop');
    }
    else{
      $(selectors.itemMega).addClass('kiti-DropisDesktop').removeClass('kiti-DropisMobile');
    }
  }
  return {
    init: init
  };
})();

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

/* ================ TEMPLATES ================ */

window.theme = theme || {};

theme.customerTemplates = (function() {

  function initEventListeners() {
    // Show modal
    if($('#accountModal').length > 0){
      $(document).on('click','a[href|="/account/login"], a[href|="/account/register"]', function(evt) {
        if ($(this).attr('href') === '/account') {
          return false;
        }
        evt.preventDefault();
        $('#accountModal').modal();
      });
    }

    // Show reset password form
    $(document).on('click','#RecoverPassword', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });

    // Hide reset password form
    $(document).on('click','#HideRecoverPasswordLink', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });

    $('.tab-trigger-link').on('click', function (e) {
      var targetHref = $(this).attr('href');
      $('.nav-dashboard').find('a[href="'+targetHref+'"]').trigger('click');
      e.preventDefault();
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('d-none');
    $('#CustomerLoginForm').toggleClass('d-none');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('d-none');
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $newAddressForm.toggleClass('d-none');
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('d-none');
      $(this).closest('.col-toggle').toggleClass('col-lg-6');
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  return {
    init: function() {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();

/*================ SECTIONS ================*/
window.theme = window.theme || {};
theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle'
  };
  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);

    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }
    this.$edit.on('click', this._onEditClick.bind(this));
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));

      $evtTarget.toggleClass(config.showEditClass);
      $updateLine.toggleClass(config.showClass);
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled){
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};
theme.Filters = (function() {
  let self = this;
  var constants = {
    SORT_BY: 'sort_by'
  };
  var selectors = {
    filterGroup: '.kt_layerfilterGroups',
    filterGroupDesktop: '.kt_layerfilterGroupsDesktop',
    filterGroupMobile: '.kt_layerfilterGroupsMobile',
    filterLink: 'a[data-pjax-filter]',
    catShowing: '.child_collection li.current-cat'
  };
  let dataToggle = $(selectors.filterGroupDesktop).data('toggle');
  let item_categories_filter,groupsFilters, brands_icon, colorGroupFilter, groupsFilter;
  function Filters(container) {
    item_categories_filter = $('.kt_categories_filter').length > 0 ? $('.kt_categories_filter')[0].innerText.replace(/(\r\n|\n|\r|\s\s)/gm, "") : '';
    groupsFilters = JSON.parse(document.getElementById('groupsFilters').innerHTML);
    brands_icon = groupsFilters.settings.brands_icon.split(",");
    colorGroupFilter = groupsFilters.settings.color_groups.split(", ");
    groupsFilter = groupsFilters.blocks;
    var $container = (this.$container = $(container));
    this._createFilter();
    this._checkCatShowing();
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {
    _createFilter: function() {
      var filterContent = '';
      var currSearch = window.location.search;
      var currSort = $('#sort_by').length ? ($('#sort_by li.selected a').attr('href')).replace('?','') : undefined;
      if(currSearch.indexOf('?sort_by=') >= 0 || currSearch.indexOf('?page=') >= 0 || currSearch.indexOf('?view=') >= 0 || currSearch.indexOf('?q=') >= 0){
        currSearch = '?'+currSearch.split('?')[1];
        if (currPage > 1) {
          currSearch = currSearch.replace('page='+currPage, 'page=1')
        }
      }
      else{
        currSearch = '';
      }
      _.forEach(groupsFilter, function(item,idx0) {
        var filterGroupItem  = "";
        item.new_row = item.new_row || false;
        if(item.key == 'kt_rencent'){
          if (item.new_row) {filterGroupItem += '<div class="col-12 d-none d-lg-block clearfix"></div>'}
          filterGroupItem += '<div class="kt_filterGroupItem col-12 col-lg-'+item.block_width+' kt_filterGroupItem'+idx0+' widget widget_recent_product" style="display:none;">';
          filterGroupItem += '<ul><li class="_"></li></ul></div>';
        }
        else if(item.key == 'kt_banner'){
          if (item.img === null) {return}
          if (item.new_row) {filterGroupItem += '<div class="col-12 d-none d-lg-block clearfix"></div>'}
          filterGroupItem += '<div class="kt_filterGroupItem col-12 col-lg-'+item.block_width+' kt_filterGroupItem'+idx0+' widget widget_banner"><ul class="kt_filterGroupItem_ul pt-2i pt-lg-0i"><li class="_banner text-center" style="border: none"><div class="banner-effect1" style="position: relative"><a href="'+item.url+'"><img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="'+item.img+'"></a></div></li></ul>';
          filterGroupItem += '</div>';
        }
        else if(item.key == 'kt_custom'){
          if (item.new_row) {filterGroupItem += '<div class="col-12 d-none d-lg-block clearfix"></div>'}
          filterGroupItem += '<div class="kt_filterGroupItem col-12 col-lg-'+item.block_width+' kt_filterGroupItem'+idx0+' widget widget_custom">'+item.content+'<ul class="list-unstyled"><li class="_"></li></ul>';
          filterGroupItem += '</div>';
        }
        else if(item.key == 'kt_categories'){
          if (item.new_row) {filterGroupItem += '<div class="col-12 d-none d-lg-block clearfix"></div>'}
          filterGroupItem += '<div class="kt_filterGroupItem col-12 col-lg-'+item.block_width+' kt_filterGroupItem'+idx0+'">'+item_categories_filter+'<ul class="list-unstyled m-0"><li class="_"></li></ul>';
          filterGroupItem += '</div>';
        }
        else{
          if (item.new_row) {filterGroupItem += '<div class="col-12 d-none d-lg-block clearfix"></div>'}
          filterGroupItem += '<div class="kt_filterGroupItem col-12 col-lg-'+item.block_width+' kt_filterGroupItem'+idx0+' blockStyle_'+item.block_style+' split_'+item.use_split+'">';
          filterGroupItem += '<div class="layered_subtitle_heading"><span class="layered_subtitle">'+item.title+'<span></span></span><span class="ico"><i class="fa fa-angle-down" aria-hidden="true"></i></span></div>';
          filterGroupItem += '<ul class="kt_filterGroupItem_ul">';
          var itemTags = item.tags;
          _.find(collectionTags, function(itemTag) {
            if(itemTag.indexOf(item.key+" ") === 0 && item.tags.length === 0){
              if(filterGroupItem.indexOf('_'+_snakeCase(itemTag.replace(item.key+" ",""))) === -1){
                filterGroupItem += '<li class="_'+_handleize(itemTag.replace(item.key+" ",""));
                if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                  filterGroupItem += ' tagSelected';
                }
                if(iscollectionTags.length > 0 && _.indexOf(iscollectionTags, itemTag) < 0){
                  filterGroupItem += ' tagHidden';
                }
                filterGroupItem += '">';
                filterGroupItem += '<a class="custom-control custom-checkbox" data-pjax-filter="" href="';
                if(currTags_handleize.length == 0){
                  filterGroupItem += '/collections/'+collection.Crr+'/'+_handleize(itemTag)+currSearch;
                }
                else if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                  filterGroupItem += '/collections/'+collection.Crr+'/';
                  _.forEach(currTags_handleize, function(itemCurrentTags) {
                    if(_handleize(itemTag) !== itemCurrentTags){
                      filterGroupItem += itemCurrentTags+'+';
                    }
                  })
                  filterGroupItem += currSearch;
                }else{
                  filterGroupItem += '/collections/'+collection.Crr+'/';
                  _.forEach(currTags_handleize, function(itemCurrentTags) {
                    if(_handleize(itemTag) !== itemCurrentTags){
                      filterGroupItem += itemCurrentTags+'+'
                    }
                  })
                  filterGroupItem += _handleize(itemTag)+currSearch;
                }
                filterGroupItem += '" title="'+itemTag+'">';
                if(colorGroupFilter.indexOf(item.key) !== -1){
                  filterGroupItem += '<span class="color_pick swatch" data-color="'+_handleize(itemTag.replace(item.key+" ",""))+'"></span>';
                }
                if(item.block_style === '6' || item.block_style === '7'){
                  _.forEach(brands_icon, function(itemBrandIcon) {
                    if(itemBrandIcon.indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1 || _snakeCase(itemBrandIcon).indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1){
                      filterGroupItem += '<span class="brand_icon"><img src="';
                      filterGroupItem += itemBrandIcon;
                      filterGroupItem += '"></span>';
                    }
                  });
                }
                filterGroupItem += '<span class="custom-control-label titleFilterItem">'+itemTag.replace(item.key+" ","")+'</span>';
                filterGroupItem += '</a>';
                filterGroupItem += '</li>';
              }
            }
            else if(item.tags === 'all_tag'){
              filterGroupItem += '<li class="_'+_handleize(itemTag);
              if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                filterGroupItem += ' tagSelected';
              }
              if(iscollectionTags.length > 0 && _.indexOf(iscollectionTags, itemTag) < 0){
                filterGroupItem += ' tagHidden';
              }
              filterGroupItem += '">';
              filterGroupItem += '<a class="custom-control custom-checkbox" data-pjax-filter="" href="';
              if(currTags_handleize.length == 0){
                filterGroupItem += '/collections/'+collection.Crr+'/'+_handleize(itemTag)+currSearch;
              }
              else if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                filterGroupItem += '/collections/'+collection.Crr+'/';
                _.forEach(currTags_handleize, function(itemCurrentTags) {
                  if(_handleize(itemTag) !== itemCurrentTags){
                    filterGroupItem += itemCurrentTags+'+'
                  }
                })
                filterGroupItem += currSearch;
              }
              else{
                filterGroupItem += '/collections/'+collection.Crr+'/';
                _.forEach(currTags_handleize, function(itemCurrentTags) {
                  if(itemTag !== itemCurrentTags){
                    filterGroupItem += itemCurrentTags+'+'
                  }
                })
                filterGroupItem += _handleize(itemTag)+currSearch;
              }
              filterGroupItem += '" title="'+itemTag+'">';                
              if(colorGroupFilter.indexOf(item.key) !== -1){
                filterGroupItem += '<span class="color_pick swatch" data-color="'+_handleize(itemTag)+'"></span>';
              }
              if(item.block_style === '6' || item.block_style === '7'){
                _.forEach(brands_icon, function(itemBrandIcon) {
                  if(itemBrandIcon.indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1 || _snakeCase(itemBrandIcon).indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1){
                    filterGroupItem += '<span class="brand_icon"><img src="';
                    filterGroupItem += itemBrandIcon;
                    filterGroupItem += '"></span>';
                  }
                });
              }
              filterGroupItem += '<span class="custom-control-label titleFilterItem">'+itemTag+'</span>';
              filterGroupItem += '</a>';
              filterGroupItem += '</li>';
            }
            else if(item.tags.length > 0){
              _.forEach(item.tags.split(', '), function(item_,idx0) {
                if(_snakeCase(itemTag) === _snakeCase(item_) && filterGroupItem.indexOf('_'+_snakeCase(itemTag.replace(item.key+" ",""))) === -1){
                  filterGroupItem += '<li class="_'+_handleize(itemTag);
                  if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                    filterGroupItem += ' tagSelected';
                  }
                  if(iscollectionTags.length > 0 && _.indexOf(iscollectionTags, itemTag) < 0){
                    filterGroupItem += ' tagHidden';
                  }
                  filterGroupItem += '">';
                  filterGroupItem += '<a class="custom-control custom-checkbox" data-pjax-filter="" href="';
                  if(currTags_handleize.length == 0){
                    filterGroupItem += '/collections/'+collection.Crr+'/'+_handleize(itemTag)+currSearch;
                  }
                  else if(_.indexOf(currTags_handleize, _handleize(itemTag)) >= 0){
                    filterGroupItem += '/collections/'+collection.Crr+'/';
                    _.forEach(currTags_handleize, function(itemCurrentTags) {
                      if(_handleize(itemTag) !== itemCurrentTags){
                        filterGroupItem += itemCurrentTags+'+'
                      }
                    })
                    filterGroupItem += currSearch;
                  }
                  else{
                    filterGroupItem += '/collections/'+collection.Crr+'/';
                    _.forEach(currTags_handleize, function(itemCurrentTags) {
                      if(itemTag !== itemCurrentTags){
                        filterGroupItem += itemCurrentTags+'+'
                      }
                    })
                    filterGroupItem += _handleize(itemTag)+currSearch;
                  }
                  filterGroupItem += '" title="'+itemTag+'">';                
                  if(colorGroupFilter.indexOf(item.key) !== -1){
                    filterGroupItem += '<span class="color_pick swatch" data-color="'+_handleize(itemTag)+'"></span>';
                  }
                  if(item.block_style === '6' || item.block_style === '7'){
                    _.forEach(brands_icon, function(itemBrandIcon) {
                      if(itemBrandIcon.indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1 || _snakeCase(itemBrandIcon).indexOf(_snakeCase(itemTag.replace(item.key+" ",""))) !== -1){
                        filterGroupItem += '<span class="brand_icon"><img src="';
                        filterGroupItem += itemBrandIcon;
                        filterGroupItem += '"></span>';
                      }
                    });
                  }
                  filterGroupItem += '<span class="custom-control-label titleFilterItem">'+itemTag+'</span>';
                  filterGroupItem += '</a>';
                  filterGroupItem += '</li>';
                }
              });
            }
          })
          filterGroupItem += '</ul>';
          filterGroupItem += '</div>';
        }
        if(filterGroupItem.indexOf('<li class="_') !== -1){
          filterContent += filterGroupItem;
        }
      })
      $(selectors.filterGroupDesktop).addClass('colFilter-'+$(filterContent).length);
      if($(window).width() >= 992){
        $(selectors.filterGroupDesktop).html('<div class="d-flex flex-wrap">'+filterContent+'</div>');
        if(dataToggle == 'show'){
          $(selectors.filterGroupDesktop).find('.kt_filterGroupItem').addClass('showAny')
        }
      }
      else{
        $(selectors.filterGroupMobile).html(filterContent);
        if(dataToggle == 'show'){
          $(selectors.filterGroupMobile).find('.kt_filterGroupItem').addClass('show')
        }
        if($('.kt_layerfilterGroups .kt_filterGroupItem').last().hasClass('blockStyle_3') || $('.kt_layerfilterGroups .kt_filterGroupItem').last().hasClass('blockStyle_6') || $('.kt_layerfilterGroups .kt_filterGroupItem').last().hasClass('blockStyle_7')){
          $('.kt_layerfilterGroups .kt_filterGroupItem').last().addClass('showAny')
        }
        if($('.kt_layerfilterGroups .kt_filterGroupItem').first().hasClass('widget_product_categories')){
          $('.kt_layerfilterGroups .kt_filterGroupItem').first().addClass('showAny')
        }
      }
      
      if($('.widget_recent_product').length > 0){
        let stringProduct = localStorage.getItem("kt-recent") || '';
        if(localStorage.getItem("kt-recent") !== null){
          let arrayProduct = stringProduct.split(',').reverse();
          $(".widget_recent_product").show().attr('data-include', firstPrd+'?q='+arrayProduct.join("+")+'&view=recently-sidebar&design_theme_id='+Shopify.theme.id).addClass('lazyload');
        }
      }

      if (typeof currSort !== undefined){
        _.forEach($('#sort_by a'), function(itemOrderby,idx0) {
          var newSort = ($(itemOrderby).attr('href')).replace('?','');
          if(currSearch !== '' && currSearch.indexOf('sort_by=') === -1 && currSearch.indexOf(($(itemOrderby).attr('href')).replace('?','')) === -1){
            $(itemOrderby).attr('href',currSearch+($(itemOrderby).attr('href')).replace('?','&'))
          }
          else if(currSearch !== '' && currSearch.indexOf('sort_by=') !== -1 && currSearch.indexOf(($(itemOrderby).attr('href')).replace('?','')) === -1){
            $(itemOrderby).attr('href',currSearch.replace(currSort,newSort));
          }else if(currSort == newSort){
            $(itemOrderby).attr('href',currSearch);
          }
        });
      }
      $('#filterApply').html($('.result-count').html());
      $('#filterSelected').html($('.filter-container__selected-filter').html());
      if($(selectors.filterGroup).find('.tagSelected').length > 0){
        $('#filterClear').show();
      }
      else{
        $('#filterClear').hide();
      }
    },
    _checkCatShowing: function() {
      if($(selectors.catShowing).length > 0){
        $(selectors.catShowing).parents('li.level-1').addClass('showAny');
      }
    }
  });

  return Filters;
})();

theme.clickOnScrollButton = (function(){
  var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var element = $('.kt_layerFilterJS a[data-action="infinity"]').not('.loading')[0];
  if(element !== undefined && getComputedStyle($('.kt_layerFilterJS').find('.loadMore')[0]).display !== "none" && element.getBoundingClientRect().top <= viewportHeight + 600){
    // disableScroll();    
    $('.kt_layerFilterJS').find('a[data-action="infinity"]').trigger('click');
  }
});

theme.FiltersPjax = (function(){
  var loadmore = false;
  var scrollTop = null;
  $(document).on('click', 'a[data-pjax-filter]', function(event) {
    if ($.support.pjax) {
      if($(this).attr('data-action') === 'loadmore' || $(this).attr('data-action') === 'infinity' ){
        $.pjax.click(event, {
          container: '.product-listing-loadmore',
          fragment: '.product-listing',
          timeout: 4000,
          scrollTo: false,
          push: false
        });
        $(this).text($(this).attr('data-text-loading'));
        loadmore = true;
      }
      else{
        $('.loadingFilter .d-none').removeClass('d-none');
        $.pjax.click(event, {
          container: '.kt_layerFilterJS',
          fragment: '.kt_layerFilterJS',
          timeout: 4000,
          scrollTo: false
        });
      }
      if($(this).attr('data-scroll-top') !== undefined){
        scrollTop = true;
        $('div[data-section-id="kt_collection_banner"]').find('img').css('opacity',0.5)
      }
    }
  });

  $(document).on('click','a[data-ktpjax]:not([data-col])', function(){
    $('.loadingFilter .d-none').removeClass('d-none');
    var val = $(this).attr('data-href');
    $('.ktjax').attr('href',theme.Images.removeProtocol(window.location.href));
    $.ajax({
      type: "POST",
      url: '/cart.js',
      data: {"attributes[theme_coll_layout]": val},
      dataType: 'json',
      success: function(d){
        if ($.support.pjax) {
          $('.ktjax').trigger('click');
        } else {
          window.location.reload();
        }
      }
    });
  });

  $(document).on('click','a[data-col]:not(.active)', function(){
    $('.show-grid-list').css('pointer-events', 'none');
    var val = $(this).attr('data-href');
    $.ajax({
      type: "POST",
      url: '/cart.js',
      data: {"attributes[theme_coll_layout]": val},
      dataType: 'json',
      success: function() {
        $('.product-listing .lazyloaded').addClass('lazyload');
        $('.show-grid-list').css('pointer-events', '');
      }
    });
    $('a.active[data-col]').removeClass('active').attr('data-ktpjax');
    $(this).addClass('active');
    $('.show-grid-list .layered_subtitle').html($(this).html());
    $('.show-pds').each(function(){
      $(this).attr('data-href',val.split('_')[0]+$(this).attr('data-pds'))
    });
    var col_crr = $('.product-listing').attr('data-grid'), fix_col_crr = $(this).attr('data-fix-grid');
    var col = $(this).attr('data-col'), fix_col = $(this).attr('data-fix-col');
    $('.product-listing').attr({'class': $('.product-listing').attr('class').replace(fix_col_crr,fix_col), 'data-fix-grid': col_crr, 'data-grid': col});
    $('.product-listing li.grid-item').attr('class', $('.product-listing li.grid-item').attr('class').replace(col_crr,col));    
    theme.checkProductGrid_Width();
    if($('.product-listing[data-section-type="masory-section"]').length > 0){
      var $grid = $('#Masory-collection-template.ly__ms_items').isotope({
        itemSelector: '.grid-item',
        masonry: {
          horizontalOrder: true,
          percentPosition: true
        },
        transitionDuration: '.8s'
      });
    }    
  });

  $(document).on('pjax:success', function() {
    if(loadmore){
      var countAddNew = $('.product-listing .product-listing-loadmore').find('.grid-item').length;
      $('.product-listing').find('.product-listing-loadmore').first().addClass('removeElement');
      $('.product-listing').append($('.product-listing').find('.product-listing-loadmore').first().html());
      $('.product-listing').find('.product-listing-loadmore.removeElement').first().remove();
      var CountEnd = $('.CountEnd').first().text(), AllCount = $('.AllCount').first().text(), $aMore = $('.pagination_ [data-action]').first();
      CountEnd = +CountEnd + countAddNew;
      $('.CountEnd').text(CountEnd);
      if(CountEnd < +AllCount){
        var curPage = $aMore.attr('data-page').replace('page_','')
        $aMore.attr('href',$aMore.attr('href').replace('page='+curPage,'page='+(+curPage+1))).attr('data-page','page_'+(+curPage+1));
      }
      else{
        $('.pagination_ .loadMore').hide();
      }
      $aMore.removeClass('loading').text($aMore.attr('data-text-button'));
      $('#filterApply').html($('.result-count').html());
      // enableScroll();
    }
    else if(scrollTop == true){
      $('html').animate({scrollTop:0}, 'slow');
      scrollTop = false;
    }
    else{
      var offsetTop = $('.header.ontop').length !== 0 ? $('#PageContainer').offset().top - ($('.header.ontop').height()) * 2 : $('#PageContainer').offset().top - 100;
      $('html').animate({scrollTop:offsetTop}, 'slow');
    }
    if($('.product-listing[data-section-type="masory-section"]').length > 0 && loadmore){
      for (var i = CountEnd - countAddNew; i <= CountEnd; i++) {
        let $this = $('.product-listing .grid-item:eq('+i+')');
        $('.product-listing')
        .isotope('appended', $this)
        .isotope('layout');
      }
      theme.updateResizeProductCard();
    }
    loadmore = false;
    theme.checkProductGrid_Width();
    theme.wokerktlz(true);
    var prefetch = document.createElement('link');
      prefetch.rel = "prefetch";
      prefetch.href = $('.collection-products .btn-loadmore').attr('href') + '&_pjax=.product-listing-loadmore';
      prefetch.onload = function() {
        $(this).remove();
      };
    headDocument.insertBefore(prefetch, firstLink);
    if ($(".shopify-product-reviews-badge").length > 0 && typeof window.SPR == 'function') {
      return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
    }
  })
  $(document).on('pjax:complete', function(event, xhr, textStatus, options) {
    var sections = new theme.Sections();
    sections.register('masory-section', theme.ProductsMasorySection);
    sections.register('collection-filter', theme.Filters);
    KT.fixGridSwatch();
    if($('.loadingFilter .card').length > 0){$('.loadingFilter .card').addClass('d-none').removeClass('bottom')};
    if($('.kt_layerFilter.kt_canvas').length <= 0){
      $('body').removeClass('filterOpened');
      anime({targets: '#bg-overlay.filter-overlay', backgroundColor: 'rgba(0,0,0,0)',duration: 300,easing: 'linear',complete: function(anim) {
        $('#bg-overlay').removeAttr('style class');
      }})
    }
  });
});

window.theme = window.theme || {};
theme.HeaderSection = (function() {

  function Header(container) {
    theme.MenuReposive.init();
    theme.ResizeNavMega.init();
    let closeAnnouncement = '.close-header-announcement';
    if ($(container).find('.swiper-container').length > 0) {
      KT.loadScript('swiper', function(e,l){
        if (l == 'ok') {
          theme.Swiper.init($('[data-section-id="header"]')[0]);
        }
      });
    }
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.MenuReposive.unload();
    },
    onSelect: function(evt) {
      // console.log('onSelect');
    },
    onBlockSelect: function(evt) {
    }
  });

  return Header;
})();

/* eslint-disable no-new */
theme.Product = (function() {
  function Product(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var productsectionId = $container.attr('data-product-id');
    theme.ktCountdown(container);
    theme.dateFromTo();
    theme.realTimeVisitor(container);

    this.settings = {
      // Breakpoints from src/stylesheets/global/variables.scss.liquid
      enableHistoryState: $container.data('enable-history-state') || false,
      imageSize: "530x@2x",
      namespace: '.slideshow-' + sectionId,
      sectionId: sectionId,
      zoomEnabled: theme.function.photoZoom,
      thumbEnabled: $container.data('use-thumb'),
      imagesLayout: $container.data('images-layout'),
      ajaxCart: $container.data('enable-ajax-cart') || false
    };
    this.selectors = {
      template: '#ProductSection-' + sectionId,
      addToCart: '#AddToCart-' + sectionId,
      addToCartText: '#AddToCartText-' + sectionId,
      addToCartMore: '#AddToCartMore-'+ sectionId,
      comparePrice: '#ComparePrice-' + sectionId,
      originalPrice: '#ProductPrice-' + sectionId,
      variesPrice: '#ProductVaries-' + sectionId,
      unitPrice: '#UnitPrice-' + sectionId,
      SKU: '.variant-sku',
      originalPriceWrapper: '.product-price__price-' + sectionId,
      originalSelectorId: '#ProductSelect-' + sectionId,
      variantSelectorId: '#ProductVariantSelect-' + sectionId,
      productFeaturedImage: '.product-single__photos-' + sectionId + ' .product-single__photo.active-photo',
      productThumbSlick: '.productThumbSlide--' + sectionId,
      productPrices: '.product-single__price-' + sectionId,
      productPhotosWrapper: '.photos-wrapper-' + sectionId,
      productPhotos: '.product-single__photos-' + sectionId,
      productPhotoImages: '.product-single__photo--' + sectionId,
      productThumbsWrapper: '.thumbnails-wrapper-' + sectionId,
      productThumbs: '.product-single__thumbnails-' + sectionId,
      productThumbImages: '.product-single__thumbnail--' + sectionId,
      saleClasses: '#ProductSection-' + sectionId + 'product-price__sale product-price__sale--single',
      saleLabel: '.product-price__sale-label-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      dataSettings: '.datasettings--' + sectionId,
      dataJs: '.datajs--' + sectionId,
      cartForm: '#cart-form--' + sectionId
    }

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML);
    this.dataSettings = $(this.selectors.dataSettings).data();
    this.dataJs = $(this.selectors.dataJs).data();
    let self = this;
    if (sectionId == 'quickview-template') {
      setTimeout(function() {
      self._initBreakpoints();
      }, 400);
    } else {
      if(this.settings.imagesLayout !== 'masonry'){
        this._initBreakpoints();
      } else if(this.settings.imagesLayout === 'masonry'){
        this._initIsotope();
        self._initPhotoSwipeFromDOM();
        this._initStickySummary();
        self._onReSizeInfo();
      }
    }
    this._stringOverrides();
    this._initVariants();
    this._initImageSwitch();
    this._create360();
    this._checkVariantVideo();
    if(this.dataSettings.useMaxheight){
      this._onReSizeImages();
    }
    this._stickyAddCart();
    if(theme.gadget.shipTo){
      this._shipTo();
    }
    this._AjaxForm();
    this._prefetchCollection();
    // Pre-loading product images to avoid a lag when a thumbnail is clicked, or
    // when a variant is selected that has a variant image
    if(this.settings.sectionId !== _.toString(this.productSingleObject.id)){
      theme.Images.preload(this.productSingleObject.images[0], this.settings.imageSize);
      theme.Images.preload(this.productSingleObject.images[0], '110x110@2x');
    }
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function() {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },

    _initBreakpoints: function() {
      var self = this;
      var current_window_width = $(window).width();
      KT.loadScript('swiper', function(e,l){
        if (l == 'ok') {
          // initialize thumbnail slider on mobile if more than three thumbnails
          if ($(self.selectors.productThumbImages).length >= 1 && $(self.selectors.productThumbsWrapper).height() > 1) {
            self._initThumbnailSlider();
          }
          // initialize photo slider
          if ($(self.selectors.productPhotoImages).length >= 1) {
            self._initPhotoSlider();
          }
          // Changes slider direction
          $(window).on("resize", function() {
            if(current_window_width >= 576 && $(window).width() < 576 || current_window_width < 576 && $(window).width() >= 576){
              if (theme.function.use_thumb_hidden_on_mb || self.dataSettings.useThumbVertical) {
                if (typeof self.thumbSlider === 'object') {
                  self._destroyThumbnailSlider();
                }
                if ($(self.selectors.productThumbImages).length >= 1 && $(self.selectors.productThumbsWrapper).height() > 1) {
                  self._initThumbnailSlider();
                }
                self._destroyPhotoSlider();
                self._initPhotoSlider();
              }
              current_window_width = $(window).width();
            }
          })
        }
      })
    },

    _initIsotope: function() {
      var self = this;
      KT.loadScript('isotope', function(e,l){
        if (l == 'ok') {
          var $grid = $(self.selectors.productPhotos).isotope({
            itemSelector: '.product-single__photos-item',
            percentPosition: true,
              masonry: {
                columnWidth: '.grid-sizer'
              }
          });
        }
      });
    },

    _initVariants: function() {
      var self = this;
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };
      if(_.filter(theme.function.productOptionStyle,{'op_pre_select': true}).length){
        options.enableHistoryState = false;
      }
      if(options.product.variants[0].requires_shipping == false){$(this.selectors.template+' .freeShipping').removeClass('hidden')}
      this.variants = new slate.Variants(options);
      this.$container.on('variantChange' + this.settings.namespace, this._updateAddToCart.bind(this));
      if(this.dataSettings.layoutSection !== 3){
        this.$container.on('variantImageChange' + this.settings.namespace, this._updateImages.bind(this));
      }
      this.$container.on('variantPriceChange' + this.settings.namespace, this._updatePrice.bind(this));
      this.$container.on('variantSKUChange' + this.settings.namespace, this._updateSKU.bind(this));
      if(options.product.options.length >= 1 && options.product.options[0] !== "Title"){
        var option = this.variants.currentVariant.option1, check_option = 0;
        var optitonSelector1 = 'SingleOptionSelector-0--'+self.settings.sectionId;
        var optitonSelector2 = 'SingleOptionSelector-1--'+self.settings.sectionId;
        var optitonSelector3 = 'SingleOptionSelector-2--'+self.settings.sectionId;
        _.forEach(self.productSingleObject.variants, function(value) {
          $.each($('#'+optitonSelector1+' option'), function(index,el) {
            if(value.option1 !== option){
              check_option = 0;option = value.option1;
            }
            if(check_option == 0 && $(this).val() == value.option1){
              var firstVariant = _handleize(value.option1);
              if(value.option2){firstVariant = firstVariant +' / '+ _handleize(value.option2)}
              if(value.option3){firstVariant = firstVariant +' / '+ _handleize(value.option3)}
              $(this).attr({
                'data-first-variant': firstVariant,
                'data-first-variant-title': value.title
              });
              if(value.featured_image){
                $(this).attr('data-featured-image', value.featured_image.src);
              }
              check_option++;
            }
          });
        });
        $.each($(self.selectors.template+' .fake_select'), function(index, el) {
          var settings_op = _.find(theme.function.productOptionStyle, { 'name': $(this).data('name-option')});
          if(settings_op !== undefined){
            if(settings_op.style === "combobox with_out_variant_image") {
              $.each($(this).find('li'), function(idx, el) {
                var featuredImage = $(this).closest('.selector-wrapper.js').find('.single-option-selector option[value="'+$(this).attr('data-value')+'"]').attr('data-featured-image');
                if (featuredImage !== undefined) {
                  var fileExt = _.last(featuredImage.split('.')), featuredImage = featuredImage.replace('.'+fileExt, '_150x150_crop_center.'+fileExt);
                  $(this).closest('.selector-wrapper.js').find('.fake_select.variant_image li').eq(idx).find('img').attr('data-src', featuredImage).addClass('lazyload');
                }
              });
            }
            else{
              if(settings_op.color_watched && self.dataSettings.swatchStyle !== 'color'){
                $.each($(this).find('li'), function(idx, el) {
                  var featuredImage = $(this).closest('.selector-wrapper.js').find('.single-option-selector option[value="'+$(this).attr('data-value')+'"]').attr('data-featured-image');
                  if (featuredImage !== undefined) {           
                    var fileExt = _.last(featuredImage.split('.')), featuredImage = featuredImage.replace('.'+fileExt, '_100x100_crop_center.'+fileExt);
                  }
                  $(this).find('.swatch').css('background-image', 'url("' +featuredImage+ '")');
                });
              }
            }
          }
        });
        this._changeVariants(this.variants.currentVariant);
      }
    },

    _AjaxForm: function() {
      var self = this;
      let $form = $(self.selectors.cartForm);
      $(document).on('change', '.group-product .product-form__variants', function(){
        $(this).parents('.itemGroupProducts').find('[name="qty_group"]').attr('data-id', $(this).val());
      });
      if(this.settings.ajaxCart){
        $(document).on('submit', self.selectors.cartForm, function(e) {
          e.preventDefault();
          $(self.selectors.addToCart).removeClass('loaded').addClass('loading');
          if($form.find('.op_pre_select').length>0) {
            $form.find('.op_pre_select').addClass('error flash');
            setTimeout(function(){      
              $form.find('.op_pre_select').removeClass('flash');
            }, 1000)
            $('.btn.loading').removeClass('loading');
            return false;
          }
          if($form.find('.itemGroupProducts').length > 0) {
            let queue = [];
            queue.push({
              "id": parseInt($form.find('[name="id"]').val()),
              "quantity": parseInt($form.find('[name="quantity"]').val())
            })
            $(self.selectors.cartForm+' .itemGroupProducts [name="qty_group"]').each(function() {
              queue.push({
                "id": parseInt($(this).attr('data-id')),
                "quantity": parseInt($(this).val(), 10) || 0
              });
            });
            Shopify.KT_addItems(queue);
          } else {
            Shopify.KT_addItemFromForm('cart-form--'+self.settings.sectionId);
          }
        });
      } else if(this.settings.ajaxCart == false) {
        $(document).on('submit', self.selectors.cartForm, function(e) {
          $(self.selectors.addToCart).removeClass('loaded').addClass('loading');
          if($form.find('.op_pre_select').length>0){
            e.preventDefault();
            $form.find('.op_pre_select').addClass('error flash');
            setTimeout(function(){      
              $form.find('.op_pre_select').removeClass('flash');
            }, 1000)
            $('.btn.loading').removeClass('loading');
            return false;
          }else{
            if($form.find('.itemGroupProducts').length > 0) {
              e.preventDefault();
              let queue = [];
              queue.push({
                'id': parseInt($form.find('[name="id"]').val()),
                'quantity': parseInt($form.find('[name="quantity"]').val())
              });
              $(self.selectors.cartForm+' .itemGroupProducts [name="qty_group"]').each(function() {
                queue.push({
                  'id': parseInt($(this).attr('data-id')),
                  'quantity': parseInt($(this).val(), 10) || 0
                });
              });
              let ajax = {
                    type: "POST",
                    url: "/cart/add.js",
                    data: {'items': queue},
                    dataType: "json",
                    success: function(e) {
                      // console.log(e)
                      window.location.href = '/cart';
                    },
                    error: function(e) {
                      alert('error');
                    }
                  };
              $.ajax(ajax);
            } else {
              return;
            }
          }
        });
      }
    },

    _changeVariants: function(currentVariant) {
      var self = this;
      var options2 = new Array, options3 = new Array;
      var option = currentVariant.option1, check_option = 0;
      var optitonSelector1 = 'SingleOptionSelector-0--'+self.settings.sectionId;
      var optitonSelector2 = 'SingleOptionSelector-1--'+self.settings.sectionId;
      var optitonSelector3 = 'SingleOptionSelector-2--'+self.settings.sectionId;
      $.each($('.single-option-selector-'+self.settings.sectionId+' option'), function(index,el) {
        $(this).text($(this).val());
      });
      $('._soulout').removeClass('_soulout');
      $('._unavailable').removeClass('_unavailable');
      $('.kt_flash_lable').text('');
      _.forEach(self.productSingleObject.variants, function(value) {
        if(value.option1 === currentVariant.option1){
          options2.push(value.option2)
          if(value.option2 === currentVariant.option2){
            options3.push(value.option3)
          }
        }
        if(value.available == false){
          if (value.option1 == currentVariant.option1 && value.option2 == currentVariant.option2) {
            $.each($('#'+optitonSelector3+' option'), function(index,el) {
              if(value.option3 == $(this).attr('value')){
                $(this).text($(this).text()+' - Soldout');
                $('#cart-form--'+self.settings.sectionId+' ._'+_handleize(value.option3)+'[data-change-option="'+optitonSelector3+'"]').addClass('_soulout').find('.kt_flash_lable').text(' - Soldout');
              }
            });
          }
          else if(value.option1 == currentVariant.option1 && value.option3 == currentVariant.option3) {
            $.each($('#'+optitonSelector2+' option'), function(index,el) {
              if(value.option2 == $(this).attr('value')){
                $(this).text($(this).text()+' - Soldout');
                $('#cart-form--'+self.settings.sectionId+' ._'+_handleize(value.option2)+'[data-change-option="'+optitonSelector2+'"]').addClass('_soulout').find('.kt_flash_lable').text(' - Soldout');
              }
            });
          }
        }
      });
      options2 = $.unique(options2);
      options3 = $.unique(options3);
      $.each($('#'+optitonSelector2+' option'), function(index,el) {
        if(_.indexOf(options2,$(this).attr('value')) == -1){
          $('#cart-form--'+self.settings.sectionId+' ._'+_handleize($(this).val())+'[data-change-option="'+optitonSelector2+'"]').addClass('_unavailable').find('.kt_flash_lable').text(' - Unavailable');
        }
        else if(self.dataSettings.swatchStyle !== 'color'){
          var variant = _.filter(self.productSingleObject.variants, { 'option1': currentVariant.option1, 'option2': $(this).attr('value'), 'option3': currentVariant.option3 });
          var featuredImage = variant[0].featured_image !== null ? variant[0].featured_image.src : undefined;
          if (featuredImage !== undefined) {           
            var fileExt = _.last(featuredImage.split('.')), featuredImage = featuredImage.replace('.'+fileExt, '_100x100_crop_center.'+fileExt);
          }
          $('li._'+_handleize($(this).val())+'[data-change-option="'+optitonSelector2+'"] .swatch').css('background-image', 'url("' +featuredImage+ '")');
        }
      });
      $.each($('#'+optitonSelector3+' option'), function(index,el) {
        if(_.indexOf(options3,$(this).attr('value')) == -1){
          $('#cart-form--'+self.settings.sectionId+' ._'+_handleize($(this).val())+'[data-change-option="'+optitonSelector3+'"]').addClass('_unavailable').find('.kt_flash_lable').text(' - Unavailable');
        }
        else if(self.dataSettings.swatchStyle !== 'color'){
          var variant = _.filter(self.productSingleObject.variants, { 'id': currentVariant.id });
          var featuredImage = variant[0].featured_image !== null ? variant[0].featured_image.src : undefined;
          if (featuredImage !== undefined) {           
            var fileExt = _.last(featuredImage.split('.')), featuredImage = featuredImage.replace('.'+fileExt, '_100x100_crop_center.'+fileExt);
          }
          $('li._'+_handleize($(this).val())+'[data-change-option="'+optitonSelector3+'"] .swatch').css('background-image', 'url("' +featuredImage+ '")');
        }
      });
    },

    _onReSizeImages: function() {
      var self = this;
      var iframe = $(self.selectors.template+" iframe#resize-image-product");
      function maxHeight() {        
        if ($(window).width() >= 768) {
          if (self.selectors.template == '#ProductSection-product-template' && self.dataSettings.useMaxheight) {
            $(self.selectors.template+' .content-summary').css('max-height', iframe.height() - 10);
          }
          if (self.selectors.template == '#ProductSection-quickview-template') {
            $('#myModal .content-summary').css('max-height', iframe.height() - 10);
          }
        } else {
          $('.content-summary').css('max-height', '');
        }
      }
      iframe.each(function() {
        $(this.contentWindow || this).resize($.throttle( 150, maxHeight));
      })
    },

    _onReSizeInfo: function(refresh) {
      let self = this;
      let iframe = $(self.selectors.template+" iframe#resize-info-product");
      let thissummary = $('.summary.entry-summary');
      let thissummaryw = thissummary.width();
      let thissummaryo = thissummary.offset();
      let scrollTop = $(window).scrollTop();
      let mirrorHeight = $('.product-images').height();
      let thisposition = scrollTop + thissummary[0].getBoundingClientRect().top + (thissummary.outerHeight() - thissummary.height());
      let $window = $(window);
      function transalte() {
        if ($window.width() < 992) {return}
        scrollTop = $window.scrollTop();
        mirrorHeight = $('.product-images').height();
        let thissummaryh = thissummary.outerHeight();
        if (mirrorHeight > scrollTop + thissummaryh - thisposition) {
          if (scrollTop >= thisposition){
            let transalte = $('header[data-header-sticky="true"]').length > 0 ? 85 : 20;
            thissummary.not('.fixed').addClass('fixed').removeClass('maxscroll').css({'top': transalte+'px','width': thissummaryw+'px','transform': 'none'});
          }else if(scrollTop < thisposition){
            thissummary.removeClass('fixed maxscroll').removeAttr('style');
          }
        } else if (mirrorHeight <= thissummaryh + thissummary.offset().top) {
          let transalte = mirrorHeight - thissummaryh - 10;
          thissummary
          .addClass('maxscroll')
          .removeClass('fixed')
          .removeAttr('style')
          .css({'transform': 'translate3d(0px,'+transalte+'px,0px)','-webkit-transform': 'translate3d(0px,'+transalte+'px,0px)','moz-transform': 'translate3d(0px,'+transalte+'px,0px)','-ms-transform': 'translate3d(0px,'+transalte+'px,0px)','-o-transform': 'translate3d(0px,'+transalte+'px,0px)'});
        }
      }
      if (refresh) {
        transalte();
      } else {
        iframe.each(function() {
          $(this.contentWindow || this).resize($.throttle( 150, transalte));
        })
      }
    },

    _stickyAddCart: function() {
      var self = this;
      if ($('.kt-stickyAddCart').length > 0) {
        $(window).scroll(function() {
          let scrollTop = $(window).scrollTop();
          var $this = $('.kt-stickyAddCart');
          if (scrollTop > $(self.selectors.addToCart).offset().top + 60 && $('.kt-stickyAddCart').hasClass('fixed') === false) {
            var headerHeight = $('header[data-header-sticky="true"] .content_header').outerHeight() || 0;
            $this.addClass('fixed')
            if($('.kt-stickyAddCart .position-fixed').hasClass('top')){
              if (theme.window_W < 767 ) {
                headerHeight = 0
              }
              $('.kt-stickyAddCart .position-fixed.top').css('top',headerHeight+'px');
            }
          }
          else if(scrollTop <= $(self.selectors.addToCart).offset().top && $('.kt-stickyAddCart').hasClass('fixed')){
            $this.removeClass('fixed');
            $('.show-stickyAddCart #form_variants').slideToggle();
            $('body').removeClass('show-stickyAddCart');
            if($('.kt-stickyAddCart .position-fixed').hasClass('top')){
              $('.kt-stickyAddCart .position-fixed.top').css('top','-100%');
            }
          }
        });
      }
    },

    _initImageSwitch: function() {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;
      var $originalSelectorId = $(this.selectors.originalSelectorId);
      var $variantSelectorId = this.selectors.variantSelectorId;
      $(document).on('click',this.selectors.productThumbImages, function(evt) {
        evt.preventDefault();
        var $el = $(this);
        var template = self.selectors.template;
        if(typeof $el.attr('data-id') !== "undefined" && $el.attr('data-id') !== '' && $el.attr('title') !== self.productSingleObject.title ){
          $($variantSelectorId+ ' span').text($el.attr('title')).animate({"font-size": "14px"}, 400).animate({"font-size": "13px"}, 500);
          goto = false;
          var options = $el.attr('title').split(' / ');
          $(template +' .fake_select li').removeClass('selected');
          $(options).each(function(index, opiton) {
            var options_change = $(template +' option[value="'+opiton+'"]').val();
            var $options_change_ = $(template +' option[value="'+opiton+'"]').parent();
            $(template +' .fake_select li._'+_handleize(opiton)).addClass('selected');
            if(opiton != self.productSingleObject.title && $('[data-change-label="SingleOptionSelector-'+index+'--'+self.settings.sectionId+'"]').parent().hasClass('op_pre_select') === false){
              $(template +' label[data-change-label="SingleOptionSelector-'+index+'--'+self.settings.sectionId+'"] .text').text(opiton);
              $(template +" .swatches-selected-name[data-change-label='SingleOptionSelector-"+index+"--"+self.settings.sectionId+"] .name").html(opiton);
            }
            if(options_change != $options_change_.val() ){
              $options_change_.val(options_change).change();
            }
          });
          var val_id = $el.attr('data-id');
          $originalSelectorId.val(val_id).change();
          if(($(this).parents("div.product-page").data('enable-history-state')) == true && _.filter(theme.function.productOptionStyle,{'op_pre_select': true}).length <= 0){
            var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + val_id;
            window.history.replaceState({path: newurl}, '', newurl);
          }
        }
        var imageSrc = $el.attr('href');
      });
    },

    _initThumbnailSlider: function() {
      var self = this;      
      var current_window_width = $(window).width();
      if (self.thumbnailOptions) {
        optionsThumbs = self.thumbnailOptions;
      } else {
        var optionsThumbs = $(self.selectors.productThumbsWrapper).data();
        optionsThumbs.speed = 500;
        optionsThumbs.watchSlidesVisibility = true;
        optionsThumbs.grabCursor = true;
        optionsThumbs.watchOverflow = true;
        if (self.dataSettings.useThumbVertical && current_window_width < 576) {
          $(self.selectors.productThumbsWrapper).removeClass('swiper-container-vertical');
          optionsThumbs.direction = "horizontal";
          if (self.dataSettings.widthSection) {
            optionsThumbs.slidesPerView = 4;
            optionsThumbs.spaceBetween = 10;
          }
          else {
            optionsThumbs.slidesPerView = 4;
            optionsThumbs.spaceBetween = 10;
          }
        } else if(self.dataSettings.useThumbVertical){
          $(self.selectors.productThumbsWrapper).addClass('swiper-container-vertical');
          optionsThumbs.direction = "vertical";
          optionsThumbs.slidesPerView = "auto";
        }
        self.thumbnailOptions = optionsThumbs;
      }
      // console.log(optionsThumbs);
      self.thumbSlider = new Swiper(self.selectors.productThumbsWrapper, optionsThumbs);
    },

    _destroyThumbnailSlider: function() {
      self.thumbSlider.destroy();
      self.thumbSlider = undefined;
      self.thumbnailOptions = undefined;
    },
    
    _initPhotoSlider: function() {
      var self = this;
      // Create Photo slide
      if (self.photoOptions) {
        options = self.photoOptions;
      } else {
        var options = $(self.selectors.productPhotosWrapper).data();
        options.speed = 500;
        options.watchSlidesVisibility = true;
        options.grabCursor = true;
        options.watchOverflow = true;
        options.initialSlide = initialSlide;
        options.navigation = {
          nextEl: self.selectors.productPhotosWrapper + ' .swiper-button-next',
          prevEl: self.selectors.productPhotosWrapper + ' .swiper-button-prev',
        };
        if ($(self.selectors.productThumbsWrapper).hasClass('oneImageThumb') === false) {
          options.thumbs = {
            swiper: self.thumbSlider
          }
          if (theme.function.use_thumb_hidden_on_mb && theme.window_W < 768) {
            options.thumbs = null;
          }
        }
        options.on = {
          init: function () {
            initialSlide = 0;
          },
          slideChange: function () {
            setTimeout(function() {
              if ($(self.selectors.productThumbImages).length >= 1 && $(self.selectors.productThumbsWrapper).height() > 1) {
                self.thumbSlider.slideTo(self.photoSlider.realIndex,300,false);
              }
              var current_slide = $(self.photoSlider.slides[self.photoSlider.realIndex]);
              if (current_slide.find('.gallery-video').length == 0){
                $(self.selectors.productPhotos).find('video.video-element').trigger('pause');
              }
              if (theme.is_mobile == false && theme.function.photoZoom){
                $(self.selectors.template+' .photos-wrapper .product-single__photos-item').trigger('zoom.destroy');
                $.each($(self.selectors.template+' .photos-wrapper .swiper-slide-visible'), function(index, val) {
                  $(this).zoom({url: $(this).attr('data-src')});
                });
              }
            }, 100);
          }
        };
        self.photoOptions = options;
      }
      // console.log(options)
      self.photoSlider = new Swiper(self.selectors.productPhotosWrapper+':not(.first)', options);
      self._initPhotoSwipeFromDOM();
      if (theme.is_mobile == false && self.settings.zoomEnabled){
        KT.loadScript('zoom', function(e,l){
          if (l == 'ok') {
            $.each($(self.selectors.template+' .photos-wrapper .swiper-slide-visible'), function(index, val) {
              $(this).zoom({url: $(this).attr('data-src')});
            });
            $(document).on('click', 'img.zoomImg', function(event) {
              event.preventDefault();
              $(self.selectors.template+' img[data-srcfix="'+theme.Images.removeProtocol(event.target.currentSrc)+'"]').trigger('click');
            });
          }
        })
      }
    },

    _destroyPhotoSlider: function() {
      self.photoSlider.destroy();
      self.photoSlider = undefined;
      self.photoOptions = undefined;
    },

    _initPhotoSwipeFromDOM: function() {
      var self = this;
      if (self.dataSettings.wide) {
        KT.loadScript('photo-swipe', function(e,l){          
          if (l == 'ok') {
            theme.initPhotoSwipeFromDOM(self.selectors.template+' .photos-wrapper','.product-single__photos-item a','IMG', function(currentIndex, currentItem){
              if($(self.selectors.template+' .photos-wrapper .product-single__photos-item').length !== 0){
                var itemSlick = $(self.selectors.template+' .photos-wrapper').find('.product-single__photos-item[data-src~="'+currentItem.src+'"]');
                if($(itemSlick).length !== 0){
                  var slideIndex = $(itemSlick).closest('.product-single__photos-item').index();
                  self.photoSlider.slideTo(slideIndex, 300);
                }
              }
            });
          }
        })
      }
    },

    _initStickySummary: function() {
      let thissummary = $('.summary.entry-summary');
      let thissummaryw = thissummary.width();
      let thissummaryo = thissummary.offset();
      let scrollTop = $(window).scrollTop();
      let mirrorHeight = $('.product-images').height();
      let thisposition = scrollTop + thissummary[0].getBoundingClientRect().top + thissummary.height();
      let thisposition_max= scrollTop + thissummary[0].getBoundingClientRect().top + (thissummary.outerHeight() - thissummary.height());
      $(window).scroll(function() {
        scrollTop = $(window).scrollTop();
        mirrorHeight = $('.product-images').height();
        let thissummaryh = thissummary.outerHeight();
        if (thissummary !== undefined && theme.window_W >= 992) {
          if (mirrorHeight > scrollTop + thissummaryh - thisposition_max) {
            if (scrollTop + theme.window_H - 200 >= thisposition && thissummary.hasClass('fixed') == false){
              let transalte = $('header[data-header-sticky="true"]').length > 0 ? 85 : 20;
              thissummary.not('.fixed').addClass('fixed').removeClass('maxscroll').css({'top': transalte+'px','width': thissummaryw+'px','transform': 'none'});
            }else if(scrollTop + theme.window_H - 200 < thisposition && thissummary.hasClass('fixed')){
              thissummary.removeClass('fixed maxscroll').removeAttr('style');
            }
          }
          else if (thissummary.hasClass('maxscroll') == false && mirrorHeight <= thissummaryh + thissummary.offset().top) {
            let transalte = mirrorHeight - thissummaryh - 10;
            thissummary
            .addClass('maxscroll')
            .removeClass('fixed')
            .removeAttr('style')
            .css({'transform': 'translate3d(0px,'+transalte+'px,0px)','-webkit-transform': 'translate3d(0px,'+transalte+'px,0px)','moz-transform': 'translate3d(0px,'+transalte+'px,0px)','-ms-transform': 'translate3d(0px,'+transalte+'px,0px)','-o-transform': 'translate3d(0px,'+transalte+'px,0px)'});
          }
        }
      });
      $(window).resize(function() {
        if (thissummary !== undefined && $(window).width() >= 992 && thissummary.hasClass('fixed')) {
          thissummary.removeClass('fixed maxscroll').removeAttr('style');
        }
      });
    },

    _updateAddToCart: function(evt) {
      var variant = evt.variant;
      var self = this;
      var template = self.selectors.template;
      var sectionId = self.settings.sectionId;
      if($('#SingleOptionSelector-0--'+sectionId).val() !== undefined ){
        $('#callBackVariant--'+sectionId).attr('class','_'+_handleize($('#SingleOptionSelector-0--'+sectionId).val()));
        if($('#SingleOptionSelector-2--'+sectionId).val() !== undefined ){
          $('#callBackVariant--'+sectionId).addClass('_'+_handleize($('#SingleOptionSelector-2--'+sectionId).val()));
        }
        if($('#SingleOptionSelector-1--'+sectionId).val() !== undefined ){
          $('#callBackVariant--'+sectionId).addClass('_'+_handleize($('#SingleOptionSelector-1--'+sectionId).val()));
        }
      }
      if (variant) {
        var variantOption = $(template+' option[value="'+variant.id+'"]');
        variant.inventory_quantity = parseInt(variantOption.data('inventory-quantity'));
        variant.incoming = variantOption.data('incoming');
        if($('#SingleOptionSelector-0--'+sectionId) !== undefined && $('#SingleOptionSelector-0--'+sectionId).parent().find('.op_pre_select').length <= 0){
          $('label[data-change-label="SingleOptionSelector-0--'+sectionId+'"] .text').html($('#SingleOptionSelector-0--'+sectionId).val());
        }
        if($('#SingleOptionSelector-1--'+sectionId) !== undefined && $('#SingleOptionSelector-1--'+sectionId).parent().find('.op_pre_select').length <= 0){
          $('label[data-change-label="SingleOptionSelector-1--'+sectionId+'"] .text').html($('#SingleOptionSelector-1--'+sectionId).val());
        }
        if($('#SingleOptionSelector-2--'+sectionId) !== undefined && $('#SingleOptionSelector-2--'+sectionId).parent().find('.op_pre_select').length <= 0){
          $('label[data-change-label="SingleOptionSelector-2--'+sectionId+'"] .text').html($('#SingleOptionSelector-2--'+sectionId).val());
        }
        this._changeVariants(variant);
        this._updateGallery(evt,variant);
        $(this.selectors.variantSelectorId+ ' span').text(variant.title).animate({"font-size": "14px"}, 400).animate({"font-size": "13px"}, 500);
        $(this.selectors.productPrices).removeClass('visibility-hidden').attr('aria-hidden', 'true');
        // console.log(variant.inventory_quantity)
        // console.log(variant.inventory_management)
        if (variant.available) {
          $(template).find('.kt_progress_bar,.js-item-quantity--'+sectionId).removeClass('d-none');
          if (variant.inventory_quantity > 0 && variant.inventory_management !== null) {
            $('#qty-'+sectionId).attr('max',variant.inventory_quantity).trigger('change');
            $('.js-item-quantity--'+sectionId+' .control');
            $(template).find('.kt_progress_bar_pr').attr('data-remaining_items', variant.inventory_quantity);
            theme.stockCountdown.updateMeter(template + ' .kt_progress_bar_pr',variant.inventory_quantity);
          }
        } else {
          $(template).find('.kt_progress_bar,.js-item-quantity--'+sectionId).addClass('d-none');
        }
        if (variant.available || variant.incoming) {
          $(this.selectors.addToCart).prop('disabled', false);          
          if (variant.incoming) {
            $('.preOrder--'+sectionId).slideDown().find('span').html(variant.incoming);
            $(this.selectors.addToCartText).text(theme.strings.preOrder);
          } else {
            $('.preOrder--'+sectionId).slideUp();
            $(this.selectors.addToCartText).text(theme.strings.addToCart);
          }
          $(template).find('.shopifyPaymentButton').show()
        } else {
          $(this.selectors.addToCart).prop('disabled', true);
          $(this.selectors.addToCartText).text(theme.strings.soldOut);
          $(template).find('.shopifyPaymentButton').hide()
        }
      }
      else {
        if(goto == true){
          $('[data-op-pre-select]').each(function(index, el) {
            $(this).addClass('op_pre_select');
            $(this).find('label .text').html(theme.productStrings.label_select+$(this).attr('data-name-option').toLowerCase());
          });
          var option1 = $('#SingleOptionSelector-0--'+sectionId).val();
          var option1_cr = _handleize(option1);
          var options = $('#SingleOptionSelector-0--'+sectionId+' option[value="'+option1+'"]').attr('data-first-variant').split(' / ');
          var options_title = $('#SingleOptionSelector-0--'+sectionId+' option[value="'+option1+'"]').attr('data-first-variant-title').split(' / ');
          $(template +' .fake_select li').removeClass('selected');
          $(options).each(function(index, option) {
            var option_title = options_title[index];
            if (options.length == 3 && index == 1 && optionIndex == 'SingleOptionSelector-1--'+ sectionId) {
              option = _handleize(optionValue);
              option_title = optionValue;
            }
            if (options.length == 3 && index == 2 && optionIndex == 'SingleOptionSelector-1--'+ sectionId) {
              var vr_available = _.find(self.productSingleObject.variants, { 'option1': option1,'option2': optionValue});
              option = _handleize(vr_available.option3);
              option_title = vr_available.option3;
            }
            if(index === 0 && option !== option1_cr ){
              $(template +' .fake_select li._'+option1_cr).addClass('selected');
            }
            else{
              var options_change = $(template +" option[value='"+option_title+"']").val();
              var $options_change_ = $(template +" option[value='"+option_title+"']").parent();
              $(template +' .fake_select li._'+option).addClass('selected');
              $('label[data-change-label="SingleOptionSelector-'+index+'--'+sectionId+'"] .text').text(option_title);
              if(options_change != $options_change_.val()){
                $options_change_.val(options_change).change();
              }
            }
          });
        }
      }
    },

    _updateImages: function(evt) {
      var variant = evt.variant;
      if (variant.featured_image == undefined) {return false}
      variantImage = variant.featured_image.src;
      var sizedImgUrl = theme.Images.getSizedImageUrl(variantImage, this.settings.imageSize);
      if(variantImage != undefined && goto == true ){
        var $photo = $(this.selectors.productPhotos + ' .product-single__photos-item[data-src="' + theme.Images.removeProtocol(variantImage) + '"]');
        slideIndex = $photo.index();
        if(self.photoSlider !== undefined){
          self.photoSlider.slideTo(slideIndex);
        }
      }
    },
    
    _updateGallery: function(evt,variant) {
      var self = this;
      var dataJs = this.dataJs;
      var imgPos = variant.featured_image ? variant.featured_image.position : parseInt($(this.selectors.dataJs).attr('data-vrimgpos'));
      var imgspr = dataJs.imgspos.split(','), imgsArray = dataJs.primgs.split(','), templateSlick = self.settings.sectionId;
      var htmlPhotoImages = '';
      if ($(self.selectors.productThumbImages).length >= 1) {
        var htmlThumbImages = '';
      }
      var last_imgPos = $(this.selectors.dataJs).attr('data-vrimgpos');
      if(_.indexOf(imgspr,imgPos.toString()) !== -1 && last_imgPos !== imgPos.toString() && this.dataSettings.gallery){
        var imgsPos = [];
        _.forEach(imgspr, function(value,idx0) {
          if(parseInt(value) >= imgPos){
            if (parseInt(value) == imgsArray.length) {
              imgsPos.push(parseInt(imgspr[idx0]));
              imgsPos.push(parseInt(value));
              return false;
            }
            else{
              imgsPos.push(parseInt(value));
              imgsPos.push(parseInt(imgspr[idx0+1]));
              return false;
            }
          }
        });
        if(dataJs.vrsvideo.length > 0 && dataJs.vrsvideo !== "undefined"){
          var vrsVideoArr = [];
          _.forEach(dataJs.vrsvideo.split(','), function(value, idx) {
            var item = new Object();
            item['position'] = value.split(':')[0];
            item['thumb'] = value.split('|http')[0].split(':')[2];
            item['url'] =  value.split('|http')[1].split(':')[1];
            vrsVideoArr.push(item)
          });
        }
        var newgallery = false;
        if($.unique($.merge(JSON.parse($(this.selectors.dataJs).attr('data-curpos')),imgsPos)).length > 2){
          newgallery = true;
        }
        if(parseInt(imgsPos[0]) == parseInt(imgsPos[1])){
          newgallery = true;
        }
        if(imgspr.length > 1 && newgallery){
          $(this.selectors.dataJs).attr('data-curpos','['+imgsPos[0]+","+imgsPos[1]+']');
          variant.featured_image ? $(this.selectors.dataJs).attr('data-vrimgpos',variant.featured_image.position) : $(this.selectors.dataJs).attr('data-vrimgpos',imgsPos[0]);
          var imgsprw = dataJs.primgswidth.toString().split(','), imgsprh = dataJs.primgsheight.toString().split(',');
          if($(this.selectors.productThumbs).length > 0){
            var image_size = theme.Images.imageSize($(this.selectors.productThumbs+" .product-single__thumbnail-image:first").attr('src')) || theme.Images.imageSize($(this.selectors.productThumbs+" .product-single__thumbnail-image:first").attr('data-src'));
          }
          var image_size_ = image_size || '110x110@2x';
          var count_img = positionIdx = 0;
          var kt_visible = false;
          _.forEach(imgsArray, function(value, idx) {
            kt_visible = false;
            if(parseInt(imgsPos[0]) <= idx+1 && parseInt(imgsPos[1]) > idx+1){
              kt_visible = true;
            }
            if(parseInt(imgsPos[0]) == parseInt(imgsPos[1]) && parseInt(imgsPos[0] == idx+1)){
              kt_visible = true;
            }
            if(parseInt(imgsPos[0]) == parseInt(imgsPos[1]) && parseInt(imgsPos[0]) == idx+1 && parseInt(imgsPos[1]) == imgsArray.length){
              kt_visible = true;
            }
            if(imgspr[imgspr.length - 2] !== imgspr[imgspr.length - 1] && parseInt(imgsPos[1]) == idx+1 && parseInt(imgsPos[1]) == imgsArray.length){
              kt_visible = true;
            }
            if(kt_visible == true){
              var fileExt = _.last(value.split('.')), img_url_photo = value.replace('.'+fileExt, '_{width}x.'+fileExt);
              if ($(self.selectors.productThumbs).length > 0) {
                var img_url_thumb = value.replace('.'+fileExt, '_'+image_size+'.'+fileExt);
              }
              var altobj = _.find(self.productSingleObject.variants, function(o) { return o.id == dataJs.vrsFeaturedImg[idx].id});
              var alt = altobj !== undefined ? altobj.featured_image.alt : self.productSingleObject.title;
              if (alt !== null && alt.indexOf('||video:') !== -1 ) {
                var gallery = ' gallery-video';
                var kt_video = true;
                var vUrl = alt.split('||video:')[1];
                var fImageId = altobj.featured_image.id;
              }else {
                var kt_video = false;
                var gallery = ' gallery-image';
              }
              var productImgType = theme.function.productImgType === 'stretch' ? ' is-cover' : ' is-default';
              productImgType = theme.function.productImgType === 'nonstretch' ? ' is-contain' : productImgType;
              var productImgType_child = ' aspectRatioPlaceholder';

              if(self.settings.imagesLayout === 'masonry'){
                productImgType = ' is-default';
              }
              let paddingCss = '';

              if(productImgType === ' is-default'){
                paddingCss = 'padding-bottom:'+(imgsprh[idx] / imgsprw[idx]) * 100.00 +'%';
              }

              let positionCss = ' one_hundred';
              if (count_img !== 0){
                positionCss = ' sixties';
                if (positionIdx == 1 || positionIdx == 2){
                  positionCss = ' forty';
                  if (positionIdx == 2){
                    positionIdx = -1;
                  }
                }
                positionIdx++
              }

              htmlPhotoImages += '<div class="swiper-slide product-single__photos-item'+ gallery + productImgType + positionCss +'" data-src="'+ dataJs.imgurl.replace('kiti', value)+'">';
              htmlPhotoImages += '<a href="javascript:void(0)" class="product-single__photo product-single__photo--'+templateSlick + productImgType_child +'" style="max-width:'+imgsprw[idx]+'px;'+paddingCss+'">';
              htmlPhotoImages += '<img class="product-single__photo-image img-responsive lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-srcbase="'+ dataJs.imgurl.replace('kiti', value.replace('.'+fileExt, '_'+image_size_+'.'+fileExt)) +'" data-src="'+ dataJs.imgurl.replace('kiti', img_url_photo) +'" data-widths="[180, 360, 540, 720, 900, 1080]" data-aspectratio="'+imgsprw[idx] / imgsprh[idx]+'" data-srcfix="'+dataJs.imgurl.replace('kiti', value)+'" data-size="'+imgsprw[idx]+'x'+imgsprh[idx]+'" data-sizes="auto" >';
              if (kt_video && vUrl.indexOf('.mp4') !== -1) {
                htmlPhotoImages += '<div class="video_content"><video class="video-element" controls="controls" loop poster="'+dataJs.imgurl.replace('kiti', value)+'"><source type="video/mp4" src="'+vUrl+'"></video></div>';
              }
              htmlPhotoImages += '<span class="loading-img"></span>';
              htmlPhotoImages += '</a></div>';
              if( $(self.selectors.productThumbs).length > 0){
                htmlThumbImages += '<div class="swiper-slide product-single__thumbnails-item'+ gallery + productImgType +'" data-src="'+dataJs.imgurl.replace('kiti', value)+'">';
                htmlThumbImages += '<a href="javascript:void(0)" class="product-single__thumbnail product-single__thumbnail--'+templateSlick+ productImgType_child +'" style="'+paddingCss+'"';
                htmlThumbImages += ' title="'+dataJs.vrsFeaturedImg[idx].title+'"';
                htmlThumbImages += ' data-src="'+dataJs.imgurl.replace('kiti', value)+'"';
                htmlThumbImages += ' data-id="'+dataJs.vrsFeaturedImg[idx].id+'">';
                htmlThumbImages += '<img class="product-single__thumbnail-image img-responsive lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="'+ dataJs.imgurl.replace('kiti', img_url_thumb) +'" alt="'+self.productSingleObject.title+'">';
                if (kt_video) {
                  htmlThumbImages += '<div class="btn play';
                  if(vUrl.indexOf('.mp4') == -1){
                    htmlThumbImages += ' kt_openvd_'+fImageId;
                  }
                  htmlThumbImages += '"><i class="fa fa-play" aria-hidden="true"></i></div>';
                }
                if (kt_video && vUrl.indexOf('.mp4') == -1){
                  KT.loadScript('magnific-popup', function(e,l){          
                    if (l == 'ok') {self._checkedVariantVideo(vUrl,fImageId)}
                  })
                }
                htmlThumbImages += '</a></div>';
              }
              count_img++
            }
          });

          var templateImages = self.selectors.template;
          if(self.settings.imagesLayout === 'masonry'){
            $(self.selectors.productPhotos + ' .product-single__photos-item').each(function(index, el) {
              $(self.selectors.productPhotos).isotope( 'remove', this )
              if (index+1 == $(self.selectors.productPhotos + ' .product-single__photos-item').length) {
                $(self.selectors.productPhotos).append(htmlPhotoImages);
                 $.each($(self.selectors.productPhotos + ' .product-single__photos-item'), function(index, val) {
                  if ($(this).attr('style') == undefined){
                    $(self.selectors.productPhotos)
                    .isotope('appended', $(this))
                    .isotope('layout');
                  }
                });
              }
            });
          }
          else {
            var curr_count_img = [];
            for (var i = 0; i < self.photoSlider.slides.length; i++) {
              curr_count_img.push(i)
            }
            if( count_img > 1){
              $(templateImages +' #product-thumb-slide--'+templateSlick).removeClass('oneImageThumb');
              if ($(templateImages + ' #product-thumb-slide--'+templateSlick).data('vertical')) {
                $(templateImages + ' #product-photo-slide--'+templateSlick).addClass(' col-md-9 order-md-1 pl-md-0').removeClass('oneImagePhoto');
              }
              if (typeof self.thumbSlider === 'object') {
                self.thumbSlider.appendSlide(htmlThumbImages);
                self.thumbSlider.removeSlide(curr_count_img);
                self.photoSlider.appendSlide(htmlPhotoImages);
                self.photoSlider.removeSlide(curr_count_img);
              } else {
                if(self.settings.thumbEnabled){
                  $(self.selectors.productThumbsWrapper).find('.swiper-wrapper').html(htmlThumbImages);
                  self._initThumbnailSlider();
                }
                self._destroyPhotoSlider();
                $(self.selectors.productPhotosWrapper).find('.swiper-wrapper').html(htmlPhotoImages);
                self._initPhotoSlider();
              }
            }else{
              $(templateImages +' #product-thumb-slide--'+templateSlick).addClass('oneImageThumb');
              if ($(templateImages + ' #product-photo-slide--'+templateSlick).data('vertical')) {
                $(templateImages + ' #product-photo-slide--'+templateSlick).addClass('col-md-12 oneImagePhoto').removeClass(' col-md-9 order-md-1 pl-md-0');
              }
              if (typeof self.thumbSlider === 'object') {
                self._destroyThumbnailSlider();
                $(self.selectors.productThumbsWrapper).find('.swiper-wrapper').html(htmlThumbImages);
              }
              self._destroyPhotoSlider();
              $(self.selectors.productPhotosWrapper).find('.swiper-wrapper').html(htmlPhotoImages);
              self._initPhotoSlider();
            }
          }
          var vrvideo = _.find(vrsVideoArr, function(o) { return o.position == imgsPos[0] });
          if(vrvideo !== undefined){
            KT.loadScript('magnific-popup', function(e,l){          
              if (l == 'ok') {self._checkedVariantVideo(vrvideo.url)}
            })
          }else{
            $('.kt_openvd_'+this.productSingleObject.id).addClass('d-none');
          }
        }
      }
    },

    _checkVariantVideo: function() {
      var self = this;
      var dataJs = this.dataJs;
      var imgspr = dataJs.imgspos.split(',');
      var imgPos = this.variants.currentVariant.featured_image ? this.variants.currentVariant.featured_image.position : parseInt($(this.selectors.dataJs).attr('data-vrimgpos'));
      var imgsPos = [];
      _.forEach(imgspr, function(value,idx0) {
        if(parseInt(value) >= imgPos){
          imgsPos.push(parseInt(value));
          imgsPos.push(parseInt(imgspr[idx0+1]));
          return false;
        }
      });
      if(dataJs.vrsvideo.length > 0 && dataJs.vrsvideo !== "undefined"){
        var vrsVideoArr = [];
        _.forEach(dataJs.vrsvideo.split(','), function(value, idx) {
          var item = new Object();
          item['position'] = value.split(':')[0];
          item['thumb'] = value.split('|http')[0].split(':')[2];
          item['url'] =  value.split('|http')[1].split(':')[1];
          vrsVideoArr.push(item)
        });
      }
      var vrvideo = _.find(vrsVideoArr, function(o) { return o.position == imgsPos[0] });
      if(vrvideo !== undefined){
        KT.loadScript('magnific-popup', function(e,l){          
          if (l == 'ok') {self._checkedVariantVideo(vrvideo.url)}
        })
      }else{
        $('.kt_openvd_'+this.productSingleObject.id).addClass('d-none');
      }
      if($(self.selectors.template+' div[class~="play"][data-video]').length){
        KT.loadScript('magnific-popup', function(e,l){
          if (l == 'ok') {
            $.each($(self.selectors.template+' div[class~="play"][data-video]'), function(idx, el) {
              self._checkedVariantVideo($(this).attr('data-video'),$(this).attr('data-imgid'))
            });
          }
        })
      }
    },

    _checkedVariantVideo: function(url,btnId) {
      var btnId = btnId == undefined ? self.productSingleObject.id : btnId;
      $('.kt_openvd_'+btnId)
      .removeClass('d-none')
      .on('click',function(event){
        event.preventDefault();
        theme.videoPopup(url);
      })
    },

    _create360: function(variant) {
      var dataJs = this.dataJs
          self = this;
      if(dataJs.imgspos360.length === 0){
        return false;
      }
      // Check 360 available
      var imgsPos360 = dataJs.imgspos360.split(','), primgs = dataJs.primgs.split(','), imgsprw = dataJs.primgswidth.toString().split(','), imgsprh = dataJs.primgsheight.toString().split(',');
      if(imgsPos360 !== '""' && imgsPos360 !== "undefined" && imgsPos360.length > 0){
        var files = [];
        _.forEach(primgs, function(value, idx) {
          if(parseInt(imgsPos360[0]) <= idx+1 && idx+1 < parseInt(imgsPos360[1])){
            var file = dataJs.imgurl.replace('kiti', value);
            files.push(file)
          }
        });
        KT.loadScript('threesixty', function(e,l){          
          if (l == 'ok') {
            theme.imgs360(files,imgsPos360,imgsprw[imgsPos360[0]],imgsprh[imgsPos360[0]],self.productSingleObject.id);
            $('.kt_open360_'+self.productSingleObject.id).removeClass('d-none')
          }
        })
      }
      if(self.settings.sectionId == 'quickview-template'){
        $(document).on('click','#myModal button.close', function () {
          $('.myModalThreeSixty.kt_'+self.productSingleObject.id).modal('hide').remove();
          $('#sizeGuide_and_shipping').remove();
        });
        $('#myModal').on('hidden.bs.modal', function () {
          $('.myModalThreeSixty.kt_'+self.productSingleObject.id).modal('hide').remove();
          $('#sizeGuide_and_shipping').remove();
        })
      }
    },
    
    _updatePrice: function(evt) {
      var variant = evt.variant;
      var self = this;
      var template = self.selectors.template;
      // Update the product price
      $(this.selectors.originalPrice).html(theme.Currency.formatMoney(variant.price, theme.moneyFormat));
      $(this.selectors.originalPrice.replace('#','.')).html(theme.Currency.formatMoney(variant.price, theme.moneyFormat));
      // Update and show the product's compare price if necessary
      if (variant.compare_at_price > variant.price) {
        $(this.selectors.comparePrice)
          .html(theme.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat))
          .removeClass('d-none');
        $(this.selectors.comparePrice.replace('#','.'))
          .html(theme.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat))
          .removeClass('d-none');
        $(this.selectors.originalPriceWrapper).addClass(this.selectors.saleClasses);
        $(this.selectors.saleLabel).removeClass('d-none');
      } else {
        $(this.selectors.comparePrice).addClass('d-none');
        $(this.selectors.comparePrice.replace('#','.')).addClass('d-none');
        $(this.selectors.saleLabel).addClass('d-none');
        $(this.selectors.originalPriceWrapper).removeClass(this.selectors.saleClasses);
      }
      // Update and show the product's unit price if necessary
      if (variant.unit_price){
        $(this.selectors.unitPrice).show().removeClass('d-none');
        $(this.selectors.unitPrice.replace('#','.')).show().removeClass('d-none');
        var unit_price_base_unit = variant.unit_price_measurement.quantity_value + variant.unit_price_measurement.quantity_unit;
            unit_price_base_unit += ' (<span class="unit_price">'+ theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) + '</span> / ';
            unit_price_base_unit += '<span class="base_unit">';
        if(variant.unit_price_measurement){
          if (variant.unit_price_measurement.reference_value != 1) {
            unit_price_base_unit += variant.unit_price_measurement.reference_value;
          }
          unit_price_base_unit += variant.unit_price_measurement.reference_unit;
        }
        unit_price_base_unit += '</span>';
        unit_price_base_unit += '</span>)';
        $(this.selectors.unitPrice).html(unit_price_base_unit);
        $(this.selectors.unitPrice.replace('#','.')).html(unit_price_base_unit);
      } else {
        $(this.selectors.unitPrice).hide().addClass('d-none');
        $(this.selectors.unitPrice.replace('#','.')).hide().addClass('d-none');
      }
      if(theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency){
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
      }
    },

    _shipTo: function() {
      function checkLocation(location_code){
        $.ajax({
          type: 'get',
          url: '/cart?view=listShipping&q='+location_code+'',
        })
        .done(function(data) {
          if(data !== ''){
            var list_shipping = '';
            var data = JSON.parse(data.replace('<!-- BEGIN template --><!-- cart.listShipping -->','').replace('<!-- END template -->',''));
            $('.shipByLocation .flag').html('<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="'+data.flag+'" alt="'+data.code+'">');
            data.shipping_rates = JSON.parse(data.shipping_rates);
            $.each(data.shipping_rates, function(index, val) {
              var p_mr = index < data.shipping_rates.length - 1 ? ' class="mb-1"' : '';
              var color_free = val.price.indexOf('>0 ') >= 0 ? ' style="color:#4CAF50"' : '';
              list_shipping += '<p'+ p_mr + '>';
              list_shipping += '<i class="fkt-check pr-2"'+color_free+'></i>';
              if (val.min_order_subtotal !== undefined) {
                list_shipping += val.name;
                if (val.min_order_subtotal !== null) {
                  list_shipping += theme.function.textInListShipping + val.min_order_subtotal;
                }
                if (val.max_order_subtotal !== null) {
                  if (val.min_order_subtotal !== null) {
                    list_shipping += ' - '+val.max_order_subtotal;
                  } else {
                    list_shipping += val.name+theme.function.textInListShippingMax+val.max_order_subtotal;
                  }
                }
              }
              if (val.weight_low !== undefined && val.weight_low !== null) {
                list_shipping += val.name;
                if (val.weight_low !== null) {
                  list_shipping += theme.function.textInListShipping + val.weight_low+' kg';
                }
                if (val.weight_high !== null) {
                  if (val.weight_low !== null) {
                    list_shipping += ' - '+val.weight_high+' kg';
                  } else {
                    list_shipping += val.name+theme.function.textInListShippingMax+val.weight_high+' kg';
                  }
                }
              }
              list_shipping += '. <span style="color: #F44336">+ '+val.price+'</span>';
              list_shipping += '</p>';
            });
            // console.log(data)
            $('.shipByLocation .list').html(list_shipping);
            if(shopCurrency !== Shopify.currency.active){
              KT.loadScript('shopify-currency', function(e,l){
                if (l == 'ok') {
              KT.loadScript('shipping', function(e,l){
                if (l == 'ok') {
                  Kt_currency.convertAll(shopCurrency,Shopify.currency.active,'.shipByLocation span.money');
                }
              })
                }
              })
            }
            $('.shipByLocation').slideDown();
          }
          // console.log("success");
        })
        .fail(function() {
          console.log("error checkLocation");
        })
        .always(function(data) {
          // console.log("complete");
        });
      }
      function getLocation(){
        $.ajax({
          type: 'get',
          url: 'https://api.teathemes.net/currency',
        })
        .done(function(data) {
          // console.log("success");
          var location = {
            name: data.registered_country.names.en,
            code: data.countryCode
          }
          localStorage.setItem("kt-location",JSON.stringify(location));
          checkLocation(data.countryCode);
          $('.shipByLocation .name_country').html(data.registered_country.names.en);
        })
        .fail(function() {
          console.log("error getLocation");
        })
        .always(function(data) {
          // console.log("complete");
        });
        
      }
      if (localStorage.getItem("kt-location") !== null) {
        checkLocation(JSON.parse(localStorage.getItem("kt-location")).code);
        $('.shipByLocation .name_country').html(JSON.parse(localStorage.getItem("kt-location")).name)
      } else {
        getLocation()
      }
    },

    _updateSKU: function(evt) {
      var variant = evt.variant;
      // Update the sku
      $(this.selectors.SKU).html(variant.sku);
    },

    _prefetchCollection: function(evt) {
      setTimeout(function() {
        $.each($('.prefetchCollection a'), function(idx, el) {
          $('head link').first().after('<link rel="prefetch" href="'+$(this).attr("href")+'">');
        });
      },1000)
    },

    onUnload: function() {
      this.$container.off(this.settings.namespace);
    }
  });

  return Product;
})();

theme.videoPopup = (function(url) {
  if(url.indexOf('.mp4') !== -1){
    $.magnificPopup.open({
      items: [
        {
          src: '<div class="white-popup"><div class="white-popupcontent"><video class="amp-page amp-video-element" id="myVideo_product" controls="controls" autoplay><source type="video/mp4" src="'+url+'"></video></div></div>',
          type: 'inline'
        }
      ],
      type: 'image'
    });
  }else if(url.indexOf('youtube.com') !== -1 || url.indexOf('youtu.be.com') !== -1 || url.indexOf('vimeo.com') !== -1){
    $.magnificPopup.open({
      items: [
        {
          src: url,
          type: 'iframe'
        }
      ],
      type: 'image'
    });
  }
});

window.theme = theme || {};
theme.Swiper = (function() {
  /* ---------------------------------------------
   Swiper
   --------------------------------------------- */
  function init(container) {
    var $container = $(container);
    var sectionId = $container.attr('data-section-id');
    var attr = $container.attr('data-section-type');
    $container.find('.shopify-section').children().unwrap();
    $container.find('.swiper-container').each(function() {
      if ($(this).hasClass('swiper-container-initialized') || $(this).find('.swiper-wrapper').length < 1||$(this).find('.swiper-wrapper').length && $(this).find('.swiper-wrapper').children().length < 1){
        return true;
      }
      var self = this;
      var config = $(this).data();
      config.watchOverflow = true;
      config.a11y = false;
      config.watchSlidesVisibility = true;
      if (config.nav) {
        config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
        if (config.nextEl && config.nextEl !== '') {
          config.navigation = {
            nextEl: config.nextEl,
            prevEl: config.prevEl
          }
        }
      }
      if (config.dots) {
        config.pagination = {
          el: '.swiper-pagination',
          type: 'bullets'
        }
      }
      if (config.autoplay && config.delay !== undefined) {
        config.autoplay = {
          delay: config.delay * 1000
        }
      }
      if (config.scrollbar) {
        config.scrollbar = {
          el: '.swiper-scrollbar',
          draggable: true
        }
      }
      config.on = {
        init: function () {
          // console.log('init')
          theme.checkProductGrid_Width();
          checkThemeCustom();
          KT.countdown();
          if ($(self).hasClass('loadvariant')) {
            theme.wokerktlz(true);
          }
          let mySwiper = self.swiper;
          let itemCrr = $(mySwiper.slides[mySwiper.activeIndex]);
          if (itemCrr.find(".bgndVideo").length > 0) {
            KT.loadScript('YTPlayer', function(e,l){
              if (l == 'ok') {
                itemCrr.find(".bgndVideo").YTPlayer({containment:itemCrr.find(".bgndVideo").parent()});
              }
            })
          }
        },
        slideChange: function () {
          // console.log('slideChange')
          if(typeof jQuery.fn.YTPlayer === 'function'){
            $.each($(self).find(".bgndVideo.mb_YTPlayer"), function() {
              $(this).YTPPause();
            })
          }
          let mySwiper = self.swiper;
          let itemCrr = $(mySwiper.slides[mySwiper.activeIndex]);          
          itemCrr.find('.lazyloading:not(.lazyload)').addClass('lazyload');
          if (itemCrr.find(".bgndVideo.mb_YTPlayer").length > 0) {
            itemCrr.find(".bgndVideo.mb_YTPlayer").YTPPlay();
          }
          if (itemCrr.find(".bgndVideo:not(.mb_YTPlayer)").length > 0) {
            KT.loadScript('YTPlayer', function(e,l){
              if (l == 'ok') {
                itemCrr.find(".bgndVideo").YTPlayer({containment:itemCrr.find(".bgndVideo").parent()});
              }
            })
          }
        },
        resize: function () {
          // console.log('resize')
          $.debounce( 250, function(){checkThemeCustom()})();
        }
      };
      function checkThemeCustom() {
        let mySwiper = self.swiper;
        let $self = $(self);
        let $self_p = $(self).parent();
        if(mySwiper.params.nav && mySwiper.slides.length > mySwiper.params.slidesPerView){
          $self_p.addClass('swiper-container-has-nav');
        } else {
          $self_p.removeClass('swiper-container-has-nav');
        }
        if(mySwiper.params.dots && mySwiper.slides.length > mySwiper.params.slidesPerView){
          $self_p.addClass('swiper-container-has-dot');
        } else {
          $self_p.removeClass('swiper-container-has-dot');
        }
        if(mySwiper.params.noOverflow && mySwiper.slides.length > mySwiper.params.slidesPerView){
          $self_p.addClass('swiper-no-overflow');
        } else {
          $self_p.removeClass('swiper-no-overflow');
        }
        if($self_p.find('.swiper-pagination-outside').length > 0){
          $self_p.addClass('swiper-pagination-outside');
        }
        // if($self_p.find('.fake-height-slide').length > 0 && $self_p.find('.fake-height-slide-follow').length > 0){
        //   let mirror = $(self_p).find('.fake-height-slide');
        //   let follow = $(self_p).find('.fake-height-slide-follow').first();
        //   mirror.css('height' , follow.height());
        // }
        if(mySwiper.params.spaceBetween <= 0){
          $(self).css({paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0});
        }
      }
      // console.log(config)
      var mySwiper = new Swiper(this, config);
      // console.log(mySwiper)
    });
   }
  /* ---------------------------------------------
   Swiper mobile
   --------------------------------------------- */
  function initSwiperMobile(){
  }
  /* ---------------------------------------------
   Refresh lazyload
   --------------------------------------------- */
  function initLazyload(container){
    theme.lazyListener('#'+$(container).attr('id'))
  }
  return{
    init: init,
    initSwiperMobile: initSwiperMobile,
    initLazyload: initLazyload
  };
})();

theme.swiper = {};
theme.SwiperSection = (function() {
  function Swiper(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var swiper = this.swiper = '#Swiper-' + sectionId;
    theme.Swiper.init(container);
  }
  return Swiper;
})();
theme.SwiperSection.prototype = _.assignIn({}, theme.SwiperSection.prototype, {
  onSelect: function(evt) {
    theme.Swiper.initLazyload(evt.target);
    if($(this.swiper).hasClass('kt_home_slide')){      
      if(window.parent.document.getElementById("ktTools-slideshow-js") == null){
        let ktToolsSlideshowJs = document.createElement("script");
        ktToolsSlideshowJs.type = "text/javascript";
        ktToolsSlideshowJs.id = "ktTools-slideshow-js";
        ktToolsSlideshowJs.src = theme.extensions.ktToolsSlideshowJs;
        window.parent.document.getElementsByTagName("head")[0].appendChild(ktToolsSlideshowJs);
      }
    }
  },
  onUnload: function() {
    delete theme.swiper[this.swiper];
  },

  onBlockSelect: function(evt) {
    var $swiper = $(this.swiper).find('.swiper-container')[0].swiper;
    $swiper.slideTo($(evt.target).index());
  },

  onBlockDeselect: function() {
    var $swiper = $(this.swiper).find('.swiper-container')[0].swiper;
    if($(this.swiper).find('.swiper-container').data('autoplay')){
      $swiper.autoplay.start();
    }
  }
});

window.theme = theme || {};
theme.ProductsMasorySection = (function() {  
  function MasonrySection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var masonry = this.masonry = '#Masory-' + sectionId;

    KT.loadScript('isotope', function(e,l){
      if (l == 'ok') {
        var $grid = $(masonry+ '.ly__ms_items').isotope({
          itemSelector: '.grid-item',
          layoutMode: 'packery',
          packery: {
            horizontalOrder: true,
            percentPosition: true
          },
          transitionDuration: '.4s'
        });
        theme.checkProductGrid_Width();
        theme.updateResizeProductCard();
      }
    });
  }
  return MasonrySection;
})();

window.theme = theme || {};
theme.MasonrySection = (function() {  
  function MasonrySection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var masonry = this.masonry = '#Masonry-' + sectionId;

    KT.loadScript('isotope', function(e,l){
      if (l == 'ok') {
        var $grid = $(masonry).isotope({
          itemSelector: '.masonry-item',
          masonry: {
            horizontalOrder: true,
            percentPosition: true
          },
          transitionDuration: '.8s'
        });
      }
    });
  }
  return MasonrySection;
})();

window.theme = theme || {};
theme.BannerMasorySection = (function() {  
  function MasorySection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var sectionContainer = $container.attr('data-container');
    var sectionFilter = $container.attr('data-filter');
    var sectionItems = $container.attr('data-items');

    KT.loadScript('imagesloaded', function(e,l){
      if (l == 'ok') {
        KT.loadScript('isotope', function(e,l){
          if (l == 'ok') {
            const $portfolioFilterNav = $(sectionFilter),
                  $portfolioContainer = $(sectionContainer);

            if (typeof imagesLoaded === 'function' && $.fn.isotope) {
              $portfolioContainer.imagesLoaded(function() {
                isotopeInit();
                isotopeFilter();
              });
            } else {
              console.log('ALERT: Need to add imagesloaded and isotope plugin to be able to use portfolio page!');
            }

            function isotopeInit() {
              let layoutMode = $portfolioContainer.data('layoutmode');

              $portfolioContainer.isotope({
                itemSelector: sectionItems
              });

              // reveal all items after init
              let $items = $portfolioContainer.find(sectionItems);
              $portfolioContainer.addClass('show-items').isotope('revealItemElements', $items);
            }

            function isotopeFilter() {
              $portfolioFilterNav.find('a').on('click', function(e) {
                let $this = $(this),
                    selector = $this.attr('data-filter');

                // Remove active class
                $portfolioFilterNav.find('.active').removeClass('active');

                // Init filter
                $portfolioContainer.isotope({
                  filter: selector,
                  transitionDuration: '0.7s'
                });

                // Add active class
                $this.closest('li').addClass('active');
                e.preventDefault();
              });
            }
          }
        })
      }
    })
  }
  return{
    MasorySection:MasorySection
  }
})();

window.theme = theme || {};
theme.Instagram = (function() {  
  function Instagram(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var ul_ins = $('#shopify-section-'+sectionId+' .instagramWrapper'), dataIns = ul_ins.data();
    if("" == dataIns.accessToken){
      $('#instagramWrapper-'+sectionId).hide();
      return;
    }
    KT.loadScript('instafeed', function(e,l){
      if (l == 'ok') {
        var padd = ul_ins.data('use-slide') === true ? ' swiper-slide' : ' col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2-10';
        var html = '';
        var count = 0;
        if(dataIns.layout == 3 || dataIns.layout == '3'){
          padd = ' col-6 col-sm-3 col-md-2-10';
        }
        var feed = new Instafeed({
          target: 'instagramWrapper-'+sectionId,
          get: 'user',
          userId: dataIns.accessToken.split('.')[0],
          accessToken: dataIns.accessToken,
          sortBy: 'most-recent',
          filter: function(image) {
            var img_url_640 = image.images.standard_resolution.url;
            if (dataIns.tag !== undefined && dataIns.tag !== '') {
              if(image.carousel_media){
                _.forEach(image.carousel_media, function(value) {
                  if(image.tags.indexOf(dataIns.tag) >= 0 && count < dataIns.limit && value.type == 'image'){
                    count ++;
                    img_url_640 = value.images.standard_resolution.url;
                    html +='<div class="item'+padd+' order-'+count+'"><a class="instagram-feed" href="' + image.link + '"><img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="' + img_url_640 + '" alt="'+image.user.full_name+'"><div class="instagram-feed-content"><span class="position-relative mr-2"><i class="fkt-heart-o"></i> ' + image.likes.count + '</span><span class="position-relative"><i class="fkt-comments mr-1"></i> ' + image.comments.count + '</span></div></a></div>';
                  }
                });
              } else {
                if(image.tags.indexOf(dataIns.tag) >= 0 && count < dataIns.limit){
                  count ++;
                  html +='<div class="item'+padd+' order-'+count+'"><a class="instagram-feed" href="' + image.link + '"><img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="' + img_url_640 + '" alt="'+image.user.full_name+'"><div class="instagram-feed-content"><span class="position-relative mr-2"><i class="fkt-heart-o"></i> ' + image.likes.count + '</span><span class="position-relative"><i class="fkt-comments mr-1"></i> ' + image.comments.count + '</span></div></a></div>';
                }
              }
            } else if (count < dataIns.limit){
              count ++;
              html +='<div class="item'+padd+' order-'+count+'"><a class="instagram-feed" href="' + image.link + '"><img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw==" data-src="' + img_url_640 + '" alt="'+image.user.full_name+'"><div class="instagram-feed-content"><span class="position-relative mr-2"><i class="fkt-heart-o"></i> ' + image.likes.count + '</span><span class="position-relative"><i class="fkt-comments mr-1"></i> ' + image.comments.count + '</span></div></a></div>';
            }
            if(count >= dataIns.limit){
              return false;
            }
          },
          error: function(data) {
            console.log('ajax error');
            $('#instagramWrapper-'+sectionId).hide();
          },
          after: function() {
            $('#instagramWrapper-'+sectionId).append(html).show(0);
            ul_ins.find('li:empty').remove();
            if(dataIns.useSlide === true || dataIns.useSlide === 'true' ){
              theme.Swiper.init($container);
            }
            if(dataIns.useMasonry === true || dataIns.useMasonry === 'true' ){
              $('#instagramWrapper-'+sectionId).append('<div class="grid-sizer" style="width: 10%"></div>')
              KT.loadScript('isotope', function(e,l){
                if (l == 'ok') {
                  var $grid = $('#instagramWrapper-'+sectionId).isotope({
                    itemSelector: '.item',
                    percentPosition: true,
                      masonry: {
                        columnWidth: '.grid-sizer'
                      }
                  });
                }
              });
            }
          }
        });
        feed.run();
      }
    })
  }
  return Instagram;
})();

window.theme = theme || {};
theme.stockCountdown = (function(){
  // Settings are here
  var total_items = 70;
  var check_stock = false;
  var timer = null,timerinterval = null;
  var min_of_remaining_items = 1;
  var decrease_after = 1.7; 
  var decrease_after_first_item = 0.17; 
  var min_items_left = 0;
  var max_items_left = 0;
  var remaining_items = 0;
  var stock_bg_process = 0;
  function randomIntFromInterval(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}
  function progressbar(container) {
    updateMeter(container, remaining_items);
    timer = setTimeout(function() {
      updateMeter(container)
    }, 1000 * 60 * decrease_after_first_item );

    timerinterval = setInterval(function() {
      updateMeter(container)
    }, 1000 * 60 * decrease_after)
  }
  function updateMeter(container,remaining_items_) {
    var remaining_items_ = remaining_items_;
    if (remaining_items_ == undefined) {
      remaining_items_ = remaining_items - 1;
      if (remaining_items < min_of_remaining_items) {
        remaining_items = remaining_items_;
        remaining_items_ = randomIntFromInterval(min_items_left, max_items_left)
      }
    }
    if (remaining_items_ > max_items_left) {
      return false;
    }
    var content = theme.productStrings.stockMessage[0]+' <span class="count">' + remaining_items_ + '</span> '+theme.productStrings.stockMessage[1];
    $(container).addClass('items-count').find('p').html(content);
    $(container).find('kt_progress_bar_pr .count').css('background-color', stock_bg_process);
    $(container).find('kt_progress_bar_pr .count').css('color', '#fff');
    setTimeout(function() {
      $(container).find('kt_progress_bar_pr .count').css('background-color', '#fff');
      $(container).find('kt_progress_bar_pr .count').css('color', stock_bg_process)
    }, 1000 * 60 * 0.03);
    $(container).find(".count").text(remaining_items_);
    $(container).closest('.product-inner').find('.show-iq span,#quantity_sticky span').text(remaining_items_);
    var width = 100 * remaining_items_ / total_items;
    if (remaining_items_ < 10) {
      $(container).find('.progress').addClass('less-than-ten')
    }
    setTimeout(function() {
      $(container).find('.progress-bar').css('width', width + '%').attr('aria-valuenow', width);;
    },300);
    max_items_left = remaining_items_;
    remaining_items = remaining_items_;
    if(max_items_left <= min_items_left){
      clearTimeout(timer);
      clearTimeout(timerinterval);
    }
  }
  function init(container){
    if($(container).length <= 0){return false} 
    min_items_left = parseInt($(container).attr('data-stock-from'));
    max_items_left = parseInt($(container).attr('data-stock-to'));
    remaining_items = parseInt($(container).attr('data-remaining_items')) || randomIntFromInterval(min_items_left, max_items_left);
    stock_bg_process = $(container).attr('data-stock-bg-process');
    progressbar(container);
  }
  return {
    init: init,
    progressbar: progressbar,
    updateMeter: updateMeter
  };
})();

theme.ktCountdown = (function(container){ 
  var container_ = container !== undefined ? '#'+$(container).attr('id')+' ' : '';  
      container_ = container_ !== '#undefined ' ? container_ : '';
  if($(container_+'.kt_countdown').length >0){
    KT.loadScript('countdown', function(e,l){
      if (l == 'ok') {
        init();
      }
    });
    function init(){
      $(container_+'.kt_countdown').each(function() {
        let $this = $(this);
        let html = '<div class="block cdhrs"><span class="flip-top">00</span><span class="label">'+theme.strings.cdhrs+'</span></div><span class="sign">:</span>';
            html += '<div class="block cdmins"><span class="flip-top">00</span><span class="label">'+theme.strings.cdmin+'</span></div><span class="sign">:</span>';
            html += '<div class="block cdsecs"><span class="flip-top">00</span><span class="label">'+theme.strings.cdsecs+'</span></div>';
        let htmlFull = '<div class="block cdday"><span class="flip-top">00</span><span class="label">'+theme.strings.cdday+'</span></div><span class="sign">:</span>' + html;
        if ($this.hasClass('kt_loop_bar')) {
          var sFullDay = 86400,
             hours = parseInt($this.data('h')),
             minutes = parseInt($this.data('i')),
             seconds = parseInt($this.data('s')),
             seconds_row = hours*60*60+minutes*60+seconds,
             // d = moment($this.data('time-now')),
             date = $this.data('time-now'),
             loop_per_day = Math.ceil(sFullDay/seconds_row);
          // many days from now!
          var secondsTimeSpanToHMS = function(seconds) {
            var s = seconds;
            var h = Math.floor(s/3600);
            s -= h*3600;
            var m = Math.floor(s/60);
            s -= m*60;
            return (h < 10 ? '0'+h : h)+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
          }
          var checkRow = function checkRow() {
            for (var i = 1; i < loop_per_day + 1; i++) {
              var now_h = parseInt($this.data('h-now'));
              var now_m = parseInt($this.data('i-now'));
              var now_s = parseInt($this.data('s-now'));
              var now = now_h*60*60+now_m*60+now_s;
              if (now < seconds_row * i) {
                return seconds_row * i < sFullDay ? seconds_row * i : sFullDay;
              }
            }
          }
          if(checkRow() !== undefined || checkRow() !== null){
            var seconds_end = secondsTimeSpanToHMS(checkRow());
            if (seconds_end === '24:00:00') {
              let day = new Date(date);
              let nextDay = new Date(day);
              nextDay.setDate(day.getDate()+1);
              let monthFullNumber = ["01", "02", "03","04", "05", "06", "07","08", "09", "10","11", "12"];
              date = nextDay.getFullYear() + '/' + monthFullNumber[nextDay.getMonth()] + '/' + nextDay.getDate();
              seconds_end = '00:00:00';
            }
            $this.html(html);
            let $thisHrs = $this.find('.cdhrs .flip-top');
            let $thisMins = $this.find('.cdmins .flip-top');
            let $thisSecs = $this.find('.cdsecs .flip-top');
            let onStart = 0;
            if(theme.function.countdown_timezone){
              KT.loadScript('moment', function(e,l){
                if (l == 'ok') {                      
                  KT.loadScript('moment-zone', function(e,l){
                    if (l == 'ok') {
                      $this.countdown(moment.tz(date+' '+seconds_end, theme.function.timezone).toDate())
                      .on('update.countdown', function(event) {
                        $thisHrs.text(event.strftime('%H'))
                        $thisMins.text(event.strftime('%M'))
                        $thisSecs.text(event.strftime('%S'))
                        if (onStart === 0) {onStart++;$this.parent().addClass('showOn');}
                      })
                      .on('finish.countdown', function(event) {
                        $this.parent().remove();
                      });
                    }
                  });
                }
              });
            } else {
              $this.countdown(Date.parse(date+' '+seconds_end))
              .on('update.countdown', function(event) {
                $thisHrs.text(event.strftime('%H'))
                $thisMins.text(event.strftime('%M'))
                $thisSecs.text(event.strftime('%S'))
                if (onStart === 0) {onStart++;$this.parent().addClass('showOn');}
              })
              .on('finish.countdown', function(event) {
                $this.parent().remove();
              });
            }
          }
        }
        else{
          var date = $this.data('time');
          if ('24:00:00'.indexOf(date) !== -1) {
            let day = new Date(date);
            let nextDay = new Date(day);
            nextDay.setDate(day.getDate()+1);
            let monthFullNumber = ["01", "02", "03","04", "05", "06", "07","08", "09", "10","11", "12"];
            date = nextDay.getFullYear() + '/' + monthFullNumber[nextDay.getMonth()] + '/' + nextDay.getDate() +' 00:00:00';
          }
          $this.html(htmlFull);
          let $thisDay = $this.find('.cdday .flip-top');
          let $thisHrs = $this.find('.cdhrs .flip-top');
          let $thisMins = $this.find('.cdmins .flip-top');
          let $thisSecs = $this.find('.cdsecs .flip-top');
          let onStart = 0;
          if(theme.function.countdown_timezone){
            KT.loadScript('moment', function(e,l){
              if (l == 'ok') {                      
                KT.loadScript('moment-zone', function(e,l){
                  if (l == 'ok') {
                    $this.countdown(moment.tz(date, theme.function.timezone).toDate())
                    .on('update.countdown', function(event) {
                      $thisDay.text(event.strftime('%-D'))
                      $thisHrs.text(event.strftime('%H'))
                      $thisMins.text(event.strftime('%M'))
                      $thisSecs.text(event.strftime('%S'))
                      if (onStart === 0) {onStart++;$this.parent().addClass('showOn');}
                    })
                    .on('finish.countdown', function(event) {
                      $this.parent().remove();
                    });
                  }
                });
              }
            });
          } else {
            $this.countdown(Date.parse(date))
            .on('update.countdown', function(event) {
              $thisDay.text(event.strftime('%-D'))
              $thisHrs.text(event.strftime('%H'))
              $thisMins.text(event.strftime('%M'))
              $thisSecs.text(event.strftime('%S'))
              if (onStart === 0) {onStart++;$this.parent().addClass('showOn')}
            })
            .on('finish.countdown', function(event) {
              $this.parent().remove();
            });
          }
        }
      });
    }
  }
})

theme.dateFromTo = (function(container){
  var container_ = container !== undefined ? '#'+$(container).attr('id')+' ' : '';
  if ($(container_+' .product_delivery').length >0) {
    KT.loadScript('moment', function(e,l){
      if (l == 'ok') {
        init();
      }
    });
    function init(){
      var el = $(container_+' .product_delivery');
      var data = theme.function.product_delivery;
      var fromDays = parseInt(data.fromDate);
      var toDays = parseInt(data.toDate);
      KT.loadScript('momentlocale', function(e,l){
        if (l == 'ok') {
          moment.locale(shopLocale);
          var fromDate = moment().add(fromDays, 'days');
          if (data.offSaturday && fromDate.format('d') == '6'){
            fromDays++;
            fromDate = moment().add(fromDays, 'days');
          }
          if (data.offSunday &&fromDate.format('d') == '0') { 
            fromDays = fromDays + 2;
            fromDate = moment().add(fromDays, 'days');
          }
          if (toDays > fromDays) {
            var toDate = moment().add(toDays, 'days');
            if (data.offSaturday &&toDate.format('d') == '6'){
              toDays++;
              toDate = moment().add(toDays, 'days');
            }
            if (data.offSunday &&toDate.format('d') == '0') {
              toDays = toDays + 2;
              toDate = moment().add(toDays, 'days');
            }
          }

          $.each(data.offDays, function(index, val) {
            var valD = val.split('/')[1],valM = val.split('/')[0],valY = val.split('/')[2];
            if (fromDate.format('DD') === valD && fromDate.format('MM') === valM) {
              if (fromDate.format('YYYY') === '****' || fromDate.format('YYYY') === valY) {
                fromDays++;
                fromDate = moment().add(fromDays, 'days');
              }
            }
            if (toDays > fromDays) {
              if (toDate.format('DD') === valD && toDate.format('MM') === valM) {
                if (toDate.format('YYYY') === '****' || toDate.format('YYYY') === valY) {
                  toDays++;
                  toDate = moment().add(toDays, 'days');
                }
              }
            }
          });
          el.find('#fromDate').html(fromDate.format(theme.deliveryFormatDate));
          if (toDays > fromDays) {
            el.find('#toDate').html(toDate.format(theme.deliveryFormatDate));
            el.find('.toDate').removeClass('d-none');
          }
        }
      })
    }
  }
})

theme.realTimeVisitor = (function(container){
  var container_ = container !== undefined ? '#'+$(container).attr('id')+' ' : '';
  if ($(container_).find('.realTime').length >0) {
    var el = $(container_).find('.realTime');
    $(function(a){
      var min = 1,
      max = el.find('.counter_real_time').attr('data-counter-max'),
      t=1,
      r=max;
      t=Math.ceil(t),
      r=Math.floor(r);
      var o=Math.floor(Math.random()*(r-t+1))+t,
      n=["1","2","4","3","6","10","-1","-3","-2","-4","-6"],
      h="",e="",l=["10","20","15"],h="",e="",M="";
      setInterval(function(){
        if(h=Math.floor(Math.random()*n.length),e=n[h],o=parseInt(o)+parseInt(e),min>=o){
          M=Math.floor(Math.random()*l.length);
          var a=l[M];o+=a
        }
        if(o<1 || o>max ){
          o=Math.floor(Math.random()*(r-t+1))+t;
        }
        el.find("#number_counter>span").html((parseInt(o)));el.show();
      },parseInt(el.find('.counter_real_time').attr('data-interval-time')))
    });
  }
})

window.theme = theme || {};
theme.BannerSection = (function() {
  function Banner(container) {
    theme.ktCountdown(container);
  }
  return Banner;
})();

window.theme = theme || {};
theme.BannerVideoSection = (function() {
  function Banner(container) {
    var $container = $(container);
    KT.loadScript('magnific-popup', function(e,l){
      if (l == 'ok') {
        $.each($container.find(' .btn-iframe'), function(idx, el) {
          $(this).on('click',function(event){
            event.preventDefault();
            theme.videoPopup($(this).attr('href'));
          })
        })
      }
    })
  }
  return Banner;
})();

theme.variantChange = (function(){
  function vars_change(vrId,chageByTitle,opt,prVrs,el) {
    var element = el;
    var el = el[0].nodeName === "SELECT" ? '' : el;
    var formJs = element;
    if (el !== '' && $('#qvShowUp #ProductSection'+el.attr('data-section-id')).length > 0) {
      formJs = $('#qvShowUp #ProductSection'+el.attr('data-section-id'));
    }
    if (el !== '' && $('#amShowUpJSON').length > 0) {
      formJs = $('#amShowUpJSON');
    }
    var img_url = '';
    var activeVr = _.find(prVrs, { 'id': vrId});
    activeVr = _.find(prVrs, { 'title': chageByTitle}) || activeVr;

    var productOptionStyle = theme.function.productGridOptionStyle;
    var productOption1Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == activeVr.p_options[0]});
    var productOption2Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == activeVr.p_options[1]});
    var productOption3Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == activeVr.p_options[2]});
    if (opt === 'Opt1Js') {
      var varsVisible = _.filter(prVrs, { 'option1': activeVr.option1 });
      if (activeVr.option2) {
        var vars_opt2 = '', vars_unless2 = new Array, selected2 = '';
        var vars_opt3 = '', vars_unless3 = new Array, selected3 = '';
        _.forEach(varsVisible, function(variant) {
          if (_.indexOf(vars_unless2,variant.option2) == -1 && activeVr.option1 == variant.option1) {
            vars_unless2.push(variant.option2)
            if (el !== '') {
              let img_url = variant.featured_image ? variant.featured_image.src : null;
              let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
              let bgImage = img_url !== null && productOption2Style !== undefined && productOption2Style.color_watched && productOption2Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';
              var active = activeVr.id == variant.id ? ' active': '';
              var maybeHide2 = vars_unless2.length > 5 ? true : false;
              vars_opt2 += '<li class="swatch-on-grid _'+ _handleize(variant.option2) + active +'" data-toggle="tooltip" data-placement="top" title="'+ variant.option2 +'" data-available="'+ variant.available +'" data-maybe-hide="'+maybeHide2+'">';
              vars_opt2 += '<span class="swatch" data-vrS="kt_'+ _handleize(variant.option2) +'" data-opt="Opt2Js" data-vrId='+ variant.id +' data-available="'+ variant.available +'" title="'+ variant.title.replace('"','&quot;')+'"'+bgImage+'>';
              vars_opt2 += '<span class="swatch-title">'+ variant.option2 +'</span><span class="comma">,</span>';
              vars_opt2 += '</span></li>';
            } else {
              var selected = activeVr.id == variant.id ? ' selected' : '';
              if (activeVr.id == variant.id) {selected2 = variant.option2}
              vars_opt2 += '<option'+selected+' class="swatch _'+ _handleize(variant.option2) +'" data-available="'+ variant.available +'" value="'+ variant.option2.replace('"','&quot;') +'" data-opt="Opt2Js" data-vrId="'+ variant.id +'">';
              vars_opt2 += variant.option2;
              vars_opt2 += '</option>';
            }
          }
          if (activeVr.option3) {
            if (activeVr.id == variant.id) {
              vars_unless3.push(variant.option3);
              if (el !== '') {
                let img_url = variant.featured_image ? variant.featured_image.src : null;
                let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
                let bgImage = img_url !== null && productOption3Style !== undefined && productOption3Style.color_watched && productOption3Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';
                var maybeHide3 = vars_unless3.length > 5 ? true : false;
                vars_opt3 += '<li class="swatch-on-grid _'+ _handleize(variant.option3) +' active" data-toggle="tooltip" data-placement="top" title="'+ variant.option3 +'" data-available="'+ variant.available +'" data-maybe-hide="'+maybeHide3+'">';
                vars_opt3 += '<span class="swatch" data-vrS="kt_'+ _handleize(variant.option3) +'" data-opt="Opt3Js" data-vrId='+ variant.id +' data-available="'+ variant.available +'" title="'+ variant.title.replace('"','&quot;')+'"'+bgImage+'>';
                vars_opt3 += '<span class="swatch-title">'+ variant.option3 +'</span><span class="comma">,</span>';
                vars_opt3 += '</span></li>';
              } else {
                selected3 = variant.option3
                vars_opt3 += '<option selected class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
                vars_opt3 += variant.option3;
                vars_opt3 += '</option>';
              }
            }
            if (_.indexOf(vars_unless3,variant.option3) == -1 && activeVr.option1 === variant.option1 && activeVr.option2 === variant.option2 && activeVr.option3 !== variant.option3) {
              vars_unless3.push(variant.option3);
              if (el !== '') {
                let img_url = variant.featured_image ? variant.featured_image.src : null;
                let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
                let bgImage = img_url !== null && productOption3Style !== undefined && productOption3Style.color_watched && productOption3Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';
                var maybeHide3 = vars_unless3.length > 5 ? true : false;
                vars_opt3 += '<li class="swatch-on-grid _'+ _handleize(variant.option3) +'" data-toggle="tooltip" data-placement="top" title="'+ variant.option3 +'" data-available="'+ variant.available +'" data-maybe-hide="'+maybeHide3+'">';
                vars_opt3 += '<span class="swatch" data-vrS="kt_'+ _handleize(variant.option3) +'" data-opt="Opt3Js" data-vrId='+ variant.id +' data-available="'+ variant.available +'" title="'+ variant.title.replace('"','&quot;')+'"'+bgImage+'>';
                vars_opt3 += '<span class="swatch-title">'+ variant.option3 +'</span><span class="comma">,</span>';
                vars_opt3 += '</span></li>';                
              } else {
                vars_opt3 += '<option class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
                vars_opt3 += variant.option3;
                vars_opt3 += '</option>';
              }
            }
          }
          if (variant.option1 == activeVr.option1 && variant.featured_image){
            img_url = variant.featured_image.src;
          }
        });
        if (el !== '') {
          if(vars_unless2.length > 5){
            vars_opt2 += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
          }
          if(vars_unless3.length > 5){
            vars_opt3 += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
          }
          formJs.closest('.product-inner').find('[data-opt="Opt2Js"] .content__variants_list').html(vars_opt2);
          formJs.closest('.product-inner').find('[data-opt="Opt3Js"] .content__variants_list').html(vars_opt3);
        } else {
          element.closest('tr').find('select[data-opt="Opt2Js"]').html(vars_opt2).val(selected2);
          element.closest('tr').find('select[data-opt="Opt3Js"]').html(vars_opt3).val(selected3);
        }
      }
    }
    if (opt === 'Opt2Js') {
      var varsVisible = _.filter(prVrs, { 'option1': activeVr.option1 });
      if (parseInt(formJs.data('options')) == 3) {
        var vars_opt3 = '', vars_unless3 = new Array;
        _.forEach(varsVisible, function(variant) {
          if (activeVr.id == variant.id) {
            vars_unless3.push(variant.option3);
            if (el !== '') {
              var maybeHide3 = vars_unless3.length > 5 ? true : false;
              vars_opt3 += '<li class="swatch-on-grid _'+ _handleize(variant.option3) +' active" data-toggle="tooltip" data-placement="top" title="'+ variant.option3 +'" data-available="'+ variant.available +'" data-maybe-hide="'+maybeHide3+'">';
              vars_opt3 += '<span class="swatch" data-vrS="kt_'+ _handleize(variant.option3) +'" data-opt="Opt3Js" data-vrId='+ variant.id +' data-available="'+ variant.available +'" title="'+ variant.title.replace('"','&quot;')+'">';
              vars_opt3 += '<span class="swatch-title">'+ variant.option3 +'</span><span class="comma">,</span>';
              vars_opt3 += '</span></li>';
            } else {
              if (activeVr.id == variant.id) {selected3 = variant.option3}
              vars_opt3 += '<option selected class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
              vars_opt3 += variant.option3;
              vars_opt3 += '</option>';
            }
          }
          if (_.indexOf(vars_unless3,variant.option3) === -1 && activeVr.option1 === variant.option1 && activeVr.option2 === variant.option2) {
            vars_unless3.push(variant.option3);
            if (el !== '') {
              var maybeHide3 = vars_unless3.length > 5 ? true : false;
              vars_opt3 += '<li class="swatch-on-grid _'+ _handleize(variant.option3) +'" data-toggle="tooltip" data-placement="top" title="'+ variant.option3 +'" data-available="'+ variant.available +'" data-maybe-hide="'+maybeHide3+'">';
              vars_opt3 += '<span class="swatch" data-vrS="kt_'+ _handleize(variant.option3) +'" data-opt="Opt3Js" data-vrId='+ variant.id +' data-available="'+ variant.available +'" title="'+ variant.title.replace('"','&quot;')+'">';
              vars_opt3 += '<span class="swatch-title">'+ variant.option3 +'</span><span class="comma">,</span>';
              vars_opt3 += '</span></li>';
            } else {
              if (activeVr.id == variant.id) {selected3 = variant.option3}
              vars_opt3 += '<option class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
              vars_opt3 += variant.option3;
              vars_opt3 += '</option>';
            }
          }
          if (variant.option1 == activeVr.option1 && variant.featured_image){
            img_url = variant.featured_image.src;
          }
        });
        if (el !== '') {
          if(vars_unless3.length > 5){
            vars_opt3 += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
          }
          formJs.closest('.product-inner').find('[data-opt="Opt3Js"] .content__variants_list').html(vars_opt3);
        } else {
          element.closest('tr').find('select[data-opt="Opt3Js"]').html(vars_opt3).val(selected3);
        }
      }
    }
    if (el !== '') {
      var pInner = formJs.closest('.product-inner');
      var name_src = pInner.find('.primary-thumb img').attr('src') != undefined ? pInner.find('.primary-thumb img').attr('src').split(',')[0] : undefined;
      var name_srcset = pInner.find('.primary-thumb img').attr('srcset') != undefined ? pInner.find('.primary-thumb img').attr('srcset').split(',')[0] : undefined;
      var imgChecked = false;
      if (activeVr.featured_image && name_src != undefined) {
        imgChecked = (name_src.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) >= 0 || (name_src.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) === -1 ? true : false;
      }
      if (activeVr.featured_image && name_srcset != undefined) {
        imgChecked = (name_srcset.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) >= 0 || (name_srcset.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) === -1 ? true : false;
      }
      if (imgChecked === true) {
        var img_url = activeVr.featured_image.src;
        var fileExt = _.last(img_url.split('.'));
        var imgLarge = new Image();
        imgLarge.src = theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_540x.'+fileExt)); 
        imgLarge.onload = function () {
          var featured_image = '<div class="primary-thumb '+theme.Images.imgFit(activeVr.featured_image.width,activeVr.featured_image.height)+'"><img class="lazyload"';
              featured_image += 'src="'+theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_540x.'+fileExt))+'"';
              featured_image += 'data-src="'+theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_{width}x.'+fileExt))+'"';
              featured_image += 'data-widths="[360, 540, 720]"';
              featured_image += 'data-sizes="auto"';
              featured_image += 'alt=""></div>';
          pInner.find('.aspectRatio').append(featured_image);
          pInner.find('.primary-thumb').first().remove();
          pInner.find('.second-thumb').first().remove();
          pInner.find('.product_type_variable').removeClass('loading');
        }
      }
      else{
        pInner.find('.product_type_variable').removeClass('loading');
      }
      pInner.find('[class*="ProductVaries-"]').addClass('d-none');
      pInner.find('[class*="ProductPrice-"]').html(theme.Currency.formatMoney(activeVr.price, theme.moneyFormat)).removeClass('d-none');
      if (activeVr.compare_at_price > activeVr.price) {
        pInner.find('[class*="ComparePrice-"]').removeClass('d-none');
        pInner.find('[class*="ComparePrice-"]').html(theme.Currency.formatMoney(activeVr.compare_at_price, theme.moneyFormat));
      }
      else{
        pInner.find('[class*="ComparePrice-"]').addClass('d-none');
      }
      // Update and show the product's unit price if necessary
      if (activeVr.unit_price){
        pInner.find('[class*="UnitPrice-"]').show().removeClass('d-none');
        var unit_price_base_unit = activeVr.unit_price_measurement.quantity_value + activeVr.unit_price_measurement.quantity_unit;
            unit_price_base_unit += ' (<span class="unit_price">'+ theme.Currency.formatMoney(activeVr.unit_price, theme.moneyFormat) + '</span> / ';
            unit_price_base_unit += '<span class="base_unit">';
        if(activeVr.unit_price_measurement){
          if (activeVr.unit_price_measurement.reference_value != 1) {
            unit_price_base_unit += activeVr.unit_price_measurement.reference_value;
          }
          unit_price_base_unit += activeVr.unit_price_measurement.reference_unit;
        }
        unit_price_base_unit += '</span>';
        unit_price_base_unit += '</span>)';
        pInner.find('[class*="UnitPrice-"]').html(unit_price_base_unit);
      } else {
        pInner.find('[class*="UnitPrice-"]').hide().addClass('d-none');
      }
      pInner.find('input[name="id"]').val(activeVr.id);
      pInner.find('.add_to_cart_button').attr('data-vrid', activeVr.id);
      if(theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency){
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
      }
      if (activeVr.available) {
        pInner.find('.add_to_cart_button').prop('disabled', false).removeClass('sold_out disabled');
        if (activeVr.incoming){
          pInner.find('.add_to_cart_button span').html(theme.productStrings.preOrder);
        }else{
          pInner.find('.add_to_cart_button span').html(theme.productStrings.addToCart);
        }
      } else {
        pInner.find('.add_to_cart_button').prop('disabled', true).addClass('sold_out disabled');
        pInner.find('.add_to_cart_button span').html(theme.productStrings.soldOut);
      }
    }
    else {
      var name_src = element.closest('tr').find('.vr-img img').attr('src').split(',')[0];
      var imgChecked = false;
      if (name_src != undefined && activeVr.featured_image) {
        imgChecked = (name_src.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) >= 0 || (name_src.split('/').slice(-1)[0]).indexOf(theme.Images.getName(activeVr.featured_image.src)) === -1 ? true : false;
      }
      if (imgChecked === true) {
        img_url = activeVr.featured_image.src;
        var fileExt = _.last(img_url.split('.'));
        var imgLarge = new Image();
        imgLarge.src = img_url.replace('.'+fileExt, '_180x180_crop_center.'+fileExt); 
        imgLarge.onload = function () {
          var featured_image = '<img src="'+theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_180x180_crop_center.'+fileExt))+'"></div>';
          element.closest('tr').find('.vr-img').append(featured_image);
          element.closest('tr').find('.vr-img img').first().remove();
          element.closest('#amShowUp').find('.add_to_cart_button').removeClass('loading');
        }
      }else{
        element.closest('#amShowUp').find('.add_to_cart_button').removeClass('loading');
      }
      element.closest('tr').find('[class*="ProductPrice-"]').html(theme.Currency.formatMoney(activeVr.price, theme.moneyFormat));
      if (activeVr.compare_at_price > activeVr.price) {
        element.closest('tr').find('[class*="ComparePrice-"]').show();
        element.closest('tr').find('[class*="ComparePrice-"]').html(theme.Currency.formatMoney(activeVr.compare_at_price, theme.moneyFormat));
      }
      else{
        element.closest('tr').find('[class*="ComparePrice-"]').hide();
      }
      // Update and show the product's unit price if necessary
      if (activeVr.unit_price){
        element.closest('tr').find('[class*="UnitPrice-"]').show().removeClass('d-none');
        var unit_price_base_unit = activeVr.unit_price_measurement.quantity_value + activeVr.unit_price_measurement.quantity_unit;
            unit_price_base_unit += ' (<span class="unit_price">'+ theme.Currency.formatMoney(activeVr.unit_price, theme.moneyFormat) + '</span> / ';
            unit_price_base_unit += '<span class="base_unit">';
        if(activeVr.unit_price_measurement){
          if (activeVr.unit_price_measurement.reference_value != 1) {
            unit_price_base_unit += activeVr.unit_price_measurement.reference_value;
          }
          unit_price_base_unit += activeVr.unit_price_measurement.reference_unit;
        }
        unit_price_base_unit += '</span>)';
        element.closest('tr').find('[class*="UnitPrice-"]').html(unit_price_base_unit);
      } else {
        element.closest('tr').find('[class*="UnitPrice-"]').hide().addClass('d-none');
      }
      element.closest('tr').find('input[name="quantity"]').attr('data-id',activeVr.id);
      if (activeVr.available) {
        element.closest('tr').find('input[name="quantity"]').removeAttr('max').attr('min', 1).val(1);
      } else {
        element.closest('tr').find('input[name="quantity"]').attr({'min': 0,'max': 0}).val(0);
      }
      element.closest('tr').find('.vr-title span').text(activeVr.title);
      element.closest('#amShowUp').find('.btn-addmore').attr('data-vrid',activeVr.id);
      if(theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency){
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'#amShowUp span.money');
      }
    }
    if (formJs.parents('.kt-stickyAddCart').length > 0) {
      var productSingleObject = JSON.parse(document.getElementById('ProductJson-product-template').innerHTML);
      var option1 = $('#SingleOptionSelector-0--product-template').val();
      var option1_cr = _handleize(option1);
      var options_title = activeVr.title.split(' / ');
      $('#ProductSection-product-template .fake_select li').removeClass('selected');
      $(activeVr.options).each(function(index, option) {
        var option_title = option;
        var option = _handleize(option);
        var options_change = $("#ProductSection-product-template option[value='"+option_title+"']").val();
        var $options_change_ = $("#ProductSection-product-template option[value='"+option_title+"']").parent();
        $('#ProductSection-product-template .fake_select li._'+option).addClass('selected');
        $('label[data-change-label="SingleOptionSelector-'+index+'--product-template"] .text').text(option_title);
        if(options_change != $options_change_.val()){
          $options_change_.val(options_change).change();
        }
      });
    }
    if (formJs.parents('.table-compare').length > 0) {
      let pInner = formJs.parents('.table-compare');
      let pId = el.attr("data-section-id").split('-')[1];
      pInner.find('[class*="ProductPrice-'+pId+'"]').html(theme.Currency.formatMoney(activeVr.price, theme.moneyFormat));
      if (activeVr.compare_at_price > activeVr.price) {
        pInner.find('[class*="ComparePrice-'+pId+'"]').show();
        pInner.find('[class*="ComparePrice-'+pId+'"]').html(theme.Currency.formatMoney(activeVr.compare_at_price, theme.moneyFormat));
      }
      if (activeVr.available) {
        pInner.find('[class*="Availability-'+pId+'"]').text(theme.productStrings.inStock).addClass('in_stock');
      } else {
        pInner.find('[class*="Availability-'+pId+'"]').text(theme.productStrings.outOfStock).removeClass('in_stock');
      }
      if(theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency){
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
      }
    }
  }
  $(document).on('click','.product-loop-variants .swatch-on-grid:not(.more) .swatch', function(event){
    var url = $(this).attr('data-view');
    var $this = $(this);
    var formJs = $this.closest('.product-inner').find('form[data-section-id]').last();
    formJs.closest('.product-inner').find('.product_type_variable').addClass('loading');
    formJs.closest('.product-inner').find('[data-opt="'+$this.data('opt')+'"] .variants_list li.active').removeClass('active');
    $this.parent().addClass('active');
    var activeVrOpt1 = formJs.closest('.product-inner').find('[data-opt="Opt1Js"] .variants_list li.active').attr('title');
    var activeVrOpt2 = formJs.closest('.product-inner').find('[data-opt="Opt2Js"] .variants_list li.active').attr('title');
    var activeVrOpt3 = formJs.closest('.product-inner').find('[data-opt="Opt3Js"] .variants_list li.active').attr('title');
    var varTitle = activeVrOpt1 + (activeVrOpt2 !== undefined ? ' / '+ activeVrOpt2 : '') + (activeVrOpt3 !== undefined ? ' / '+ activeVrOpt3 : '');
    if (formJs.attr('data-pr-vrs') == '') {
      $.ajax({
        url: url+'?view=vrsjson',
        type: 'GET'
      })
      .done(function(data) {
        // console.log("success");
        formJs.attr('data-pr-vrs', data.replace('<!-- BEGIN template --><!-- product.vrsjson -->','').replace('<!-- END template -->',''));
        vars_change($this.data('vrid'),varTitle,$this.data('opt'),JSON.parse(data.replace('<!-- BEGIN template --><!-- product.vrsjson -->','').replace('<!-- END template -->','')),formJs);
      })
      .fail(function() {
        // console.log("error");
      })
      .always(function() {
        // console.log("complete");
      });
    } else {
      vars_change($this.data('vrid'),varTitle,$this.attr('data-opt'),JSON.parse(formJs.attr('data-pr-vrs')),formJs);
    }
  });
  $(document).on('change','select.product-loop-variants', function(event){
    var url = $(this).attr('data-view');
    var $this = $(this);
    var formJs = $('#amShowUpJSON');
    $('#amShowUp').find('.add_to_cart_button').addClass('loading');
    var activeVrOpt1 = $this.closest('tr').find('select[data-opt="Opt1Js"]').val();
    var activeVrOpt2 = $this.closest('tr').find('select[data-opt="Opt2Js"]').val();
    var activeVrOpt3 = $this.closest('tr').find('select[data-opt="Opt3Js"]').val();
    if ($(this).val().indexOf('"') > 0) {
      $(this).find("option:not([value='"+$(this).val()+"'])").removeAttr('selected');
      $(this).find("option[value='"+$(this).val()+"']").attr('selected', 'selected');
    } else {
      $(this).find('option:not([value="'+$(this).val()+'"])').removeAttr('selected');
      $(this).find('option[value="'+$(this).val()+'"]').attr('selected', 'selected');
    }
    var varTitle = activeVrOpt1 + (activeVrOpt2 !== undefined ? ' / '+ activeVrOpt2 : '') + (activeVrOpt3 !== undefined ? ' / '+ activeVrOpt3 : '');
    vars_change($(this).find('option:selected').data('vrid'),varTitle,$(this).find('option:selected').data('opt'),formJs.data('pr-vrs'),$(this))
  });
});

window.theme = theme || {};
theme.variantsAddMore = (function(){
  function buildSelect(prVrs,vrId) {
    var activeVr = _.find(prVrs, { 'id': vrId});
    if (activeVr.option1) {
      var varsVisible = _.filter(prVrs, { 'option1': activeVr.option1 });
      var vars_opt1 = '', vars_unless1 = new Array;
      var vars_opt2 = '', vars_unless2 = new Array;
      var vars_opt3 = '', vars_unless3 = new Array;
      var img_url = '';
      _.forEach(prVrs, function(variant) {
        if (_.indexOf(vars_unless1,variant.option1) == -1) {
          if (activeVr.id == variant.id) {
            vars_unless1.push(variant.option1);
            vars_opt1 += '<option selected class="swatch _'+ _handleize(variant.option1) +'" data-available="'+ variant.available +'" value="'+ variant.option1.replace('"','&quot;') +'" data-opt="Opt1Js" data-vrId="'+ variant.id +'">';
            vars_opt1 += variant.option1;
            vars_opt1 += '</option>';
          }
          if (_.indexOf(vars_unless1,variant.option1) == -1 && activeVr.option1 !== variant.option1) {
            vars_unless1.push(variant.option1);
            vars_opt1 += '<option class="swatch _'+ _handleize(variant.option1) +'" data-available="'+ variant.available +'" value="'+ variant.option1.replace('"','&quot;') +'" data-opt="Opt1Js" data-vrId="'+ variant.id +'">';
            vars_opt1 += variant.option1;
            vars_opt1 += '</option>';
          }
        }
      });
      _.forEach(varsVisible, function(variant) {
        if (variant.option1 == activeVr.option1 && variant.featured_image){
          img_url = variant.featured_image.src;
        }
        if (activeVr.option2){
          if (activeVr.id == variant.id) {
            vars_unless2.push(variant.option2);
            vars_opt2+= '<option selected class="swatch _'+ _handleize(variant.option2) +'" data-available="'+ variant.available +'" value="'+ variant.option2.replace('"','&quot;') +'" data-opt="Opt2Js" data-vrId="'+ variant.id +'">';
            vars_opt2 += variant.option2;
            vars_opt2 += '</option>';
          }
          if(_.indexOf(vars_unless2,variant.option2) == -1 && activeVr.option1 == variant.option1 && activeVr.option2 !== variant.option2) {
            vars_unless2.push(variant.option2);
            vars_opt2 += '<option class="swatch _'+ _handleize(variant.option2) +'" data-available="'+ variant.available +'" value="'+ variant.option2.replace('"','&quot;') +'" data-opt="Opt2Js" data-vrId="'+ variant.id +'">';
            vars_opt2 += variant.option2;
            vars_opt2 += '</option>';
          }
        } 
        if (activeVr.option3) {
          if (activeVr.id == variant.id) {
            vars_unless3.push(variant.option3);
            vars_opt3 += '<option selected class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
            vars_opt3 += variant.option3;
            vars_opt3 += '</option>';
          }
          if (_.indexOf(vars_unless3,variant.option3) == -1 && activeVr.option1 === variant.option1 && activeVr.option2 === variant.option2 && activeVr.option3 !== variant.option3) {
            vars_unless3.push(variant.option3);
            vars_opt3 += '<option class="swatch _'+ _handleize(variant.option3) +'" data-available="'+ variant.available +'" value="'+ variant.option3.replace('"','&quot;') +'" data-opt="Opt3Js" data-vrId="'+ variant.id +'">';
            vars_opt3 += variant.option3;
            vars_opt3 += '</option>';
          }
        }
      });
      var html = '';
      html += '<tr class="chane-d-ed">';
        html += '<th class="delete-wrapper text-center" scope="row"><i class="fkt-close btn-delete" aria-hidden="true" onclick="$(this).closest(\'tr\').remove()"></i></th>';
        html += '<td class="hide-lg text-left"><div class="vr-img">';
        if (activeVr.featured_image){
          img_url = activeVr.featured_image.src;
          var fileExt = _.last(img_url.split('.'));
          html += '<img src="'+ theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_180x180_crop_center.'+fileExt)) +'">'; 
        } else if (img_url !== '') {
          var fileExt = _.last(img_url.split('.'));
          html += '<img src="'+ theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_180x180_crop_center.'+fileExt)) +'">'; 
        } else if ($('#amShowUp').attr('data-featured-image') !== ''){
          img_url = $('#amShowUpJSON').attr('data-featured-image');
          var fileExt = _.last(img_url.split('.'));
          html += '<img src="'+ theme.Images.removeProtocol(img_url.replace('.'+fileExt, '_180x180_crop_center.'+fileExt)) +'">'; 
        }
        html += '</div><div class="vr-title"><span>'+activeVr.title+'</span><i class="fkt-edit change-d" aria-hidden="true"></i></div></td>';
          html += '<td class="hide-sm" class="hide-lg" data-title="'+$('#amShowUp th').eq(1).text()+'"><div class="form-group mb-0"><select class="form-control product-loop-variants data-opt="Opt1Js">'+vars_opt1+'</select></div></td>';
        if (vars_opt2 !== '') {
          html += '<td class="hide-sm" data-title="'+$('#amShowUp th').eq(2).text()+'"><div class="form-group mb-0"><select class="form-control product-loop-variants data-opt="Opt2Js">'+vars_opt2+'</select></div></td>';
        }
        if (vars_opt3 !== '') {
          html += '<td class="hide-sm" data-title="'+$('#amShowUp th').eq(3).text()+'"><div class="form-group mb-0"><select class="form-control product-loop-variants data-opt="Opt3Js">'+vars_opt3+'</select></div></td>';
        }
        html += '<td class="qtt-wrapper" data-title="Qty:">';
          html += '<div class="quantity">';
            html += '<div class="control">';
              html += '<a class="btn-number qtyminus quantity-minus" href="javascript:void(0)"></a>';
              if (activeVr.available) {
                html += '<input type="text" data-id="'+activeVr.id+'" data-price="'+activeVr.price+'" name="quantity" value="1" min="1" class="input-qty form-control mb-0 qty text" size="4" pattern="[0-9]*">';
              }else{
                html += '<input type="text" data-id="'+activeVr.id+'" data-price="'+activeVr.price+'" name="quantity" value="0" min="0" max="0" class="input-qty form-control mb-0 qty text" size="4" pattern="[0-9]*">';
              }
              html += '<a class="btn-number qtyplus quantity-plus" href="javascript:void(0)"></a>';
            html += '</div>';
          html += '</div>';
        html += '</td>';
        html += '<td class="price-wrapper" data-title="Price:">';
          html += '<span class="price">';
            html += '<ins class="ProductPrice-'+activeVr.id+'">'+theme.Currency.formatMoney(activeVr.price, theme.moneyFormat)+'</ins>';
            // Update and show the product's unit price if necessary
              var unit_price_base_unit = '<span class="UnitPrice-'+activeVr.id+' text-nowrap';
              if (!activeVr.unit_price) {
                  unit_price_base_unit += ' d-none';
              }
                  unit_price_base_unit += '">';
              if (activeVr.unit_price) {
                  unit_price_base_unit += activeVr.unit_price_measurement.quantity_value + activeVr.unit_price_measurement.quantity_unit;
                  unit_price_base_unit += ' (<span class="unit_price">'+ theme.Currency.formatMoney(activeVr.unit_price, theme.moneyFormat) + '</span> / ';
                  unit_price_base_unit += '<span class="base_unit">';
                if(activeVr.unit_price_measurement){
                  if (activeVr.unit_price_measurement.reference_value != 1) {
                    unit_price_base_unit += activeVr.unit_price_measurement.reference_value;
                  }
                  unit_price_base_unit += activeVr.unit_price_measurement.reference_unit;
                }
                unit_price_base_unit += '</span>)';
              }
              unit_price_base_unit += '</span>';
              html += unit_price_base_unit;
            // if (activeVr.compare_at_price) {html += '<del class="ComparePrice-'+activeVr.id+'">'+theme.Currency.formatMoney(activeVr.compare_at_price, theme.moneyFormat)+'</del>';}
          html += '</span>';
        html += '</td>';
      html += '</tr>';
      $('#amShowUp .list-vrs').append(html);
      $('#amShowUp .add_to_cart_button').removeClass('loading');
      if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'#amShowUp .list-vrs  span.money');
      }
    }
  }
  function init(formJS,url,crVr) {
    var formJS = formJS, vrId = parseInt(crVr);
    var html = '';
    html += '<div class="table-group">';
    html += '<table class="table m-0">';
      html += '<thead class="thead-light">';
        html += '<tr>';
          html += '<th scope="col" class="text-center">#</th>';
          html += '<th scope="col" class="nameOption1"></th>';
          html += '<th scope="col" class="nameOption2" style="display: none"></th>';
          html += '<th scope="col" class="nameOption3" style="display: none"></th>';
          html += '<th scope="col">Qty</th>';
          html += '<th scope="col">Price</th>';
        html += '</tr>';
      html += '</thead>';
      html += '<tbody class="list-vrs">';
      html += '</tbody>';
      html += '<tfoot>';
        html += '<tr class="buttonAddmore">';
          html += '<td colspan="6" class="text-center"><i class="fkt-plus btn-addmore" aria-hidden="true" data-vrid="'+vrId+'"></i>';
          if(themeAjaxCart){
            html += '<button type="submit" class="btn btn-primary btn-onclick add_to_cart_button text-uppercase addItemsAjax loading" style="width: 100%;margin-top: 10px;">'+theme.strings.addToCart+'</button>';
          }else{
            html += '<button type="submit" class="btn btn-primary btn-onclick add_to_cart_button text-uppercase addItemsBasic loading" style="width: 100%;margin-top: 10px;">'+theme.strings.addToCart+'</button>';
          }
          html += '</td>';
        html += '</tr>';
      html += '</tfoot>';
    html += '</table>';
    html += '</div>';
    $.ajax({
      url: url+'?view=jsfull',
      type: 'GET'
    })
    .done(function(data) {
      // console.log("success");
      data = JSON.parse(data);
      var prVrs = data.variants;
      $('#amShowUpJSON').attr('data-pr-vrs',JSON.stringify(prVrs));
      $('#amShowUp').find('.nameOption1').text(data.options[0]);
      if(data.options[1]){
        $('#amShowUp').find('.nameOption2').text(data.options[1]).show();
      }
      if(data.options[2]){
        $('#amShowUp').find('.nameOption3').text(data.options[2]).show();
      }
      buildSelect(prVrs,vrId);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      // console.log("complete");
    });
    return html;
  }
  return {
    init: init,
    buildSelect: buildSelect
  };
})();

theme.menuBgChange = (function(){
  $(document).on('mouseenter','a.bgChange',function(event){
    event.preventDefault();
    var image = $(this).attr('data-hover-image');
    var content = $(this).attr('data-hover-banner');
    if(image !== undefined || content !== undefined ){
      $(this).parents('.sub-menu.megamenu').addClass('hiddenBg');    
      if($(this).parents('.sub-menu.megamenu').find('.imgByCollection').length == 0){
        if(image !== undefined){
          $(this).parents('.sub-menu.megamenu').append('<img class="imgByCollection" src="'+image+'" >');
        }else{
          $('.imgByCollection').remove();
          $(this).parents('.sub-menu.megamenu').append(content);
        }
      }else{
        $('.sub-menu.megamenu a.img-cate').remove();
        if(image !== undefined){
          $('.imgByCollection').show();
          $(this).parents('.sub-menu.megamenu').find('.imgByCollection').attr('src',image);
        }else{
          $('.imgByCollection').hide();
          $(this).parents('.sub-menu.megamenu').append(content);
        }
      }
    }
  })
  .on('mouseleave','a.bgChange',function(event){
    $(this).parents('.sub-menu.megamenu').removeClass('hiddenBg');
    $('.imgByCollection').hide();
    $('.sub-menu.megamenu a.img-cate').hide();
  });
});

theme.checkProductGrid_Width = (function(){
  $('div.product-item:not(.showUp)').each(function(){
    if ($(this).is(':visible')) {
      var parentWidth = $(this).width();
      $(this).removeClass('smallCard normalCard largeCard hugeCard');
      if(parentWidth > 550){
        $(this).addClass('hugeCard');
      }
      else if(parentWidth > 350){
        $(this).addClass('largeCard');
      }
      else if(parentWidth <= 240 && parentWidth > 180 ){
        $(this).addClass('smallCard');
      }
      else if(parentWidth < 180){
        $(this).addClass('ssmallCard smallCard');
      }
      else{
        $(this).addClass('normalCard');
      }
    }
  });
});
theme.Quantity = (function(){
  $(document).on('click', '.quantity-up, .qtyplus',function(event) {
    event.preventDefault();
    var spinner = $(this).closest('.quantity'),
        input = spinner.find('input.input-qty'),
        min = input.attr('data-min') || 0,
        max = input.attr('data-max');
    var oldValue = parseFloat(input.val());
    if (oldValue >= max) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue + 1;
    }
    input.val(newVal).trigger("change");
  });
  $(document).on('click', '.quantity-down, .qtyminus',function(event) {
    event.preventDefault();
    var spinner = $(this).closest('.quantity'),
        input = spinner.find('input.input-qty'),
        min = input.attr('data-min') || 0,
        max = input.attr('data-max');
    var oldValue = parseFloat(input.val());
    if (oldValue <= min) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue - 1;
    }
    input.val(newVal).trigger("change");
  });
  $(document).on('change', '.quantity input.input-qty', function(){
    // $(this).parent().find('.fake-select-qty').remove();
    var input = $(this),max = input.attr('max');
    if( parseFloat(input.val()) > parseFloat(max) ){
      input.val(parseFloat(max)).trigger("change");
    }
    if( $(this).parents('form[action="/cart/add"]').length > 0 ){
      $(this).parents('form[action="/cart/add"]').find('input[type="hidden"][name="quantity"]').remove();
    }
  });
  // $(document).on('change', '.fake-select-qty', function(){
  //   var new_qty = parseFloat($(this).val());
  //   var input = $(this).parent().find('[name="quantity"]'),max = input.attr('max');
  //   if( parseFloat($(this).val()) !== 11){
  //     // $(this).remove();
  //     input.val(new_qty).trigger("change");
  //   } else if( parseFloat($(this).val()) === 11){
  //     // $(this).remove();
  //     input.val(11).trigger("change");
  //     input.trigger("focus");
  //   }
  // });
});

theme.initPhotoSwipeFromDOM = (function(gallerySelector, elcloned, tgName, callback){
  $('.pswp').removeAttr('style');
  // loop through all gallery elements and bind events
  var galleryElements = $( gallerySelector );
  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
    // build items array
    var itemsArray = $(el).find(elcloned+' [data-size]');
    var items = [];
    _.forEach(itemsArray, function(elItem, idx) {
      var item = new Object();
      item['src'] = $(elItem).attr('data-srcfix');
      item['w'] = $(elItem).attr('data-size').split('x')[0];
      item['h'] = $(elItem).attr('data-size').split('x')[1];
      items.push(item)
    });
    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
      return (el.tagName && el.tagName.toUpperCase() === tgName);
    });
    if(!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = $(clickedListItem).parents(gallerySelector),
        childNodes = clickedGallery.find(elcloned+' [data-size]'),
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;
    for (var i = 0; i < numChildNodes; i++) {
      if(childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }
    if(index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe( index, clickedGallery );
    }
    return false;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = $('.pswp')[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {
      // history & focus options are disabled
      history: false,
      focus: false,

      // define gallery index (for URL)
      galleryUID: $(galleryElement).attr('data-pswp-uid'),

      getThumbBoundsFn: function(index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = $(galleryElement).find(elcloned+' [data-size]')[index], // find thumbnail
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect(); 

        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
      },
      shareButtons: [
        {id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
        {id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
        {id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
      ]

    };

    // PhotoSwipe opened from URL
    if(fromURL) {
      if(options.galleryPIDs) {
        // parse real index when custom PIDs are used 
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for(var j = 0; j < items.length; j++) {
          if(items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if( isNaN(options.index) ) {
      return;
    }

    if(disableAnimation) {
      options.showAnimationDuration = 0;
    }
    
    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    gallery.listen('afterChange', function() {
      callback(gallery.getCurrentIndex(),gallery.currItem)
    });
  };

  for(var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i+1);
    galleryElements[i].onclick = onThumbnailsClick;
  }
})

theme.imgs360 = (function(files,position,width,height,vrId) {
  var totalFrames = position[1] - position[0];
  var myModalThreeSixty = '<section class="modal animated fadeIn myModalThreeSixty kt_'+vrId+'" data-vr-id="'+vrId+'" data-total-frames="'+totalFrames+'" data-end-frames="'+totalFrames+'" data-files="'+files+'" data-width="'+width+'" data-height="'+height+'" aria-hidden="false" role="dialog" tabindex="-1"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <button class="close animate"> <span aria-hidden="true">×</span> </button> <div class="content-item"> <div class="threesixty productThreeSixty"> <div class="spinner"> <span>0%</span> </div><ol class="threesixty_images"></ol> </div></div></div></div></section>';
  $('body').append(myModalThreeSixty);
  $(document).on('click','button.kt_open360_'+vrId,function(e){
    $('.myModalThreeSixty.kt_'+vrId).modal();
    if($('.myModalThreeSixty.kt_'+vrId).find('.threesixty_images li').length > 0){return false}
    var dataJs = $('.myModalThreeSixty.kt_'+vrId);
    var options = {
      totalFrames: dataJs.attr('data-total-frames'),
      endFrame: dataJs.attr('data-end-frames'), 
      currentFrame: 1, 
      imgList: '.threesixty_images', 
      progress: '.spinner',
      imgArray: dataJs.attr('data-files').split(','),
      width: dataJs.attr('data-width'),
      height: dataJs.attr('data-height'),
      responsive: true,
      navigation: true
    }
    $jq('.myModalThreeSixty.kt_'+dataJs.attr('data-vr-id')+' .productThreeSixty').ThreeSixty(options);
  });
  $(document).on('click','button.close.animate',function(e){
    $(this).closest('.myModalThreeSixty').addClass('fadeOut').animate({opacity: 0}, 400, function(){
      $('.myModalThreeSixty.kt_'+vrId).removeClass('fadeOut').modal('hide')
    });
  });
  $('.myModalThreeSixty.kt_'+vrId).on('hidden.bs.modal', function () {
    $('.productThreeSixty').find('.nav_bar_stop').trigger('click')
  })
})

window.theme = theme || {};
theme.cookiesPopup = (function() {
  function init(container) {
    var popup = $('.kt-cookies-popup');
    setTimeout(function() {
      popup.addClass('popup-display');
      popup.on('click', '.cookies-accept-btn', function(e) {
        e.preventDefault();
        acceptCookies();
      })
    }, 2500);

    var acceptCookies = function() {
      popup.removeClass('popup-display').addClass('popup-hide');
      localStorage.setItem("kt_cookies", "accepted")
    };
    if(localStorage.getItem("kt_cookies") == 'accepted') {
      popup.removeClass('popup-display').addClass('popup-hide');
    }
  }
  return init;
})();
theme.cookiesPopup.prototype = _.assignIn({}, theme.cookiesPopup.prototype, {
  onSelect: function(evt) {
    localStorage.removeItem("kt_cookies");
    $('.kt-cookies-popup').addClass('popup-display').removeClass('popup-hide');
  }
});

window.theme = theme || {};
theme.newsletterPopup = (function() {
  function init(container) {
    let $container = $(container);
    let display = getCookie("kt_popupNewsletter");
    let delay = $container.attr('data-pause');
    let backdrop = $container.data('backdrop') || true;
    let mobileDisplay = $container.data('mobile-display');
    let dataScrollNewsletterPopup = parseInt($container.attr('data-scroll'));
    let scroll = function(){
      display = getCookie("kt_popupNewsletter");
      if($(window).scrollTop() < dataScrollNewsletterPopup && dataScrollNewsletterPopup != 0 || display === 'disable'){
        return false
      }
      if (mobileDisplay && theme.window_W < 768) {
        return false;
      }
      if($(container).find('p.form--success').length <= 0){
        $container.on('change', '#hideforever', function(){
          if ($(this).is(':checked')) {
            document.cookie = "kt_popupNewsletter=disable;1;path=/";
          } else {
            document.cookie = "kt_popupNewsletter=;path=/";
          }
        });
        $container.on('click', '.close', function(){
          if ($(container).find('#hideforever').is(':checked') === false){
            setCookie("kt_popupNewsletter",'disable',1,1,10);
          }
        });
        if (display != "disable") {
          if( dataScrollNewsletterPopup == 0 ){
            setTimeout(function() {
              $container.modal({
                backdrop: backdrop
              });
            }, delay);
          } else {
            $container.modal({
              backdrop: backdrop
            });
          }
        }
      }
    }
    if( dataScrollNewsletterPopup == 0){
      scroll();
    } else {
      $(window).scroll($.throttle( 150, scroll));
    }
    $('#newsletterModal').on('hide.bs.modal', function () {
      if ($(container).find('#hideforever').is(':checked') === false){
        setCookie("kt_popupNewsletter",'disable',1,1,10);
      }
    });
    if(window.location.search.indexOf('?customer_posted') >= 0){      
      $container.modal({
        backdrop: backdrop
      });
    }
  }
  return init;
})();
theme.newsletterPopup.prototype = _.assignIn({}, theme.newsletterPopup.prototype, {
  onSelect: function(evt) {
    $container.modal('show');
    document.cookie = "kt_popupNewsletter=;path=/";
  }
});

window.theme = theme || {};
theme.lookBook = (function() { 
  function lookBook(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    KT.loadScript('tippy', function(e,l){
      if (l == 'ok') {
        $.each($container.find('.kt_pin[data-product-handle]'), function(index, el) {
          tippy(this, {
            content(reference) {
              const template = $('.kt_pin_pritem[data-product-handle="'+$(reference).attr('data-product-handle')+'"]')[0];
              return template.outerHTML;
            },
            sticky: true,
            interactive: true
          });
        });
      }
    })
  }
  return lookBook;
})();

theme.wokerktlz = (function(load){
  function createWorkerktlz(){
    if(theme.myWorker){return true}
    var blob = new Blob([localStorage.getItem('workerktlz')], { type: "text/javascript", async: true });
    // console.log(window.URL.createObjectURL(blob))
    var myWorker = theme.myWorker = new Worker(window.URL.createObjectURL(blob));
    if(theme.myWorker === undefined){return true}
    KlzWorker();
    window.timeoutOnscroll;
    window.onscroll = function() {
      clearTimeout(window.timeoutOnscroll);
      window.timeoutOnscroll = setTimeout(function(){
      KlzDynamicVariantsLoader();
      }, 100)
    };
    window.timeoutOnresize;
    window.onresize = function() {
      clearTimeout(window.timeoutOnresize);
      window.timeoutOnresize = setTimeout(function(){
      KlzDynamicVariantsLoader();
      }, 100)
    };
  }
  if(KT.checkVersion('workerktlz')){
    $.ajax({
      url: '/cart?view=workerktlz',
      type: 'GET',
      dataType: 'html'
    })
    .done(function(data) {
      KT.pushVersion('workerktlz');
      data = data.replace('<!-- BEGIN template --><!-- cart.workerktlz -->','').replace('<!-- END template -->','');
      localStorage.setItem('workerktlz', data);
    })
    .fail(function() {
      // console.log("error");
    })
    .always(function() {
      // console.log("complete");
      createWorkerktlz();
    });
  }
  else {
    createWorkerktlz();
  }
  function KlzDynamicVariantsLoader(loadDeferral, visibilityBuffer, skipHidden){
    loadDeferral = loadDeferral == undefined ? "onVisible" : loadDeferral;
    visibilityBuffer = visibilityBuffer == undefined ? 300 : visibilityBuffer;
    skipHidden = skipHidden == undefined ? 1 : skipHidden;
    var loadComplete = false;
    var getWindowHeight = function() {
      if (undefined !== self.innerHeight) {
        return self.innerHeight;
      } else {
        if (undefined !== document.documentElement && undefined !== document.documentElement.clientHeight) {
          return document.documentElement.clientHeight;
        } else {
          if (undefined !== document.body) {
            return document.body.clientHeight;
          }
        }
      }
    };
    var getVerticalScrollPosition = function() {
      if (undefined !== document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
      } else {
        if (undefined !== document.body) {
          return document.body.scrollTop;
        }
      }
    };
    var isHidden = function(element) {
      return skipHidden && (element.offsetWidth <= 0 || element.offsetHeight <= 0);
    };
    var getVerticalPosition = function(element) {
      if (!element) {
        return 0;
      }
      var verticalPosition = element.offsetTop;
      var parent = element;
      while (parent = parent.offsetParent) {
        verticalPosition += parent.offsetTop;
      }
      return verticalPosition;
    };
    var shouldLoadNow = function(element) {
      var loadDeferralByElement = element.getAttribute('data-ktlz');
      if(loadDeferralByElement !== null){loadDeferral = loadDeferralByElement};
      switch (loadDeferral) {
        case "onLoad":
          if (loadComplete) {
            return true;
          }
        case "onVisible":
          return !isHidden(element) && ((getVerticalScrollPosition() - visibilityBuffer) <= getVerticalPosition(element) && getVerticalPosition(element) <= (getWindowHeight() + getVerticalScrollPosition() + visibilityBuffer));
        case "instant":
        default:
          return true;
      }
    };
    var buildHTML = function(pJSON) {
      let data = pJSON;
      // console.log(data)
      // console.log(data.options)
      let option1_Name = data.options && data.options[0] ? data.options[0] : null;
      let option1_Variants = '';
      let option1_Variants_Array = [];
      let option_Variants_Array_Visible = [];
      let option2_Name = data.options[1] && data.options[1] ? data.options[1] : null;
      let option2_Variants = '';
      let option2_Variants_Array = [];
      let option3_Name = data.options[2] && data.options[2] ? data.options[2] : null;
      let option3_Variants = '';
      let option3_Variants_Array = [];
      
      let productOptionStyle = theme.function.productGridOptionStyle;
      let productOption1Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == option1_Name});
      let productOption2Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == option2_Name});
      let productOption3Style = productOptionStyle.find(function(productOptionStyle){ return productOptionStyle['name'] == option3_Name});

      let first_available_variant = data.variants.find(function(variant){ return variant.available === true});
      data.variants.forEach(function(variant) {
        let bg_style = productOption1Style !== undefined && productOption1Style.color_watched && productOption1Style.sw_style == 'image_variant' ? ' bg-contain' : '';
        if(option1_Variants_Array.indexOf(variant.option1) === -1){
          option1_Variants_Array.push(variant.option1);
          let activeVariantFirstOption1 = first_available_variant.options.indexOf(variant.option1) !== -1 ? ' active' : '';
          let maybeHide1 = option1_Variants_Array.length > 5 ? true : false;
          let handleOption1 = variant.option1.toLowerCase().replace(/'|"|\(|\)|\[|\]/g, "").replace(/\W+/g, "-").replace(/^-+|-+$/g, "");

          let img_url = variant.featured_image ? variant.featured_image.src : null;
          let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
          let bgImage = img_url !== null && productOption1Style !== undefined && productOption1Style.color_watched && productOption1Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';

          option1_Variants += '<li class="swatch-on-grid _'+handleOption1+activeVariantFirstOption1+'" title="'+variant.option1+'" data-available="true" data-maybe-hide="'+maybeHide1+'">';
          option1_Variants += '<span class="swatch'+bg_style+'" data-vrs="kt_'+handleOption1+'" data-opt="Opt1Js" data-vrid="'+variant.id+'" data-view="/products/'+pJSON.handle+'" data-available="'+variant.available+'" title="'+variant.option1+'"'+bgImage+'>';
          option1_Variants += '<span class="swatch-title">'+variant.option1+'</span><span class="comma">,</span>';
          option1_Variants += '</span>';
          option1_Variants += '</li>';
        }

        if(option1_Variants_Array.indexOf(first_available_variant.options[0]) !== -1){
          if(option_Variants_Array_Visible.indexOf(variant.option1) === -1){option_Variants_Array_Visible.push(variant.option1);}
          if(option2_Name !== null && option_Variants_Array_Visible[0] === variant.option1 && option_Variants_Array_Visible.indexOf(variant.option2) === -1){option_Variants_Array_Visible.push(variant.option2);}
          if(option3_Name !== null && option_Variants_Array_Visible[1] === variant.option2 && option_Variants_Array_Visible.indexOf(variant.option3) === -1){option_Variants_Array_Visible.push(variant.option3);}
        }
        if(option2_Name !== null && option2_Variants_Array.indexOf(variant.option2) === -1 && option_Variants_Array_Visible.indexOf(variant.option2) !== -1){
          option2_Variants_Array.push(variant.option2);
          let activeVariantFirstOption2 = first_available_variant.options.indexOf(variant.option2) !== -1 ? ' active' : '';
          let maybeHide2 = option2_Variants_Array.length > 5 ? true : false;
          let handleOption2 = variant.option2.toLowerCase().replace(/'|"|\(|\)|\[|\]/g, "").replace(/\W+/g, "-").replace(/^-+|-+$/g, "");
          
          let img_url = variant.featured_image ? variant.featured_image.src : null;
          let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
          let bgImage = img_url !== null && productOption2Style !== undefined && productOption2Style.color_watched && productOption2Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';
          
          option2_Variants += '<li class="swatch-on-grid _'+handleOption2+activeVariantFirstOption2+'" title="'+variant.option2+'" data-available="true" data-maybe-hide="'+maybeHide2+'">';
          option2_Variants += '<span class="swatch'+bg_style+'" data-vrs="kt_'+handleOption2+'" data-opt="Opt2Js" data-vrid="'+variant.id+'" data-view="/products/'+pJSON.handle+'" data-available="'+variant.available+'" title="'+variant.option2+'"'+bgImage+'>';
          option2_Variants += '<span class="swatch-title">'+variant.option2+'</span><span class="comma">,</span>';
          option2_Variants += '</span>';
          option2_Variants += '</li>';
        }
        if(option3_Name !== null && option3_Variants_Array.indexOf(variant.option3) === -1 && option_Variants_Array_Visible.indexOf(variant.option3) !== -1){
          option3_Variants_Array.push(variant.option3);
          let activeVariantFirstOption3 = first_available_variant.options.indexOf(variant.option3) !== -1 ? ' active' : '';
          let maybeHide3 = option3_Variants_Array.length > 5 ? true : false;
          let handleOption3 = variant.option3.toLowerCase().replace(/'|"|\(|\)|\[|\]/g, "").replace(/\W+/g, "-").replace(/^-+|-+$/g, "");

          let img_url = variant.featured_image ? variant.featured_image.src : null;
          let fileExt = img_url !== null ? img_url.split('.')[img_url.split('.').length - 1] : null;
          let bgImage = img_url !== null && productOption3Style !== undefined && productOption3Style.color_watched && productOption3Style.sw_style !== 'color' ? 'style="background-image: url(\''+(img_url.replace('.'+fileExt, '_100x100_crop_center.'+fileExt)).replace(/http(s)?:/, '')+'\')"' : '';
          
          option3_Variants += '<li class="swatch-on-grid _'+handleOption3+activeVariantFirstOption3+'" title="'+variant.option3+'" data-available="true" data-maybe-hide="'+maybeHide3+'">';
          option3_Variants += '<span class="swatch'+bg_style+'" data-vrs="kt_'+handleOption3+'" data-opt="Opt3Js" data-vrid="'+variant.id+'" data-view="/products/'+pJSON.handle+'" data-available="'+variant.available+'" data-toggle="tooltip" title="'+variant.option3+'"'+bgImage+'>';
          option3_Variants += '<span class="swatch-title">'+variant.option3+'</span><span class="comma">,</span>';
          option3_Variants += '</span>';
          option3_Variants += '</li>';
        }
      });
      if(option1_Variants_Array.length > 5){
        option1_Variants += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
      }
      if(option2_Variants_Array.length > 5){
        option2_Variants += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
      }
      if(option3_Variants_Array.length > 5){
        option3_Variants += '<li class="swatch-on-grid more kt__quick-shop"><span class="swatch"><span class="swatch-title">'+theme.productStrings.viewMoreVariants+'+</span></span> </li>';
      }
      if(option1_Variants_Array.length > 0){
        if(productOption1Style !== undefined){
          let one_option_1 = option1_Variants_Array.length === 1 ? ' one-option' : '';
          option1_Variants = '<ul class="product-loop-variants variants '+productOption1Style.style + one_option_1+' list-unstyled" data-swatchesstyle="image_variant" data-usecolor="'+productOption1Style.color_watched+'" data-opt="Opt1Js"><li class="name_option">'+option1_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option1_Variants + '</li></ul></ul>'
        }
        else{
          option1_Variants = '<ul class="product-loop-variants variants list list_1 list-unstyled" data-swatchesstyle="image_variant" data-usecolor="false" data-opt="Opt1Js"><li class="name_option">'+option1_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option1_Variants + '</li></ul></ul>'
        }
      }
      if(option2_Variants_Array.length > 0){
        if(productOption2Style !== undefined){
          let one_option_2 = option2_Variants_Array.length === 1 ? ' one-option' : '';
          option2_Variants = '<ul class="product-loop-variants variants '+productOption2Style.style + one_option_2+' list-unstyled" data-swatchesstyle="image_variant" data-usecolor="'+productOption2Style.color_watched+'" data-opt="Opt2Js"><li class="name_option">'+option2_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option2_Variants + '</li></ul></ul>'
        }
        else{
          option2_Variants = '<ul class="product-loop-variants variants list list_1 list-unstyled" data-swatchesstyle="image_variant" data-usecolor="false" data-opt="Opt2Js"><li class="name_option">'+option2_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option2_Variants + '</li></ul></ul>'
        }
      }

      if(option3_Variants_Array.length > 0){
        if(productOption3Style !== undefined){
          let one_option_3 = option2_Variants_Array.length === 1 ? ' one-option' : '';
          option3_Variants = '<ul class="product-loop-variants variants '+productOption3Style.style + one_option_3+' list-unstyled" data-swatchesstyle="image_variant" data-usecolor="'+productOption3Style.color_watched+'" data-opt="Opt3Js"><li class="name_option">'+option3_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option3_Variants + '</li></ul></ul>'
        }
        else{
          option3_Variants = '<ul class="product-loop-variants variants list list_1 list-unstyled" data-swatchesstyle="image_variant" data-usecolor="false" data-opt="Opt3Js"><li class="name_option">'+option3_Name+':</li><li class="variants_list"><ul class="content__variants_list p-0">' + option3_Variants + '</li></ul></ul>'
        }
      }
      let productVariants = '<input type="hidden" name="quantity" value="1"><input type="hidden" name="id" value="'+first_available_variant.id+'">';
      return options = {
        "option1": option1_Variants,
        "option2": option2_Variants,
        "option3": option3_Variants,
        "input": productVariants
      }
    };
    var loadDynamicVariants = function() {
      // if(!checkConnection()){return false;}
      $.each($(".ktlz"), function(idx, el) {
        var element = this;
        if (shouldLoadNow(element) && !$(element).hasClass("ktlz-loaded")) {
          if($(element).attr('data-href') === undefined){return true}
          if(Shopify.designMode && Shopify.theme.role === 'main' || typeof(Worker) == "undefined"){
            $.ajax({
              url:'/products/'+$(element).attr('data-href')+'?view=jsfull',
              type: 'GET'
            })
            .done(function(data) {
              // console.log("success");
              let pJSON = JSON.parse(data.replace(/<!--.*?-->/g, ""));
              let html = buildHTML(pJSON);
              let ktlzFormPid = $(".ktlz-form-pid-"+pJSON.id);
              $.each(ktlzFormPid, function(idx, el) {
                let $this = $(this);
                $this.find('.prd--option1').html(html.option1).removeClass('animated-background');
                $this.find('.prd--option2').html(html.option2).removeClass('animated-background');
                $this.find('.prd--option3').html(html.option3).removeClass('animated-background');
                if ($this.find('input[name="id"]').length <= 0) {
                  $this.append(html.input);
                }
                $this.attr("data-pr-vrs", JSON.stringify(pJSON.variants));
                if($this.parents('#qsShowUp').length){
                  $('#qsShowUp').find('.product-loop-variants').removeClass('_small');
                }
                $this.find('[data-toggle="tooltip"]').tooltip();
                if (currTags !== null) {
                  $.each(currTags_handleize, function(index, val) {
                    if (val.indexOf('color-') === 0) {
                      $this.find('.swatch-on-grid._'+val.replace('color-','')+ ' .swatch').trigger('click');
                      $this.find('.swatch-on-grid._'+val.replace('color-','')+'[data-maybe-hide="true"]').attr('data-maybe-hide',false);
                      return true;
                    }
                  });
                }
              });
            })
            .fail(function() {
              // console.log("error");
            })
            .always(function() {
              // console.log("complete");
            });
          } else {
            theme.myWorker.onmessage = function(e) {
              var ktlzFormPid = $(".ktlz-form-pid-"+e.data.pId);
              $.each(ktlzFormPid, function(idx, el) {
                let $this = $(this);
                $this.find('.prd--option1').html(e.data.html.option1).removeClass('animated-background');
                $this.find('.prd--option2').html(e.data.html.option2).removeClass('animated-background');
                $this.find('.prd--option3').html(e.data.html.option3).removeClass('animated-background');
                if ($this.find('input[name="id"]').length <= 0) {
                  $this.append(e.data.html.input);
                }
                $this.attr("data-pr-vrs", JSON.stringify(e.data.pJson.variants));
                if($this.parents('#qsShowUp').length){
                  $('#qsShowUp').find('.product-loop-variants').removeClass('_small');
                }
                $this.find('[data-toggle="tooltip"]').tooltip();
                if (currTags !== null) {
                  $.each(currTags_handleize, function(index, val) {
                    if (val.indexOf('color-') === 0) {
                      $this.find('.swatch-on-grid._'+val.replace('color-','')+ ' .swatch').trigger('click');
                      $this.find('.swatch-on-grid._'+val.replace('color-','')+'[data-maybe-hide="true"]').attr('data-maybe-hide',false);
                      return true;
                    }
                  });
                }
              });
            }
            var postWorkerData = {
              handleProduct: $(element).attr('data-href'),
              productOptionStyle: theme.function.productGridOptionStyle
            }
            theme.myWorker.postMessage(postWorkerData); // Start the worker.         
          }
          $(element).removeClass('ktlz').add("ktlz-loaded");
        }
      });
    };
    loadComplete = true;
    return loadDynamicVariants();
  }
  function KlzWorker(){
    KlzDynamicVariantsLoader();
  }
  if(load){return KlzWorker()}
})

theme.updateShipping = (function(){  
  window.parent.$ && window.parent.$.ajax({
    type: 'get',
    url: window.parent.location.pathname.split('/themes/')[0] + '/api/2019-04/shipping_zones.json',
  })
  .done(function(data) {
    console.log(data)
    // console.log("success");
    var list_zone = new Array;    
    $.each(data.shipping_zones, function(index, val) {
      $.each(val.countries, function(index, item) {
        let by_money = JSON.stringify((val.price_based_shipping_rates).concat(val.weight_based_shipping_rates)).match(/([0-9]+\.+[0-9]+)/g);
        let shipping_rates = JSON.stringify((val.price_based_shipping_rates).concat(val.weight_based_shipping_rates));
        $.each(by_money, function(index, val) {
          shipping_rates = shipping_rates.replace(val, theme.Currency.formatMoney(val.replace(/(\.)+(\d$)/g, '.'+'$2'+'0'),theme.moneyFormat))
        })
        let item_zone = {
          name: item.name.toLowerCase(),
          code: item.code,
          shipping_rates: shipping_rates
        };
        list_zone.push(item_zone)
      });
    });
    var contentPage = '{%-layout none-%}{%-capture listZone-%}';
    contentPage += JSON.stringify(list_zone);
    // console.log(list_zone)
    contentPage += '{%-endcapture-%}';
    contentPage += '{%- assign option_name = canonical_url | split: \'?q=\' | last | upcase -%}';
    contentPage += '{%- assign checkZone = \'"code":"\' | append: option_name | append: \'",\' -%}';
    contentPage += '{%- capture flag -%}"flag":"{%- include \'flags-svg\', code: option_name -%}",{%- endcapture -%}';
    contentPage += '{%- if listZone contains checkZone -%}';
    contentPage += '{%- assign zoneOptions = listZone | split: checkZone | last | split: \',{"name"\' | first | prepend: flag | prepend: checkZone | prepend: \'{\' | replace: \'}]"}]\', \'}]"}\' -%}';
    contentPage += '{%- endif -%}';
    contentPage += '{{zoneOptions}}';
    contentPage += '{%- unless zoneOptions -%}';
    contentPage += '{%- capture flag -%},"flag":"//cdn.shopify.com/s/assets/flags/fallback-f2f97b483f85d709c5e86ef4c82a768b79e1a3e19407c6ca68337a6a1e50e9f7.svg"{%- endcapture -%}';
    contentPage += '{%- if listZone contains \'"code":"*"\' -%}';
    contentPage += '{%- assign zoneOptions = listZone | split: \'"code":"*"\' | last | split: \',{"name"\' | first | prepend: flag | prepend: \'"code":"*"\' | prepend: \'{\'| replace: \'}]"}]\', \'}]"}\' -%}';
    contentPage += '{%- endif -%}';
    contentPage += '{{zoneOptions}}';
    contentPage += '{%endunless%}';
    window.parent.$ && window.parent.$.ajax({
      url:  window.parent.location.pathname.split('/editor')[0] + '/assets.json',
      type: 'PUT',
      data: {asset:  { key: 'templates/cart.listShipping.liquid', 'value': contentPage}},
    })
    .done(function() {
      if (window.parent && window.parent.Shopify.Flash && "function" === typeof window.parent.Shopify.Flash.notice) {
        window.parent.Shopify.Flash.notice("PUT listShipping Complete")
      }
    });
  })
  .fail(function() {
    console.log("error getLocation");
  })
  .always(function(data) {
    // console.log("complete");
  });
});

theme.updateResizeProductCard = (function(el){
  function updateLayout(mutationsList) {
   $('[data-section-type="masory-section"]').isotope('layout');
  }
  var listObserver_masorySection = new MutationObserver(updateLayout);
  $.each($('.product-body:not(.on_live)'), function(idx, el) {
    listObserver_masorySection.observe(this, { childList: true, subtree: true })
    $(this).addClass('on_live')
  });
})

theme.lazyListener = (function(container){
  var el = container !== undefined ? container + ' ' : '';
  if (lazy_firstLoad) {
    lazy_firstLoad = false;
    $.each($(el+'.lazyloaded[data-include]'), function(el, idx) {
      let $this = $(this);
      $this.find('.shopify-section').children().unwrap();
      if ($this.find('.swiper-slide').length >= 0) {
        KT.loadScript('swiper', function(e,l){
          if (l == 'ok') {
            theme.Swiper.init($this.parents('[data-section-type="swiper-section"]')[0]);
            theme.Swiper.init($this.find('[data-section-type="swiper-section"]')[0])
          }
        });
      } else {
        theme.checkProductGrid_Width();
        KT.countdown();
        if ($this.hasClass('loadvariant')) {
          theme.wokerktlz(true);
        }
      }

      //currency
      if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {        
        $('span.money').each(function() {
          $(this).attr('data-currency-'+shopCurrency, $(this).html());
        });
        Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
      }
      if($this.find('[data-mt-respon]').length > 0){
        KT.respSpaceSection();
      }
      $('.tab-content').css('height', '');
      if ($this.find('[name="checkout_url"]').length > 0) {
        $this.find('[name="checkout_url"]').val($this.data('checkout-url'));
      }
      //product review
      if ($(".shopify-product-reviews-badge").length > 0 && typeof window.SPR == 'function') {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
    });
  }
  $.each($(el+'.lazyload[data-include]:not(.lazyloaded)'), function(el, idx) {
    var component = this;
    var url = $(this).attr('data-include');
    if (url.indexOf('/collections/') === 0 || url.indexOf('/pages/') === 0 || url.indexOf('/products/') === 0 || url.indexOf('/cart?view=mobile-menu') === 0) {
      // $('head link').first().after('<link rel="prefetch" href="'+url+'">');
      var prefetch = document.createElement('link');
      prefetch.rel = "prefetch";
      prefetch.href = url;
      prefetch.onload = function() {
        $(this).remove();
      };
      headDocument.insertBefore(prefetch, firstLink);
    }
    component.addEventListener('lazyincluded', function(event) {
      let $this = $(this);
      if (event.detail.content) {
        $this.find('.shopify-section').children().unwrap();
        if (event.detail.content.indexOf('swiper-slide') >= 0) {
          KT.loadScript('swiper', function(e,l){
            if (l == 'ok') {
              theme.Swiper.init($this.parents('[data-section-type="swiper-section"]')[0]);
              theme.Swiper.init($this.find('[data-section-type="swiper-section"]')[0])
            }
          });
        } else {
          theme.checkProductGrid_Width();
          KT.countdown();
          if ($this.hasClass('loadvariant')) {
            theme.wokerktlz(true);
          }
        }

        //currency
        if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
          $('span.money').each(function() {
            $(this).attr('data-currency-'+shopCurrency, $(this).html());
          });
          Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
        }
        if($this.find('[data-mt-respon]').length > 0){
          KT.respSpaceSection();
        }
        $('.tab-content').css('height', '');
        if ($this.find('[name="checkout_url"]').length > 0) {
          $this.find('[name="checkout_url"]').val($this.data('checkout-url'));
        }
        //product review
        if ($(".shopify-product-reviews-badge").length > 0 && typeof window.SPR == 'function') {
          return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
        }
      }
    });
  });
});

window.theme = theme || {};
theme.cookiesPopup = (function() {
  function init(container) {
    var popup = $('.kt-cookies-popup');
    setTimeout(function() {
      popup.addClass('popup-display');
      popup.on('click', '.cookies-accept-btn', function(e) {
        e.preventDefault();
        acceptCookies();
      })
    }, 2500);

    var acceptCookies = function() {
      popup.removeClass('popup-display').addClass('popup-hide');
      localStorage.setItem("kt_cookies", "accepted")
    };
    if(localStorage.getItem("kt_cookies") == 'accepted') {
      popup.removeClass('popup-display').addClass('popup-hide');
    }
  }
  return init;
})();
theme.cookiesPopup.prototype = _.assignIn({}, theme.cookiesPopup.prototype, {
  onSelect: function(evt) {
    localStorage.removeItem("kt_cookies");
    $('.kt-cookies-popup').addClass('popup-display').removeClass('popup-hide');
  }
});

window.theme = theme || {};
theme.ageVerificationModal = (function() {
  function init(container) {    
    let ageVerificationModal = $("#ageVerificationModal");
    ageVerificationModal.on('show.bs.modal', function (e) {
    })
    ageVerificationModal.on('hidden.bs.modal', function (e) {
      sessionStorage.setItem('ageVerification', 'hide');
      $('html').removeClass('ageVerificationModal');      
      if ($('#hideforever_ageVerification').is(':checked')) {
        localStorage.setItem('ageVerification', 'hide');
      } else {
        localStorage.removeItem('ageVerification');
      }
    })
    if (ageVerification !== 'hide') {
      ageVerificationModal.modal({
        backdrop: 'static' 
      });
    }
    $(document).on('click', '.verification-failed-btn', function(event) {
      event.preventDefault();
      $('.verification-failed').show();
      ageVerificationModal.find('.btn,p,.custom-control').hide();
    });
  }
  return init;
})();
theme.ageVerificationModal.prototype = _.assignIn({}, theme.ageVerificationModal.prototype, {
  onSelect: function(evt) {
    localStorage.removeItem("ageVerification");
    sessionStorage.removeItem("ageVerification");
    $("#ageVerificationModal").modal({
      backdrop: 'static' 
    });
  }
});

window.theme = theme || {};
theme.footerSection = (function() {
  function init(container) {
    var btnToggle = 'footer .widget-title:not(.not_drop)';
    if(theme.window_W < 576){
      $(btnToggle).addClass('onHide').next().slideUp();
    }
    $(document).on('click',btnToggle,function(e){
      if(theme.window_W >= 576){return}
      e.preventDefault();
      $(this).toggleClass('onHide').next().toggle('slideUp');      
    });
  }
  return init;
})();

$(document).ready(function() {
  theme.lazyListener();
  theme.is_mobile = Modernizr.touchevents;
  theme.window_W = $(window).width();
  theme.window_H = $(window).height();
  theme.scrollbarWidth = theme.getScrollbarWidth();
  var sections = new theme.Sections();
  if ($('[data-section-type="swiper-section"]').length > 0) {
    KT.loadScript('swiper', function(e,l){
      if (l == 'ok') {
        sections.register('swiper-section', theme.SwiperSection);
      }
    });
  }
  sections.register('header-section', theme.HeaderSection);
  sections.register('footer-section', theme.footerSection);
  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('collection-filter', theme.Filters);
  sections.register('masonry-section', theme.MasonrySection);
  sections.register('instagram-section', theme.Instagram);
  sections.register('banner-section', theme.BannerSection);
  sections.register('banner-video-section', theme.BannerVideoSection);
  sections.register('countdown-section', theme.ktCountdown);
  sections.register('countto-section', theme.ktCountTo);
  sections.register('masory-section', theme.ProductsMasorySection);
  sections.register('banner-masonry',theme.BannerMasorySection.MasorySection);
  sections.register('kt-cookies', theme.cookiesPopup);  
  sections.register('kt-ageVerification', theme.ageVerificationModal);  
  sections.register('kt-newsletter-modal', theme.newsletterPopup);  
  sections.register('kt-lookbook', theme.lookBook);  
  theme.stockCountdown.init('.product-page .kt_progress_bar_pr');
  theme.variantChange();
  theme.menuBgChange();
  theme.Quantity();
  
  theme.MenuReposive.clone_main_menu();
  theme.MenuReposive.js_height_full();
  theme.MenuReposive.js_width_full();
  theme.DropdownReposive.init('.kiti--DropWindow','.kiti--DropItem','.kiti--DropInner');
  theme.DropdownReposive.init('#ProductSection-product-template .fake_select>ul','.color_sw','.title');
  if (templateName !== 'password') {
    theme.wokerktlz();
  }

  if (!Shopify.designMode) {
    if (theme.gadget.cookies_infor && localStorage.getItem("kt_cookies") !== 'accepted' && templateName !== 'password') {
      $.ajax({
        url: '/?section_id=cookies_popup',
        type: 'GET',
        dataType: 'html'
      })
      .done(function(data) {
        $('.content_for_extension').append(data);
        sections.register('kt-cookies', theme.cookiesPopup);  
      })
    }
  }
  KT.loadScript('color_sw', function(e,l){});
  if ($('[data-section-type="collection-template"]').length > 0) {
    KT.loadScript('pjax', function(e,l){
      if (l == 'ok') {
        theme.FiltersPjax();        
        var prefetch = document.createElement('link');
          prefetch.type = "xhr";
          prefetch.rel = "prefetch";
          prefetch.href = $('.collection-products .btn-loadmore').attr('href') + '&_pjax=.product-listing-loadmore';
          prefetch.onload = function() {
            $(this).remove();
          };
        headDocument.insertBefore(prefetch, firstLink);
      }
    })
  }
  theme.checkProductGrid_Width();
});

$(window).on("resize", function() {
  theme.is_mobile = theme.MenuReposive.is_mobile();
  theme.window_W = $(window).width();
  theme.window_H = $(window).height();
  theme.scrollbarWidth = theme.getScrollbarWidth();

  if($('#header-ontop .ResizedNavMegaScroll').length > 0){
    $('#header-ontop .ResizedNavMegaScroll').removeClass('ResizedNavMegaScroll')
  }
  if($('.kt_layerfilterGroupsMobile').length > 0){
    if (theme.window_W >= 768 && $('.kt_layerfilterGroupsMobile').html() != ''){
      $('.kt_layerfilterGroupsDesktop').html($('.kt_layerfilterGroupsMobile').html())
    }
    else if(theme.window_W < 768 && $('.kt_layerfilterGroupsDesktop').html() != ''){
      $('.kt_layerfilterGroupsMobile').html($('.kt_layerfilterGroupsDesktop').html())
    }
  }
  theme.ResizeNavMega.init();
  theme.MenuReposive.clone_main_menu();
  
  theme.MenuReposive.js_height_full();
  theme.MenuReposive.js_width_full();
  theme.DropdownReposive.init('.kiti--DropWindow','.kiti--DropItem','.kiti--DropInner');
  theme.DropdownReposive.init('#ProductSection-product-template .fake_select>ul','.color_sw','.title');
});
$(window).resize($.throttle( 250, theme.checkProductGrid_Width));

$(window).scroll(function(){
  if(theme.window_W < 768 && !theme.attrTheme || theme.window_W >= 768 && theme.attrTheme){
    if(theme.attrTheme){theme.attrTheme = false}else{theme.attrTheme = true}
    $.ajax({
      type: "POST",
      url: '/cart.js',
      data: {"attributes[theme_mobile]": theme.attrTheme},
      dataType: 'json'});
  }
});

if ($('.kt_layerFilterJS a[data-action="infinity"]').length > 0){
  $(window).scroll($.throttle( 250,theme.clickOnScrollButton));
}
if ($('#header-ontop .header').length <= 0 && $('[data-section-id="header"]').data('header-sticky') === true) {
  $(window).scroll($.throttle( 250, theme.MenuReposive.clone_header_ontop));
  $(window).resize($.throttle( 250, theme.MenuReposive.clone_header_ontop));
}
theme.init = function() {
  theme.customerTemplates.init();

  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  $('[data-toggle="tooltip"]').tooltip()

  $(document).on("click", ".back-toggle", function(e) {
    setTimeout(function() {document.referrer !== '' ? history.back() : location.href = '/'}, 100)
  });
  if(Shopify.designMode && createPagesByTheme){
    let pages = [
      {
        "title": "Vertical menu Builder",
        "handle": "vertical-menu",
        "template_suffix": "vertical-menur"
      },
      {
        "title": "Products recently viewed",
        "handle": "recently-viewed",
        "template_suffix": "recently_viewed"
      },
      {
        "title": "Products Wishlist",
        "handle": "wishlist",
        "template_suffix": "wishlist"
      },
      {
        "title": "Edit additional information",
        "handle": "edit-additional-information",
        "template_suffix": "prd-additional"
      }
    ];
    pages.forEach(function(page) {
      window.parent.$ && window.parent.$.ajax({
        url: window.parent.location.pathname.split('/themes/')[0] + '/api/2019-04/pages.json',
        type: 'POST',
        data: {"page": page}
      })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    })
  }
  if(Shopify.designMode){    
    // Reset cart attributes
    if(theme.cartAttributes.length > 1){
      $.ajax({
        type: "POST",
        url: '/cart.js',
        data: {
          "attributes": {
            "theme_align":'',
            "theme_light":'',
            "theme_coll_layout":''
          }
        },
        dataType: 'json',
        success: function() {}
      });
    }
    
    // Buttons admin Extensions
    let $top = $(top.document);
    let $action_list = $top.find('.te-panel__footer .ui-action-list').first();
    if($action_list.find('#ktImport').length == 0 ){
      $action_list.prepend('<li><a href="#" id="ktImport" class="theme-editor-action-list__item">Import demo<span style="float: right;width: 18px;height: 18px;" class="next-icon--import-blue"></span></a></li><li class="theme-editor-action-list__item--separator"></li>');
      $action_list.prepend('<li><a href="#" id="ktTools" class="theme-editor-action-list__item">More Tools<span style="float: right;width: 18px;height: 18px;" class="next-icon--theme-settings-blue"><span></a></li>');
      $action_list.prepend('<li><a href="#" id="ktUpdateShipping" class="theme-editor-action-list__item" style="white-space: nowrap;">Update Shipping rates</a></li>');
    }
    var $importBtn = window.top.document.querySelector('#ktImport');
    $importBtn.addEventListener('click',function(){
      if($("#adminThemeCss-css").length == 0){
        if (window.parent && window.parent.Shopify.Flash && "function" === typeof window.parent.Shopify.Flash.notice) {
          window.parent.Shopify.Flash.notice("Loading ...")
        }
        KT.loadScript('adminThemeCss', function(e,l){});
      }
      if($("#modal-container").length == 0){
        $.ajax({
          url: 'https://'+Shopify.shop+'/?section_id=adminThemeTool',
          type: 'GET'
        })
        .done(function(data) {
          // console.log("success");
          $('.content_for_footer').append(data);
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          // console.log("complete");
        });
      } else {
        $('.float-btn-group').first().toggleClass('open');
        $('body').first().toggleClass('modal-active');
      }
    });
    var $toolsBtn = window.top.document.querySelector('#ktTools');
    $toolsBtn.addEventListener('click',function(){
      if(window.parent.document.getElementById("t4_import_submit") == null){
        if (window.parent && window.parent.Shopify.Flash && "function" === typeof window.parent.Shopify.Flash.notice) {
          window.parent.Shopify.Flash.notice("Loading ...")
        }
        $.ajax({
          type: "GET",
          url: '/cart?view=t4-import-tags&design_theme_id='+Shopify.theme.id,
          dataType: 'html',
          success: function(data) {
            $top.find('.te-preview').append(data).addClass('open-import');
          }
        });
      } else {
        $top.find('.te-preview').addClass('open-import');
      }
    });
    
    // Button update shipping
    var $updateShippingbtn = window.top.document.querySelector('#ktUpdateShipping');
    $updateShippingbtn.addEventListener('click',function(){
      theme.updateShipping();
      if (window.parent && window.parent.Shopify.Flash && "function" === typeof window.parent.Shopify.Flash.notice) {
        window.parent.Shopify.Flash.notice("Loading ...")
      }
    });
    if (theme.role === 'the4') {
      window.parent.$ && window.parent.$.ajax({
        type: "PUT",
        url: window.parent.location.pathname.split('/themes/')[0] + '/api/2019-07/themes/'+Shopify.theme.id+'.json',
        dataType: 'json',
        data: {
          "theme": {
            "id": Shopify.theme.id,
            "role": "unpublished"
          }
        },
        success: function(data) {
          // console.log(data)
        }
      });
    }

    // Buttons admin PopupEditor
    // window.top.document.querySelector('.theme-setting__input--textarea').addEventListener('focus',function(){
    //   console.log(1)
    // })
  }
  // window.addEventListener('beforeinstallprompt', (e) => {
  //   // Stash the event so it can be triggered later.
  //   deferredPrompt = e;
  //   // Update UI notify the user they can add to home screen
  //   alert(1)
  // });
  console.info("%c ---------------------------------------------------------------------------------","color: #5c6ac4;")
  console.info("%c ------------- Molla - Multipurpose Responsive Shopify Theme by The4 -------------","color: #5c6ac4;")
  console.info("%c https://themeforest.net/item/molla-multipurpose-responsive-shopify-theme/24901908","color: #5c6ac4;")
  console.info("%c ---------------------------------------------------------------------------------","color: #5c6ac4;")
};

$(theme.init);