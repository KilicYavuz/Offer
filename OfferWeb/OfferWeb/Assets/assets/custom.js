$ = $jqMolla;
(function($) {
  "use strict";
  /* ---------------------------------------------
  SEARCH
   --------------------------------------------- */
  KT.ajaxSearch = function(){
    if(theme.function.searchAjax === false){return false};
    let $current_search;
    function init(element){
      clearTimeout($current_search);
      let $val = element.val();
      let $this = element.parents('form.box-search');
      let $typeSearch = theme.function.searchAjaxTypes;
      let $url = '';
      let searchByCollection = theme.function.searchByCollection;
      if($val.trim() == '') {
        $this.removeClass('loading loaded');
        $this.find(".livesearch").html('');
        return false;
      }else{
        if (searchByCollection) {
          let $thisLiSelected = $this.find(".searchCat");
          if($thisLiSelected.val() !== ''){
            $val = $thisLiSelected.val() || '' + $this.find("input.search").val();
          }
        }
        $this.find(".livesearch").html('');
        $this.addClass('loading').removeClass('loaded');
        $current_search = setTimeout(function(){
          $.getJSON("/search/suggest.json", {
            "q": $val,
            "resources": {
              "type": $typeSearch,
              "options": {
                "unavailable_products": "last",
                "fields": "title,product_type,variants.title,vendor,tag"
              }
            }
          }).done(function(response) {
            let articles = response.resources.results.articles;
            let pages = response.resources.results.pages;
            let products = response.resources.results.products;
            let htmlResult = '';
            if (products.length > 0) {
              $.each(products, function(index, prd) {
                htmlResult += productLayout(prd);
              });
            }
            if (pages.length > 0) {
              htmlResult += '<li class="item-search pages_obj">';
                htmlResult += '<div class="name_type">'+theme.strings.search_dropdown_pages+'</div>';
                htmlResult += '<ul>';
                $.each(pages, function(index, page) {
                  htmlResult += pageLayout(page);
                });
                htmlResult += '</ul> ';
              htmlResult += '</li> ';
            }
            if (articles.length > 0) {
              htmlResult += '<li class="item-search pages_obj">';
                htmlResult += '<div class="name_type">'+theme.strings.search_dropdown_articles+'</div>';
                htmlResult += '<ul>';
                $.each(articles, function(index, article) {
                  htmlResult += articleLayout(article);
                });
                htmlResult += '</ul>';
              htmlResult += '</li>';
            }
            if (htmlResult === ''){
              htmlResult += '<li class="col-12"><h6 class="mb-0">'+theme.strings.search_dropdown_no_results+'</h6></li>';
            }
            $this.find(".livesearch").html(htmlResult);
            $this.removeClass('loading').addClass('loaded');
            if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
              Kt_currency.convertAll(shopCurrency,localStorageCurrency,'span.money');
            }
          })
        }, 400);
      }
    }
    function productLayout(product) {
      let html = ''
      html += '<li class="item-search">';
        html += '<a href="'+product.url+'">';
          html += '<div class="thumb">';
          if(product.image){
            html += '<img src="'+theme.Images.getSizedImageUrl(product.image, '240x240_crop_center')+'" alt="'+product.title+'">';
          }
          html += '</div>';
          html += '<div class="product-info">';
            html += '<h4 class="product-name">'+product.title+'</h4>';
            html += '<div class="product-description">';
            html += '</div>';
            html += '<div class="rating">';
              html += '<span class="shopify-product-reviews-badge" data-id="'+product.id+'"></span>';
            html += '</div>';
            html += '<span class="price">';
              html += '<ins>'+theme.Currency.formatMoney(product.price, theme.moneyFormat)+'</ins>';
              if(product.compare_at_price > product.price){
              html += '<del>'+theme.Currency.formatMoney(product.compare_at_price, theme.moneyFormat)+' </del>';
              }
            html += '</span>';
          html += '</div>';
        html += '</a>';
      html += '</li> ';
      return html;
    }
    function pageLayout(page) {
      let html = ''
      html += '<li>';
        html += '<a href="'+page.url+'">';
        html += page.title;
        html += '</a>';
      html += '</li> ';
      return html;
    }
    function articleLayout(article) {
      let html = ''
      html += '<li>';
        html += '<a href="'+article.url+'">';
        html += article.title;
        html += '</a>';
      html += '</li> ';
      return html;
    }
    $(document)
    .on('keyup','.box-search input.search', function(event) {
      event.preventDefault();
      let $this = $(this);
      $("input.search").not($this).val($this.val());
      init($this)
    })
    .on('click','.box-search.show input.search', function(event) {
      event.preventDefault();
      let $this = $(this);
      let $val_input = $(this).val();
      if ($val_input === '' || $this.parents('.box-search.show').find('.livesearch li').length > 0) {return false}
      init($this)
    })
    .on('change','.box-search .searchCat', function(event) {
      event.preventDefault();
      let $this = $(this);
      let $val_input = $(this).val();
      if ($val_input === '' || $this.parents('.box-search.show').find('.livesearch li').length > 0) {return false}
      init($this)
    });
  }
  
  /* ---------------------------------------------
    Search By cattegories
    kitisummus@gmail.com
   --------------------------------------------- */
  function kt_search(){
    if (!theme.function.searchByCollection) {return false}
    //Search Box
    $(document)
    .on('submit', "form.box-search", function(event){
      let $this = $(this);
      let $thisLiSelected = $this.find(".searchCat");
      if($thisLiSelected.length > 0 && $thisLiSelected.val() !== ''){
        let inputValue = $thisLiSelected.val() + $this.find("input.search").val();
        $("input.search").val(inputValue);
      }
      return;
    });

    //Search By cattegories
    function searchDrop(el){
      if ($(el).parents('.box-search').hasClass('focus') === false) {
        $(el).parents('.box-search').addClass('focus');
      }
    }
    $(document)
    .on("focus",".box-search input.search",function(evt) {
      searchDrop(this);
    })
    .on("click",".searchDrop",function(evt) {
      searchDrop(this);
    })
    .on('keydown', 'input.search', function(evt){
      if(evt.which == 13) {
        $(this).closest('form').submit();
      }
    })
    .on('click', function(e){ 
      if ($(e.target).is('.box-search') === false && $(e.target).is('.box-search *') === false) {
        $('.box-search').removeClass('loaded');
        $('.livesearch').empty();
      }
      if ($(e.target).is('.box-search input') === false) {
        $('.box-search').removeClass('focus').removeClass('showCatt')
      }
    });
  }
    
  /* ---------------------------------------------
   QUICKVIEW
   --------------------------------------------- */
  function kt_quickView(){
    $(document).on('click', '.quick-view', function(event) {
      event.preventDefault();
      let $this = $(this);
      let $myModal = $("#myModal");
      var url = $this.attr('data-view').split('?')[0];
      let vr_id = $(this).parents('.product-inner').find('input[name="id"]').val();
      $this.addClass('loading');
      if ($myModal.attr('data-view') == url) {
        $this.removeClass('loading');
        $myModal.modal();
        return false;
      }
      $('#sizeGuide_and_shipping').remove();
      $.ajax({
        url: url+'?variant='+vr_id+'&view=quickView',
        type: 'GET',
        beforeSend:function(){
        },
        success: function(data){
          $('.product-quickview-content').html(data.split('<!-- sizeGuide_and_shipping -->')[2]);
          var sizeGuide_and_shipping = data.split('<!-- sizeGuide_and_shipping -->')[1];
          $('body').append('<div id="sizeGuide_and_shipping">'+sizeGuide_and_shipping+'</div>');
          $this.removeClass('loading');
          var sections = new theme.Sections();
          sections.register('productQuickview', theme.Product);
          theme.stockCountdown.init('#ProductSection-quickview-template .kt_progress_bar_pr');
          theme.DropdownReposive.init('#ProductSection-quickview-template .fake_select>ul','.color_sw','.title');
          if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
            Kt_currency.convertAll(shopCurrency,localStorageCurrency,'.product-quickview-content span.money');
          }
          $myModal.attr('data-view',url).modal();
          $('.prefetch-product').remove();
          $('head link').first().after('<link class="prefetch-product" rel="prefetch" href="'+url+'">');
          if ($(".product-quickview-content .shopify-product-reviews-badge").length > 0 && typeof window.SPR == 'function') {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
          }
        }
      });
    });
  }

  /* ---------------------------------------------
   QUICKSHOP
   --------------------------------------------- */
  function kt_quickShop(){
    $(document).on('click', '.kt__quick-shop', function(event) {
      event.preventDefault();
      let $this = $(this);
      let pr_item = $this.closest('.product-item');
      let formJS = pr_item.find('form[data-section-id]');

      $('#bg-overlay').attr('data-form', '#qsShowUp');

      let img_qs = '<div class="'+pr_item.find('.product-thumb')[0].className+'">';
      img_qs += pr_item.find('.aspectRatio')[0].outerHTML;
      img_qs += '</div>';

      let info_qs = '<div class="product-body">';
      info_qs += pr_item.find('.product-name')[0].outerHTML;
      info_qs += pr_item.find('.product-price')[0].outerHTML;
      info_qs += '</div>';

      let variants_qs = '';
      variants_qs += '<div class="product-variants-wrapper product-variants-wrapper-qs">';
        variants_qs += '<div class="prd-variants">';
        variants_qs += formJS.find('.prd--option1').length ? formJS.find('.prd--option1')[0].outerHTML : '';
        variants_qs += formJS.find('.prd--option2').length ? formJS.find('.prd--option2')[0].outerHTML : '';
        variants_qs += formJS.find('.prd--option3').length ? formJS.find('.prd--option3')[0].outerHTML : '';
        variants_qs += formJS.find('[name="id"]').length ? formJS.find('[name="id"]')[0].outerHTML : '';
        variants_qs += formJS.find('[name="quantity"]').length ? formJS.find('[name="quantity"]')[0].outerHTML : '';
        variants_qs += '</div>';
      variants_qs += '</div>';

      let button_qs = '';
      button_qs += '<div class="product-button-wrapper-qs">';
        button_qs += '<button type="submit" class="btn btn-primary btn-onclick product_type_variable add_to_cart_button addItemAjax w-100" data-pid="'+formJS.attr('data-p-id')+'" data-vrid="'+pr_item.find('[name="id"]').val()+'">';
        button_qs += '<i class="fkt-cart-plus fkt-lg"></i>';
        button_qs += '<span class="text-nowrap addItemAjax-text text-uppercase">'+theme.strings.addToCart+'</span>';
        button_qs += '</button>';
      button_qs += '</div>';

      let body_qs = '';
      let ktlz_qs = formJS.attr('data-pr-vrs') === '' ? ' ktlz' : '';
      body_qs += '<div id="qsShowUp" class="modalShowUp">';
        body_qs += '<div class="product-item showUp">';
        body_qs += '<div class="alert-top"></div><div class="close-qs showUp" data-form="#qsShowUp"><i class="fkt-close" aria-hidden="true"></i></div>';
        body_qs += '<div class="product product-inner'+ ktlz_qs +'" data-href="'+pr_item.find('.product-inner').attr('data-href')+'" data-ktlz="instant">';
        body_qs += '<form method="post" action="/cart/add" data-pr-vrs="" id="'+formJS.attr('id')+'-qs" data-section-id="'+formJS.attr('data-section-id')+'-qs" class="ktlz-form-pid-'+formJS.attr('data-p-id')+'" data-options="'+formJS.attr('data-options')+'">';
        body_qs += '<div class="row">';
        body_qs += '<div class="col-4">'+img_qs+'</div>';
        body_qs += '<div class="col-8">'+info_qs+'</div>';
        body_qs += '</div>';
        body_qs += variants_qs+button_qs;
        body_qs += '</form>';
        body_qs += '</div>';
        body_qs += '</div>';
      body_qs += '</div>';
      $('body').append(body_qs);
      $('#'+formJS.attr('id')+'-qs').attr('data-pr-vrs',formJS.attr('data-pr-vrs'));
      pr_item = $('#qsShowUp');

      pr_item.find('.product-variants-wrapper-qs ul._small').removeClass('_small');
      $('#qsShowUp').css('position','fixed');
      anime({targets: '#qsShowUp',duration: 0,easing: 'linear',bottom:'-100%',left: '50%',backgroundColor: '#fff',zIndex: 1042,width: '100%',maxWidth: '480px',minHeight: '250px',
        complete: function(anim) {
          pr_item.addClass('showUp');
          $('#bg-overlay').addClass('showUp');
          if ($(window).width() < 768) {
            $(pr_item).animate({bottom: 0}, 500);
          }
          else{
            $(pr_item).animate({bottom: '50%'}, 500);
          }
          $this.removeClass('loading');
          if(ktlz_qs !== ''){theme.wokerktlz(true);}
          $('body').css({overflow:'hidden',marginRight: theme.getScrollbarWidth()});
          $('.prefetch-product').remove();
          $('head link').first().after('<link class="prefetch-product" rel="prefetch" href="'+pr_item.find('.product-name a').attr('href')+'">');
        }
      });
    });
  }

  /* ---------------------------------------------
   PRODUCT GRID ADD MORE
   --------------------------------------------- */
  KT.addmoreGrid = function(){
    function init(elem) {
      $('#amShowUp').remove();
      var $this = elem;
      if ($this.closest('.product-inner').length) {
        var pr_item = $this.closest('.product-inner');
        var formJS = pr_item.find('form[data-section-id]');
        var url = $this.attr('data-view').split('?')[0];
        var crVr = $this.attr('data-vrid');
        var fea_image = $this.closest('.product-inner').find('.product-thumb .primary-thumb').attr('data-ogr');
      }
      if ($this.hasClass('product-variable__cart-drawer')) {
        var formJS = $this.closest('.item__cart-drawer').find('form[data-section-id]');
        var url = $this.attr('data-view');
        var crVr = $this.attr('data-vrid');
        var fea_image = $this.attr('data-ogr');
        theme.is_mobile ? $('.close__cart-drawer').trigger('touchstart') : $('.close__cart-drawer').trigger('click');
      }
      $('body').append('<div id="amShowUp" class="p-style-01 modalShowUp"><div class="close-qs showUp" data-form="#amShowUp"></div><div id="amShowUpJSON" data-featured-image="'+fea_image+'"></div>'+theme.variantsAddMore.init(formJS,url,crVr)+'</div>');
      pr_item = $('#amShowUp');
      $('#bg-overlay').attr('data-form', '#amShowUp');
      pr_item.css({'position':'fixed' ,bottom:'-100%',left: '50%'});
      anime({targets: '#amShowUp',duration: 0,delay: $this.hasClass('product-variable__cart-drawer') ? 500 : 0,easing: 'linear',backgroundColor: '#fff',zIndex: 1042,width: '100%',maxWidth: '768px',minHeight: '250px',
        complete: function(anim) {
          pr_item.addClass('showUp');
          $('#bg-overlay').addClass('showUp');
          if ($(window).width() < 768) {
            pr_item.animate({bottom: 0}, 500);
          }
          else{
            pr_item.animate({bottom: '50%'}, 500);
          }
          $this.removeClass('loading');
          $('body').css({overflow:'hidden',marginRight: theme.getScrollbarWidth()});
        }
      });
      $(document).on('change', '.qty[name="quantity"]',function() {
        var qty = $(this).val();
        var price = parseInt($(this).attr('data-price'));
        $(this).closest('tr').find('.price ins').html(theme.Currency.formatMoney(price*qty, theme.moneyFormat));        
        if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
          Kt_currency.convertAll(shopCurrency,localStorageCurrency,'#amShowUp .list-vrs span.money');
        }
      });
    }
    function on_click() {
      $(document).on('click','.addMoreItemAjax', function(event){
        event.preventDefault();
        KT.addmoreGrid().init($(this));
      });
      $(document).on('click','.addItemsBasic', function(event){
        event.preventDefault();
        KT.addItemFromFormAddMore('#amShowUp');
      });
      $(document).on('click','#amShowUp .btn-addmore', function(event){
        var prVrs = $('#amShowUpJSON').data('pr-vrs');
        theme.variantsAddMore.buildSelect(prVrs,parseInt($(this).attr('data-vrid')));
      });
      $(document).on('click','#amShowUp .change-d', function(event){
        $(this).closest('tr').toggleClass('chane-d-ed');
      });
    }
    return {init:init,on_click:on_click};
  }
    
  /* ---------------------------------------------
   WISHLIST
   --------------------------------------------- */
  // Add wishlist
  function addwishlist() {
    $("body").on('click', '.kt-wishlist', function(event) {
      if ($(this).attr('data-action') == undefined) {
        if($('#accountModal').length > 0) {
          $('#accountModal').modal();
        } else {
          window.location.href = $(this).attr('href');
        }
        return false;
      }
      event.preventDefault();
      var $this = $(this);
      $this.addClass('loading');
      $.ajax({
        url: 'https://nitro-wishlist.teathemes.net?shop='+ Shopify.shop,
        type: 'POST',
        data: $this.data(),
        success: function(data, status) {
          try {
            data = $.parseJSON(data);
          } catch(ex) {
            //console.log(ex);
          }
          if(data.status == 'success' && status == 'success') {
            $this.removeClass('loading').addClass('added').attr('data-action','view').attr('href', '/pages/wishlist');
            $this.find('.btn-name').text(theme.productStrings.viewWishlist);
            $('.wishlistCount').html(function(i, val) {
              return val * 1 + 1
            });
          } else {
            $this.removeClass('loading');
            console.log(data.message);
          }
        },
        error: function(data) {
          $this.removeClass('loading');
          console.log('ajax error');
        },
      });
    });
  }
  // Remove wishlist
  function removewishlist() {
    $("body").on('click', '.nitro_wishlist_remove', function(event) {
      event.preventDefault();
      var $this = $(this),
          value = $(this).data('id');
      $('.wishlist-page .card').css('opacity','1');
      $.ajax({
        url: 'https://nitro-wishlist.teathemes.net?shop='+ Shopify.shop,
        type: 'POST',
        data: $this.data(),
        success: function(data, status) {
          try {
            data = $.parseJSON(data);
          } catch(ex) {
            //console.log(ex);
          }
          if(data.status == 'success' && status == 'success') {
            $('.wishlistCount').html(function(i, val) {
              return val * 1 - 1
            });
            $('#WishItem-' + value).fadeOut(300, function(){
              $(this).remove();
              var rowCount = $('.wishlist-page-items .wishlist-page-item').length;
              if(rowCount == 0) {
                $('.table-wishlist').hide();
                $('.wishlist-empty').show();
              }
            });
            $('.wishlist-page .card').css('opacity','0');
          } else {
            $('.loader').remove();
            console.log('ajax error');
          }
        },
        error: function(data) {
          $('.loader').remove();
          console.log('ajax error');
        },
      });
    });
  }
  
  /* ---------------------------------------------
   RECENTLY VIEWED
   --------------------------------------------- */
  // Add to recently
  function recentlyViewedAdd() {
    if($('#shopify-section-kt_recentlyViewedProducts').length <= 0 || $('#ProductSection-product-template').length <= 0){return false}
    var arrayProduct = localStorage.getItem("kt-recent") !== null ? localStorage.getItem("kt-recent").split(',') : new Array;
    if(product_handle !== null){
      var c = _handleize(product_handle);
      if(arrayProduct.indexOf(c)< 0 ){
        if(arrayProduct.length >= 10){
          arrayProduct.pop();
        }
        arrayProduct[arrayProduct.length]= (c);
        arrayProduct = arrayProduct.toString();
        localStorage.setItem("kt-recent", arrayProduct);
      }
    }
  }
  // recentlyViewedProductSingle
  window.recentlyViewedProductSingle = function() {
    if($('#shopify-section-kt_recentlyViewedProducts').length > 0){
      var stringProduct = localStorage.getItem("kt-recent") || '';
      var arrayProduct = stringProduct.split(',');
      if(localStorage.getItem("kt-recent") !== null){
        var arrayProduct = arrayProduct.reverse();
        $('#shopify-section-kt_recentlyViewedProducts .load_recent').attr('data-include', canonical_url+'?q='+arrayProduct.join("+")+'&view=recently&design_theme_id=kiti').addClass('lazyload');
        theme.lazyListener('#shopify-section-kt_recentlyViewedProducts');
      }
    }
  }
  
  /* ---------------------------------------------
   COMPARE
   --------------------------------------------- */
  function AutoloadCompare(){
    var stringProduct = localStorage.getItem("kt-compare");
    if(stringProduct != null && stringProduct.length !== 0){ 
      var arrayProduct = stringProduct.split(',');
      $('.compareCount').text(arrayProduct.length);
      $('.no-compare').hide();
      arrayProduct.map(function(index, elem) {
        $(".compare[data-pid='"+index+"']").addClass('added');
      });
      if($('.mini-compare-content').length){
        $(document).on('mouseenter', '.mini-compare .icon-link', function() {
          if ($('.mini-compare').hasClass('load')) {
            $('.mini-compare').removeClass('load');
            $(this).find('.kt-button').addClass('loading');
            KT.loadMiniCompare();
          } else {
            return
          }
        });
      }
    } else {
      $('.no-compare').show();
    }
  }
  function AddCompare(){
    $('body').on('click', '.compare', function(event) {
      event.preventDefault();
      if($(this).hasClass('added') && $("#compare-content").find('.product-description').length > 0){
        $("#compare-modal").modal('show');
        return false;
      }
      /* Act on the event */
      var $this = $(this),
          handle = $this.data('pid'),
          holder = $("#compare-content"),
          stringProduct = localStorage.getItem("kt-compare");
      $this.addClass('loading');
      if(stringProduct !== null && stringProduct.length > 1){ 
        var arrayProduct = stringProduct.split(',');
      }else{
        var arrayProduct = new Array;
      }
      if(arrayProduct.indexOf(handle)< 0 && $(this).hasClass('added') === false ){
        arrayProduct.push(handle);
        if (arrayProduct.length > 1) {
          var arrayProduct_ = arrayProduct.join(',');
          if (arrayProduct_.substring(0, 1) == ',') { 
            arrayProduct_ = arrayProduct_.substring(1);
          }
        }else{
          arrayProduct_ = arrayProduct.toString();
        }
        $('.compareCount').text(arrayProduct.length);
        localStorage.setItem("kt-compare", arrayProduct_);
      }      
      $('.no-compare').hide();
      KT.showModalCompare(handle);
      KT.loadMiniCompare();
      setTimeout(function() {
        $this.removeClass('loading').addClass('added');
      }, 1000);
    });
  }
  function RemoveCompare(){
    $(document).on('click', '.compare-remove', function(event) {
      event.preventDefault();
      var $this = $(this), handle = $this.attr('data-pid');
      $('.compare[data-pid="'+handle+'"]' ).removeClass('added');
      var list_handle = localStorage.getItem("kt-compare");      
      if(list_handle !== null){ 
        var arrayProduct = list_handle.split(',');
      }
      arrayProduct = $.grep(arrayProduct, function(value) {
        return value != handle;
      });
      arrayProduct = $.trim(arrayProduct);        
      $('.compareCount').text(arrayProduct.length);
      localStorage.setItem("kt-compare", arrayProduct.toString());
      anime({targets: '.cp-'+handle, opacity: 0,duration: 300,easing: 'linear',complete: function(anim) {$('.cp-'+handle).remove()}});
      if(arrayProduct.length === 0 ){
        $('.no-compare').show();
        $(".mini-compare-content .mini-compare-body").hide(0);
      }
    });
    $(document).on('click', '.compare-remove-all', function(event) {
      event.preventDefault();
      let list_handle = localStorage.getItem("kt-compare").split(',');
      list_handle.map(function(handle, idx) {
        $('.cp-'+handle).remove();
      })
      localStorage.removeItem("kt-compare");
      $('.no-compare').show();
      $(".mini-compare-content .mini-compare-body").hide(0);
    });
  }
  KT.showModalCompare = function(p_handle){
    if($("#compare-content").find('.'+p_handle).length > 0 || localStorage.getItem("kt-compare") == null || localStorage.getItem("kt-compare").length === 0){
      $("#compare-modal").modal('show');
      return false;
    }
    if(p_handle === 'kiti' && $("#compare-content .compare-remove").length){
      $("#compare-modal").modal('show');
      return false;
    }
    var list_handle = localStorage.getItem("kt-compare").split(',');
    $("#compare-content").css({'overflow-y':'auto','max-height':$(window).outerHeight() - 30});
    $("#compare-content").attr('data-include','/collections/all?view=compare&q='+localStorage.getItem("kt-compare")).addClass('lazyload');
    $("#compare-modal").modal('show');
  }
  KT.loadMiniCompare = function(){
    let list_handle = localStorage.getItem("kt-compare").split(',');
    if(list_handle != null && list_handle.length !== 0){
      $(".mini-compare-content .mini-compare-body").show(0);
      let html = '';
      html += '<ul class="compare-products"></ul>';
      html += '<div class="compare-actions">';
        html += '<a href="javascript:void(0)" class="compare-remove-all action-link">Clear All</a>';
        html += '<a href="javascript:void(0)" class="btn btn-outline-primary-2" onclick="KT.showModalCompare(\'kiti\')"><span>Compare</span><i class="fkt-long-arrow-right"></i></a>';
      html += '</div>';
      $(".mini-compare-content .mini-compare-body").html(html);
      list_handle.map(function(handle, idx) {
        if (handle !== '' && handle !== null) {
          KT.getProduct(handle,function(prd){
            let html_item = '';
            html_item += '<li class="compare-product cp-'+prd.handle+'">';
              html_item += '<a href="javascript:void(0)" class="compare-remove btn-remove fkt-close" data-pid="'+prd.handle+'" title="Remove Product"></a>';
              html_item += '<h4 class="compare-product-title"><a href="'+prd.url+'">'+prd.title+'</a></h4>';
            html_item += '</li>';
            $(".mini-compare-content .compare-products").append(html_item);
            if (idx+1 === list_handle.length) {
              $('.mini-compare .kt-button').removeClass('loading');
            }
          })
        }
      });
    }else{
      $(".mini-compare-content .mini-compare-body").hide(0);
      $('.mini-compare .kt-button').removeClass('loading');
    }
  }

  /* ---------------------------------------------
   CSS BANNER WAIT
   --------------------------------------------- */  
  function css_banner_builded(){
    let css_banner = '';
    let array_banner = new Array;
    $('.banner-css').each(function(){
      let sectionType = $(this).data().sectionType;
      if (array_banner.indexOf(sectionType) >= 0) {return}else{array_banner.push(sectionType)}
      let item_css = $(this)[0].innerText;
      item_css = item_css.replace('<style>','');
      item_css = item_css.replace('<style data-shopify>','');
      item_css = item_css.replace('</style>','');
      css_banner += item_css.replace(/(\r\n|\n|\r|\s\s)/gm, "");
    });
    if ($('.css_banner_builded').length == 0) {
      $('script').first().before('<style class="css_banner_builded">'+css_banner+'</style>');
    }else{
      $('.css_banner_builded').html(css_banner)
    }
    $('.wait-for-css').removeClass('wait-for-css');
  }

  /* ---------------------------------------------
   ACCOUNT FORM ERORR
   --------------------------------------------- */
  function customize_error(){
    $('#error_html .errors').detach().appendTo('.error_html_clone');
  }

  /* ---------------------------------------------
   NEWSLETTER FORM
   --------------------------------------------- */

  KT.register = function($form) {
    $form.find('[id|="mc-embedded-subscribe"]').addClass('loading');
    $form.find('.close__').hide();
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
      cache: false,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      error: function (err) { alert(theme.strings.nll_error_mesenger) },
      success: function (data) {
        $form.find('[id|="mc-embedded-subscribe"]').removeClass('loading');
        if (data.result === 'success') {
          // Yeahhhh Success
          // console.log(data.msg)
          $form.find('.msg.error').remove();
          $('.kt-popup-newsletter .notice').hide();
          if ($form.find('.msg.success').length > 0) {
            $form.find('.msg.success').html((theme.strings.nll_success_mesenger).replace('<span class=\"code\"></span>', '<span class=\"code\">'+$form.attr('data-kt')+'</span>'));
          }else{
            $form.prepend('<p class="msg success margin-bottom-10" style="color: rgb(53, 114, 210)">'+(theme.strings.nll_success_mesenger).replace('<span class=\"code\"></span>', '<span class=\"code\">'+$form.attr('data-kt')+'</span>')+'</p>')
          }
        } else {
          // Something went wrong, do something to notify the user.
          $form.find('.msg.success').remove();
          if ($form.find('.msg.error').length > 0) {
            $form.find('.msg.error').html(data.msg.substring(4))
          }else{
            $form.prepend('<p class="msg error mb-1" style="color: #ff8282;margin-top: 15px;">' + data.msg.substring(4) + '</p>')
          }
        }
      }
    })
  }

  /* ---------------------------------------------
   SUGGEST PRODUCTS
   --------------------------------------------- */
  function suggestProducts() {
    let newsArray = theme.suggestArray;
    let curNewsIndex = 0;
    let delay_time = theme.suggest.delay_time;
    let show_time = theme.suggest.show_time;
    let $thisSuggest = $('.kt-products-suggest');
    let intervalIDS;
    if ($thisSuggest.length <= 0) {return false}
    function advanceNewsItem() {
      clearInterval(intervalIDS);
      ++curNewsIndex;
      if(curNewsIndex >= newsArray.length) {curNewsIndex = 0;}
      let spaceBottom = 15;
      if($('.jas-sticky-atc.fixed').length > 1){
        spaceBottom = $('.jas-sticky-atc.fixed').outerHeight() + 15;
      }
      if($('.claue-cookies-popup.popup-display').length > 1){
        spaceBottom = $('.claue-cookies-popup.popup-display').outerHeight() + 15;
      }
      anime({targets: '.kt-products-suggest', bottom: ($thisSuggest.width()+spaceBottom)*-1+'px',opacity: 0,duration: 600,easing: 'linear',complete: function(anim) {
        $thisSuggest.hide();
        jQuery.getJSON("/products/" + newsArray[curNewsIndex] + ".js", function(data) {
          if (theme.suggest.use_fake_location && theme.suggest.arr_fake_location.length > 0) {
            var myArray = theme.suggest.arr_fake_location, rand = Math.floor(Math.random() * theme.suggest.arr_fake_location.length);
          }
          let fakeTimeOrder = Math.floor((Math.random() * 60) + 1);
          $thisSuggest.find('.product-title').html(data.title).attr('href','/collections/'+theme.suggest.collection_opj+data.url);
          $thisSuggest.find('.table-cell-top.img a').attr('href','/collections/'+theme.suggest.collection_opj+data.url);
          $thisSuggest.find('.table-cell-top.img img').attr( { src:KT.resizeImage(data.featured_image,'85x108_crop_center'), alt:data.title } );
          $thisSuggest.find('.minute-number').html(fakeTimeOrder);
          if (theme.suggest.use_fake_location && theme.suggest.arr_fake_location.length > 0) {
            $thisSuggest.find('.from').html(myArray[rand]);
          }
          $thisSuggest.show();
          anime({targets: '.kt-products-suggest', bottom: spaceBottom+'px',opacity: 1,duration: 600,easing: 'linear'});
          function funShowTime(){
            anime({targets: '.kt-products-suggest', bottom: ($thisSuggest.width()+spaceBottom)*-1+'px',opacity: 0,duration: 600,easing: 'linear'});
          }
          intervalIDS = setInterval(funShowTime, show_time);
          // setTimeout(function(){
          //   anime({targets: '.kt-products-suggest', bottom: ($thisSuggest.width()+spaceBottom)*-1+'px',opacity: 0,duration: 600,easing: 'linear'});
          // }, show_time)
        });
      }});
    }

    let intervalID = setInterval(advanceNewsItem, delay_time + show_time);
    let check_mouse = true;
    $thisSuggest.on({
      mouseenter: function () {
        if (check_mouse) {
          clearInterval(intervalID);
          clearInterval(intervalIDS);
          check_mouse = false;
       }
      },
      mouseleave: function () {
        intervalID = setInterval(advanceNewsItem, delay_time + show_time);
        check_mouse = true;
      }
    });
  }

  KT.resizeImage = function(e, t) {
    try {
      if ("original" == t) return e;
      var n = e.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
      return n[1] + "_" + t + "." + n[2]
    } catch (r) {
      return e
    }
  }

  /* ---------------------------------------------
   CART DRAWER
  --------------------------------------------- */
  KT.drawOpen = function(){
    $('body').addClass('cart-drawer-open');
    $('#bg-overlay').addClass('cart-drawer-overlay').removeClass('menu-overlay');
    $('body').css({overflow:'hidden',marginRight: theme.getScrollbarWidth()});
    if($('#bg-overlay').hasClass('showUp')){
      $('#amShowUp').addClass('mini')
    }
    if ($('.mini-cart').hasClass('load')) {
      $('.mini-cart').removeClass('load');
      $('.content__cart-drawer').addClass('loading');
      Shopify.KT_getCart();
    }
    KT.drawResize();
  }
  KT.drawResize = function(){
    var wHeight = $(window).height();
    var headHeight = $('.head__cart-drawer').outerHeight();
    var footHeight = $('.footer__cart-drawer').outerHeight();
    var height = wHeight-(headHeight+footHeight+17);
    if (height > 350) {
      $('.items__cart-drawer').css('max-height',height);
    }else{
      $('.items__cart-drawer').css('max-height',350);
    }
  }

  /* ---------------------------------------------
   CART POPUP
  --------------------------------------------- */
  KT.popupOpen = function(){
    if ($('.mini-cart').hasClass('load')) {
      $('.mini-cart').removeClass('load');
      $('#cartModal .ajax__list-cart').addClass('loading');
      Shopify.KT_getCart();
    }
    $('#cartModal').modal()
  }

  /* ---------------------------------------------
   BACKGROUND OVERLAY
  --------------------------------------------- */
  KT.bgOverlay = function(action){
    $(document).on(action, '#bg-overlay,.close-qs,.close__cart-drawer', function(e){
      var $this = $(this);
      if ($this.hasClass('showUp')) {
        var pr_item = $($this.attr('data-form'));
        $('body').css({overflow:'',marginRight: ''});
        anime({targets: '#bg-overlay.showUp', backgroundColor: 'rgba(0,0,0,0)',duration: 300,easing: 'linear'})
        anime({targets: $this.attr('data-form'), bottom: '-50%',opacity: 0,duration: 300,easing: 'linear',complete: function(anim) {
          $('body').removeClass('popIn');
          $('#bg-overlay').removeAttr('style class data-form');
          $('.showUp:not(#bg-overlay)').removeAttr('data-form');
          pr_item.remove();
        }});
      }
      if ($this.hasClass('cart-drawer-overlay') || $this.attr('data-form') === "cart-drawer") { 
        $('body').removeClass('cart-drawer-open');
        $('body').css({overflow:'',marginRight: ''});
        anime({targets: '#bg-overlay.cart-drawer-overlay', backgroundColor: 'rgba(0,0,0,0)',duration: 300,easing: 'linear',complete: function(anim) {
          $('#bg-overlay').removeAttr('style class');
        }})
      }
    });
  }

  /* ---------------------------------------------
   ERROR ALERT
  --------------------------------------------- */
  KT.errorAlert = function(content){
    $('.cart-error .content-error').html(content);
    $('.cart-error').addClass('show');
  }

  /* ---------------------------------------------
   GET ANIMATE
  --------------------------------------------- */
  KT.getAnimationDuration = function(el) {
    var cssTimingProps = ['animation-duration', 'transition-duration'],
      durations = {};
    for (var i = 0, len = cssTimingProps.length; i < len; i++) {
      var key = String(cssTimingProps[i]),
        compStyle = window.getComputedStyle(el, null),
        trans = compStyle.getPropertyValue(key);
      if (trans && trans !== '0s') {
        durations[key] = [];

        var transItems = trans.toLowerCase().split(',');
        for (var j = 0, lenJ = transItems.length; j < lenJ; j++) {
          var duration = transItems[j];

          if (duration.indexOf('ms') !== -1) {
            duration = duration.replace('ms', '');
            durations[key][j] = parseFloat(duration);
          } else {
            duration = duration.replace('s', '');
            durations[key][j] = parseFloat(duration) * 1000;
          }
        }
      }
    }
    return durations;
  }

  /* ---------------------------------------------
   FIX SWATCH STYLE
   --------------------------------------------- */
  KT.fixGridSwatch = function(){
    $('.color_pick.swatch, [data-usecolor="true"] .swatch').each(function( index ) {
      if(getComputedStyle(this).backgroundColor === 'rgba(0, 0, 0, 0)' && getComputedStyle(this).backgroundImage === 'none'){
        $(this).addClass('no_background')
      }
    });
  }

  /* ---------------------------------------------
   MOUSE POSITION
   --------------------------------------------- */
  // KT.moveItem = function(el) {
  //   $('.bg-move .image_bg').each(function(){
  //     $(this).mouseMove($(this).parents('.bg-move__area-mouse'));
  //   });
  // }

  /* ---------------------------------------------
   COUNTDOWN WITHOUT SECTION
  --------------------------------------------- */
  KT.countdown = function(){
    $('.kt_countdown').each(function(){
      if ($(this).parents('[data-section-type="countdown-section"]').length <= 0) {
        let el = $(this).parents('[data-section-type]');
        if (el.length > 0){
          if(el.hasClass('product-page')) {
            return true
          }
          theme.ktCountdown(el);
        } else {
          theme.ktCountdown($(this));
        }
      }
    });
  }
  
  /* ---------------------------------------------
   PARALLAX BANNER
   --------------------------------------------- */
  // KT.parallax = function(){
  //   $('.bg-parallax .image_bg').each(function(){
  //     $(this).parallax(null, parseFloat($(this).attr('data-parallax-speed')));
  //   });
  // }

  /* ---------------------------------------------
   RESPONSIVE SPACE SECTION
   --------------------------------------------- */
  KT.respSpaceSection = function(){
    let resp_0 = '',resp_1 = '',resp_2 = '',resp_3 = '',resp_4 = '',resp_5 = '';
    // 0, 576px, 768px, 992px, 1200px, 1230px
    let query0 = "screen and (min-width: 0px)",
        query1 = "screen and (min-width: 576px)",
        query2 = "screen and (min-width: 768px)",
        query3 = "screen and (min-width: 992px)",
        query4 = "screen and (min-width: 1200px)",
        query5 = "screen and (min-width: 1230px)",
    respSpace = function(el,count){
      let elData = el.data();
      let resp_ = elData.el + '{';
      if (elData.mtRespon !== undefined && elData.mtRespon !== '') {
        var mt = elData.mtRespon.toString().split('|');
        resp_ += mt[count] !== undefined ? 'margin-top:' + mt[count] + ' !important;' : '';
      }
      if (elData.mbRespon !== undefined && elData.mbRespon !== '') {
        var mb = elData.mbRespon.toString().split('|');
        resp_ += mb[count] !== undefined ? 'margin-bottom:' + mb[count] + ' !important;' : '';
      }
      if (elData.pRespon !== undefined && elData.pRespon !== '') {
        var p = elData.pRespon.toString().split('|');
        if (elData.elP == undefined) {
          resp_ += p[count] !== undefined ? 'padding:' + p[count] + ' !important;' : '';
          resp_ === elData.el + '{' ? resp_ = '' : resp_ += '}';
        } else if(p[count] !== undefined) {
          resp_ === elData.el + '{' ? resp_ = '' : resp_ += '}';
          resp_ += elData.elP + '{';
          resp_ += p[count] !== undefined ? 'padding:' + p[count] + ' !important;' : '';
          resp_ += '}';
        } else {
          resp_ === elData.el + '{' ? resp_ = '' : resp_ += '}';
        }
      } else {
       resp_ === elData.el + '{' ? resp_ = '' : resp_ += '}';
      }
      return resp_; 
    },
    handler0 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_0 += respSpace($(this),0);
          });
          resp_0 = resp_0 !== '' ? '@media ' + query0 + '{' + resp_0 + '}' : '';
        },
        destroy : function() {}
    },
    handler1 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_1 += respSpace($(this),1);
          });
          resp_1 = resp_1 !== '' ? '@media ' + query1 + '{' + resp_1 + '}' : '';
        },
        destroy : function() {}
    },
    handler2 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_2 += respSpace($(this),2);
          });
          resp_2 = resp_2 !== '' ? '@media ' + query2 + '{' + resp_2 + '}' : '';
        },
        destroy : function() {}
    },
    handler3 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_3 += respSpace($(this),3);
          });
          resp_3 = resp_3 !== '' ? '@media ' + query3 + '{' + resp_3 + '}' : '';
        },
        destroy : function() {}
    },
    handler4 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_4 += respSpace($(this),4);
          });
          resp_4 = resp_4 !== '' ? '@media ' + query4 + '{' + resp_4 + '}' : '';
        },
        destroy : function() {}
    },
    handler5 = {
        match : function() {
          $.each($('[data-el]'), function(index, el) {
            resp_5 += respSpace($(this),5);
          });
          resp_5 = resp_5 !== '' ? '@media ' + query5 + '{' + resp_5 + '}' : '';
        },
        destroy : function() {}
    };
    enquire.register(query0, handler0, true);
    enquire.register(query1, handler1, true);
    enquire.register(query2, handler2, true);
    enquire.register(query3, handler3, true);
    enquire.register(query4, handler4, true);
    enquire.register(query5, handler5, true);
    if ($('style.respSpaceSection') .length) {
      $('.respSpaceSection').html(resp_0+resp_1+resp_2+resp_3+resp_4+resp_5);
    }else{
      $('script').first().before('<style media="screen" class="respSpaceSection">'+resp_0+resp_1+resp_2+resp_3+resp_4+resp_5+'</style>');
    }
  }
  
  /* ---------------------------------------------
   API
  --------------------------------------------- */
  KT.addItem = function(id, qty, backfunc) {
    var itemChange = id;
    var qty = qty || 1,
        ajax = {
          type: "POST",
          url: "/cart/add.js",
          data: "quantity=" + qty + "&id=" + itemChange,
          dataType: "json",
          success: function(e) {
            window.location.href = '/cart';
          },
          error: function(e) {
            alert('error');
          }
        };
    $.ajax(ajax)
  }
  KT.addItemFromFormAddMore = function(el_id) {
    let queue = [];
    $(el_id+' [name="quantity"]').each(function() {
      queue.push({
        "id": parseInt($(this).attr('data-id')),
        "quantity": parseInt($(this).val(), 10) || 0
      });
    });
    var ajax = {
          type: "POST",
          url: "/cart/add.js",
          data: queue,
          dataType: "json",
          success: function(e) {
            window.location.href = '/cart';
          },
          error: function(e) {
            alert('error');
          }
        };
    $.ajax(ajax)
  }
  KT.resizeImage = function(image, size) {
    try {
      if(size == 'original') { return image; }
      else {      
        var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return matches[1] + '_' + size + '.' + matches[2];
      }    
    } catch (e) { return image; }
  }
  KT.getProduct = function(handle, callback) {
    jQuery.getJSON('/products/' + handle + '.js', function (product, textStatus) {
      if ((typeof callback) === 'function') {
        callback(product);
      }
      else {
        console.log(product.title);
      }
    });
  };

  /* ---------------------------------------------
    Scripts ready
  --------------------------------------------- */
  $(document).ready(function() {
    KT.ajaxSearch();
    kt_search();
    kt_quickView();
    kt_quickShop();
    KT.addmoreGrid().on_click();
    customize_error();
    addwishlist();
    removewishlist();
    recentlyViewedAdd();
    recentlyViewedProductSingle();
    css_banner_builded();
    theme.is_mobile ? KT.bgOverlay('touchstart') : KT.bgOverlay('click');
    KT.respSpaceSection();
    AutoloadCompare();
    AddCompare();
    RemoveCompare();
    KT.countdown();
    KT.fixGridSwatch();
    theme.suggest.enable ? suggestProducts() : null;

    // Scroll top Top
    $(document).on('click','.scrollToTop',function() {
      $('body,html').animate({scrollTop:0},800);
    });

    // CART MINI
    if($('.ajax__list-cart').length){
      $(document).on('mouseenter', '.mini-cart:not([onclick]) .icon-link', function(e) {
        if ($('.mini-cart').hasClass('load')) {
          $('.mini-cart').removeClass('load');
          $('.ajax__list-cart').addClass('loading')
          Shopify.KT_getCart();
        } else {
          return
        }
      });
    }

    // CART DRAWER
    $(document)
    .on('focusin', '#CartSpecialInstructions' ,function(){
      $('.note__cart-drawer').addClass('show');
      $('.note__cart-drawer .update').show();
    })
    .on('click', 'input.kt_agree' ,function(){
      if ($(this).is(':checked')) {
        $('.kt_agree_swich').css({'opacity':1,'pointer-events':''});
      }else{
        $('.kt_agree_swich').css({'opacity':'0.7','pointer-events':'none'});
      }
    })

    // CART PAGE
    $(document)
    .on('change', '[name="discount_code"]' ,function(){
      $('form[action="/checkout"] #coupon_code').val($(this).val()).trigger('change')
    })
    
    // BOX MOBILE MENU
    $(document).on('click', '.menu-toggle', function (e) {
      e.preventDefault();
      $('.box-mobile-menu').addClass('open');
    });

    // SCROLL TOP
    $(document).on('click','.scroll_top',function() {
      $('body,html').animate({scrollTop:0},800);
    });
    
    $(document)
    .on('click', '.fake_select label', function(e) {
      e.preventDefault();
      if($(this).parents('.fake_select').hasClass('show')){
        $('.fake_select.show').removeClass('show');
      }else{
        $('.fake_select.show').removeClass('show');
        $(this).parents('.fake_select').addClass('show');
      }
    })
    .on("click", function(e) {
      if ($(e.target).is('.fake_select.show') === false && $(e.target).is('.fake_select.show *') === false) {
        $('.fake_select').removeClass("show");
      }
    })
    .on('click', '.btn.play', function(e) {
      $(this).closest('.product-page').find('video.video-element').trigger('play');
    });
    
    $(document)
    .on('click', '.kiti--DropItem>a', function(e) {
      e.preventDefault();
      if($(this).hasClass('livesearch_mb') && $(window).width() < 768){
        $('.liveSearchMobile').addClass('show');
        return false;
      }
      if($(this).parent().hasClass('show')){
        $(this).parent().toggleClass('show');
      }else{
        $('.kiti--DropItem.show').removeClass('show');
        $(this).parent().addClass('show');
      }
    })
    .on("click", function(e) {
      if ($(e.target).is('.kiti--DropItem.show') === false && $(e.target).is('.kiti--DropItem.show *') === false) {
        $('.kiti--DropItem.show').removeClass("show");
      }
    });
    
    // Filter on click
    $(document)
    .on('click', '.kt_filterGroupItem .layered_subtitle_heading', function(e){
      e.preventDefault();
      $(this).parents('.kt_filterGroupItem').toggleClass('show');
    })
    .on('click', function(e){
      if ($(e.target).is('.kt_filterGroupItem.kt_filterDropdown *') === false ) {
        $('.kt_filterGroupItem.kt_filterDropdown').removeClass("show");
      }
      if ($(e.target).is('.kt_dropdown .kt_layerfilterGroups') === false) {
        $('.kt_dropdown .kt_layerfilterGroups').slideUp();
      }
      if ($(e.target).is('.showQuickShop *') === false) {
        $('.showQuickShop button.close').trigger('click');
      }
    });

    $(document)
    .on('click', '.filter-by.filterDrop', function(e){
      e.preventDefault();
      $(this).toggleClass('opened');
      $('.kt_dropdown .kt_layerfilterGroups').is(':hidden') ? $('.kt_dropdown .kt_layerfilterGroups').slideDown('slow')  : $('.kt_dropdown .kt_layerfilterGroups').slideUp();
    })
    .on('click', '.filter-by.filterCanvas', function(e){
      e.preventDefault();
      $('body').toggleClass('filterOpened');      
      $('#bg-overlay').addClass('filter-overlay')
    })
    .on('click', '#bg-overlay.filter-overlay, .filter-close', function(e){
      e.preventDefault();
      $('body').removeClass('filterOpened');
      anime({targets: '#bg-overlay.filter-overlay', backgroundColor: 'rgba(0,0,0,0)', duration: 300, easing: 'linear', complete: function(anim) {
        $('#bg-overlay').removeAttr('style class');
      }})
    })
    .on('click', '.filter-by.filterMobile, #filterApply, .headFilter .close', function(e){
      e.preventDefault();
      if($('.kt_layerFilter.kt_layerMobilde').hasClass('show')){
        $('.kt_layerFilter.kt_layerMobilde.show').removeClass('show');
      }
      else{
        $('.kt_layerFilter.kt_layerMobilde').addClass('show');
      }
    });

    $(document)
    .on('click', '.widget_product_categories.market-layout .level-1:not(.opened)>a', function(e){
      e.preventDefault();
      if ($(this).parent().hasClass('opened')) {return false}
      $('.widget_product_categories.market-layout .opened').removeClass('opened');
      $('.widget_product_categories.market-layout .child_collection').slideUp();
      $(this).parent().toggleClass('opened');
      $(this).parent().find('.child_collection').slideToggle();
    })
    
    // Create an event listener to set a specific variant option when clicking on swatches.
    $(document).on('click', '[data-change-option]', function(e) {
      //Single product page
      let $this = $(this);
      var templateSinglePr = 'product-template';
      if($this.parents('.product-page').length > 0){
        templateSinglePr = $this.parents('.product-page').attr('data-section-id');
      }
      e.preventDefault();
      goto = true;
      optionIndex = $this.data('change-option');
      optionValue = $this.data('value');
      $this.parent().find('li').removeClass('selected');
      $this.addClass('selected');
      if($this.parents('.selector-wrapper.js').find(".fake_select.variant_image").length){
        $this.parents('.selector-wrapper.js').find(".fake_select.variant_image li").removeClass('selected');
        $this.parents('.selector-wrapper.js').find('.fake_select.variant_image li[data-value="'+optionValue+'"]').addClass('selected');
      }
      $("#ProductSection-"+templateSinglePr+" .swatches-selected-name[data-change-label='"+optionIndex+"'] .name").html(optionValue);
      $('#ProductSection-'+templateSinglePr+' .fake_select.show').removeClass('show');
      $this.closest('.fake_select').removeClass('op_pre_select error');
      $("#ProductSection-"+templateSinglePr+" #"+optionIndex).val(optionValue).trigger('change');
    });

    $('a[data-toggle="list"]').on('shown.bs.tab', function (e) {
      setTimeout(function(){
        theme.checkProductGrid_Width();
      }, 400);
    })
    $(document).on('click', '.tab-list-ajax [data-toggle="list"]', function(e) {
      var tab_content = $(this).closest('.tab-list-ajax').find('.tab-content');
      if ($($(this).attr('href')).find('.product-list-grid').hasClass('lazyload')) {
        var height = tab_content.innerHeight();
        tab_content.css('height', height - 200);
        $($(this).attr('href')).find('.button-loadmore').css('opacity', '0');
      }
    });

    $(document).on('click', '.btn-onclick', function(e) {
      $(this).addClass('loading').removeClass('loaded');
    })

    $('[id|="mc-embedded-subscribe-form"]').each(function(){
      var $form = $(this);
      if ($form.length > 0 && theme.function.nll_ajax) {
        $form.find('[type="submit"]').bind('click', function (event) {
          if (event) event.preventDefault()
          KT.register($form)
        })
      }
    });

    if ( $(window).width() >= 992 && $('.sticky-content').length > 0) {
      $('.sticky-content').stick_in_parent({
        offset_top: 80
      });
    }
    $(document)
    .on('click', '.drop-mobile .label-drop', function(e){
      e.preventDefault();
      $(this).parent().toggleClass('show');
    })
    .on('click', function(e){
      if ($(e.target).is('.drop-mobile.show *') === false ) {
        $('.drop-mobile.show').removeClass("show");
      }
    });  
    /* ---------------------------------------------
     Fixed-fshadow
     --------------------------------------------- */
    $(document)
    .on('mouseenter', '.swiper-fixed-fshadow .grid-item', function(event) {
      event.preventDefault();
      $(this).parents('.swiper-fixed-fshadow').css('z-index', '1');
    })
    .on('touchstart', '.swiper-fixed-fshadow .grid-item', function(event) {
      event.preventDefault();
      $(this).parents('.swiper-fixed-fshadow').css('z-index', '1');
    })
    .on('touchcancel', '.swiper-fixed-fshadow .grid-item', function(event) {
      event.preventDefault();
      $(this).parents('.swiper-fixed-fshadow').css('z-index', '0');
    })
    .on('mouseleave', '.swiper-fixed-fshadow .grid-item', function(event) {
      event.preventDefault();
      $(this).parents('.swiper-fixed-fshadow').css('z-index', '0');
    });

    // Scroll To button
    var $scrollTo = $('.kt_home_slide .btn');
    if ( $scrollTo.length ) {
      $scrollTo.on('click', function(e) {
        var target = $(this).attr('href'),
            $target = $(target);
        if ($target.length && target.charAt(0) === '#') {
          var scrolloffset = ( $(window).width() >= 992 ) ? ($target.offset().top - 52) : $target.offset().top
          $('html, body').animate({
            'scrollTop': scrolloffset
          }, 600);
          e.preventDefault();
        }
      });
    }
    if ($('.border-top.unset').length > 0 && $('#shopify-section-kt_top_banner > div').length > 0) {
      $('.border-top.unset').show()
    }

    if ($('#currency_form').length > 0) {
      $(document).on('click', '.mg-currency-item', function(event){
        event.preventDefault();
        $('.mg_currency_widget').css('pointer-events', 'none');
        let newCurrency =  $(this).find('[data-currency]').data('currency');
        $('#currency_form input[name="currency"]').val(newCurrency);
        $('#currency_form').submit();
      })
    }
  });

  /* ---------------------------------------------
   Scripts scroll
   --------------------------------------------- */
  $(window).scroll(function() {
    // Show hide scrolltop button
    var windowHeight = $(window).height();
    if($(this).scrollTop() > windowHeight ) {
      $('.scroll_top').fadeIn(500);
      $('body.popIn').removeClass('popIn');
    } else {
      $('.scroll_top').fadeOut(800);
    }
  });
  
  /* ---------------------------------------------
   Scripts resize
   --------------------------------------------- */
  $(window).on("resize", function() {
    theme.is_mobile ? KT.bgOverlay('touchstart') : KT.bgOverlay('click');
    KT.respSpaceSection();
    KT.drawResize();
    if ($(window).width() <= 768) {
      $('.modalShowUp').animate({bottom: 0}, 500);
    }
    else{
      $('.modalShowUp').animate({bottom: '50%'}, 500);
    }
  });


  if(Shopify.designMode){
    $(document)
    .on('shopify:section:load', recentlyViewedProductSingle)
    .on('shopify:section:select', recentlyViewedProductSingle)
    .on('shopify:block:select', recentlyViewedProductSingle);
    $(document)
    .on('shopify:section:load', css_banner_builded)
    .on('shopify:section:select', css_banner_builded)
    .on('shopify:block:select', css_banner_builded);
    $(document)
    .on('shopify:section:load', customize_error)
    .on('shopify:section:select', customize_error)
    .on('shopify:block:select', customize_error);
    $(document)
    .on('shopify:section:load', KT.countdown)
    .on('shopify:section:select', KT.countdown)
    .on('shopify:block:select', KT.countdown);
    $(document)
    .on('shopify:section:load', KT.respSpaceSection)
    .on('shopify:section:select', KT.respSpaceSection)
    .on('shopify:block:select', KT.respSpaceSection);
    $(document)
    .on('shopify:section:load', theme.wokerktlz(true))
    .on('shopify:section:select', theme.wokerktlz(true))
    .on('shopify:block:select', theme.wokerktlz(true));
  }

})( jQuery );