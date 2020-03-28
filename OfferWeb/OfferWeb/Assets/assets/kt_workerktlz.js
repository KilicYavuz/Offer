var blob = new Blob([document.querySelector('#workerktlz').innerHTML], { type: "text/javascript" });
var myWorker = new Worker(window.URL.createObjectURL(blob));

function KlzDynamicVariantsLoader(responsiveCell2GMaxWidth, responsiveCell3GMaxWidth, responsiveCell4GMaxWidth, loadDeferral, visibilityBuffer, skipHidden){
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
  var loadDynamicVariants = function() {
    var elements = document.getElementsByClassName("ktlz");
    var length = elements.length;
    for (var i=0; i<length; i++) {
      var element = elements[i];
      if (shouldLoadNow(element) && element.classList.contains("ktlz-loaded") == false) {
        // loadVariants(element);
        myWorker.onmessage = function(e) {
          // console.log(e.data);
          // console.log(document.getElementsByClassName("ktlz-form-pid-"+e.data.pId))
          var ktlzFormPid = document.getElementsByClassName("ktlz-form-pid-"+e.data.pId);
          for (var y=0; y<ktlzFormPid.length; y++) {
            ktlzFormPid[y].innerHTML = e.data.html;
            ktlzFormPid[y].setAttribute("data-pr-vrs", JSON.stringify(e.data.pJson.variants));
          }
        }
        var postWorkerData = {
          handleProduct: element.getAttribute('data-href'),
          productOptionStyle: theme.function.productGridOptionStyle
        }
        myWorker.postMessage(postWorkerData); // Start the worker.
        element.classList.add("ktlz-loaded");
      }
    }
  };
  var checkConnection = function() {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var type = connection !== undefined ? connection.effectiveType : '4g';
    var show = type === '4g' ? true : false;
    return show;
  };
  var checkInnerWidth = function(element) {
  };
  if(checkConnection() == false){
    return false;
  }
  window.onload = function() {
    loadComplete = true;
    loadDynamicVariants();
  };
  window.timeoutOnscroll;
  window.onscroll = function() {
    clearTimeout(window.timeoutOnscroll);
    window.timeoutOnscroll = setTimeout(function(){
      loadDynamicVariants();
    }, 200)
  };
  window.timeoutOnresize;
  window.onresize = function() {
    clearTimeout(window.timeoutOnresize);
    window.timeoutOnresize = setTimeout(function(){
      loadDynamicVariants();
    }, 200)
  };
}
KlzDynamicVariantsLoader(-1, -1, -1, "onVisible", 300, 1, true);