$ = $jqMolla;
function floatToString(e, t) {
  var n = e.toFixed(t).toString();
  return n.match(/^\.\d+/) ? "0" + n : n
}

function attributeToString(e) {
  return "string" != typeof e && (e += "", "undefined" === e && (e = "")), jQuery.trim(e)
}
"undefined" == typeof window.Shopify && (window.Shopify = {}),

Shopify.KT_onError = function(e, t) {
  var n = eval("(" + e.responseText + ")");
  n.message ? alert(n.message + "(" + n.status + "): " + n.description) : alert("Error : " + Shopify.KT_fullMessagesFromErrors(n).join("; ") + ".")
},
Shopify.KT_fullMessagesFromErrors = function(e) {
  var t = [];
  return jQuery.each(e, function(e, n) {
    jQuery.each(n, function(n, r) {
      t.push(e + " " + r)
    })
  }), t
},
Shopify.KT_onCartUpdate = function(e,remove) {
  // alert("There are now " + e.item_count + " items in the cart.");
  Shopify.KT_onCartUpdate_(e,remove);
},
Shopify.KT_onCartShippingRatesUpdate = function(e, t) {
  var n = "";
  t.zip && (n += t.zip + ", "), t.province && (n += t.province + ", "), n += t.country;
},
Shopify.KT_onItemAdded = function(e) {
  // Shopify.Cart.alert(e, true)
  Shopify.KT_getCart();
},
Shopify.KT_formatMoney = function(e, t) {
  function n(e, t) {
    return "undefined" == typeof e ? t : e
  }

  function r(e, t, r, i) {
    if (t = n(t, 2), r = n(r, ","), i = n(i, "."), isNaN(e) || null == e) return 0;
    e = (e / 100).toFixed(t);
    var o = e.split("."),
        a = o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + r),
        s = o[1] ? i + o[1] : "";
    return a + s
  }
  "string" == typeof e && (e = e.replace(".", ""));
  var i = "",
    o = /\{\{\s*(\w+)\s*\}\}/,
    a = t || this.money_format;
  switch (a.match(o)[1]) {
    case "amount":
      i = r(e, 2);
      break;
    case "amount_no_decimals":
      i = r(e, 0);
      break;
    case "amount_with_comma_separator":
      i = r(e, 2, ".", ",");
      break;
    case "amount_with_space_separator":
      i = r(e, 2, " ", ",");
      break;
    case "amount_with_period_and_space_separator":
      i = r(e, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      i = r(e, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      i = r(e, 0, ".", "");
      break;
    case "amount_with_space_separator":
      i = r(e, 2, ",", "");
      break;
    case "amount_with_apostrophe_separator":
      i = r(e, 2, "'", ".")
  }
  return a.replace(o, i)
},
Shopify.KT_addItem = function(e, t, n) {
  var itemChange = e;
  var t = t || 1,
      r = {
        type: "POST",
        url: "/cart/add.js",
        data: "quantity=" + t + "&id=" + e,
        dataType: "json",
        success: function(e) {
            "function" == typeof n ? n(itemChange,e) : Shopify.KT_onItemAdded(e)
        },
        error: function(e, t) {
            Shopify.KT_onError(e, t)
        }
      };
  jQuery.ajax(r)
},
Shopify.KT_addItems = function(items, callback) {
  var ajax = {
        type: "POST",
        url: "/cart/add.js",
        data: {'items': items},
        dataType: "json",
        success: function(data) {
          "function" == typeof callback ? callback(items) : Shopify.KT_onItemAdded(data)
        },
        error: function(data, t) {
          Shopify.KT_onError(data, t)
        }
      };
  jQuery.ajax(ajax)
},
Shopify.KT_addItemFromForm = function(e, t) {
  var el = e;
  var n = {
    type: "POST",
    url: "/cart/add.js",
    data: jQuery("#" + e).serialize(),
    dataType: "json",
    success: function(e) {
      "function" == typeof t ? t(e) : Shopify.KT_onItemAdded(e)
    },
    error: function(e, t) {
      Shopify.KT_onError(e, t)
    }
  };
  jQuery.ajax(n)
},
Shopify.KT_addItemFromFormAddMore = function(el_id) {
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
        data: {"items": queue},
        dataType: "json",
        success: function(e) {
          Shopify.KT_getCart();
        },
        error: function(e) {
          alert('error');
        }
      };
  $.ajax(ajax)
},
Shopify.KT_getCart = function(e) {
  jQuery.getJSON("/cart.js", function(t, n) {
    "function" == typeof e ? e(t) : Shopify.KT_onCartUpdate(t)
  })
},
Shopify.KT_pollForCartShippingRatesForDestination = function(e, t, n) {
  n = n || Shopify.KT_onError;
  var r = {
    url: '/cart/async_shipping_rates',
    type: 'GET'
  }
  jQuery.ajax(r)
  .done(function(n, i, o) {
    // console.log("success");
    200 === o.status ? "function" == typeof t ? t(n.shipping_rates, e) : Shopify.KT_onCartShippingRatesUpdate(n.shipping_rates, e) : setTimeout(r, 500)
  })  
  .fail(function(XMLHttpRequest, textStatus) {
    // console.log("error");
    n(XMLHttpRequest, textStatus);
  });
},
Shopify.KT_getCartShippingRatesForDestination = function(address, t, n) {
  n = n || Shopify.KT_onError;
  // console.log(e);
  jQuery.ajax({
    url: '/cart/shipping_rates.json',
    type: 'GET',
    data: Shopify.KT_param({
      shipping_address: address
    })
  })
  .done(function(respon) {
  // console.log("success");
    t(respon.shipping_rates,address);
  })
  .fail(function(XMLHttpRequest, textStatus) {
    // console.log("error");
    n(XMLHttpRequest, textStatus);
  });
},
Shopify.KT_changeItem = function(e, t, n) {
  var itemChange = e;
  var r = {
      type: "POST",
      url: "/cart/change.js",
      data: "quantity=" + t + "&id=" + e,
      dataType: "json",
      success: function(e) {
        "function" == typeof n ? n(itemChange,e) : Shopify.KT_onCartUpdate(e)
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(r)
},
Shopify.KT_removeItem = function(e, t) {
  var itemChange = e;
  var n = {
      type: "POST",
      url: "/cart/change.js",
      data: "quantity=0&id=" + e,
      dataType: "json",
      success: function(e) {
        "function" == typeof t ? t(itemChange,e,'remove item') : Shopify.KT_onCartUpdate(e,'remove item')
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(n)
},
Shopify.KT_clear = function(e) {
  var t = {
      type: "POST",
      url: "/cart/clear.js",
      data: "",
      dataType: "json",
      success: function(t) {
        "function" == typeof e ? e(t) : Shopify.KT_onCartUpdate(t)
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(t)
},
Shopify.KT_updateCartFromForm = function(e, t) {
  var n = {
      type: "POST",
      url: "/cart/update.js",
      data: jQuery("#" + e).serialize(),
      dataType: "json",
      success: function(e) {
        "function" == typeof t ? t(e) : Shopify.KT_onCartUpdate(e);
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(n)
},
Shopify.KT_updateCartAttributes = function(e, t) {
  var n = "";
  jQuery.isArray(e) ? jQuery.each(e, function(e, t) {
      var r = attributeToString(t.key);
      "" !== r && (n += "attributes[" + r + "]=" + attributeToString(t.value) + "&")
  }) : "object" == typeof e && null !== e && jQuery.each(e, function(e, t) {
      n += "attributes[" + attributeToString(e) + "]=" + attributeToString(t) + "&"
  });
  var r = {
      type: "POST",
      url: "/cart/update.js",
      data: n,
      dataType: "json",
      success: function(e) {
        "function" == typeof t ? t(e) : Shopify.KT_onCartUpdate(e)
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(r)
},
Shopify.KT_updateCartNote = function(e, t) {
  var n = {
      type: "POST",
      url: "/cart/update.js",
      data: "note=" + attributeToString(e),
      dataType: "json",
      success: function(e) {
        "function" == typeof t ? t(e) : Shopify.KT_onCartUpdate(e)
      },
      error: function(e, t) {
        Shopify.KT_onError(e, t)
      }
  };
  jQuery.ajax(n)
},
Shopify.KT_updatedCartNote = function(cart) {
  $('.note__cart-drawer .title').show();
  $('.note__cart-drawer .update').hide();
},
jQuery.fn.jquery >= "1.4" ? Shopify.KT_param = jQuery.param : (Shopify.KT_param = function(e) {
  var t = [],
    n = function(e, n) {
      n = jQuery.isFunction(n) ? n() : n, t[t.length] = encodeURIComponent(e) + "=" + encodeURIComponent(n)
    };
  if (jQuery.isArray(e) || e.jquery) jQuery.each(e, function() {
    n(this.name, this.value)
  });
  else
    for (var r in e) Shopify.KT_buildParams(r, e[r], n);
  return t.join("&").replace(/%20/g, "+")
},
Shopify.KT_buildParams = function(e, t, n) {
    jQuery.isArray(t) && t.length ? jQuery.each(t, function(t, r) {
      rbracket.test(e) ? n(e, r) : Shopify.KT_buildParams(e + "[" + ("object" == typeof r || jQuery.isArray(r) ? t : "") + "]", r, n)
    }) : null != t && "object" == typeof t ? Shopify.KT_isEmptyObject(t) ? n(e, "") : jQuery.each(t, function(t, r) {
      Shopify.KT_buildParams(e + "[" + t + "]", r, n)
    }) : n(e, t)
},
Shopify.KT_isEmptyObject = function(e) {
  for (var t in e) return !1;
  return !0
});
/* ----------- onClick customize for theme
---------------*/
$(document)
.on('click','.addItemAjax',function(event){
  event.preventDefault();
  let $this = $(this);
  let id = $this.attr('data-vrid');
  let qty = 1;
  let $form = $this.parents('form[action="/cart/add"]');
  $this.find('.addItemAjax-text').attr('data-prev-text', $this.find('.addItemAjax-text').text()).addClass('waitting-text-change');
  if ($form.length > 0) {
    if($form.find('[name="id"]').length > 0){
      id = $form.find('[name="id"]').val();
    }
    if($form.find('[name="quantity"]').length > 0){
      qty = $form.find('[name="quantity"]').val();
    }
  }
  Shopify.KT_addItem(id,qty);
})
.on('click','.addItemsAjax',function(event){
  event.preventDefault();
  Shopify.KT_addItemFromFormAddMore('#amShowUp')
})
.on('click', '.note__cart-drawer .update' ,function(){
  Shopify.KT_updateCartNote($('#CartSpecialInstructions').val(),Shopify.KT_updatedCartNote);
});

/* ----------- onCartUpdate customize for theme
---------------*/
Shopify.KT_onCartUpdate_ = function(cart,remove_action) {
  $('.prefetch-cart').remove();
  $('head link').first().after('<link class="prefetch-cart" rel="prefetch" href="/cart">');
  var table = $(".ajax__list-cart");
  var table_content = '';
  $('.cartCount').text(cart.item_count);
  $('.cartCost').attr('data-price',cart.total_price).html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
  $('.title.has-item').html(cart.item_count == 1 ? theme.strings.cartItem.split('(')[0]+'('+cart.item_count+' item)'+theme.strings.cartItem.split(')')[1] : theme.strings.cartItems.split('(')[0]+'('+cart.item_count+' items)'+theme.strings.cartItems.split(')')[1]);
  $('.btn.loading, .kt-button.loading').removeClass('loading');
  $('.waitting-text-change').text(theme.strings.addedToCart);
  $('.mini-cart .icon-link').removeClass('load');

  var iconCartVisible = function(){
    var cartVisible = false;
    if (theme.function.sticky_icon_cart === false) {return false}
    $('.cartCount:not(.fixed)').each(function(el,idx){
      if(this.getBoundingClientRect().top > 1){
        cartVisible = true;
      }
      if((idx + 1) === $('.cartCount:not(.fixed)').length) {
        return false;
      }
    });
    return cartVisible;
  }
  if (theme.function.ajax_cart === 'drop' && iconCartVisible() === false) {
    $('body').addClass('popIn');
    anime({
      targets: '.cartCount.fixed',
      keyframes: [
        {backgroundColor: '#fff',color: '#555',scale: 1.25,rotate:-45,borderRadius:15},
        {backgroundColor: '#111',color: '#fff',scale: 1,rotate:0,borderRadius:50}
      ],
      duration: 2000,
      delay: 100,
      easing: 'easeOutElastic(1, .8)',
      complete: function(anim) {
        $('.cartCount.fixed').removeAttr('style')
      }
    });
  }
  var urlAjax = '/cart?view=listjsondrop';
  theme.function.ajax_cart == 'drawer' ? urlAjax = '/cart?view=listjson' : urlAjax;
  theme.function.ajax_cart == 'popup' ? urlAjax = '/cart?view=listjsonpopup' : urlAjax;
  if (theme.function.cart_shipping_calculator) {
    if($('.get__shipping').attr('data-curr-address') !== undefined && cart.item_count > 0){
      $('.get__shipping').show();
      if ($('#address_country option').length > 0) {
        var address = JSON.parse($('.get__shipping').attr('data-curr-address'));
        Shopify.KT_getCartShippingRatesForDestination(address,Shopify.Cart.getShippingCart,Shopify.Cart.onError);
      }
    }
    if(theme.function.ajax_cart == 'drawer' && $('#address_country option').length <= 0 ) {
      Shopify.Cart.getCountry();
    }
  }
  $.ajax({
    type: 'get',
    url: urlAjax,
    beforeSend: function() {
      if(!remove_action && theme.function.ajax_cart == 'drawer'){
        theme.is_mobile ? $('.close-qs').trigger('touchstart') : $('.close-qs').trigger('click');
      }
      if (cart.item_count > 0) {
        if ( $( ".has-item" ).is( ":hidden" ) ) {
          $('.has-item').css({'display':''});
          $('.no-item').css({'display':'none'});
        }
      }
      else {
        if ( $( ".no-item" ).is( ":hidden" ) ) {
          $('.has-item').css({'display':'none'});
          $('.no-item').css({'display':''});
        }
      }
      if($('#myModal').length > 0){
        $('#myModal').modal('hide')
      }
    },
    success: function(table_content) {
      setTimeout(function(){
        $('.btn.adding').text(theme.strings.addToCart).removeClass('adding');
      },1000)
      table.html(table_content).removeClass('loading');
      if(!remove_action && theme.function.ajax_cart == 'drawer'){
        KT.drawOpen();
      }
      if(!remove_action && theme.function.ajax_cart == 'popup'){
        KT.popupOpen();
      }
      if($('.spendFreeShip').length > 0){
        var line_total = parseInt($('.spendFreeShip').find('[aria-valuemax]').attr('aria-valuemax'));
        var progress_bar = $('.spendFreeShip').find('.progress-bar');
        if (line_total > cart.total_price){
          progress_bar.attr('aria-valuenow', line_total - cart.total_price).css('width',cart.total_price / line_total * 100 + '%').text(Math.round(cart.total_price / line_total * 100) + '%');
          $('.spendFreeShip').removeClass('congratulations');
        }else{
          progress_bar.attr('aria-valuenow', line_total).css('width','100%').text('100%');
          $('.spendFreeShip').addClass('congratulations');
        }
      }
      $('.title-ajax__cart').html(cart.item_count == 1 ? theme.strings.cartItem.split('(')[0]+'('+cart.item_count+' item)'+theme.strings.cartItem.split(')')[1] : theme.strings.cartItems.split('(')[0]+'('+cart.item_count+' items)'+theme.strings.cartItems.split(')')[1]);
      if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
        Kt_currency.convertAll(shopCurrency,localStorageCurrency);
      }
      $('.content__cart-drawer.loading').removeClass('loading');
    }
  });
}


"undefined" == typeof Shopify.Cart && (Shopify.Cart = {});
Shopify.Cart.getShippingCart = function(respon,address) {
  $.ajax({
    type: "POST",
    url: '/cart.js',
    data: {"attributes[theme_shipping]": JSON.stringify(address)},
    dataType: 'json'
  });
  let $getShipping = $('.get__shipping'),
      $contentShipping = $('.content__shipping'),
      $cartCost = $('.cartCost'),
      $cartCostPlusShipping = $('.cartCostPlusShipping'),
      $addressShipping = $('.address__shipping');

  $getShipping.attr('data-curr-address',JSON.stringify(address));
  let addressHTML = '';
  if(address.zip !== '1'){
    addressHTML += address.zip + ', ';
  }
  if(address.province !== address.country){
    addressHTML += address.province + ', ';
  }
  addressHTML += address.country;
  $addressShipping.html(addressHTML);
  if(respon.length == 0){
    $contentShipping.html('<td colspan="2"><div class="alert alert-danger" role="alert">There are no shipping methods available for your cart or destination.</div></td>');
  } else {
    let items_ = '<td class="item__shipping" colspan="2">';
    $.each(respon, function(index, val) {
      items_ += '<div class="item_shipp">';
      items_ += '<div class="item_shipp_name custom-control custom-radio">';
      items_ += '<input id="item_spp'+index+'" class="custom-control-input" type="radio" name="shipping-cart-drawer" data-name="'+val.code+'" value="'+val.price+'" placeholder=""';
      items_ += index == 0 ? 'checked="checked">' : '>';
      items_ += '<label class="content-item__shipping custom-control-label" for="item_spp'+index+'">';
      items_ += '<span class="name-item__shipping">'+val.name;
      if(val.delivery_days.length > 0){
        items_ += '</span><span class="delivery_days-item__shipping"> (';
        if(val.delivery_days.length >= 2){
          items_ += val.delivery_days[0]+'-'+val.delivery_days[1]+' days)</span>';
        } else {
          items_ += val.delivery_days[0]+' day)</span>';
        }
      } else {
        items_ += '</span>';
      }
      items_ += '</label>';
      if(val.delivery_date !== null){
        items_ += '<div class="data-item__shipping"> Get by it ';
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let delivery_date  = new Date(val.delivery_date);
        items_ += delivery_date.toLocaleDateString("en-US", options);
        items_ += '</div>';
      }
      items_ += '</div>';
      items_ += '<div class="item_shipp_price">';
      items_ += '<span class="price-item__shipping">'+theme.Currency.formatMoney(val.price * 100, theme.moneyFormat)+'</span>';
      items_ += '</div>';
      items_ += '</div>';
    });
    items_ += '</td>';
    $contentShipping.html(items_).show();
  }
  $contentShipping.css('opacity', '');
  $('.calculate__shipping').removeClass('loading');  
  $('.afterShip').show();
  let cartCost = parseFloat($cartCost.attr('data-price'));
  let shipp = parseFloat($contentShipping.find('input[type="radio"][checked="checked"]').val()) * 100;
  $cartCostPlusShipping.html(theme.Currency.formatMoney(cartCost+shipp, theme.moneyFormat));
  if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
    Kt_currency.convertAll(shopCurrency,localStorageCurrency);
  }
  KT.drawResize();
}
Shopify.Cart.fullMessagesFromErrors = function(e) {
  var t = [];
  return jQuery.each(e, function(e, r) {
    jQuery.each(r, function(r, n) {
      t.push(e + " " + n)
    })
  }), t
}
Shopify.Cart.onError = function(XMLHttpRequest, textStatus) {
  var feedback = "",
      data = eval("(" + XMLHttpRequest.responseText + ")");
  feedback = data.message ? data.message + "(" + data.status + "): " + data.description : "Error : " + Shopify.Cart.fullMessagesFromErrors(data).join("; ") + ".", "Error : country is not supported." === feedback && (feedback = "We do not ship to this destination.");
  $('.content__shipping').html(feedback);
  $('.calculate__shipping').addClass('error').removeClass('loading');
}
Shopify.Cart.alert = function(product, success, status){
  console.log(product)
}
Shopify.Cart.getCountry = function(){
  if (typeof(Storage) !== "undefined" && sessionStorage.dataCountry !== undefined ) {
    $('#address_country').html(sessionStorage.dataCountry);
    Shopify.Cart.buildCountry();
    return;
  }
  jQuery.ajax({
    url: '/cart?view=listcountry',
    type: 'GET',
    dataType: 'html',
    complete: function(xhr, textStatus) {
      //called when complete
    },
    success: function(data, textStatus, xhr) {
      //called when successful      
      $('#address_country').html(data);
      sessionStorage.dataCountry = data;
      Shopify.Cart.buildCountry()
    },
    error: function(xhr, textStatus, errorThrown) {
      //called when there is an error
    }
  });     
}
Shopify.Cart.buildCountry = function(){
  if($('[name="address[country]"]').attr('data-default') !== undefined){
    $('[name="address[country]"]').val($('[name="address[country]"] option[value="'+$('[name="address[country]"]').attr('data-default')+'"]').val());
  }
  var select = $('[name="address[country]"] option:selected').html(), provinces = $('[name="address[country]"] option:selected').attr('data-provinces');
  if (provinces !== "[]") {
    var provinces = JSON.parse($('[name="address[country]"] option:selected').attr('data-provinces'));
    var default_province = $('[name="address[province]"]').attr('data-default');
    var provinces_html = '';
    $.each(provinces, function(index, val) {
      if (default_province !== undefined && val[0] == default_province){
        $('[data-select="#address__province"]').html(val[1]);
        provinces_html += '<option selected="selected" value="'+val[0]+'">'+val[1]+'</option>';
      } else if (index == 0) {
        $('[data-select="#address__province"]').html(val[1]);
        provinces_html += '<option selected="selected" value="'+val[0]+'">'+val[1]+'</option>';
      }
      provinces_html += '<option value="'+val[0]+'">'+val[1]+'</option>';
    });
    $('[name="address[province]"]').html(provinces_html).parent().show();
    // $('[name="address[zip]"]').val('').parent().show();
  } else {
    $('[name="address[province]"]').html('').parent().hide();
    $('[name="address[zip]"]').parent();
  }
  if($('.get__shipping').attr('data-curr-address') !== undefined){
    var address = JSON.parse($('.get__shipping').attr('data-curr-address'));
    Shopify.KT_getCartShippingRatesForDestination(address,Shopify.Cart.getShippingCart,Shopify.Cart.onError);
  }
}
$(document)
.on('change','[name="address[country]"]',function(){
 let select = $('[name="address[country]"] option:selected').html(), provinces = $(this).find('option:selected').attr('data-provinces');
  $(this).parent().find('.label_hidden_select').html(select);
  if (provinces !== "[]") {
    let provinces = JSON.parse($(this).find('option:selected').attr('data-provinces'));
    let default_province = $('[name="address[province]"]').attr('data-default');
    let provinces_html = '';
    $.each(provinces, function(index, val) {
      if (default_province !== undefined && val[0] == default_province){
        $('[data-select="#address__province"]').html(val[1]);
        provinces_html += '<option selected="selected" value="'+val[0]+'">'+val[1]+'</option>';
      } else if (index == 0) {
        $('[data-select="#address__province"]').html(val[1]);
        provinces_html += '<option selected="selected" value="'+val[0]+'">'+val[1]+'</option>';
      }
      provinces_html += '<option value="'+val[0]+'">'+val[1]+'</option>';
    });
    $('[name="address[province]"]').html(provinces_html).parent().show();
    $('[name="address[zip]"]').val('').parent().show();
  } else {
    $('[name="address[province]"]').html('').parent().hide();
    $('[name="address[zip]"]').parent();
  }
  KT.drawResize();
})
.on('change','[name="address[province]"]',function(){
  let select = $('[name="address[province]"] option:selected').html()
  $(this).parent().find('.label_hidden_select').html(select);
  KT.drawResize();
})
.on('click','.calculate__shipping',function(){
  let address = {
    'zip': $('[name="address[zip]"]').val(),
    'country': $('[name="address[country]"]').val(),
    'province': $('[name="address[province]"]').val() !== null ? $('[name="address[province]"]').val() : $('[name="address[country]"]').val()
  }
  if (JSON.stringify(address) !== $('.get__shipping').attr('data-curr-address')) {
    Shopify.KT_getCartShippingRatesForDestination(address,Shopify.Cart.getShippingCart,Shopify.Cart.onError);
  }
})
.on('change','[name="shipping-cart-drawer"]',function(){
  let cartCost = parseFloat($('.cartCost').attr('data-price'));
  let shipp = parseFloat($(this).val()) * 100;
  $('.show__shipping-price').html(theme.Currency.formatMoney(shipp, theme.moneyFormat));
  $('.cartCostPlusShipping').html(theme.Currency.formatMoney(cartCost+shipp, theme.moneyFormat));
  if (theme.function.multiCurrency == true && localStorageCurrency !== null && localStorageCurrency !== shopCurrency) {
    Kt_currency.convertAll(shopCurrency,localStorageCurrency);
  }
});
document.addEventListener("DOMContentLoaded", function(event) {
  if ($('#address_country').length > 0 && $('body.template-cart').length > 0) {
    if (typeof(Storage) !== "undefined" && sessionStorage.dataCountry !== undefined ) {
      $('#address_country').html(sessionStorage.dataCountry);
      Shopify.Cart.buildCountry();
    } else {
      Shopify.Cart.getCountry();
    }
  }
});