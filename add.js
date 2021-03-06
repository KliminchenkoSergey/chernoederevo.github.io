function t142_checkSize(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var button = rec.querySelector('.t142__submit');
  if (!button) return;
  var buttonStyle = getComputedStyle(button, null);
  var buttonPaddingTop = parseInt(buttonStyle.paddingTop) || 0;
  var buttonPaddingBottom = parseInt(buttonStyle.paddingBottom) || 0;
  var buttonHeight = button.clientHeight - (buttonPaddingTop + buttonPaddingBottom) + 5;
  var textHeight = button.scrollHeight;
  if (buttonHeight < textHeight) {
    button.classList.add('t142__submit-overflowed')
  }
}

function t229_highlight(recid) {
  var url = window.location.href;
  var pathname = window.location.pathname;
  if (url.substr(url.length - 1) === '/') {
    url = url.slice(0, -1)
  }
  if (pathname.substr(pathname.length - 1) === '/') {
    pathname = pathname.slice(0, -1)
  }
  if (pathname.charAt(0) === '/') {
    pathname = pathname.slice(1)
  }
  if (pathname === '') {
    pathname = '/'
  }
  var shouldBeActiveElements = document.querySelectorAll('.t229__list_item a[href=\'' + url + '\'], ' + '.t229__list_item a[href=\'' + url + '/\'], ' + '.t229__list_item a[href=\'' + pathname + '\'], ' + '.t229__list_item a[href=\'/' + pathname + '\'], ' + '.t229__list_item a[href=\'' + pathname + '/\'], ' + '.t229__list_item a[href=\'/' + pathname + '/\']');
  Array.prototype.forEach.call(shouldBeActiveElements, function (link) {
    link.classList.add('t-active')
  })
}

function t229_checkAnchorLinks(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec || window.innerWidth < 980) return;
  var navLinks = rec.querySelectorAll('.t229__list_item a[href*=\'#\']');
  navLinks = Array.prototype.filter.call(navLinks, function (navLink) {
    return !navLink.classList.contains('tooltipstered')
  });
  if (navLinks.length) {
    t229_catchScroll(navLinks)
  }
}

function t229_catchScroll(navLinks) {
  navLinks = Array.prototype.slice.call(navLinks);
  var clickedSectionID = null;
  var sections = [];
  var sectionToNavigationLinkID = {};
  var interval = 100;
  var lastCall;
  var timeoutID;
  if (Array.isArray(navLinks)) {
    navLinks = navLinks.reverse()
  }
  Array.prototype.forEach.call(navLinks, function (link) {
    var currentSection = t229_getSectionByHref(link);
    if (currentSection && currentSection.id) {
      sections.push(currentSection);
      sectionToNavigationLinkID[currentSection.id] = link
    }
  });
  t229_updateSectionsOffsets(sections);
  sections.sort(function (a, b) {
    var firstTopOffset = parseInt(a.getAttribute('data-offset-top'), 10) || 0;
    var secondTopOffset = parseInt(b.getAttribute('data-offset-top'), 10) || 0;
    return secondTopOffset - firstTopOffset
  });
  window.addEventListener('resize', t_throttle(function () {
    t229_updateSectionsOffsets(sections)
  }, 200));
  if (typeof jQuery !== 'undefined') {
    $('.t229').bind('displayChanged', function () {
      t229_updateSectionsOffsets(sections)
    })
  } else {
    var menuEls = document.querySelectorAll('.t229');
    Array.prototype.forEach.call(menuEls, function (menu) {
      menu.addEventListener('displayChanged', function () {
        t229_updateSectionsOffsets(sections)
      })
    })
  }
  setInterval(function () {
    t229_updateSectionsOffsets(sections)
  }, 5000);
  t229_highlightNavLinks(navLinks, sections, sectionToNavigationLinkID, clickedSectionID);
  Array.prototype.forEach.call(navLinks, function (navLink, i) {
    navLink.addEventListener('click', function () {
      var clickedSection = t229_getSectionByHref(navLink);
      if (!navLink.classList.contains('tooltipstered') && clickedSection && clickedSection.id) {
        navLinks.forEach(function (link, index) {
          if (index === i) {
            link.classList.add('t-active')
          } else {
            link.classList.remove('t-active')
          }
        });
        clickedSectionID = clickedSection.id
      }
    })
  });
  window.addEventListener('scroll', function () {
    var dateNow = new Date().getTime();
    if (lastCall && dateNow < lastCall + interval) {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function () {
        lastCall = dateNow;
        clickedSectionID = t229_highlightNavLinks(navLinks, sections, sectionToNavigationLinkID, clickedSectionID)
      }, interval - (dateNow - lastCall))
    } else {
      lastCall = dateNow;
      clickedSectionID = t229_highlightNavLinks(navLinks, sections, sectionToNavigationLinkID, clickedSectionID)
    }
  })
}

function t229_updateSectionsOffsets(sections) {
  sections.forEach(function (section) {
    var sectionTopPos = section.getBoundingClientRect().top + window.pageYOffset;
    section.setAttribute('data-offset-top', sectionTopPos)
  })
}

function t229_getSectionByHref(curlink) {
  if (!curlink) return;
  var href = curlink.getAttribute('href');
  var curLinkValue = href ? href.replace(/\s+/g, '') : '';
  if (curLinkValue.indexOf('/') === 0) curLinkValue = curLinkValue.slice(1);
  if (href && curlink.matches('[href*="#rec"]')) {
    curLinkValue = curLinkValue.replace(/.*#/, '');
    return document.getElementById(curLinkValue)
  } else {
    var selector = href ? href.trim() : '';
    var slashIndex = selector.indexOf('#') !== -1 ? selector.indexOf('#') : !1;
    if (typeof slashIndex === 'number') {
      selector = selector.slice(slashIndex + 1)
    } else {
      slashIndex = selector.indexOf('/') !== -1 ? selector.indexOf('/') : !1;
      if (typeof slashIndex === 'number') selector = selector.slice(slashIndex + 1)
    }
    var fullSelector = '.r[data-record-type="215"] a[name="' + selector + '"]';
    return document.querySelector(fullSelector) ? document.querySelector(fullSelector).closest('.r') : null
  }
}

function t229_highlightNavLinks(navLinks, sections, sectionToNavigationLinkID, clickedSectionID) {
  var scrollPosition = window.pageYOffset;
  var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  var returnValue = clickedSectionID;
  var lastSection = sections.length ? sections[sections.length - 1] : null;
  var lastSectionTopPos = lastSection ? lastSection.getAttribute('data-offset-top') : '0';
  lastSectionTopPos = parseInt(lastSectionTopPos, 10) || 0;
  if (sections.length && clickedSectionID === null && lastSectionTopPos > (scrollPosition + 300)) {
    navLinks.forEach(function (link) {
      link.classList.remove('t-active')
    });
    return null
  }
  for (var i = 0; i < sections.length; i++) {
    var sectionTopPos = sections[i].getAttribute('data-offset-top');
    var navLink = sections[i].id ? sectionToNavigationLinkID[sections[i].id] : null;
    if (scrollPosition + 300 >= sectionTopPos || i === 0 && scrollPosition >= scrollHeight - window.innerHeight) {
      if (clickedSectionID === null && navLink && !navLink.classList.contains('t-active')) {
        navLinks.forEach(function (link) {
          link.classList.remove('t-active')
        });
        if (navLink) navLink.classList.add('t-active');
        returnValue = null
      } else if (clickedSectionID !== null && sections[i].id && clickedSectionID === sections[i].id) {
        returnValue = null
      }
      break
    }
  }
  return returnValue
}

function t229_setBg(recid) {
  var menuBlocks = document.querySelectorAll('.t229');
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    if (window.innerWidth > 980) {
      if (menu.getAttribute('data-bgcolor-setbyscript') === 'yes') {
        menu.style.backgroundColor = menu.getAttribute('data-bgcolor-rgba')
      }
    } else {
      menu.style.backgroundColor = menu.getAttribute('data-bgcolor-hex');
      menu.setAttribute('data-bgcolor-setbyscript', 'yes');
      if (menu.style.transform) menu.style.transform = '';
      if (menu.style.opacity) menu.style.opacity = ''
    }
  })
}

function t229_appearMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec || window.innerWidth <= 980) return;
  var menuBlocks = rec.querySelectorAll('.t229');
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var appearOffset = menu.getAttribute('data-appearoffset');
    if (appearOffset) {
      if (appearOffset.indexOf('vh') !== -1) {
        appearOffset = Math.floor((window.innerHeight * (parseInt(appearOffset) / 100)))
      }
      appearOffset = parseInt(appearOffset, 10);
      var menuHeight = menu.clientHeight;
      if (typeof appearOffset === 'number' && window.pageYOffset >= appearOffset) {
        if (menu.style.transform === 'translateY(-' + menuHeight + 'px)') {
          t229_slideUpElement(menu, menuHeight, 'toBottom')
        }
      } else if (menu.style.transform === 'translateY(0px)') {
        t229_slideUpElement(menu, menuHeight, 'toTop')
      } else {
        menu.style.transform = 'translateY(-' + menuHeight + 'px)';
        menu.style.opacity = '0'
      }
    }
  })
}

function t229_slideUpElement(menu, menuHeight, position) {
  var diff = position === 'toTop' ? 0 : menuHeight;
  var diffOpacity = position === 'toTop' ? 1 : 0;
  var timerID = setInterval(function () {
    menu.style.transform = 'translateY(-' + diff + 'px)';
    menu.style.opacity = diffOpacity.toString();
    diffOpacity = position === 'toTop' ? diffOpacity - 0.1 : diffOpacity + 0.1;
    diff = position === 'toTop' ? diff + (menuHeight / 20) : diff - (menuHeight / 20);
    if (position === 'toTop' && diff >= menuHeight) {
      menu.style.transform = 'translateY(-' + menuHeight + 'px)';
      menu.style.opacity = '0';
      clearInterval(timerID)
    }
    if (position === 'toBottom' && diff <= 0) {
      menu.style.transform = 'translateY(0px)';
      menu.style.opacity = '1';
      clearInterval(timerID)
    }
  }, 10)
}

function t229_changeBgOpacityMenu(recid) {
  if (window.innerWidth <= 980) return;
  var menuBlocks = document.querySelectorAll('.t229');
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var bgColor = menu.getAttribute('data-bgcolor-rgba');
    var bgColorAfterScroll = menu.getAttribute('data-bgcolor-rgba-afterscroll');
    var bgOpacity = menu.getAttribute('data-bgopacity');
    var bgOpacityTwo = menu.getAttribute('data-bgopacity-two');
    var menuShadow = menu.getAttribute('data-menushadow') || '0';
    var menuShadowValue = menuShadow === '100' ? menuShadow : '0.' + menuShadow;
    menu.style.backgroundColor = window.pageYOffset > 20 ? bgColorAfterScroll : bgColor;
    if (window.pageYOffset > 20 && bgOpacityTwo === '0' || window.pageYOffset <= 20 && bgOpacity === '0.0' || menuShadow === ' ') {
      menu.style.boxShadow = 'none'
    } else {
      menu.style.boxShadow = '0px 1px 3px rgba(0,0,0,' + menuShadowValue + ')'
    }
  })
}

function t270_scroll(hash, offset, speed) {
  if (hash.indexOf('#!/tproduct/') !== -1 || hash.indexOf('#!/tab/') !== -1) {
    return !0
  }
  var root = $('html, body');
  var target = "";
  if (speed === undefined) {
    speed = 400
  }
  try {
    target = $(hash)
  } catch (event) {
    console.log("Exception t270: " + event.message);
    return !0
  }
  if (target.length === 0) {
    target = $('a[name="' + hash.substr(1) + '"]');
    if (target.length === 0) {
      return !0
    }
  }
  var isHistoryChangeAllowed = window.location.hash !== hash;
  var complete = function () {
    if (!isHistoryChangeAllowed) {
      return
    }
    if (history.pushState) {
      history.pushState(null, null, hash)
    } else {
      window.location.hash = hash
    }
    isHistoryChangeAllowed = !1
  }
  var dontChangeHistory = Boolean($('.t270').attr('data-history-disabled'));
  if (dontChangeHistory) {
    complete = function () {}
  }
  root.animate({
    scrollTop: target.offset().top - offset
  }, speed, complete);
  return !0
}

function t282_showMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return;
  var menu = rec.querySelector('.t282');
  var menuLinks = rec.querySelectorAll('.t-menusub__link-item');
  var menuContainer = rec.querySelector('.t282__container');
  var menuAndOverlay = rec.querySelectorAll('.t282__menu__container, .t282__overlay');
  var canBeClickedItems = rec.querySelectorAll('.t282__burger, .t282__menu__item:not(.tooltipstered):not(.t282__menu__item_submenu), .t282__overlay');
  Array.prototype.forEach.call(canBeClickedItems, function (element) {
    element.addEventListener('click', function () {
      if (element.closest('.t282__menu__item.tooltipstered, .t794__tm-link, .t978__tm-link, .t966__tm-link')) return;
      document.body.classList.toggle('t282_opened');
      Array.prototype.forEach.call(menuAndOverlay, function (el) {
        el.classList.toggle('t282__closed')
      });
      var menuBlock = rec.querySelector('.t282__menu__container');
      var menuContainerHeight = menuContainer ? menuContainer.getBoundingClientRect().height : 0;
      if (menuBlock) menuBlock.style.top = menuContainerHeight + 'px';
      t282_highlight(recid)
    })
  });
  menu.addEventListener('clickedAnchorInTooltipMenu', function () {
    document.body.classList.remove('t282_opened');
    Array.prototype.forEach.call(menuAndOverlay, function (el) {
      el.classList.add('t282__closed')
    })
  });
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('t282_opened');
      Array.prototype.forEach.call(menuAndOverlay, function (el) {
        el.classList.add('t282__closed')
      })
    })
  })
}

function t282_changeSize(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return;
  var menu = rec.querySelector('.t282__container');
  var menuContainer = rec.querySelector('.t282__menu__container');
  var menuWrapper = document.getElementById('nav' + recid);
  var menuHeight = menu ? menu.offsetHeight : 0;
  var menuContainerHeight = menuContainer ? menuContainer.offsetHeight : 0;
  if (menuHeight > document.documentElement.clientHeight - menuContainerHeight) {
    if (menuWrapper) menuWrapper.classList.add('t282__menu_static')
  } else {
    if (menuWrapper) menuWrapper.classList.remove('t282__menu_static')
  }
}

function t282_changeBgOpacityMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return;
  var menuBlocks = rec.querySelectorAll('.t282__container__bg');
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var bgColor = menu.getAttribute('data-bgcolor-rgba');
    var bgColorAfterScroll = menu.getAttribute('data-bgcolor-rgba-afterscroll');
    var bgOpacity = menu.getAttribute('data-bgopacity');
    var bgOpacityTwo = menu.getAttribute('data-bgopacity2');
    var menuShadow = menu.getAttribute('data-menu-shadow') || '0';
    var menuShadowValue = menuShadow === '100' ? menuShadow : '0.' + menuShadow;
    menu.style.backgroundColor = window.pageYOffset > 20 ? bgColorAfterScroll : bgColor;
    if (window.pageYOffset > 20 && bgOpacityTwo === '0' || window.pageYOffset <= 20 && bgOpacity === '0.0' || menuShadow === ' ') {
      menu.style.boxShadow = 'none'
    } else {
      menu.style.boxShadow = '0px 1px 3px rgba(0,0,0,' + menuShadowValue + ')'
    }
  })
}

function t282_highlight(recid) {
  var url = window.location.href;
  var pathname = window.location.pathname;
  var hash = window.location.hash;
  if (url.substr(url.length - 1) === '/') {
    url = url.slice(0, -1)
  }
  if (pathname.substr(pathname.length - 1) === '/') {
    pathname = pathname.slice(0, -1)
  }
  if (pathname.charAt(0) === '/') {
    pathname = pathname.slice(1)
  }
  if (pathname === '') {
    pathname = '/'
  }
  var shouldBeActiveElements = document.querySelectorAll('.t282__menu a[href=\'' + url + '\'], ' + '.t282__menu a[href=\'' + url + '/\'], ' + '.t282__menu a[href=\'' + pathname + '\'], ' + '.t282__menu a[href=\'/' + pathname + '\'], ' + '.t282__menu a[href=\'' + pathname + '/\'], ' + '.t282__menu a[href=\'/' + pathname + '/\']' + (hash ? ', .t282__menu a[href=\'' + hash + '\']' : '') + (hash ? ', .t282__menu a[href=\'/' + hash + '\']' : '') + (hash ? ', .t282__menu a[href=\'' + hash + '/\']' : '') + (hash ? ', .t282__menu a[href=\'/' + hash + '/\']' : ''));
  var rec = document.getElementById('rec' + recid);
  var menuLinks = rec ? rec.querySelectorAll('.t282__menu a') : [];
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.classList.remove('t-active')
  });
  Array.prototype.forEach.call(shouldBeActiveElements, function (link) {
    link.classList.add('t-active')
  })
}

function t282_appearMenu(recid) {
  var record = document.getElementById('rec' + recid);
  var menuBlock = record.querySelector('.t282');
  var fixedMenu = menuBlock ? menuBlock.querySelector('.t282__positionfixed') : null;
  if (!fixedMenu) return;
  var appearOffset = menuBlock.getAttribute('data-appearoffset');
  if (appearOffset && appearOffset.indexOf('vh') !== -1) {
    appearOffset = Math.floor((window.innerHeight * (parseInt(appearOffset) / 100)))
  }
  appearOffset = parseInt(appearOffset, 10);
  var menuHeight = fixedMenu.clientHeight;
  if (typeof appearOffset === 'number' && window.pageYOffset >= appearOffset) {
    if (fixedMenu.style.transform === 'translateY(-' + menuHeight + 'px)') {
      t282_slideUpElement(fixedMenu, menuHeight, 'toBottom')
    }
  } else if (fixedMenu.style.transform === 'translateY(0px)') {
    t282_slideUpElement(fixedMenu, menuHeight, 'toTop')
  } else {
    fixedMenu.style.transform = 'translateY(-' + menuHeight + 'px)';
    fixedMenu.style.opacity = '0'
  }
}

function t282_slideUpElement(menu, menuHeight, direction) {
  var diff = direction === 'toTop' ? 0 : menuHeight;
  var diffOpacity = direction === 'toTop' ? 1 : 0;
  var timerID = setInterval(function () {
    menu.style.transform = 'translateY(-' + diff + 'px)';
    menu.style.opacity = diffOpacity.toString();
    diffOpacity = direction === 'toTop' ? diffOpacity - 0.1 : diffOpacity + 0.1;
    diff = direction === 'toTop' ? diff + (menuHeight / 20) : diff - (menuHeight / 20);
    if (direction === 'toTop' && diff >= menuHeight) {
      menu.style.transform = 'translateY(-' + menuHeight + 'px)';
      menu.style.opacity = '0';
      clearInterval(timerID)
    }
    if (direction === 'toBottom' && diff <= 0) {
      menu.style.transform = 'translateY(0px)';
      menu.style.opacity = '1';
      clearInterval(timerID)
    }
  }, 10)
}

function t331_initPopup(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return !1;
  rec.setAttribute('data-animationappear', 'off');
  rec.style.opacity = '1';
  var currentBlock = rec.querySelector('.t-popup');
  var currentHook = currentBlock ? currentBlock.getAttribute('data-tooltip-hook') : '';
  var currentAnalitics = currentBlock ? currentBlock.getAttribute('data-track-popup') : '';
  if (!currentHook) return !1;
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href="' + currentHook + '"]')) {
      e.preventDefault();
      t331_showPopup(recid);
      t331_resizePopup(recid);
      if (currentAnalitics) {
        var virtTitle = currentHook;
        if (virtTitle.substring(0, 7) === '#popup:') virtTitle = virtTitle.substring(7);
        Tilda.sendEventToStatistics(currentAnalitics, virtTitle)
      }
    }
  })
}

function t331_setHeight(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return !1;
  var videoCarrier = rec.querySelector('.t331__video-carier');
  var carrierParent = videoCarrier ? videoCarrier.parentNode : null;
  var videoWidth = videoCarrier ? videoCarrier.getAttribute('data-video-width') : '0';
  var videoHeight = videoCarrier ? videoCarrier.getAttribute('data-video-height') : '0';
  if (videoHeight.indexOf('vh') !== -1) {
    videoHeight = parseInt(videoHeight, 10) * window.innerHeight / 100
  } else {
    videoHeight = parseInt(videoHeight, 10)
  }
  var ratio = videoHeight / (parseInt(videoWidth, 10) || 1);
  var videoCurrentWidth = videoCarrier ? videoCarrier.offsetWidth : 0;
  var calculatedHeight = videoCurrentWidth * ratio;
  if (videoCarrier) videoCarrier.style.height = calculatedHeight + 'px';
  if (carrierParent) carrierParent.style.height = calculatedHeight + 'px'
}

function t331_showPopup(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return !1;
  var popup = rec.querySelector('.t-popup');
  var videoContainer = rec.querySelector('.t331__youtube');
  var videoCarrier = rec.querySelector('.t331__video-carier');
  var isVideoCarrierExist = !!videoCarrier.querySelector('iframe');
  if (isVideoCarrierExist) return;
  var videoID = videoContainer ? videoContainer.getAttribute('data-content-popup-video-url-youtube') : '';
  var videoURL = videoID ? 'https://www.youtube.com/embed/' + videoID : '';
  if (videoCarrier) {
    var iframe = document.createElement('iframe');
    iframe.id = 'youtubeiframe' + recid;
    iframe.classList.add('t331__iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.src = videoURL + (videoURL.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1&rel=0';
    iframe.frameBorder = '0';
    iframe.setAttribute('allowfullscreen', '');
    videoCarrier.insertAdjacentElement('beforeend', iframe)
  }
  if (popup) popup.style.display = 'block';
  t331_setHeight(recid);
  setTimeout(function () {
    var popupContainer = popup ? popup.querySelector('.t-popup__container') : null;
    if (popupContainer) popupContainer.classList.add('t-popup__container-animated');
    if (popup) popup.classList.add('t-popup_show')
  }, 50);
  document.body.classList.add('t-body_popupshowed');
  document.body.classList.add('t331__body_popupshowed');
  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) t331_popup_close(recid)
    })
  }
  var popupClose = popup ? popup.querySelector('.t-popup__close') : null;
  if (popupClose) {
    popupClose.addEventListener('click', function () {
      t331_popup_close(recid)
    })
  }
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) t331_popup_close(recid)
  })
}

function t331_popup_close(recid) {
  document.body.classList.remove('t-body_popupshowed');
  document.body.classList.remove('t331__body_popupshowed');
  var rec = document.getElementById('rec' + recid);
  if (!rec) return !1;
  var popup = rec.querySelector('.t-popup');
  var videoCarrier = rec.querySelector('.t331__video-carier');
  if (popup) popup.classList.remove('t-popup_show');
  setTimeout(function () {
    if (videoCarrier) videoCarrier.innerHTML = '';
    if (popup && !popup.classList.contains('t-popup_show')) {
      popup.style.display = 'none'
    }
  }, 300)
}

function t331_resizePopup(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return !1;
  var popupContainer = rec.querySelector('.t-popup__container');
  var popupContainerHeight = popupContainer ? popupContainer.offsetHeight : 0;
  if (popupContainerHeight > window.innerHeight) {
    if (popupContainer) {
      popupContainer.classList.add('t-popup__container-static')
    }
  } else if (popupContainer) {
    popupContainer.classList.remove('t-popup__container-static')
  }
}

function t331_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0, 7) === '#popup:') {
    popupname = popupname.substring(7)
  }
  virtPage += popupname;
  virtTitle += popupname;
  if (ga) {
    if (window.mainTracker !== 'tilda') {
      ga('send', {
        'hitType': 'pageview',
        'page': virtPage,
        'title': virtTitle
      })
    }
  }
  if (window.mainMetrika > '' && window[window.mainMetrika]) {
    window[window.mainMetrika].hit(virtPage, {
      title: virtTitle,
      referer: window.location.href
    })
  }
}

function t390_initPopup(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t390');
  if (!container) return;
  rec.setAttribute('data-animationappear', 'off');
  rec.style.opacity = 1;
  var popup = rec.querySelector('.t-popup');
  var popupTooltipHook = popup.getAttribute('data-tooltip-hook');
  var analitics = popup.getAttribute('data-track-popup');
  var popupCloseBtn = popup.querySelector('.t-popup__close');
  var hrefs = rec.querySelectorAll('a[href*="#"]');
  var escapeEvent = t390_escClosePopup.bind(this, recId);
  if (popupTooltipHook) {
    var recBlocks = document.querySelectorAll('.r');
    for (var i = 0; i < recBlocks.length; i++) {
      recBlocks[i].addEventListener('click', function (event) {
        var target = event.target;
        var href = target.closest('a[href="' + popupTooltipHook + '"]') ? target : !1;
        if (!href) return;
        event.preventDefault();
        t390_showPopup(recId, escapeEvent);
        t390_resizePopup(recId);
        t390__lazyLoad();
        if (analitics) {
          Tilda.sendEventToStatistics(analitics, popupTooltipHook)
        }
      })
    }
  }
  popup.addEventListener('scroll', t_throttle(function () {
    t390__lazyLoad()
  }));
  popup.addEventListener('click', function (event) {
    if (event.target === this) t390_closePopup(recId, escapeEvent)
  });
  popupCloseBtn.addEventListener('click', function () {
    t390_closePopup(recId, escapeEvent)
  });
  for (var i = 0; i < hrefs.length; i++) {
    hrefs[i].addEventListener('click', function () {
      var url = this.getAttribute('href');
      if (!url || url.substring(0, 7) != '#price:') {
        t390_closePopup(recId, escapeEvent);
        if (!url || url.substring(0, 7) == '#popup:') {
          setTimeout(function () {
            document.body.classList.add('t-body_popupshowed')
          }, 300)
        }
      }
    })
  }
  var curPath = window.location.pathname;
  var curFullPath = window.location.origin + curPath;
  var isAndroid = /(android)/i.test(navigator.userAgent);
  if (isAndroid) {
    var selects = 'a[href^="#"]:not([href="#"]):not([href^="#price"]):not([href^="#popup"]):not([href^="#prodpopup"]):not([href^="#order"]):not([href^="#!"]),' + 'a[href^="' + curPath + '#"]:not([href*="#!/tproduct/"]):not([href*="#!/tab/"]):not([href*="#popup"]),' + 'a[href^="' + curFullPath + '#"]:not([href*="#!/tproduct/"]):not([href*="#!/tab/"]):not([href*="#popup"])';
    var selectors = rec.querySelectorAll(selects);
    for (var i = 0; i < selectors.length; i++) {
      selectors[i].addEventListener('click', function (event) {
        var hash = this.hash.trim();
        if (window.location.hash) {
          setTimeout(function () {
            window.location.href = hash
          }, 50)
        }
      })
    }
  }

  function t390_escClosePopup(recId) {
    if (arguments[1].key === 'Escape') t390_closePopup(recId, escapeEvent)
  }
}

function t390_showPopup(recId, escapeEvent) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t390');
  if (!container) return;
  var popup = rec.querySelector('.t-popup');
  var popupContainer = popup.querySelector('.t-popup__container');
  var documentBody = document.body;
  popup.style.display = 'block';
  setTimeout(function () {
    popupContainer.classList.add('t-popup__container-animated');
    popup.classList.add('t-popup_show')
  }, 50);
  documentBody.classList.add('t-body_popupshowed');
  documentBody.classList.add('t390__body_popupshowed');
  document.addEventListener('keydown', escapeEvent)
}

function t390_closePopup(recId, escapeEvent) {
  var rec = document.getElementById('rec' + recId);
  var popup = rec.querySelector('.t-popup');
  var popupActive = document.querySelector('.t-popup.t-popup_show');
  if (popup === popupActive) {
    document.body.classList.remove('t-body_popupshowed');
    document.body.classList.remove('t390__body_popupshowed')
  }
  popup.classList.remove('t-popup_show');
  setTimeout(function () {
    var popupHide = document.querySelectorAll('.t-popup:not(.t-popup_show)');
    for (var i = 0; i < popupHide.length; i++) {
      popupHide[i].style.display = 'none'
    }
  }, 300);
  document.removeEventListener('keydown', escapeEvent)
}

function t390_resizePopup(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var popupContainer = rec.querySelector('.t-popup__container');
  if (!popupContainer) return;
  var popupStyle = getComputedStyle(popupContainer, null);
  var popupPaddingTop = parseInt(popupStyle.paddingTop) || 0;
  var popupPaddingBottom = parseInt(popupStyle.paddingBottom) || 0;
  var popupHeight = popupContainer.clientHeight - (popupPaddingTop + popupPaddingBottom);
  if (popupHeight > (window.innerHeight - 120)) {
    popupContainer.classList.add('t-popup__container-static')
  } else {
    popupContainer.classList.remove('t-popup__container-static')
  }
}

function t390_sendPopupEventToStatistics(popupName) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupName.substring(0, 7) == '#popup:') {
    popupName = popupName.substring(7)
  }
  virtPage += popupName;
  virtTitle += popupName;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
  } else {
    if (ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {
          'hitType': 'pageview',
          'page': virtPage,
          'title': virtTitle
        })
      }
    }
    if (window.mainMetrika && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {
        title: virtTitle,
        referer: window.location.href
      })
    }
  }
}

function t390__lazyLoad() {
  if (window.lazy === 'y' || document.getElementById('allrecords').getAttribute('data-tilda-lazy') === 'yes') {
    t_onFuncLoad('t_lazyload_update', function () {
      t_lazyload_update()
    })
  }
}

function t396_init(recid) {
  var data = '';
  var resolution = t396_detectResolution();
  var allRecords = document.getElementById('allrecords');
  var record = document.getElementById('rec' + recid);
  var zeroBlock = record ? record.querySelector('.t396') : null;
  var artBoard = record ? record.querySelector('.t396__artboard') : null;
  window.tn_window_width = document.documentElement.clientWidth;
  window.tn_scale_factor = Math.round((window.tn_window_width / resolution) * 100) / 100;
  t396_initTNobj();
  t396_switchResolution(resolution);
  t396_updateTNobj();
  t396_artboard_build(data, recid);
  var isTouchDevice = 'ontouchend' in document;
  window.addEventListener('resize', function () {
    tn_console('>>>> t396: Window on Resize event >>>>');
    t396_waitForFinalEvent(function () {
      if (window.isMobile || isTouchDevice) {
        if (document.documentElement.clientWidth !== window.tn_window_width) {
          t396_doResize(recid)
        }
      } else {
        t396_doResize(recid)
      }
    }, 500, 'resizeruniqueid' + recid)
  });
  window.addEventListener('orientationchange', function () {
    tn_console('>>>> t396: Orient change event >>>>');
    t396_waitForFinalEvent(function () {
      t396_doResize(recid)
    }, 600, 'orientationuniqueid' + recid)
  });
  window.addEventListener('load', function () {
    t396_allelems__renderView(artBoard);
    var blockOverflow = artBoard ? window.getComputedStyle(artBoard).getPropertyValue('overflow') : '';
    if (typeof t_lazyload_update === 'function' && blockOverflow === 'auto' && artBoard) {
      artBoard.addEventListener('scroll', t_throttle(function () {
        var dataLazy = allRecords ? allRecords.getAttribute('data-tilda-lazy') : null;
        if (window.lazy === 'y' || dataLazy === 'yes') {
          t_onFuncLoad('t_lazyload_update', function () {
            t_lazyload_update()
          })
        }
      }, 500))
    }
    if (window.location.hash !== '' && blockOverflow === 'visible') {
      if (artBoard) artBoard.style.overflow = 'hidden';
      setTimeout(function () {
        if (artBoard) artBoard.style.overflow = 'visible'
      }, 1)
    }
  });
  if (document.querySelector('.t830')) {
    window.addEventListener('load', function () {
      if (allRecords.classList.contains('t830__allrecords_padd') || allRecords.classList.contains('t830__allrecords_padd-small')) {
        t396_doResize(recid)
      }
    })
  }
  if (record && zeroBlock && artBoard && record.getAttribute('data-connect-with-tab') === 'yes') {
    zeroBlock.addEventListener('displayChanged', function () {
      t396_allelems__renderView(artBoard);
      t396_doResize(recid)
    });
    $(zeroBlock).bind('displayChanged', function () {
      t396_allelems__renderView(artBoard);
      t396_doResize(recid)
    })
  }
  setTimeout(function () {
    if (record && record.closest('#allrecordstable') && zeroBlock && artBoard) {
      zeroBlock.addEventListener('displayChanged', function () {
        t396_allelems__renderView(artBoard);
        t396_doResize(recid)
      });
      $(zeroBlock).bind('displayChanged', function () {
        t396_allelems__renderView(artBoard);
        t396_doResize(recid)
      })
    }
  }, 1000);
  if (window.isSafari && zeroBlock) {
    zeroBlock.classList.add('t396_safari')
  }
  var isScaled = t396_ab__getFieldValue(artBoard, 'upscale') === 'window';
  var isTildaModeEdit = allRecords ? allRecords.getAttribute('data-tilda-mode') === 'edit' : null;
  if (isScaled && !isTildaModeEdit) t396_scaleBlock(recid)
}

function t396_isOnlyScalableBrowser() {
  var isFirefox = navigator.userAgent.search('Firefox') !== -1;
  var isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') !== -1;
  return isFirefox || isOpera
}

function t396_scaleBlock(recid) {
  var isOnlyScalable = t396_isOnlyScalableBrowser();
  var resolution = t396_detectResolution();
  var record = document.getElementById('rec' + recid);
  var elements = record ? record.querySelectorAll('.t396__elem') : [];
  var artBoard = record ? record.querySelector('.t396__artboard') : null;
  if (artBoard) {
    var artBoardWidth = artBoard.clientWidth;
    var updatedBlockHeight = Math.floor(artBoard.clientHeight * window.tn_scale_factor);
    var artBoardHeightVH = t396_ab__getFieldValue(artBoard, 'height_vh');
    window.tn_scale_offset = (artBoardWidth * window.tn_scale_factor - artBoardWidth) / 2;
    if (artBoardHeightVH) {
      var artBoardMinHeight = t396_ab__getFieldValue(artBoard, 'height');
      var artBoardMaxHeight = t396_ab__getHeight(artBoard);
      var scaledMinHeight = artBoardMinHeight * window.tn_scale_factor;
      updatedBlockHeight = (scaledMinHeight >= artBoardMaxHeight) ? scaledMinHeight : artBoardMaxHeight
    }
    artBoard.classList.add('t396__artboard_scale');
    var styleStr = '<style class="t396__scale-style">' + '.t-rec#rec' + recid + ' { overflow: visible; }' + '#rec' + recid + ' .t396__carrier,' + '#rec' + recid + ' .t396__filter,' + '#rec' + recid + ' .t396__artboard {' + 'height: ' + updatedBlockHeight + 'px !important;' + 'width: 100vw !important;' + 'max-width: 100%;' + '}' + '</style>';
    artBoard.insertAdjacentHTML('beforeend', styleStr)
  }
  Array.prototype.forEach.call(elements, function (elem) {
    var atom = elem.querySelector('.tn-atom');
    var containerProp = t396_elem__getFieldValue(elem, 'container');
    if (containerProp === 'grid') {
      if (isOnlyScalable) {
        if (atom) {
          var atomParent = atom.parentNode;
          var div = document.createElement('div');
          div.classList.add('tn-atom__scale-wrapper');
          div.style.transform = 'scale(' + window.tn_scale_factor + ')';
          if (atomParent) atomParent.removeChild(atom);
          div.appendChild(atom);
          if (atomParent) atomParent.appendChild(div)
        }
      } else {
        elem.style.zoom = window.tn_scale_factor;
        if (elem.getAttribute('data-elem-type') === 'shape') {
          var elemHeight = t396_elem__getFieldValue(elem, 'height');
          elemHeight = t396_elem__getHeight(elem, elemHeight);
          elemHeight = parseFloat(elemHeight).toFixed(1);
          var elemWidth = t396_elem__getFieldValue(elem, 'width');
          elemWidth = t396_elem__getWidth(elem, elemWidth);
          elemWidth = parseFloat(elemWidth).toFixed(1);
          var rect = elem.querySelector('rect');
          var elemStyles = window.getComputedStyle(atom);
          var elemColor = rect ? window.getComputedStyle(rect).fill : elemStyles.backgroundColor;
          var elemBorder = elemStyles.borderWidth;
          var div = elem.querySelector('div');
          var isImage = !1;
          if (div && getComputedStyle(div, null).backgroundImage !== 'none') {
            isImage = !0
          }
          if ((elemHeight <= 2 || elemWidth <= 2) && elemBorder === '0px' && !isImage) {
            elem.innerHTML = '<svg class="tn-atom" xmlns="http://www.w3.org/2000/svg" width="' + elemWidth + '" height="' + elemHeight + '" viewBox="0 0 ' + elemWidth + ' ' + elemHeight + '" fill="none">' + '<rect width="' + elemWidth + '" height="' + elemHeight + '" fill="' + elemColor + '"/>' + '</svg>';
            var svg = elem.querySelector('svg');
            var svgStyles = window.getComputedStyle(svg);
            var svgBorder = parseFloat(svgStyles.borderBlockWidth);
            svg.style.backgroundColor = 'unset';
            svg.style.display = 'block';
            svg.style.border = 'none';
            if (elemHeight <= 2) {
              elem.style.marginLeft = '-' + svgBorder * 2 + 'px';
              svg.style.width = parseInt(elemWidth) + svgBorder * 2 + 'px';
              var rect = elem.querySelector('rect');
              rect.style.width = parseInt(elemWidth) + svgBorder * 2 + 'px'
            }
            if (elemWidth <= 2) {
              var currentSVGHeight = parseInt(elemHeight) + svgBorder * 4;
              svg.setAttribute('viewBox', '0 0 ' + elemWidth + ' ' + currentSVGHeight.toFixed(1));
              var rect = elem.querySelector('rect');
              rect.setAttribute('height', parseInt(elemHeight) + svgBorder * 4)
            }
          }
        }
        if (elem.getAttribute('data-elem-type') === 'text' && resolution < 1200 && atom) {
          atom.style.webkitTextSizeAdjust = 'auto'
        }
        if (atom) atom.style.transformOrigin = 'center'
      }
    }
  })
}

function t396_doResize(recid) {
  var isOnlyScalable = t396_isOnlyScalableBrowser();
  var record = document.getElementById('rec' + recid);
  var allRecords = document.getElementById('allrecords');
  var resolution = t396_detectResolution();
  var scaleStyle = record ? record.querySelector('.t396__scale-style') : null;
  t396_removeElementFromDOM(scaleStyle);
  if (!isOnlyScalable) {
    var elements = record ? record.querySelectorAll('.t396__elem') : [];
    Array.prototype.forEach.call(elements, function (element) {
      element.style.zoom = '';
      var atom = element.querySelector('.tn-atom');
      if (atom) atom.style.transformOrigin = ''
    })
  } else {
    var atoms = record ? record.querySelectorAll('.tn-atom') : [];
    Array.prototype.forEach.call(atoms, function (atom) {
      var atomWrapper = atom.closest('.tn-atom__scale-wrapper');
      var atomParent = atomWrapper ? atomWrapper.parentNode : null;
      if (atomParent) atomParent.removeChild(atomWrapper);
      if (atomParent) atomParent.appendChild(atom)
    })
  }
  var artBoard = record ? record.querySelector('.t396__artboard') : null;
  var artBoardWidth = artBoard ? artBoard.clientWidth : 0;
  window.tn_window_width = window.isMobile ? document.documentElement.clientWidth : window.innerWidth;
  window.tn_scale_factor = Math.round((window.tn_window_width / resolution) * 100) / 100;
  window.tn_scale_offset = (artBoardWidth * window.tn_scale_factor - artBoardWidth) / 2;
  t396_switchResolution(resolution);
  t396_updateTNobj();
  t396_ab__renderView(artBoard);
  t396_allelems__renderView(artBoard);
  var tildaMode = allRecords ? allRecords.getAttribute('data-tilda-mode') : '';
  var isScaled = t396_ab__getFieldValue(artBoard, 'upscale') === 'window';
  if (isScaled && tildaMode !== 'edit') t396_scaleBlock(recid)
}

function t396_detectResolution() {
  var windowWidth = window.isMobile ? document.documentElement.clientWidth : window.innerWidth;
  var resolution = 1200;
  var breakpoints = [1200, 960, 640, 480, 320];
  for (var i = 0; i < breakpoints.length - 1; i++) {
    if (windowWidth < breakpoints[i]) {
      resolution = breakpoints[i + 1]
    }
  }
  return resolution
}

function t396_initTNobj() {
  tn_console('func: initTNobj');
  window.tn = {};
  window.tn.canvas_min_sizes = ['320', '480', '640', '960', '1200'];
  window.tn.canvas_max_sizes = ['480', '640', '960', '1200', ''];
  window.tn.ab_fields = ['height', 'width', 'bgcolor', 'bgimg', 'bgattachment', 'bgposition', 'filteropacity', 'filtercolor', 'filteropacity2', 'filtercolor2', 'height_vh', 'valign']
}

function t396_updateTNobj() {
  tn_console('func: updateTNobj');
  var allRecords = document.getElementById('allrecords');
  var allRecPaddingLeft = allRecords ? window.getComputedStyle(allRecords).paddingLeft || '0' : '0';
  allRecPaddingLeft = parseInt(allRecPaddingLeft, 10);
  var allRecPaddingRight = allRecords ? window.getComputedStyle(allRecords).paddingRight || '0' : '0';
  allRecPaddingRight = parseInt(allRecPaddingRight, 10);
  if (window.zero_window_width_hook && window.zero_window_width_hook === 'allrecords' && allRecords) {
    window.tn.window_width = allRecords.clientWidth - (allRecPaddingLeft + allRecPaddingRight)
  } else {
    window.tn.window_width = document.documentElement.clientWidth
  }
  window.tn.window_height = document.documentElement.clientHeight;
  window.tn.curResolution;
  var breakpoints = [1200, 960, 640, 480, 320];
  for (var i = 0; i < breakpoints.length; i++) {
    if (+window.tn.curResolution === breakpoints[i]) {
      window.tn.canvas_min_width = breakpoints[i];
      window.tn.canvas_max_width = i === 0 ? window.tn.window_width : breakpoints[i - 1]
    }
  }
  window.tn.grid_width = window.tn.canvas_min_width;
  window.tn.grid_offset_left = (window.tn.window_width - window.tn.grid_width) / 2
}
var t396_waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = 'Don\'t call this twice without a uniqueId'
    }
    if (timers[uniqueId]) {
      clearTimeout(timers[uniqueId])
    }
    timers[uniqueId] = setTimeout(callback, ms)
  }
})();

function t396_switchResolution(resolution, resolutionMax) {
  tn_console('func: switchResolution');
  if (typeof resolutionMax === 'undefined') {
    var breakpoints = [1200, 960, 640, 480, 320];
    breakpoints.forEach(function (breakpoint, i) {
      if (+resolution === breakpoint) {
        resolutionMax = i === 0 ? '' : breakpoints[i - 1]
      }
    })
  }
  window.tn.curResolution = resolution;
  window.tn.curResolution_max = resolutionMax
}

function t396_artboard_build(data, recid) {
  tn_console('func: t396_artboard_build. Recid:' + recid);
  tn_console(data);
  var record = document.getElementById('rec' + recid);
  var allRecords = document.getElementById('allrecords');
  var artBoard = record ? record.querySelector('.t396__artboard') : null;
  if (!artBoard) return !1;
  t396_ab__renderView(artBoard);
  var elements = artBoard.querySelectorAll('.tn-elem');
  Array.prototype.forEach.call(elements, function (element) {
    var dataType = element.getAttribute('data-elem-type');
    switch (dataType) {
      case 'text':
        t396_addText(artBoard, element);
        break;
      case 'image':
        t396_addImage(artBoard, element);
        break;
      case 'shape':
        t396_addShape(artBoard, element);
        break;
      case 'button':
        t396_addButton(artBoard, element);
        break;
      case 'video':
        t396_addVideo(artBoard, element);
        break;
      case 'html':
        t396_addHtml(artBoard, element);
        break;
      case 'tooltip':
        t396_addTooltip(artBoard, element);
        break;
      case 'form':
        t396_addForm(artBoard, element);
        break;
      case 'gallery':
        t396_addGallery(artBoard, element);
        break
    }
  });
  artBoard.classList.remove('rendering');
  artBoard.classList.add('rendered');
  var artBoardOverflow = artBoard.getAttribute('data-artboard-ovrflw');
  if ((artBoardOverflow === 'visible' || artBoardOverflow === 'visibleX') && allRecords) {
    allRecords.style.overflow = 'hidden'
  }
  if (artBoardOverflow === 'auto') {
    var diff = Math.abs(artBoard.offsetHeight - artBoard.clientHeight);
    if (diff !== 0) {
      artBoard.style.paddingBottom = diff + 'px'
    }
  }
  if (window.isMobile) {
    var style = document.createElement('style');
    style.textContent = '@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}';
    record.insertAdjacentElement('beforeend', style)
  }
}

function t396_ab__renderView(artBoard) {
  if (!artBoard) return !1;
  var fields = window.tn.ab_fields;
  var allRecords = document.getElementById('allrecords');
  var artBoardHeightVH;
  for (var i = 0; i < fields.length; i++) {
    t396_ab__renderViewOneField(artBoard, fields[i])
  }
  var artBoardMinHeight = t396_ab__getFieldValue(artBoard, 'height');
  var artBoardMaxHeight = t396_ab__getHeight(artBoard);
  var isTildaModeEdit = allRecords ? allRecords.getAttribute('data-tilda-mode') === 'edit' : !1;
  var isScaled = t396_ab__getFieldValue(artBoard, 'upscale') === 'window';
  artBoardHeightVH = t396_ab__getFieldValue(artBoard, 'height_vh');
  if (isScaled && !isTildaModeEdit && artBoardHeightVH) {
    var scaledMinHeight = parseInt(artBoardMinHeight, 10) * window.tn_scale_factor
  }
  var offsetTop;
  if (artBoardMinHeight === artBoardMaxHeight || (scaledMinHeight && scaledMinHeight >= artBoardMaxHeight)) {
    offsetTop = 0
  } else {
    var artBoardVerticalAlign = t396_ab__getFieldValue(artBoard, 'valign');
    switch (artBoardVerticalAlign) {
      case 'top':
        offsetTop = 0;
        break;
      case 'center':
        if (scaledMinHeight) {
          offsetTop = parseFloat(((artBoardMaxHeight - scaledMinHeight) / 2).toFixed(1))
        } else {
          offsetTop = parseFloat(((artBoardMaxHeight - artBoardMinHeight) / 2).toFixed(1))
        }
        break;
      case 'bottom':
        if (scaledMinHeight) {
          offsetTop = parseFloat((artBoardMaxHeight - scaledMinHeight).toFixed(1))
        } else {
          offsetTop = parseFloat((artBoardMaxHeight - artBoardMinHeight).toFixed(1))
        }
        break;
      case 'stretch':
        offsetTop = 0;
        artBoardMinHeight = artBoardMaxHeight;
        break;
      default:
        offsetTop = 0;
        break
    }
  }
  artBoard.setAttribute('data-artboard-proxy-min-offset-top', offsetTop);
  artBoard.setAttribute('data-artboard-proxy-min-height', artBoardMinHeight);
  artBoard.setAttribute('data-artboard-proxy-max-height', artBoardMaxHeight);
  var filter = artBoard.querySelector('.t396__filter');
  var carrier = artBoard.querySelector('.t396__carrier');
  artBoardHeightVH = t396_ab__getFieldValue(artBoard, 'height_vh');
  artBoardHeightVH = parseFloat(artBoardHeightVH);
  if (window.isMobile && artBoardHeightVH) {
    var height = document.documentElement.clientHeight * artBoardHeightVH / 100;
    artBoard.style.height = height + 'px';
    if (filter) filter.style.height = height + 'px';
    if (carrier) carrier.style.height = height + 'px'
  }
}

function t396_addText(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addText');
  var fieldsString = 'top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element)
}

function t396_addImage(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addImage');
  var fieldsString = 'img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element);
  var images = element.querySelectorAll('img');
  Array.prototype.forEach.call(images, function (img) {
    img.addEventListener('load', function () {
      t396_elem__renderViewOneField(element, 'top');
      if (img.src) {
        setTimeout(function () {
          t396_elem__renderViewOneField(element, 'top')
        }, 2000)
      }
    });
    if (img.complete) {
      t396_elem__renderViewOneField(element, 'top');
      if (img.src) {
        setTimeout(function () {
          t396_elem__renderViewOneField(element, 'top')
        }, 2000)
      }
    }
    img.addEventListener('tuwidget_done', function () {
      t396_elem__renderViewOneField(element, 'top')
    })
  })
}

function t396_addShape(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addShape');
  var fieldsString = 'width,height,top,left,';
  fieldsString += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element)
}

function t396_addButton(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addButton');
  var fieldsString = 'top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element);
  return (element)
}

function t396_addVideo(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addVideo');
  var fieldsString = 'width,height,top,left,';
  fieldsString += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element);
  var videoEl = element.querySelector('.tn-atom__videoiframe');
  var atom = element.querySelector('.tn-atom');
  if (atom) atom.style.backgroundColor = '#000';
  var videoCover = atom ? atom.getAttribute('data-atom-video-has-cover') : '';
  if (!videoCover) videoCover = '';
  var allRecords = document.getElementById('allrecords');
  var autoplay = t396_elem__getFieldValue(element, 'autoplay');
  var showinfo = t396_elem__getFieldValue(element, 'showinfo');
  var loop = t396_elem__getFieldValue(element, 'loop');
  var mute = t396_elem__getFieldValue(element, 'mute');
  var startSec = t396_elem__getFieldValue(element, 'startsec');
  var endSec = t396_elem__getFieldValue(element, 'endsec');
  var tildaMode = allRecords ? allRecords.getAttribute('data-tilda-mode') : '';
  var url = '';
  var script = document.createElement('script');
  script.textContent = 'lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});';
  var record = element ? element.closest('.r') : null;
  var recid = record ? record.id : '';
  recid = recid.replace('rec', '');
  var elementID = element.getAttribute('data-elem-id');
  var youtubeID = videoEl ? videoEl.getAttribute('data-youtubeid') : '';
  var videoHTML = '';
  if (youtubeID) {
    url = 'https://www.youtube.com/embed/' + youtubeID + '?';
    if (showinfo === 'y') url += '&showinfo=1';
    if (loop === 'y') url += '&loop=1&playlist=' + youtubeID;
    if (startSec > 0) url += '&start=' + startSec;
    if (endSec > 0) url += '&end=' + endSec;
    if (mute === 'y') url += '&mute=1';
    if (videoCover === 'y') {
      url += '&autoplay=1&amp;rel=0';
      var instFlag = 'y';
      var iframeClass = '';
      if (autoplay === 'y' && mute === 'y' && window.lazy === 'y') {
        instFlag = 'lazy';
        iframeClass = ' class="t-iframe"'
      }
      videoHTML = '<iframe id="youtubeiframe-' + recid + '-' + elementID + '"' + iframeClass + ' width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen="" allow="autoplay" data-flag-inst="' + instFlag + '"></iframe>';
      if (autoplay === 'y' && mute === 'y' && window.lazy === 'y') {
        element.insertAdjacentElement('beforeend', script)
      }
      if (autoplay === 'y' && mute === 'y') {
        atom.click()
      }
    } else {
      if (tildaMode !== 'edit' && autoplay === 'y') {
        url += '&autoplay=1'
      }
      if (window.lazy === 'y') {
        videoEl.innerHTML = '<iframe id="youtubeiframe-' + recid + '-' + elementID + '" class="t-iframe" width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>';
        element.insertAdjacentElement('beforeend', script)
      } else {
        videoEl.innerHTML = '<iframe id="youtubeiframe-' + recid + '-' + elementID + '" width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>'
      }
    }
  }
  var vimeoID = videoEl ? videoEl.getAttribute('data-vimeoid') : '';
  if (vimeoID) {
    url = '//player.vimeo.com/video/';
    url += vimeoID + '?color=ffffff&badge=0';
    if (showinfo === 'y') {
      url += '&title=1&byline=1&portrait=1'
    } else {
      url += '&title=0&byline=0&portrait=0'
    }
    if (loop === 'y') {
      url += '&loop=1'
    }
    if (mute === 'y') {
      url += '&muted=1'
    }
    if (videoCover === 'y') {
      url += '&autoplay=1';
      videoHTML = '<iframe src="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    } else {
      if (tildaMode !== 'edit' && autoplay === 'y') {
        url += '&autoplay=1'
      }
      if (window.lazy === 'y') {
        videoEl.innerHTML = '<iframe class="t-iframe" data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        element.insertAdjacentElement('beforeend', script)
      } else {
        videoEl.innerHTML = '<iframe src="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
      }
    }
  }
  if (videoCover === 'y' && atom) {
    atom.addEventListener('click', function () {
      videoEl.innerHTML = videoHTML;
      atom.style.backgroundImage = 'none';
      var playBtn = atom.querySelector('.tn-atom__video-play-link');
      if (playBtn) playBtn.style.display = 'none'
    })
  }
}

function t396_addHtml(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addHtml');
  var fieldsString = 'width,height,top,left,';
  fieldsString += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element)
}

function t396_addTooltip(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addTooltip');
  var fieldsString = 'width,height,top,left,';
  fieldsString += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element);
  var tooltip = element.querySelector('.tn-atom__pin');
  var tooltipContent = element.querySelector('.tn-atom__tip');
  var tooltipOpenTrigger = element.getAttribute('data-field-tipopen-value');
  if (window.isMobile || tooltipOpenTrigger === 'click') {
    t396_setUpTooltip_mobile(element, tooltip, tooltipContent)
  } else {
    t396_setUpTooltip_desktop(element, tooltip, tooltipContent)
  }
  setTimeout(function () {
    var atomImages = document.querySelectorAll('.tn-atom__tip-img');
    Array.prototype.forEach.call(atomImages, function (img) {
      var imgOriginal = img.getAttribute('data-tipimg-original');
      if (imgOriginal) img.src = imgOriginal
    })
  }, 3000)
}

function t396_addForm(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addForm');
  var fieldsString = 'width,top,left,';
  fieldsString += 'inputs,container,axisx,axisy,widthunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element)
}

function t396_addGallery(artBoard, element) {
  element = t396_getEl(element);
  if (!element) return;
  tn_console('func: addForm');
  var fieldsString = 'width,height,top,left,';
  fieldsString += 'imgs,container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
  element.setAttribute('data-fields', fieldsString);
  t396_elem__renderView(element)
}

function t396_elem__setFieldValue(element, prop, val, flag_render, flag_updateui, resolution) {
  element = t396_getEl(element);
  if (!element) return;
  if (!resolution) resolution = window.tn.curResolution;
  if (+resolution < 1200 && prop !== 'zindex') {
    element.setAttribute('data-field-' + prop + '-res-' + resolution + '-value', val)
  } else {
    element.setAttribute('data-field-' + prop + '-value', val)
  }
  if (flag_render === 'render') elem__renderViewOneField(element, prop);
  if (flag_updateui === 'updateui') panelSettings__updateUi(element, prop, val)
}

function t396_elem__getFieldValue(element, prop) {
  element = t396_getEl(element);
  if (!element) return;
  var resolution = window.tn.curResolution;
  var breakpoints = [1200, 960, 640, 480, 320];
  var dataField;
  breakpoints.forEach(function (breakpoint, i) {
    if (i === 0 && +resolution >= breakpoint) {
      dataField = element.getAttribute('data-field-' + prop + '-value')
    }
    if (i > 0 && +resolution === breakpoint) {
      dataField = element.getAttribute('data-field-' + prop + '-res-' + breakpoint + '-value');
      if (i > 1 && !dataField) {
        var slicedBreakpoints = breakpoints.slice(1, i);
        for (var n = slicedBreakpoints.length - 1; n >= 0; n--) {
          dataField = element.getAttribute('data-field-' + prop + '-res-' + slicedBreakpoints[n] + '-value');
          if (dataField) break
        }
      }
      if (!dataField) dataField = element.getAttribute('data-field-' + prop + '-value')
    }
  });
  return dataField ? dataField : ''
}

function t396_elem__renderView(element) {
  element = t396_getEl(element);
  tn_console('func: elem__renderView');
  var fields = element ? element.getAttribute('data-fields') : '';
  if (!fields) return !1;
  fields = fields.split(',');
  fields.forEach(function (field) {
    t396_elem__renderViewOneField(element, field)
  })
}

function t396_elem__renderViewOneField(element, field) {
  element = t396_getEl(element);
  if (!element) return;
  var value = t396_elem__getFieldValue(element, field);
  var elementType;
  var borderWidth;
  var borderStyle;
  var currentValue;
  var slidesMain;
  var slidesImg;
  switch (field) {
    case 'left':
      value = t396_elem__convertPosition__Local__toAbsolute(element, field, value);
      element.style.left = parseFloat(value).toFixed(1) + 'px';
      break;
    case 'top':
      value = t396_elem__convertPosition__Local__toAbsolute(element, field, value);
      element.style.top = parseFloat(value).toFixed(1) + 'px';
      break;
    case 'width':
      value = t396_elem__getWidth(element, value);
      element.style.width = parseFloat(value).toFixed(1) + 'px';
      elementType = element.getAttribute('data-elem-type');
      switch (elementType) {
        case 'tooltip':
          var pinSvgIcon = element.querySelectorAll('.tn-atom__pin-icon');
          Array.prototype.forEach.call(pinSvgIcon, function (pin) {
            var pinSize = parseFloat(value).toFixed(1) + 'px';
            pin.style.width = pinSize;
            pin.style.height = pinSize
          });
          element.style.height = parseInt(value).toFixed(1) + 'px';
          break;
        case 'gallery':
          borderWidth = t396_elem__getFieldValue(element, 'borderwidth');
          borderStyle = t396_elem__getFieldValue(element, 'borderstyle');
          if (!borderStyle || !borderWidth || borderStyle === 'none') {
            borderWidth = 0
          }
          value -= borderWidth * 2;
          currentValue = parseFloat(value).toFixed(1) + 'px';
          slidesMain = element.querySelector('.t-slds__main');
          slidesImg = element.querySelectorAll('.tn-atom__slds-img');
          element.style.width = currentValue;
          if (slidesMain) slidesMain.style.width = currentValue;
          Array.prototype.forEach.call(slidesImg, function (img) {
            img.style.width = currentValue
          });
          break
      }
      break;
    case 'height':
      elementType = element.getAttribute('data-elem-type');
      if (elementType === 'tooltip') return;
      value = t396_elem__getHeight(element, value);
      element.style.height = parseFloat(value).toFixed(1) + 'px';
      if (elementType === 'gallery') {
        borderWidth = t396_elem__getFieldValue(element, 'borderwidth');
        borderStyle = t396_elem__getFieldValue(element, 'borderstyle');
        if (!borderStyle || !borderWidth || borderStyle === 'none') {
          borderWidth = 0
        }
        value -= borderWidth * 2;
        currentValue = parseFloat(value).toFixed(1) + 'px';
        slidesMain = element.querySelector('.t-slds__main');
        slidesImg = element.querySelectorAll('.tn-atom__slds-img');
        element.style.height = currentValue;
        if (slidesMain) slidesMain.style.height = currentValue;
        Array.prototype.forEach.call(slidesImg, function (img) {
          img.style.height = currentValue
        })
      }
      break;
    case 'container':
      t396_elem__renderViewOneField(element, 'left');
      t396_elem__renderViewOneField(element, 'top');
      break;
    case 'inputs':
      var textArea = element.querySelector('.tn-atom__inputs-textarea');
      value = textArea ? textArea.value : '';
      try {
        t_zeroForms__renderForm($(element), value)
      } catch (err) {}
      break
  }
  if (field === 'width' || field === 'height' || field === 'fontsize' || field === 'fontfamily' || field === 'letterspacing' || field === 'fontweight' || field === 'img') {
    t396_elem__renderViewOneField(element, 'left');
    t396_elem__renderViewOneField(element, 'top')
  }
}

function t396_elem__convertPosition__Local__toAbsolute(element, field, value) {
  element = t396_getEl(element);
  if (!element) return;
  var artBoard = element.closest('.t396__artboard');
  var verticalAlignValue = t396_ab__getFieldValue(artBoard, 'valign');
  var isScaled = t396_ab__getFieldValue(artBoard, 'upscale') === 'window';
  var allRecords = document.getElementById('allrecords');
  var tildaMode = allRecords ? allRecords.getAttribute('data-tilda-mode') : '';
  var isTildaModeEdit = tildaMode === 'edit';
  var isOnlyScalable = t396_isOnlyScalableBrowser();
  var isScaledElement = !isTildaModeEdit && isScaled && isOnlyScalable;
  var isZoomedElement = !isTildaModeEdit && isScaled && !isOnlyScalable;
  var valueAxisY = t396_elem__getFieldValue(element, 'axisy');
  var valueAxisX = t396_elem__getFieldValue(element, 'axisx');
  var container = t396_elem__getFieldValue(element, 'container');
  value = parseInt(value);
  var elementContainer;
  var offsetLeft;
  var offsetTop;
  var elementWidth;
  var elementContainerWidth;
  var elementHeight;
  var elementContainerHeight;
  switch (field) {
    case 'left':
      elementContainer = container === 'grid' ? 'grid' : 'window';
      offsetLeft = container === 'grid' ? window.tn.grid_offset_left : 0;
      elementContainerWidth = container === 'grid' ? window.tn.grid_width : window.tn.window_width;
      var elementLeftUnits = t396_elem__getFieldValue(element, 'leftunits');
      if (elementLeftUnits === '%') {
        value = t396_roundFloat(elementContainerWidth * value / 100)
      }
      if (!isTildaModeEdit && isScaled) {
        if (container === 'grid' && isOnlyScalable) value = value * window.tn_scale_factor
      } else {
        value = offsetLeft + value
      }
      if (valueAxisX === 'center') {
        elementWidth = t396_elem__getWidth(element);
        if (isScaledElement && elementContainer !== 'window') {
          elementContainerWidth *= window.tn_scale_factor;
          elementWidth *= window.tn_scale_factor
        }
        value = elementContainerWidth / 2 - elementWidth / 2 + value
      }
      if (valueAxisX === 'right') {
        elementWidth = t396_elem__getWidth(element);
        if (isScaledElement && elementContainer !== 'window') {
          elementContainerWidth *= window.tn_scale_factor;
          elementWidth *= window.tn_scale_factor
        }
        value = elementContainerWidth - elementWidth + value
      }
      if (isScaledElement && elementContainer !== 'window') {
        elementWidth = t396_elem__getWidth(element);
        value = value + (elementWidth * window.tn_scale_factor - elementWidth) / 2
      }
      break;
    case 'top':
      var artBoardParent = element.parentNode;
      var proxyMinOffsetTop = artBoardParent ? artBoardParent.getAttribute('data-artboard-proxy-min-offset-top') : '0';
      var proxyMinHeight = artBoardParent ? artBoardParent.getAttribute('data-artboard-proxy-min-height') : '0';
      var proxyMaxHeight = artBoardParent ? artBoardParent.getAttribute('data-artboard-proxy-max-height') : '0';
      var getElementHeight = function (element) {
        var height = t396_elem__getHeight(element);
        if (element && element.getAttribute('data-elem-type') === 'image') {
          var width = t396_elem__getWidth(element);
          var fileWidth = t396_elem__getFieldValue(element, 'filewidth');
          var fileHeight = t396_elem__getFieldValue(element, 'fileheight');
          if (fileWidth && fileHeight) {
            var ratio = parseInt(fileWidth) / parseInt(fileHeight);
            height = width / ratio
          }
        }
        return height
      };
      elementContainer = container === 'grid' ? 'grid' : 'window';
      offsetTop = container === 'grid' ? parseFloat(proxyMinOffsetTop) : 0;
      elementContainerHeight = container === 'grid' ? parseFloat(proxyMinHeight) : parseFloat(proxyMaxHeight);
      var elTopUnits = t396_elem__getFieldValue(element, 'topunits');
      if (elTopUnits === '%') {
        value = (elementContainerHeight * (value / 100))
      }
      if (isScaledElement && elementContainer !== 'window') {
        value *= window.tn_scale_factor
      }
      if (isZoomedElement && elementContainer !== 'window') {
        offsetTop = verticalAlignValue === 'stretch' ? 0 : (offsetTop / window.tn_scale_factor)
      }
      value = offsetTop + value;
      var artBoardHeightVH = t396_ab__getFieldValue(artBoardParent, 'height_vh');
      var artBoardMinHeight = t396_ab__getFieldValue(artBoardParent, 'height');
      var artBoardMaxHeight = t396_ab__getHeight(artBoardParent);
      if (isScaled && !isTildaModeEdit && artBoardHeightVH) {
        var scaledMinHeight = parseInt(artBoardMinHeight, 10) * window.tn_scale_factor
      }
      if (valueAxisY === 'center') {
        elementHeight = getElementHeight(element);
        if (isScaledElement && elementContainer !== 'window') {
          if (verticalAlignValue !== 'stretch') {
            elementContainerHeight = elementContainerHeight * window.tn_scale_factor
          } else {
            if (scaledMinHeight) {
              elementContainerHeight = scaledMinHeight > artBoardMaxHeight ? scaledMinHeight : artBoardMaxHeight
            } else {
              elementContainerHeight = artBoardParent.clientHeight
            }
          }
          elementHeight *= window.tn_scale_factor
        }
        if (!isTildaModeEdit && isScaled && !isOnlyScalable && elementContainer !== 'window' && verticalAlignValue === 'stretch') {
          if (scaledMinHeight) {
            elementContainerHeight = scaledMinHeight > artBoardMaxHeight ? scaledMinHeight : artBoardMaxHeight
          } else {
            elementContainerHeight = artBoardParent.clientHeight
          }
          elementContainerHeight = elementContainerHeight / window.tn_scale_factor
        }
        value = elementContainerHeight / 2 - elementHeight / 2 + value
      }
      if (valueAxisY === 'bottom') {
        elementHeight = getElementHeight(element);
        if (isScaledElement && elementContainer !== 'window') {
          if (verticalAlignValue !== 'stretch') {
            elementContainerHeight = elementContainerHeight * window.tn_scale_factor
          } else {
            if (scaledMinHeight) {
              elementContainerHeight = scaledMinHeight > artBoardMaxHeight ? scaledMinHeight : artBoardMaxHeight
            } else {
              elementContainerHeight = artBoardParent.clientHeight
            }
          }
          elementHeight *= window.tn_scale_factor
        }
        if (!isTildaModeEdit && isScaled && !isOnlyScalable && elementContainer !== 'window' && verticalAlignValue === 'stretch') {
          if (scaledMinHeight) {
            elementContainerHeight = scaledMinHeight > artBoardMaxHeight ? scaledMinHeight : artBoardMaxHeight
          } else {
            elementContainerHeight = artBoardParent.clientHeight
          }
          elementContainerHeight = elementContainerHeight / window.tn_scale_factor
        }
        value = elementContainerHeight - elementHeight + value
      }
      if (isScaledElement && elementContainer !== 'window') {
        elementHeight = getElementHeight(element);
        value = value + (elementHeight * window.tn_scale_factor - elementHeight) / 2
      }
      break
  }
  return value
}

function t396_ab__setFieldValue(artBoard, prop, val, resolution) {
  if (!resolution) resolution = window.tn.curResolution;
  if (resolution < 1200) {
    if (artBoard) artBoard.setAttribute('data-artboard-' + prop + '-res-' + resolution, val)
  } else {
    if (artBoard) artBoard.setAttribute('data-artboard-' + prop, val)
  }
}

function t396_ab__getFieldValue(artBoard, prop) {
  if (!artBoard) return;
  var resolution = window.tn.curResolution;
  var breakpoints = [1200, 960, 640, 480, 320];
  var dataField;
  breakpoints.forEach(function (breakpoint, i) {
    if (i === 0 && +resolution >= breakpoint) {
      dataField = artBoard.getAttribute('data-artboard-' + prop)
    }
    if (i > 0 && +resolution === breakpoint) {
      dataField = artBoard.getAttribute('data-artboard-' + prop + '-res-' + breakpoint);
      if (i > 1 && !dataField) {
        var slicedBreakpoints = breakpoints.slice(1, i);
        for (var n = slicedBreakpoints.length - 1; n >= 0; n--) {
          dataField = artBoard.getAttribute('data-artboard-' + prop + '-res-' + slicedBreakpoints[n]);
          if (dataField) break
        }
      }
      if (!dataField) dataField = artBoard.getAttribute('data-artboard-' + prop)
    }
  });
  return dataField ? dataField : ''
}

function t396_ab__renderViewOneField(artBoard, field) {
  t396_ab__getFieldValue(artBoard, field)
}

function t396_allelems__renderView(artBoard) {
  if (!artBoard) return !1;
  tn_console('func: allelems__renderView: abid:' + artBoard.getAttribute('data-artboard-recid'));
  var ArtBoardelements = artBoard.querySelectorAll('.tn-elem');
  Array.prototype.forEach.call(ArtBoardelements, function (element) {
    t396_elem__renderView(element)
  })
}

function t396_ab__filterUpdate(artBoard) {
  var filter = artBoard.querySelector('.t396__filter');
  if (!filter) return;
  var filterColorRgb = filter.getAttribute('data-filtercolor-rgb');
  var filterColorRgb2 = filter.getAttribute('data-filtercolor2-rgb');
  var filterOpacity = filter.getAttribute('data-filteropacity');
  var filterOpacity2 = filter.getAttribute('data-filteropacity2');
  if (filterColorRgb && !filterColorRgb2) {
    filter.style.backgroundColor = 'rgba(' + filterColorRgb + ',' + filterOpacity + ')'
  } else if (!filterColorRgb && filterColorRgb2) {
    filter.style.backgroundColor = 'rgba(' + filterColorRgb2 + ',' + filterOpacity2 + ')'
  } else if (filterColorRgb && filterColorRgb2) {
    filter.style.background = '-webkit-gradient(linear, left top, left bottom, from(rgba(' + filterColorRgb + ',' + filterOpacity + ')), to(rgba(' + filterColorRgb2 + ',' + filterOpacity2 + ')) )'
  } else {
    filter.style.backgroundColor = 'transparent'
  }
}

function t396_ab__getHeight(artBoard, artBoardHeight) {
  if (!artBoardHeight) artBoardHeight = t396_ab__getFieldValue(artBoard, 'height');
  artBoardHeight = parseFloat(artBoardHeight);
  var artBoardHeightVH = t396_ab__getFieldValue(artBoard, 'height_vh');
  if (artBoardHeightVH) {
    artBoardHeightVH = parseFloat(artBoardHeightVH);
    if (!isNaN(artBoardHeightVH)) {
      var artBoardHeightVHpx = window.tn.window_height * artBoardHeightVH / 100;
      if (artBoardHeight < artBoardHeightVHpx) {
        artBoardHeight = artBoardHeightVHpx
      }
    }
  }
  return artBoardHeight
}

function t396_hex2rgb(hexStr) {
  var hex = parseInt(hexStr.substring(1), 16);
  var r = (hex & 0xff0000) >> 16;
  var g = (hex & 0x00ff00) >> 8;
  var b = hex & 0x0000ff;
  return [r, g, b]
}
String.prototype.t396_replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement)
};

function t396_elem__getWidth(element, value) {
  element = t396_getEl(element);
  if (!value) value = t396_elem__getFieldValue(element, 'width');
  value = parseFloat(value);
  var elWidthUnits = t396_elem__getFieldValue(element, 'widthunits');
  if (elWidthUnits === '%') {
    var elementContainer = t396_elem__getFieldValue(element, 'container');
    if (elementContainer === 'window') {
      value = window.tn.window_width * value / 100
    } else {
      value = window.tn.grid_width * value / 100
    }
  }
  return value
}

function t396_elem__getHeight(element, value) {
  element = t396_getEl(element);
  if (!value) value = t396_elem__getFieldValue(element, 'height');
  value = parseFloat(value);
  var elemType = element.getAttribute('data-elem-type');
  if (elemType === 'shape' || elemType === 'video' || elemType === 'html' || elemType === 'gallery') {
    var elHeightUnits = t396_elem__getFieldValue(element, 'heightunits');
    if (elHeightUnits === '%') {
      var artBoard = element.parentNode;
      var proxyMinHeight = artBoard ? artBoard.getAttribute('data-artboard-proxy-min-height') : '0';
      var proxyMaxHeight = artBoard ? artBoard.getAttribute('data-artboard-proxy-max-height') : '0';
      var artBoardMinHeight = parseFloat(proxyMinHeight);
      var artBoardMaxHeight = parseFloat(proxyMaxHeight);
      var elementContainer = t396_elem__getFieldValue(element, 'container');
      if (elementContainer === 'window') {
        value = artBoardMaxHeight * (value / 100)
      } else {
        value = artBoardMinHeight * (value / 100)
      }
    }
  } else if (elemType !== 'button') {
    value = element.clientHeight
  }
  return value
}

function t396_roundFloat(n) {
  n = Math.round(n * 100) / 100;
  return (n)
}

function tn_console(str) {
  if (+(window.tn_comments) === 1) console.log(str)
}

function t396_setUpTooltip_desktop(element, tooltip, tooltipContent) {
  element = t396_getEl(element);
  var timer;
  if (tooltip) {
    tooltip.addEventListener('mouseover', function () {
      var visibleEls = document.querySelectorAll('.tn-atom__tip_visible');
      Array.prototype.forEach.call(visibleEls, function (visibleEl) {
        var curTipEl = visibleEl.closest('.t396__elem');
        var cirTipElID = curTipEl ? curTipEl.getAttribute('data-elem-id') : '';
        if (cirTipElID !== element.getAttribute('data-elem-id')) {
          t396_hideTooltip(curTipEl, visibleEl)
        }
      });
      clearTimeout(timer);
      if (tooltipContent && tooltipContent.style.display === 'block') return;
      t396_showTooltip(element, tooltipContent)
    });
    tooltip.addEventListener('mouseout', function () {
      timer = setTimeout(function () {
        t396_hideTooltip(element, tooltipContent)
      }, 300)
    })
  }
}

function t396_setUpTooltip_mobile(element, tooltip, tooltipContent) {
  element = t396_getEl(element);
  if (tooltip) {
    tooltip.addEventListener('click', function () {
      if (tooltipContent && tooltipContent.style.display === 'block' && tooltip.classList.contains('tn-atom__pin')) {
        t396_hideTooltip(element, tooltipContent)
      } else {
        t396_showTooltip(element, tooltipContent)
      }
    })
  }
  var elementID = element.getAttribute('data-elem-id');
  document.addEventListener('click', function (e) {
    if (e.target.closest('.tn-atom__pin')) {
      var zbEl = e.target.closest('.t396__elem');
      var clickedPinId = zbEl ? zbEl.getAttribute('data-elem-id') : '';
      if (clickedPinId === elementID) return
    }
    t396_hideTooltip(element, tooltipContent)
  })
}

function t396_hideTooltip(element, tooltipContent) {
  if (tooltipContent) tooltipContent.style.display = '';
  if (tooltipContent) tooltipContent.style.left = '';
  if (tooltipContent) tooltipContent.style.transform = '';
  if (tooltipContent) tooltipContent.style.right = '';
  if (tooltipContent) tooltipContent.classList.remove('tn-atom__tip_visible');
  if (element) element.style.zIndex = ''
}

function t396_showTooltip(element, tooltipContent) {
  element = t396_getEl(element);
  var pos = element.getAttribute('data-field-tipposition-value');
  if (!pos) pos = 'top';
  var elSize = element.clientHeight;
  var elTop = element.getBoundingClientRect().top + window.pageYOffset;
  var elBottom = elTop + elSize;
  var elLeft = element.getBoundingClientRect().left + window.pageXOffset;
  var elRight = elLeft + elSize;
  var winTop = window.pageYOffset;
  var winWidth = document.documentElement.clientWidth;
  var winBottom = winTop + document.documentElement.clientHeight;
  if (tooltipContent) tooltipContent.style.display = 'block';
  if (tooltipContent) tooltipContent.style.zIndex = '-9999';
  if (tooltipContent) tooltipContent.style.transform = 'translateX(-10000px)';
  var tipElHeight = tooltipContent ? tooltipContent.offsetHeight : 0;
  var tipElWidth = tooltipContent ? tooltipContent.offsetWidth : 0;
  if (tooltipContent) tooltipContent.style.display = '';
  if (tooltipContent) tooltipContent.style.zIndex = '';
  if (tooltipContent) tooltipContent.style.transform = '';
  var padding = 15;
  var tipElRight;
  var tipElLeft;
  var tipElTop;
  var tipElBottom;
  if (pos === 'right' || pos === 'left') {
    tipElRight = elRight + padding + tipElWidth;
    tipElLeft = elLeft - padding - tipElWidth;
    if ((pos === 'right' && tipElRight > winWidth) || (pos === 'left' && tipElLeft < 0)) {
      pos = 'top'
    }
  }
  if (pos === 'top' || pos === 'bottom') {
    tipElRight = elRight + (tipElWidth / 2 - elSize / 2);
    tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);
    if (tipElRight > winWidth) {
      var rightOffset = -(winWidth - elRight - padding);
      if (tooltipContent) tooltipContent.style.left = 'auto';
      if (tooltipContent) tooltipContent.style.transform = 'none';
      if (tooltipContent) tooltipContent.style.right = rightOffset + 'px'
    }
    if (tipElLeft < 0) {
      var leftOffset = -(elLeft - padding);
      if (tooltipContent) tooltipContent.style.left = leftOffset + 'px';
      if (tooltipContent) tooltipContent.style.transform = 'none'
    }
  }
  if (pos === 'top') {
    tipElTop = elTop - padding - tipElHeight;
    tipElBottom = elBottom + padding + tipElHeight;
    if (winBottom > tipElBottom && winTop > tipElTop) {
      pos = 'bottom'
    }
  }
  if (pos === 'bottom') {
    tipElTop = elTop - padding - tipElHeight;
    tipElBottom = elBottom + padding + tipElHeight;
    if (winBottom < tipElBottom && winTop < tipElTop) {
      pos = 'top'
    }
  }
  if (tooltipContent) tooltipContent.setAttribute('data-tip-pos', pos);
  if (tooltipContent) tooltipContent.style.display = 'block';
  if (tooltipContent) tooltipContent.classList.add('tn-atom__tip_visible');
  if (element) element.style.zIndex = '1000'
}

function t396_hex2rgba(hexStr, opacity) {
  if (!hexStr) return !1;
  var hex = parseInt(hexStr.substring(1), 16);
  var r = (hex & 0xff0000) >> 16;
  var g = (hex & 0x00ff00) >> 8;
  var b = hex & 0x0000ff;
  return [r, g, b, parseFloat(opacity)]
}

function t396_removeElementFromDOM(el) {
  el = t396_getEl(el);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

function t396_getEl(el) {
  if (el instanceof jQuery) {
    return el.length ? el.get(0) : null
  } else {
    return el
  }
}
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    while (el && el.nodeType === 1) {
      if (Element.prototype.matches.call(el, s)) {
        return el
      }
      el = el.parentElement || el.parentNode
    }
    return null
  }
}

function t450_showMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return;
  var menu = rec.querySelector('.t450');
  var overlay = rec.querySelector('.t450__overlay');
  var menuElements = rec.querySelectorAll('.t450__overlay, .t450__close, a[href*="#"]');
  var menuLinks = rec.querySelectorAll('.t-menu__link-item');
  var menuLinksEls = rec.querySelectorAll('.t978__menu-link');
  document.body.classList.add('t450__body_menushowed');
  if (menu) menu.classList.add('t450__menu_show');
  if (overlay) overlay.classList.add('t450__menu_show');
  if (menu) {
    menu.addEventListener('clickedAnchorInTooltipMenu', function () {
      t450_closeMenu(menu, overlay)
    })
  }
  Array.prototype.forEach.call(menuElements, function (element) {
    element.addEventListener('click', function () {
      if (element.closest('.tooltipstered, .t-menusub__target-link, .t794__tm-link, .t966__tm-link, .t978__tm-link')) return;
      if (element.href && (element.href.substring(0, 7) === '#price:' || element.href.substring(0, 9) === '#submenu:')) return;
      t450_closeMenu(menu, overlay)
    })
  });
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
      document.body.classList.remove('t390__body_popupshowed');
      var popups = document.querySelectorAll('.t390');
      Array.prototype.forEach.call(popups, function (popup) {
        popup.classList.remove('t390__popup_show')
      })
    }
  });
  Array.prototype.forEach.call(menuLinks, function (link) {
    if (link.classList.contains('t966__tm-link')) {
      link.addEventListener('click', function () {
        setTimeout(function () {
          t450_checkSize(recid)
        }, 300)
      })
    }
    if (link.classList.contains('t978__tm-link')) {
      link.addEventListener('click', function () {
        Array.prototype.forEach.call(menuLinksEls, function (element) {
          element.addEventListener('click', function () {
            t450_checkSize(recid)
          })
        })
      })
    }
  });
  t450_highlight(recid)
}

function t450_closeMenu(menu, overlay) {
  document.body.classList.remove('t450__body_menushowed');
  if (menu) menu.classList.remove('t450__menu_show');
  if (overlay) overlay.classList.remove('t450__menu_show')
}

function t450_checkSize(recid) {
  var rec = document.getElementById('rec' + recid);
  var menu = rec ? rec.querySelector('.t450') : null;
  if (!menu) return;
  var container = menu.querySelector('.t450__container');
  var topContainer = menu.querySelector('.t450__top');
  var rightContainer = menu.querySelector('.t450__rightside');
  setTimeout(function () {
    var topContainerHeight = topContainer ? topContainer.offsetHeight : 0;
    var rightContainerHeight = rightContainer ? rightContainer.offsetHeight : 0;
    var containerPaddingTop = container ? window.getComputedStyle(container).paddingTop : '0';
    var containerPaddingBottom = container ? window.getComputedStyle(container).paddingBottom : '0';
    containerPaddingTop = parseInt(containerPaddingTop, 10);
    containerPaddingBottom = parseInt(containerPaddingBottom, 10);
    if (topContainerHeight + rightContainerHeight + containerPaddingTop + containerPaddingBottom > document.documentElement.clientHeight) {
      menu.classList.add('t450__overflowed');
      if (container) container.style.height = 'auto'
    } else {
      menu.classList.remove('t450__overflowed');
      if (container) container.style.height = ''
    }
  })
}

function t450_appearMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  var burger = rec ? rec.querySelector('.t450__burger_container') : null;
  if (!burger) return;
  var burgerAppearOffset = burger ? burger.getAttribute('data-appearoffset') : '';
  var burgerHideOffset = burger ? burger.getAttribute('data-hideoffset') : '';
  if (burgerAppearOffset) {
    burgerAppearOffset = t450_appearMenuParseNumber(burgerAppearOffset);
    if (window.pageYOffset >= burgerAppearOffset) {
      if (burger.classList.contains('t450__beforeready')) {
        burger.classList.remove('t450__beforeready')
      }
    } else {
      burger.classList.add('t450__beforeready')
    }
  }
  if (burgerHideOffset) {
    burgerHideOffset = t450_appearMenuParseNumber(burgerHideOffset);
    var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    if (window.pageYOffset + window.innerHeight >= scrollHeight - burgerHideOffset) {
      if (!burger.classList.contains('t450__beforeready')) {
        burger.classList.add('t450__beforeready')
      }
    } else if (burgerAppearOffset) {
      if (window.pageYOffset >= burgerAppearOffset) {
        burger.classList.remove('t450__beforeready')
      }
    } else {
      burger.classList.remove('t450__beforeready')
    }
  }
}

function t450_appearMenuParseNumber(string) {
  if (string.indexOf('vh') > -1) {
    string = Math.floor((window.innerHeight * (parseInt(string) / 100)))
  }
  return parseInt(string, 10)
}

function t450_initMenu(recid) {
  var rec = document.getElementById('rec' + recid);
  var menu = rec ? rec.querySelector('.t450') : null;
  var overlay = rec ? rec.querySelector('.t450__overlay') : null;
  var burger = rec ? rec.querySelector('.t450__burger_container') : null;
  var menuLinks = rec ? rec.querySelectorAll('.t-menu__link-item.t450__link-item_submenu') : [];
  var hook = menu ? menu.getAttribute('data-tooltip-hook') : '';
  if (hook) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('a[href="' + hook + '"]')) {
        e.preventDefault();
        t450_closeMenu(menu, overlay);
        t450_showMenu(recid);
        t450_checkSize(recid)
      }
    })
  }
  if (burger) {
    burger.addEventListener('click', function () {
      t450_closeMenu(menu, overlay);
      t450_showMenu(recid);
      t450_checkSize(recid)
    })
  }
  window.addEventListener('resize', function () {
    t450_checkSize(recid)
  });
  if (!window.isMobile) return;
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.addEventListener('click', function () {
      t450_checkSize(recid)
    })
  })
}

function t450_highlight(recid) {
  var url = window.location.href;
  var pathname = window.location.pathname;
  var hash = window.location.hash;
  if (url.substr(url.length - 1) === '/') {
    url = url.slice(0, -1)
  }
  if (pathname.substr(pathname.length - 1) === '/') {
    pathname = pathname.slice(0, -1)
  }
  if (pathname.charAt(0) === '/') {
    pathname = pathname.slice(1)
  }
  if (pathname === '') {
    pathname = '/'
  }
  var shouldBeActiveElements = document.querySelectorAll('.t450__menu a[href=\'' + url + '\'], ' + '.t450__menu a[href=\'' + url + '/\'], ' + '.t450__menu a[href=\'' + pathname + '\'], ' + '.t450__menu a[href=\'/' + pathname + '\'], ' + '.t450__menu a[href=\'' + pathname + '/\'], ' + '.t450__menu a[href=\'/' + pathname + '/\']' + (hash ? ', .t450__menu a[href=\'' + hash + '\']' : ''));
  var rec = document.getElementById('rec' + recid);
  var menuLinks = rec ? rec.querySelectorAll('.t450__menu a') : [];
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.classList.remove('t-active')
  });
  Array.prototype.forEach.call(shouldBeActiveElements, function (link) {
    link.classList.add('t-active')
  })
}

function t544_setHeight(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t544');
  if (!container) return;
  var sizer = rec.querySelector('.t544__sizer');
  var sizerStyle = getComputedStyle(sizer, null);
  var sizerPaddingLeft = parseInt(sizerStyle.paddingLeft) || 0;
  var sizerPaddingRight = parseInt(sizerStyle.paddingRight) || 0;
  var sizerPaddingTop = parseInt(sizerStyle.paddingTop) || 0;
  var sizerPaddingBottom = parseInt(sizerStyle.paddingBottom) || 0;
  var sizerHeight = sizer.clientHeight - (sizerPaddingTop + sizerPaddingBottom);
  var sizerWidth = sizer.clientWidth - (sizerPaddingLeft + sizerPaddingRight);
  var sizerRatio = sizerWidth / sizerHeight;
  var elements = rec.querySelectorAll('.t544__blockimg, .t544__textwrapper');
  var elementStyle = getComputedStyle(elements[0], null);
  var elementPaddingLeft = parseInt(elementStyle.paddingLeft) || 0;
  var elementPaddingRight = parseInt(elementStyle.paddingRight) || 0;
  var elementWidth = elements[0].clientWidth - (elementPaddingLeft + elementPaddingRight);
  var maxHeight = elementWidth / sizerRatio;
  if (sizerHeight !== window.innerHeight) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.height = maxHeight + 'px'
    }
  }
}

function t570_init(recid) {
  if (window.innerWidth > 750) {
    t570_setMapHeight(recid);
    window.onload = function () {
      t570_setMapHeight(recid)
    };
    window.addEventListener('resize', function () {
      t570_setMapHeight(recid)
    })
  }
}

function t570_setMapHeight(recid) {
  var rec = document.querySelector('#rec' + recid);
  if (!rec) return;
  var mapElement = rec.querySelector('.t-map');
  var textElement = rec.querySelector('.t570__col_text');
  if (!mapElement || !textElement) return;
  var paddingTop = parseInt(textElement.style.paddingTop, 10) || 0;
  var paddingBottom = parseInt(textElement.style.paddingBottom, 10) || 0;
  var textHeight = textElement.clientHeight - (paddingTop + paddingBottom);
  mapElement.style.height = textHeight + 'px';
  var event = document.createEvent('HTMLEvents');
  event.initEvent('sizechange', !0, !1);
  mapElement.dispatchEvent(event)
}

function t700_init(recId, height) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t700');
  if (!container) return;
  var doResize;
  t700__setHeight(recId, height);
  window.addEventListener('resize', function () {
    clearTimeout(doResize);
    doResize = setTimeout(function () {
      t700__setHeight(recId)
    }, 200)
  });
  if (typeof jQuery !== 'undefined') {
    $(container).bind('displayChanged', function () {
      t700__setHeight(recId)
    })
  } else {
    container.addEventListener('displayChanged', function () {
      t700__setHeight(recId)
    })
  }
}

function t700__setHeight(recId, height) {
  if (height) return;
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var youtube = rec.querySelector('#youtubeiframe' + recId);
  var vimeo = rec.querySelector('.t700__iframe.t700__vimeo');
  var html5video = rec.querySelector('.t700__iframe.t700__html5');
  if (youtube) {
    var youtubeStyle = getComputedStyle(youtube, null);
    var youtubePaddingLeft = parseInt(youtubeStyle.paddingLeft) || 0;
    var youtubePaddingRight = parseInt(youtubeStyle.paddingRight) || 0;
    var youtubeWidth = youtube.clientWidth - (youtubePaddingLeft + youtubePaddingRight);
    var youtubeHeight = youtubeWidth * 0.5625;
    var main = youtube.parentNode;
    youtube.style.height = youtubeHeight + 'px';
    if (main) main.style.height = youtubeHeight + 'px'
  }
  if (vimeo) {
    vimeo.height = t700_getComputedHeight(vimeo.parentNode)
  }
  if (html5video) {
    html5video.height = t700_getComputedHeight(html5video.parentNode)
  }
}

function t700_getComputedHeight(wrapper) {
  var wrapperWidth = parseInt(window.getComputedStyle(wrapper).width, 10);
  return (wrapperWidth / (16 / 9)).toFixed()
}

function t700_onSuccess(form) {
  if (!(form instanceof Element)) form = form[0];
  var inputsWrapper = form.querySelector('.t-form__inputsbox');
  var inputsWrapperStyle = getComputedStyle(inputsWrapper, null);
  var inputsWrapperPaddingTop = parseInt(inputsWrapperStyle.paddingTop) || 0;
  var inputsWrapperPaddingBottom = parseInt(inputsWrapperStyle.paddingBottom) || 0;
  var inputsWrapperHeight = inputsWrapper.clientHeight - (inputsWrapperPaddingTop + inputsWrapperPaddingBottom);
  var inputsOffset = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
  var inputsBottom = inputsWrapperHeight + inputsOffset;
  var successBox = form.querySelector('.t-form__successbox');
  var successBoxOffset = successBox.getBoundingClientRect().top + window.pageYOffset;
  var target = 0;
  var windowHeight = window.innerHeight;
  var body = document.body;
  var html = document.documentElement;
  var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  if (window.innerWidth > 960) {
    target = successBoxOffset - 200
  } else {
    target = successBoxOffset - 100
  }
  var tildaLabel = document.querySelector('.t-tildalabel');
  if (successBoxOffset > window.scrollY || (documentHeight - inputsBottom) < (windowHeight - 100)) {
    inputsWrapper.classList.add('t700__inputsbox_hidden');
    setTimeout(function () {
      if (windowHeight > documentHeight && tildaLabel) {
        t700__fadeOut(tildaLabel)
      }
    }, 300)
  } else {
    t700__scroll(target);
    setTimeout(function () {
      inputsWrapper.classList.add('t700__inputsbox_hidden')
    }, 400)
  }
  var successUrl = $(form).data('success-url');
  if (successUrl) {
    setTimeout(function () {
      window.location.href = successUrl
    }, 500)
  }
}

function t700__fadeOut(el) {
  if (el.style.display === 'none') return;
  var opacity = 1;
  var timer = setInterval(function () {
    el.style.opacity = opacity;
    opacity -= 0.1;
    if (opacity <= 0.1) {
      clearInterval(timer);
      el.style.display = 'none';
      el.style.opacity = null
    }
  }, 50)
}

function t700__scroll(target) {
  var duration = 400;
  var start = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var change = target - start;
  var currentTime = 0;
  var increment = 16;
  document.body.setAttribute('data-scrollable', 'true');

  function t700__easeInOutCubic(currentTime) {
    if ((currentTime /= duration / 2) < 1) {
      return change / 2 * currentTime * currentTime * currentTime + start
    } else {
      return change / 2 * ((currentTime -= 2) * currentTime * currentTime + 2) + start
    }
  }

  function t700__animateScroll() {
    currentTime += increment;
    window.scrollTo(0, t700__easeInOutCubic(currentTime));
    if (currentTime < duration) {
      setTimeout(t700__animateScroll, increment)
    } else {
      document.body.removeAttribute('data-scrollable')
    }
  }
  t700__animateScroll()
}

function t702_initPopup(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t702');
  if (!container) return;
  rec.setAttribute('data-animationappear', 'off');
  rec.setAttribute('data-popup-subscribe-inited', 'y');
  rec.style.opacity = 1;
  var documentBody = document.body;
  var popup = rec.querySelector('.t-popup');
  var popupTooltipHook = popup.getAttribute('data-tooltip-hook');
  var analitics = popup.getAttribute('data-track-popup');
  var popupCloseBtn = popup.querySelector('.t-popup__close');
  var hrefs = rec.querySelectorAll('a[href*="#"]');
  var submitHref = rec.querySelector('.t-submit[href*="#"]');
  if (popupTooltipHook) {
    var recBlocks = document.querySelectorAll('.r');
    for (var i = 0; i < recBlocks.length; i++) {
      recBlocks[i].addEventListener('click', function (event) {
        var target = event.target;
        var href = target.closest('a[href="' + popupTooltipHook + '"]') ? target : !1;
        if (!href) return;
        event.preventDefault();
        t702_showPopup(recId);
        t702_resizePopup(recId);
        t702__lazyLoad();
        if (analitics) {
          Tilda.sendEventToStatistics(analitics, popupTooltipHook)
        }
      })
    }
  }
  popup.addEventListener('scroll', t_throttle(function () {
    t702__lazyLoad()
  }));
  popup.addEventListener('click', function (event) {
    var windowWithoutScrollBar = window.innerWidth - 17;
    if (event.clientX > windowWithoutScrollBar) return;
    if (event.target === this) t702_closePopup()
  });
  popupCloseBtn.addEventListener('click', t702_closePopup);
  if (submitHref) {
    submitHref.addEventListener('click', function () {
      if (documentBody.classList.contains('t-body_scroll-locked')) {
        documentBody.classList.remove('t-body_scroll-locked')
      }
    })
  }
  for (var i = 0; i < hrefs.length; i++) {
    hrefs[i].addEventListener('click', function () {
      var url = this.getAttribute('href');
      if (!url || url.substring(0, 7) != '#price:') {
        t702_closePopup();
        if (!url || url.substring(0, 7) == '#popup:') {
          setTimeout(function () {
            documentBody.classList.add('t-body_popupshowed')
          }, 300)
        }
      }
    })
  }
}

function t702_lockScroll() {
  var documentBody = document.body;
  if (!documentBody.classList.contains('t-body_scroll-locked')) {
    var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || documentBody.parentNode || documentBody).scrollTop;
    documentBody.classList.add('t-body_scroll-locked');
    documentBody.style.top = '-' + bodyScrollTop + 'px';
    documentBody.setAttribute('data-popup-scrolltop', bodyScrollTop)
  }
}

function t702_unlockScroll() {
  var documentBody = document.body;
  if (documentBody.classList.contains('t-body_scroll-locked')) {
    var bodyScrollTop = documentBody.getAttribute('data-popup-scrolltop');
    documentBody.classList.remove('t-body_scroll-locked');
    documentBody.style.top = null;
    documentBody.removeAttribute('data-popup-scrolltop');
    document.documentElement.scrollTop = parseInt(bodyScrollTop)
  }
}

function t702_showPopup(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t702');
  if (!container) return;
  var popup = rec.querySelector('.t-popup');
  var popupContainer = popup.querySelector('.t-popup__container');
  var range = rec.querySelector('.t-range');
  var documentBody = document.body;
  popup.style.display = 'block';
  if (range) t702__triggerEvent(range, 'popupOpened');
  setTimeout(function () {
    popupContainer.classList.add('t-popup__container-animated');
    popup.classList.add('t-popup_show')
  }, 50);
  documentBody.classList.add('t-body_popupshowed');
  documentBody.classList.add('t702__body_popupshowed');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream && window.isiOSVersion && window.isiOSVersion[0] === 11) {
    setTimeout(function () {
      t702_lockScroll()
    }, 500)
  }
  document.addEventListener('keydown', t702_escClosePopup);
  t702__lazyLoad()
}

function t702_escClosePopup(event) {
  if (event.key === 'Escape') t702_closePopup()
}

function t702_closePopup() {
  var popupAll = document.querySelectorAll('.t-popup');
  document.body.classList.remove('t-body_popupshowed');
  document.body.classList.remove('t702__body_popupshowed');
  for (var i = 0; i < popupAll.length; i++) {
    popupAll[i].classList.remove('t-popup_show')
  }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream && window.isiOSVersion && window.isiOSVersion[0] === 11) {
    t702_unlockScroll()
  }
  setTimeout(function () {
    var popupHide = document.querySelectorAll('.t-popup:not(.t-popup_show)');
    for (var i = 0; i < popupHide.length; i++) {
      popupHide[i].style.display = 'none'
    }
  }, 300);
  document.removeEventListener('keydown', t702_escClosePopup)
}

function t702_resizePopup(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var popupContainer = rec.querySelector('.t-popup__container');
  if (!popupContainer) return;
  var popupStyle = getComputedStyle(popupContainer, null);
  var popupPaddingTop = parseInt(popupStyle.paddingTop) || 0;
  var popupPaddingBottom = parseInt(popupStyle.paddingBottom) || 0;
  var popupHeight = popupContainer.clientHeight - (popupPaddingTop + popupPaddingBottom);
  if (popupHeight > (window.innerHeight - 120)) {
    popupContainer.classList.add('t-popup__container-static')
  } else {
    popupContainer.classList.remove('t-popup__container-static')
  }
}

function t702_sendPopupEventToStatistics(popupName) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupName.substring(0, 7) == '#popup:') {
    popupName = popupName.substring(7)
  }
  virtPage += popupName;
  virtTitle += popupName;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
  } else {
    if (ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {
          'hitType': 'pageview',
          'page': virtPage,
          'title': virtTitle
        })
      }
    }
    if (window.mainMetrika && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {
        title: virtTitle,
        referer: window.location.href
      })
    }
  }
}

function t702_onSuccess(form) {
  if (!(form instanceof Element)) form = form[0];
  var inputsWrapper = form.querySelector('.t-form__inputsbox');
  var inputsWrapperStyle = getComputedStyle(inputsWrapper, null);
  var inputsWrapperPaddingTop = parseInt(inputsWrapperStyle.paddingTop) || 0;
  var inputsWrapperPaddingBottom = parseInt(inputsWrapperStyle.paddingBottom) || 0;
  var inputsWrapperHeight = inputsWrapper.clientHeight - (inputsWrapperPaddingTop + inputsWrapperPaddingBottom);
  var inputsOffset = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
  var inputsBottom = inputsWrapperHeight + inputsOffset;
  var successBox = form.querySelector('.t-form__successbox');
  var successBoxOffset = successBox.getBoundingClientRect().top + window.pageYOffset;
  var target = 0;
  var windowHeight = window.innerHeight;
  var body = document.body;
  var html = document.documentElement;
  var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  if (window.innerWidth > 960) {
    target = successBoxOffset - 200
  } else {
    target = successBoxOffset - 100
  }
  var tildaLabel = document.querySelector('.t-tildalabel');
  if (successBoxOffset > window.scrollY || (documentHeight - inputsBottom) < (windowHeight - 100)) {
    inputsWrapper.classList.add('t702__inputsbox_hidden');
    setTimeout(function () {
      if (windowHeight > documentHeight && tildaLabel) {
        t702__fadeOut(tildaLabel)
      }
    }, 300)
  } else {
    t702__scroll(target);
    setTimeout(function () {
      inputsWrapper.classList.add('t702__inputsbox_hidden')
    }, 400)
  }
  var successUrl = $(form).data('success-url');
  if (successUrl) {
    setTimeout(function () {
      window.location.href = successUrl
    }, 500)
  }
}

function t702__fadeOut(el) {
  if (el.style.display === 'none') return;
  var opacity = 1;
  var timer = setInterval(function () {
    el.style.opacity = opacity;
    opacity -= 0.1;
    if (opacity <= 0.1) {
      clearInterval(timer);
      el.style.display = 'none';
      el.style.opacity = null
    }
  }, 50)
}

function t702__scroll(target) {
  var duration = 400;
  var start = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var change = target - start;
  var currentTime = 0;
  var increment = 16;
  document.body.setAttribute('data-scrollable', 'true');

  function t702__easeInOutCubic(currentTime) {
    if ((currentTime /= duration / 2) < 1) {
      return change / 2 * currentTime * currentTime * currentTime + start
    } else {
      return change / 2 * ((currentTime -= 2) * currentTime * currentTime + 2) + start
    }
  }

  function t702__animateScroll() {
    currentTime += increment;
    window.scrollTo(0, t702__easeInOutCubic(currentTime));
    if (currentTime < duration) {
      setTimeout(t702__animateScroll, increment)
    } else {
      document.body.removeAttribute('data-scrollable')
    }
  }
  t702__animateScroll()
}

function t702__lazyLoad() {
  if (window.lazy === 'y' || document.getElementById('allrecords').getAttribute('data-tilda-lazy') === 'yes') {
    t_onFuncLoad('t_lazyload_update', function () {
      t_lazyload_update()
    })
  }
}

function t702__triggerEvent(el, eventName) {
  var event;
  if (typeof window.CustomEvent === 'function') {
    event = new CustomEvent(eventName)
  } else if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, !0, !1)
  } else if (document.createEventObject) {
    event = document.createEventObject();
    event.eventType = eventName
  }
  event.eventName = eventName;
  if (el.dispatchEvent) {
    el.dispatchEvent(event)
  } else if (el.fireEvent) {
    el.fireEvent('on' + event.eventType, event)
  } else if (el[eventName]) {
    el[eventName]()
  } else if (el['on' + eventName]) {
    el['on' + eventName]()
  }
}

function t724_init(recid) {
  if (typeof localStorage === 'object' && !window.isMobile) {
    var el = $('#rec' + recid).find('.t724__opener');
    var name = el.attr('data-cookie-name');
    var time = el.attr('data-cookie-time') * 24 * 60 * 60 * 1000;
    var lstorage = sessionStorage.getItem(name);
    var timeout = parseInt(el.attr('data-timeout'), 10);
    setTimeout(function () {
      $('html').on('mouseleave', function (e) {
        if (e.clientY > 10) {
          return
        }
        var curDate = Math.floor(Date.now());
        if (time == 0) {
          lstorage = sessionStorage.getItem(name)
        } else {
          lstorage = localStorage.getItem(name)
        }
        if (((lstorage == null || typeof lstorage == 'undefined') && !el.hasClass('t724__opener_activated')) || (lstorage < (curDate - time) && time > 0)) {
          el.trigger('click');
          if (el.get(0)) {
            el.get(0).click()
          }
          el.addClass('t724__opener_activated');
          if (time == 0) {
            sessionStorage.setItem(name, curDate)
          }
          if (time > 0) {
            localStorage.setItem(name, curDate)
          }
        }
      })
    }, isNaN(timeout) ? 0 : timeout * 1000)
  }
}

function t734_init(recid) {
  var rec = document.getElementById('rec' + recid);
  if (!rec) return;
  var coverBlock = document.querySelector('.t830');
  if (coverBlock) {
    var slidesWrapper = rec.querySelector('.t-slds__items-wrapper');
    if (slidesWrapper && slidesWrapper.classList.contains('t-slds_animated-none')) {
      t_onFuncLoad('t_sldsInit', function () {
        t_sldsInit(recid)
      })
    } else {
      setTimeout(function () {
        t_onFuncLoad('t_sldsInit', function () {
          t_sldsInit(recid)
        })
      }, 500)
    }
  } else {
    t_onFuncLoad('t_sldsInit', function () {
      t_sldsInit(recid)
    })
  }
  var currentCoverBlock = rec.querySelector('.t734');
  if (currentCoverBlock) {
    if (typeof jQuery !== 'undefined') {
      $(currentCoverBlock).on('displayChanged', function () {
        t_onFuncLoad('t_slds_updateSlider', function () {
          t_slds_updateSlider(recid)
        })
      })
    } else {
      currentCoverBlock.addEventListener('displayChanged', function () {
        t_onFuncLoad('t_slds_updateSlider', function () {
          t_slds_updateSlider(recid)
        })
      })
    }
  }
}

function t754__init(recid) {
  setTimeout(function () {
    t_onFuncLoad('t_prod__init', function () {
      t_prod__init(recid)
    });
    t754__hoverZoom_init(recid);
    t754_initPopup(recid);
    t754__updateLazyLoad(recid);
    t754__alignButtons_init(recid);
    if (typeof t_store_addProductQuantityEvents !== 'undefined') {
      t754_initProductQuantity(recid)
    }
    $('body').trigger('twishlist_addbtn')
  }, 500)
}

function t754_initProductQuantity(recid) {
  var el = $('#rec' + recid);
  var productList = el.find(".t754__col, .t754__product-full");
  productList.each(function (i, product) {
    t_store_addProductQuantityEvents($(product))
  })
}

function t754__showMore(recid) {
  var el = $('#rec' + recid).find(".t754");
  var showmore = el.find('.t754__showmore');
  var cards_count = parseInt(el.attr('data-show-count'), 10);
  if (cards_count > 0) {
    if (showmore.text() === '') {
      showmore.find('td').text(t754__dict('loadmore'))
    }
    showmore.show();
    el.find('.t754__col').hide();
    var cards_size = el.find('.t754__col').size();
    var cards_count = parseInt(el.attr('data-show-count'), 10);
    var x = cards_count;
    var y = cards_count;
    t754__showSeparator(el, x);
    el.find('.t754__col:lt(' + x + ')').show();
    showmore.click(function () {
      x = (x + y <= cards_size) ? x + y : cards_size;
      el.find('.t754__col:lt(' + x + ')').show();
      if (x == cards_size) {
        showmore.hide()
      }
      if (typeof $('.t-records').attr('data-tilda-mode') == 'undefined') {
        if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
          t_onFuncLoad('t_lazyload_update', function () {
            t_lazyload_update()
          })
        }
      }
      t754__showSeparator(el, x);
      if ($('#rec' + recid).find('[data-buttons-v-align]')[0]) {
        t754__alignButtons(recid)
      }
    })
  }
}

function t754__showSeparator(el, x) {
  el.find('.t754__separator_number').addClass('t754__separator_hide');
  el.find('.t754__separator_hide').each(function () {
    if ($(this).attr('data-product-separator-number') <= x) {
      $(this).removeClass('t754__separator_hide')
    }
  })
}

function t754__dict(msg) {
  var dict = [];
  dict.loadmore = {
    EN: 'Load more',
    RU: '?????????????????? ??????',
    FR: 'Charger plus',
    DE: 'Mehr laden',
    ES: 'Carga m??s',
    PT: 'Carregue mais',
    UK: '?????????????????????? ????',
    JA: '?????????????????????',
    ZH: '????????????',
  };
  var lang = window.browserLang;
  if (typeof dict[msg] !== 'undefined') {
    if (typeof dict[msg][lang] !== 'undefined' && dict[msg][lang] != '') {
      return dict[msg][lang]
    } else {
      return dict[msg].EN
    }
  }
  return 'Text not found "' + msg + '"'
}

function t754__alignButtons_init(recid) {
  var el = $('#rec' + recid);
  if (el.find('[data-buttons-v-align]')[0]) {
    try {
      t754__alignButtons(recid);
      $(window).bind('resize', t_throttle(function () {
        if (typeof window.noAdaptive !== 'undefined' && window.noAdaptive === !0 && window.isMobile) {
          return
        }
        t754__alignButtons(recid)
      }, 200));
      el.find('.t754').bind('displayChanged', function () {
        t754__alignButtons(recid)
      });
      if (window.isMobile) {
        $(window).on('orientationchange', function () {
          t754__alignButtons(recid)
        })
      }
    } catch (e) {
      console.log('buttons-v-align error: ' + e.message)
    }
  }
}

function t754__alignButtons(recid) {
  var rec = $('#rec' + recid);
  var wrappers = rec.find('.t754__textwrapper');
  var maxHeight = 0;
  var itemsInRow = rec.find('.t-container').attr('data-blocks-per-row') * 1;
  var mobileView = $(window).width() <= 480;
  var tableView = $(window).width() <= 960 && $(window).width() > 480;
  var mobileOneRow = $(window).width() <= 960 && rec.find('.t754__container_mobile-flex')[0] ? !0 : !1;
  var mobileTwoItemsInRow = $(window).width() <= 480 && rec.find('.t754 .mobile-two-columns')[0] ? !0 : !1;
  if (mobileView) {
    itemsInRow = 1
  }
  if (tableView) {
    itemsInRow = 2
  }
  if (mobileTwoItemsInRow) {
    itemsInRow = 2
  }
  if (mobileOneRow) {
    itemsInRow = 999999
  }
  var i = 1;
  var wrappersInRow = [];
  $.each(wrappers, function (key, element) {
    element.style.height = 'auto';
    if (itemsInRow === 1) {
      element.style.height = 'auto'
    } else {
      wrappersInRow.push(element);
      if (element.offsetHeight > maxHeight) {
        maxHeight = element.offsetHeight
      }
      $.each(wrappersInRow, function (key, wrapper) {
        wrapper.style.height = maxHeight + 'px'
      });
      if (i === itemsInRow) {
        i = 0;
        maxHeight = 0;
        wrappersInRow = []
      }
      i++
    }
  })
}

function t754__hoverZoom_init(recid) {
  if (isMobile) {
    return
  }
  var rec = $('#rec' + recid);
  try {
    if (rec.find('[data-hover-zoom]')[0]) {
      if (!jQuery.cachedZoomScript) {
        jQuery.cachedZoomScript = function (url) {
          var options = {
            dataType: 'script',
            cache: !0,
            url: url
          };
          return jQuery.ajax(options)
        }
      }
      $.cachedZoomScript('https://static.tildacdn.com/js/tilda-hover-zoom-1.0.min.js').done(function (script, textStatus) {
        if (textStatus == 'success') {
          setTimeout(function () {
            t_hoverZoom_init(recid, ".t-slds__container")
          }, 500)
        } else {
          console.log('Upload script error: ' + textStatus)
        }
      })
    }
  } catch (e) {
    console.log('Zoom image init error: ' + e.message)
  }
}

function t754__updateLazyLoad(recid) {
  var scrollContainer = $("#rec" + recid + " .t754__container_mobile-flex");
  var curMode = $(".t-records").attr("data-tilda-mode");
  if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
    scrollContainer.bind('scroll', t_throttle(function () {
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    }))
  }
}

function t754_initPopup(recid) {
  var rec = $('#rec' + recid);
  rec.find('[href^="#prodpopup"]').one("click", function (e) {
    e.preventDefault();
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    t_onFuncLoad('t_sldsInit', function () {
      t_sldsInit(recid + ' #t754__product-' + lid_prod + '')
    })
  });
  rec.find('[href^="#prodpopup"]').click(function (e) {
    e.preventDefault();
    if ($(e.target).hasClass('t1002__addBtn') || $(e.target).parents().hasClass('t1002__addBtn')) {
      return
    }
    t754_showPopup(recid);
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    el_popup.find('.js-product').css('display', 'none');
    var el_fullprod = el_popup.find('.js-product[data-product-lid="' + lid_prod + '"]');
    el_fullprod.css('display', 'block');
    var analitics = el_popup.attr('data-track-popup');
    if (analitics > '') {
      var virtTitle = el_fullprod.find('.js-product-name').text();
      if (!virtTitle) {
        virtTitle = 'prod' + lid_prod
      }
      Tilda.sendEventToStatistics(analitics, virtTitle)
    }
    var curUrl = window.location.href;
    if (curUrl.indexOf('#!/tproduct/') < 0 && curUrl.indexOf('%23!/tproduct/') < 0 && curUrl.indexOf('#%21%2Ftproduct%2F') < 0) {
      if (typeof history.replaceState != 'undefined') {
        window.history.replaceState('', '', window.location.href + '#!/tproduct/' + recid + '-' + lid_prod)
      }
    }
    t754_updateSlider(recid + ' #t754__product-' + lid_prod + '');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  });
  if ($('#record' + recid).length == 0) {
    t754_checkUrl(recid)
  }
  t754_copyTypography(recid)
}

function t754_checkUrl(recid) {
  var curUrl = window.location.href;
  var tprodIndex = curUrl.indexOf('#!/tproduct/');
  if (tprodIndex < 0) {
    tprodIndex = curUrl.indexOf('%23!/tproduct/');
    if (tprodIndex < 0) {
      tprodIndex = curUrl.indexOf('#%21%2Ftproduct%2F')
    }
  }
  if (tprodIndex >= 0) {
    var curUrl = curUrl.substring(tprodIndex, curUrl.length);
    var curProdLid = curUrl.substring(curUrl.indexOf('-') + 1, curUrl.length);
    var rec = $('#rec' + recid);
    if (curUrl.indexOf(recid) >= 0 && rec.find('[data-product-lid=' + curProdLid + ']').length) {
      rec.find('[data-product-lid=' + curProdLid + '] [href^="#prodpopup"]').triggerHandler('click')
    }
  }
}

function t754_updateSlider(recid) {
  var el = $('#rec' + recid);
  t_onFuncLoad('t_slds_SliderWidth', function () {
    t_slds_SliderWidth(recid)
  });
  var sliderWrapper = el.find('.t-slds__items-wrapper');
  var sliderWidth = el.find('.t-slds__container').width();
  var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
  sliderWrapper.css({
    transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
  });
  t_onFuncLoad('t_slds_UpdateSliderHeight', function () {
    t_slds_UpdateSliderHeight(recid)
  });
  t_onFuncLoad('t_slds_UpdateSliderArrowsHeight', function () {
    t_slds_UpdateSliderArrowsHeight(recid)
  })
}

function t754_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t-popup');
  popup.css('display', 'block');
  setTimeout(function () {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  }, 50);
  $('body').addClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  el.find('.t-popup').mousedown(function (e) {
    var windowWidth = $(window).width();
    var maxScrollBarWidth = 17;
    var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
    if (e.clientX > windowWithoutScrollBar) {
      return
    }
    if (e.target == this) {
      t754_closePopup()
    }
  });
  el.find('.t-popup__close, .t754__close-text').click(function (e) {
    t754_closePopup()
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 27) {
      t754_closePopup()
    }
  })
}

function t754_closePopup() {
  $('body').removeClass('t-body_popupshowed');
  $('.t-popup').removeClass('t-popup_show');
  $('body').trigger('twishlist_addbtn');
  var curUrl = window.location.href;
  var indexToRemove = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
    indexToRemove = curUrl.indexOf('%23!/tproduct/');
    if (indexToRemove < 0) {
      indexToRemove = curUrl.indexOf('#%21%2Ftproduct%2F')
    }
  }
  curUrl = curUrl.substring(0, indexToRemove);
  setTimeout(function () {
    $(".t-popup").scrollTop(0);
    $('.t-popup').not('.t-popup_show').css('display', 'none');
    if (typeof history.replaceState != 'undefined') {
      window.history.replaceState('', '', curUrl)
    }
  }, 300)
}

function t754_removeSizeStyles(styleStr) {
  if (typeof styleStr != "undefined" && (styleStr.indexOf('font-size') >= 0 || styleStr.indexOf('padding-top') >= 0 || styleStr.indexOf('padding-bottom') >= 0)) {
    var styleStrSplitted = styleStr.split(';');
    styleStr = "";
    for (var i = 0; i < styleStrSplitted.length; i++) {
      if (styleStrSplitted[i].indexOf('font-size') >= 0 || styleStrSplitted[i].indexOf('padding-top') >= 0 || styleStrSplitted[i].indexOf('padding-bottom') >= 0) {
        styleStrSplitted.splice(i, 1);
        i--;
        continue
      }
      if (styleStrSplitted[i] == "") {
        continue
      }
      styleStr += styleStrSplitted[i] + ";"
    }
  }
  return styleStr
}

function t754_copyTypography(recid) {
  var rec = $('#rec' + recid);
  var titleStyle = rec.find('.t754__title').attr('style');
  var descrStyle = rec.find('.t754__descr').attr('style');
  rec.find('.t-popup .t754__title').attr("style", t754_removeSizeStyles(titleStyle));
  rec.find('.t-popup .t754__descr, .t-popup .t754__text').attr("style", t754_removeSizeStyles(descrStyle))
}

function t760_init(recid) {
  setTimeout(function () {
    t_onFuncLoad('t_prod__init', function () {
      t_prod__init(recid)
    })
  }, 500);
  t760_floating(recid);
  $(window).on('resize', t_throttle(function () {
    t760_floating(recid)
  }, 300));
  $('#rec' + recid).find('.t760').on('displayChanged', function () {
    t760_floating(recid)
  });
  $('body').trigger('twishlist_addbtn')
}

function t760_floating(recid) {
  var element = $('#rec' + recid);
  if (!window.isMobile) {
    element.find(".t760__floatable[data-floating='yes']").each(function () {
      var div = $(this);
      t760_floating_init(div)
    })
  }
}

function t760_floating_init(el) {
  var wnd = $(window);
  var col = el.parent();
  el.css('max-width', '');
  el.css('max-width', el.width());
  el.css('width', '100%');
  col.css('min-height', '');
  col.css('min-height', el.height());
  $(window).on('load', function () {
    col.css('min-height', el.height())
  });
  wnd.bind('scroll', t_throttle(function () {
    t760_floating_scroll(el, wnd, col)
  }, 20));
  wnd.resize(function () {
    wnd.scroll()
  });
  wnd.scroll()
}

function t760_floating_scroll(el, wnd, col) {
  var wnd_height = wnd.height();
  var wnd_width = wnd.width();
  if (wnd_width <= 1024) {
    el.removeClass('t760__fixedTop');
    el.removeClass('t760__fixedBottom');
    el.removeClass('t760__floating');
    return ('')
  }
  el.css('max-width', col.width());
  if (col.height() < el.height() && col.height() > 0) {
    col.height(el.height())
  }
  var el_height = el.height();
  var col_top = col.offset().top;
  var col_width = col.width();
  var col_height = col.height();
  var col_bottom = col_top + col_height;
  var wnd_top = wnd.scrollTop();
  var wnd_bottom = wnd_top + wnd_height;
  var offset = parseFloat(el.attr('data-offset-top'));
  if (wnd_top + el_height + offset >= col_bottom) {
    el.css('top', '');
    el.addClass('t760__fixedBottom');
    el.removeClass('t760__fixedTop');
    el.removeClass('t760__floating')
  } else if (wnd_top + offset > col_top) {
    el.css('top', offset);
    el.addClass('t760__floating');
    el.removeClass('t760__fixedBottom');
    el.removeClass('t760__fixedTop')
  } else {
    el.css('top', '');
    el.addClass('t760__fixedTop');
    el.removeClass('t760__fixedBottom');
    el.removeClass('t760__floating')
  }
}

function t776__init(recid) {
  setTimeout(function () {
    t_onFuncLoad('t_prod__init', function () {
      t_prod__init(recid)
    });
    t776_initPopup(recid);
    t776__hoverZoom_init(recid);
    t776__updateLazyLoad(recid);
    t776__alignButtons_init(recid);
    if (typeof t_store_addProductQuantityEvents !== 'undefined') {
      t776_initProductQuantity(recid)
    }
    $('body').trigger('twishlist_addbtn')
  }, 500)
}

function t776_initProductQuantity(recid) {
  var el = $('#rec' + recid);
  var productList = el.find(".t776__col, .t776__product-full");
  productList.each(function (i, product) {
    t_store_addProductQuantityEvents($(product))
  })
}

function t776__showMore(recid) {
  var el = $('#rec' + recid).find(".t776");
  var showmore = el.find('.t776__showmore');
  var cards_count = parseInt(el.attr('data-show-count'), 10);
  if (cards_count > 0) {
    if (showmore.text() === '') {
      showmore.find('td').text(t776__dict('loadmore'))
    }
    showmore.show();
    el.find('.t776__col').hide();
    var cards_size = el.find('.t776__col').size();
    var x = cards_count;
    var y = cards_count;
    t776__showSeparator(el, x);
    el.find('.t776__col:lt(' + x + ')').show();
    var currentColDisplayProp = el.find('.t776__col:lt(' + x + ')').css('display');
    window.addEventListener('resize', function () {
      var col = el.find('.t776__col:lt(' + x + ')');
      col.each(function () {
        this.style.display = ''
      });
      currentColDisplayProp = el.find('.t776__col:lt(' + x + ')').css('display');
      col.css('display', currentColDisplayProp === 'none' ? 'inline-block' : currentColDisplayProp)
    });
    showmore.click(function () {
      x = (x + y <= cards_size) ? x + y : cards_size;
      el.find('.t776__col:lt(' + x + ')').css('display', currentColDisplayProp === 'none' ? 'inline-block' : currentColDisplayProp);
      if (x == cards_size) {
        showmore.hide()
      }
      t776__showSeparator(el, x);
      if ($('#rec' + recid).find('[data-buttons-v-align]')[0]) {
        t776__alignButtons(recid)
      }
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    })
  }
}

function t776__showSeparator(el, x) {
  el.find('.t776__separator_number').addClass('t776__separator_hide');
  el.find('.t776__separator_hide').each(function () {
    if ($(this).attr('data-product-separator-number') <= x) {
      $(this).removeClass('t776__separator_hide')
    }
  })
}

function t776__dict(msg) {
  var dict = [];
  dict.loadmore = {
    EN: 'Load more',
    RU: '?????????????????? ??????',
    FR: 'Charger plus',
    DE: 'Mehr laden',
    ES: 'Carga m??s',
    PT: 'Carregue mais',
    UK: '?????????????????????? ????',
    JA: '?????????????????????',
    ZH: '????????????',
  };
  var lang = window.browserLang;
  if (typeof dict[msg] !== 'undefined') {
    if (typeof dict[msg][lang] !== 'undefined' && dict[msg][lang] != '') {
      return dict[msg][lang]
    } else {
      return dict[msg].EN
    }
  }
  return 'Text not found "' + msg + '"'
}

function t776__alignButtons_init(recid) {
  var el = $('#rec' + recid);
  if (el.find('[data-buttons-v-align]')[0]) {
    try {
      t776__alignButtons(recid);
      $(window).bind('resize', t_throttle(function () {
        if (typeof window.noAdaptive !== 'undefined' && window.noAdaptive === !0 && $isMobile) {
          return
        }
        t776__alignButtons(recid)
      }));
      el.find('.t776').bind('displayChanged', function () {
        t776__alignButtons(recid)
      });
      if ($isMobile) {
        $(window).on('orientationchange', function () {
          t776__alignButtons(recid)
        })
      }
    } catch (e) {
      console.log('buttons-v-align error: ' + e.message)
    }
  }
}

function t776__alignButtons(recid) {
  var rec = $('#rec' + recid);
  var wrappers = rec.find('.t776__textwrapper');
  var maxHeight = 0;
  var itemsInRow = rec.find('.t-container').attr('data-blocks-per-row') * 1;
  var mobileView = $(window).width() <= 480;
  var tableView = $(window).width() <= 960 && $(window).width() > 480;
  var mobileOneRow = $(window).width() <= 960 && rec.find('.t776__container_mobile-flex')[0] ? true : !1;
  var mobileTwoItemsInRow = $(window).width() <= 480 && rec.find('.t776 .mobile-two-columns')[0] ? true : !1;
  if (mobileView) {
    itemsInRow = 1
  }
  if (tableView) {
    itemsInRow = 2
  }
  if (mobileTwoItemsInRow) {
    itemsInRow = 2
  }
  if (mobileOneRow) {
    itemsInRow = 999999
  }
  var i = 1;
  var wrappersInRow = [];
  $.each(wrappers, function (key, element) {
    element.style.height = 'auto';
    if (itemsInRow === 1) {
      element.style.height = 'auto'
    } else {
      wrappersInRow.push(element);
      if (element.offsetHeight > maxHeight) {
        maxHeight = element.offsetHeight
      }
      $.each(wrappersInRow, function (key, wrapper) {
        wrapper.style.height = maxHeight + 'px'
      });
      if (i === itemsInRow) {
        i = 0;
        maxHeight = 0;
        wrappersInRow = []
      }
      i++
    }
  })
}

function t776__hoverZoom_init(recid) {
  if (isMobile) {
    return
  }
  var rec = $('#rec' + recid);
  try {
    if (rec.find('[data-hover-zoom]')[0]) {
      if (!jQuery.cachedZoomScript) {
        jQuery.cachedZoomScript = function (url) {
          var options = {
            dataType: 'script',
            cache: !0,
            url: url
          };
          return jQuery.ajax(options)
        }
      }
      $.cachedZoomScript('https://static.tildacdn.com/js/tilda-hover-zoom-1.0.min.js').done(function (script, textStatus) {
        if (textStatus == 'success') {
          setTimeout(function () {
            t_hoverZoom_init(recid)
          }, 500)
        } else {
          console.log('Upload script error: ' + textStatus)
        }
      })
    }
  } catch (e) {
    console.log('Zoom image init error: ' + e.message)
  }
}

function t776__updateLazyLoad(recid) {
  var scrollContainer = $("#rec" + recid + " .t776__container_mobile-flex");
  var curMode = $(".t-records").attr("data-tilda-mode");
  if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
    scrollContainer.bind('scroll', t_throttle(function () {
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    }))
  }
}

function t776_initPopup(recid) {
  var rec = $('#rec' + recid);
  rec.find('[href^="#prodpopup"]').each(function (e) {
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    $(".r").find('a[href$="#!/tproduct/' + recid + '-' + lid_prod + '"]').click(function (e) {
      if (rec.find('[data-product-lid=' + lid_prod + ']').length) {
        rec.find('[data-product-lid=' + lid_prod + '] [href^="#prodpopup"]').triggerHandler('click')
      }
    })
  });
  rec.find('[href^="#prodpopup"]').one("click", function (e) {
    e.preventDefault();
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    t_onFuncLoad('t_sldsInit', function () {
      t_sldsInit(recid + ' #t776__product-' + lid_prod + '')
    })
  });
  rec.find('[href^="#prodpopup"]').click(function (e) {
    e.preventDefault();
    if ($(e.target).hasClass('t1002__addBtn') || $(e.target).parents().hasClass('t1002__addBtn')) {
      return
    }
    t776_showPopup(recid);
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    el_popup.find('.js-product').css('display', 'none');
    var el_fullprod = el_popup.find('.js-product[data-product-lid="' + lid_prod + '"]');
    el_fullprod.css('display', 'block');
    var analitics = el_popup.attr('data-track-popup');
    if (analitics > '') {
      var virtTitle = el_fullprod.find('.js-product-name').text();
      if (!virtTitle) {
        virtTitle = 'prod' + lid_prod
      }
      Tilda.sendEventToStatistics(analitics, virtTitle)
    }
    var curUrl = window.location.href;
    if (curUrl.indexOf('#!/tproduct/') < 0 && curUrl.indexOf('%23!/tproduct/') < 0) {
      if (typeof history.replaceState != 'undefined') {
        window.history.replaceState('', '', window.location.href + '#!/tproduct/' + recid + '-' + lid_prod)
      }
    }
    t776_updateSlider(recid + ' #t776__product-' + lid_prod + '');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  });
  if ($('#record' + recid).length == 0) {
    t776_checkUrl(recid)
  }
  t776_copyTypography(recid)
}

function t776_checkUrl(recid) {
  var curUrl = window.location.href;
  var tprodIndex = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && tprodIndex < 0) {
    tprodIndex = curUrl.indexOf('%23!/tproduct/')
  }
  if (tprodIndex >= 0) {
    var curUrl = curUrl.substring(tprodIndex, curUrl.length);
    var curProdLid = curUrl.substring(curUrl.indexOf('-') + 1, curUrl.length);
    var rec = $('#rec' + recid);
    if (curUrl.indexOf(recid) >= 0 && rec.find('[data-product-lid=' + curProdLid + ']').length) {
      rec.find('[data-product-lid=' + curProdLid + '] [href^="#prodpopup"]').triggerHandler('click')
    }
  }
}

function t776_updateSlider(recid) {
  var el = $('#rec' + recid);
  t_onFuncLoad('t_slds_SliderWidth', function () {
    t_slds_SliderWidth(recid)
  });
  var sliderWrapper = el.find('.t-slds__items-wrapper');
  var sliderWidth = el.find('.t-slds__container').width();
  var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
  sliderWrapper.css({
    transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
  });
  t_onFuncLoad('t_slds_UpdateSliderHeight', function () {
    t_slds_UpdateSliderHeight(recid)
  });
  t_onFuncLoad('t_slds_UpdateSliderArrowsHeight', function () {
    t_slds_UpdateSliderArrowsHeight(recid)
  })
}

function t776_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t-popup');
  popup.css('display', 'block');
  setTimeout(function () {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  }, 50);
  $('body').addClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  el.find('.t-popup').mousedown(function (e) {
    var windowWidth = $(window).width();
    var maxScrollBarWidth = 17;
    var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
    if (e.clientX > windowWithoutScrollBar) {
      return
    }
    if (e.target == this) {
      t776_closePopup()
    }
  });
  el.find('.t-popup__close, .t776__close-text').click(function (e) {
    t776_closePopup()
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 27) {
      t776_closePopup()
    }
  });
  if (window.isSafari) {
    setTimeout(function () {
      el.find('.t-popup').scrollTop(1)
    })
  }
}

function t776_closePopup() {
  $('body').removeClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  $('.t-popup').removeClass('t-popup_show');
  var curUrl = window.location.href;
  var indexToRemove = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
    indexToRemove = curUrl.indexOf('%23!/tproduct/')
  }
  curUrl = curUrl.substring(0, indexToRemove);
  setTimeout(function () {
    $(".t-popup").scrollTop(0);
    $('.t-popup').not('.t-popup_show').css('display', 'none');
    if (typeof history.replaceState != 'undefined') {
      window.history.replaceState('', '', curUrl)
    }
  }, 300)
}

function t776_removeSizeStyles(styleStr) {
  if (typeof styleStr != "undefined" && (styleStr.indexOf('font-size') >= 0 || styleStr.indexOf('padding-top') >= 0 || styleStr.indexOf('padding-bottom') >= 0)) {
    var styleStrSplitted = styleStr.split(';');
    styleStr = "";
    for (var i = 0; i < styleStrSplitted.length; i++) {
      if (styleStrSplitted[i].indexOf('font-size') >= 0 || styleStrSplitted[i].indexOf('padding-top') >= 0 || styleStrSplitted[i].indexOf('padding-bottom') >= 0) {
        styleStrSplitted.splice(i, 1);
        i--;
        continue
      }
      if (styleStrSplitted[i] == "") {
        continue
      }
      styleStr += styleStrSplitted[i] + ";"
    }
  }
  return styleStr
}

function t776_copyTypography(recid) {
  var rec = $('#rec' + recid);
  var titleStyle = rec.find('.t776__title').attr('style');
  var descrStyle = rec.find('.t776__descr').attr('style');
  rec.find('.t-popup .t776__title').attr("style", t776_removeSizeStyles(titleStyle));
  rec.find('.t-popup .t776__descr, .t-popup .t776__text').attr("style", t776_removeSizeStyles(descrStyle))
}

function t778__init(recid) {
  t_onFuncLoad('t_prod__init', function () {
    t_prod__init(recid)
  });
  t778_initPopup(recid);
  t778__hoverZoom_init(recid);
  t778__updateLazyLoad(recid);
  t778__alignButtons_init(recid);
  t778__showMore(recid);
  if (typeof t_store_addProductQuantityEvents !== 'undefined') {
    t778_initProductQuantity(recid)
  }
  $('body').trigger('twishlist_addbtn')
}

function t778_initProductQuantity(recid) {
  var el = $('#rec' + recid);
  var productList = el.find(".t778__col, .t778__product-full");
  productList.each(function (i, product) {
    t_store_addProductQuantityEvents($(product))
  })
}

function t778__showMore(recid) {
  var el = $('#rec' + recid).find(".t778");
  var showmore = el.find('.t778__showmore');
  var cards_count = parseInt(el.attr('data-show-count'), 10);
  if (cards_count > 0) {
    if (showmore.text() === '') {
      showmore.find('td').text(t778__dict('loadmore'))
    }
    showmore.show();
    el.find('.t778__col').hide();
    var cards_size = el.find('.t778__col').size();
    var x = cards_count;
    var y = cards_count;
    t778__showSeparator(el, x);
    el.find('.t778__col:lt(' + x + ')').show();
    showmore.click(function () {
      x = (x + y <= cards_size) ? x + y : cards_size;
      el.find('.t778__col:lt(' + x + ')').show();
      el.trigger('displayChanged');
      if (x == cards_size) {
        showmore.hide()
      }
      t778__showSeparator(el, x);
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    })
  }
}

function t778__dict(msg) {
  var dict = [];
  dict.loadmore = {
    EN: 'Load more',
    RU: '?????????????????? ??????',
    FR: 'Charger plus',
    DE: 'Mehr laden',
    ES: 'Carga m??s',
    PT: 'Carregue mais',
    UK: '?????????????????????? ????',
    JA: '?????????????????????',
    ZH: '????????????',
  };
  var lang = window.browserLang;
  if (typeof dict[msg] !== 'undefined') {
    if (typeof dict[msg][lang] !== 'undefined' && dict[msg][lang] != '') {
      return dict[msg][lang]
    } else {
      return dict[msg].EN
    }
  }
  return 'Text not found "' + msg + '"'
}

function t778__showSeparator(el, x) {
  el.find('.t778__separator_number').addClass('t778__separator_hide');
  el.find('.t778__separator_hide').each(function () {
    if ($(this).attr('data-product-separator-number') <= x) {
      $(this).removeClass('t778__separator_hide')
    }
  })
}

function t778__hoverZoom_init(recid) {
  if (window.isMobile) {
    return
  }
  var rec = $('#rec' + recid);
  try {
    if (rec.find('[data-hover-zoom]')[0]) {
      if (!jQuery.cachedZoomScript) {
        jQuery.cachedZoomScript = function (url) {
          var options = {
            dataType: 'script',
            cache: !0,
            url: url
          };
          return jQuery.ajax(options)
        }
      }
      $.cachedZoomScript('https://static.tildacdn.com/js/tilda-hover-zoom-1.0.min.js').done(function (script, textStatus) {
        if (textStatus == 'success') {
          setTimeout(function () {
            t_hoverZoom_init(recid, ".t-slds__container")
          }, 500)
        } else {
          console.log('Upload script error: ' + textStatus)
        }
      })
    }
  } catch (e) {
    console.log('Zoom image init error: ' + e.message)
  }
}

function t778__updateLazyLoad(recid) {
  var scrollContainer = $("#rec" + recid + " .t778__container_mobile-flex");
  var curMode = $(".t-records").attr("data-tilda-mode");
  if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
    scrollContainer.bind('scroll', t_throttle(function () {
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    }))
  }
}

function t778__alignButtons_init(recid) {
  var el = $('#rec' + recid);
  if (el.find('[data-buttons-v-align]')[0]) {
    try {
      t778__alignButtons(recid);
      $(window).bind('resize', t_throttle(function () {
        if (typeof window.noAdaptive !== 'undefined' && window.noAdaptive === !0 && window.isMobile) {
          return
        }
        t778__alignButtons(recid)
      }));
      el.find('.t778').bind('displayChanged', function () {
        t778__alignButtons(recid)
      });
      if (window.isMobile) {
        $(window).on('orientationchange', function () {
          t778__alignButtons(recid)
        })
      }
    } catch (e) {
      console.log('buttons-v-align error: ' + e.message)
    }
  }
}

function t778__alignButtons(recid) {
  var rec = $('#rec' + recid);
  var contents = rec.find('.t778__content');
  var maxHeight = 0;
  var maxHeightBtns = 0;
  var itemsInRow = rec.find('.t-container').attr('data-blocks-per-row') * 1;
  var mobileView = $(window).width() <= 480;
  var tableView = $(window).width() <= 960 && $(window).width() > 480;
  var mobileOneRow = $(window).width() <= 960 && rec.find('.t778__container_mobile-flex')[0] ? !0 : !1;
  var mobileTwoItemsInRow = $(window).width() <= 480 && rec.find('.t778 .mobile-two-columns')[0] ? !0 : !1;
  if (mobileView) {
    itemsInRow = 1
  }
  if (tableView) {
    itemsInRow = 2
  }
  if (mobileTwoItemsInRow) {
    itemsInRow = 2
  }
  if (mobileOneRow) {
    itemsInRow = 999999
  }
  var i = 1;
  var textWrappersInRow = [];
  var btnWrappersInRow = [];
  $.each(contents, function (key, content) {
    var textWrapper = $(content).find('.t778__textwrapper');
    if (textWrapper.length > 0) {
      textWrapper = textWrapper[0];
      textWrapper.style.height = 'auto';
      if (itemsInRow === 1) {
        textWrapper.style.height = 'auto'
      } else {
        textWrappersInRow.push(textWrapper);
        if (textWrapper.offsetHeight > maxHeight) {
          maxHeight = textWrapper.offsetHeight
        }
        if (maxHeight > 0) {
          $(textWrappersInRow).css('height', maxHeight)
        }
      }
    }
    var btnWrapper = $(content).find('.t778__btn-wrapper');
    if (btnWrapper.length > 0) {
      btnWrapper = btnWrapper[0];
      btnWrapper.style.marginTop = '';
      if (itemsInRow === 1) {
        btnWrapper.style.marginTop = ''
      } else {
        btnWrappersInRow.push(btnWrapper);
        if (btnWrapper.offsetHeight > maxHeightBtns) {
          maxHeightBtns = btnWrapper.offsetHeight
        }
        $.each(btnWrappersInRow, function (key, btn) {
          if (maxHeightBtns > btn.offsetHeight) {
            btn.style.marginTop = (maxHeightBtns - btn.offsetHeight) + 'px'
          }
        })
      }
    }
    if (i === itemsInRow) {
      i = 0;
      maxHeight = 0;
      textWrappersInRow = [];
      maxHeightBtns = 0;
      btnWrappersInRow = []
    }
    i++
  })
}

function t778_initPopup(recid) {
  var rec = $('#rec' + recid);
  rec.find('[href^="#prodpopup"]').each(function (e) {
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    $(".r").find('a[href$="#!/tproduct/' + recid + '-' + lid_prod + '"]').click(function (e) {
      if (rec.find('[data-product-lid=' + lid_prod + ']').length) {
        rec.find('[data-product-lid=' + lid_prod + '] [href^="#prodpopup"]').triggerHandler('click')
      }
    })
  });
  rec.find('[href^="#prodpopup"]').one("click", function (e) {
    e.preventDefault();
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    t_onFuncLoad('t_sldsInit', function () {
      t_sldsInit(recid + ' #t778__product-' + lid_prod + '')
    })
  });
  rec.find('[href^="#prodpopup"]').click(function (e) {
    e.preventDefault();
    if ($(e.target).hasClass('t1002__addBtn') || $(e.target).parents().hasClass('t1002__addBtn')) {
      return
    }
    t778_showPopup(recid);
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    el_popup.find('.js-product').css('display', 'none');
    var el_fullprod = el_popup.find('.js-product[data-product-lid="' + lid_prod + '"]');
    el_fullprod.css('display', 'block');
    var analitics = el_popup.attr('data-track-popup');
    if (analitics > '') {
      var virtTitle = el_fullprod.find('.js-product-name').text();
      if (!virtTitle) {
        virtTitle = 'prod' + lid_prod
      }
      Tilda.sendEventToStatistics(analitics, virtTitle)
    }
    var curUrl = window.location.href;
    if (curUrl.indexOf('#!/tproduct/') < 0 && curUrl.indexOf('%23!/tproduct/') < 0) {
      if (typeof history.replaceState != 'undefined') {
        window.history.replaceState('', '', window.location.href + '#!/tproduct/' + recid + '-' + lid_prod)
      }
    }
    t778_updateSlider(recid + ' #t778__product-' + lid_prod + '');
    setTimeout(function () {
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    }, 500)
  });
  if ($('#record' + recid).length == 0) {
    t778_checkUrl(recid)
  }
  t778_copyTypography(recid)
}

function t778_checkUrl(recid) {
  var curUrl = window.location.href;
  var tprodIndex = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && tprodIndex < 0) {
    tprodIndex = curUrl.indexOf('%23!/tproduct/')
  }
  if (tprodIndex >= 0) {
    var curUrl = curUrl.substring(tprodIndex, curUrl.length);
    var curProdLid = curUrl.substring(curUrl.indexOf('-') + 1, curUrl.length);
    var rec = $('#rec' + recid);
    if (curUrl.indexOf(recid) >= 0 && rec.find('[data-product-lid=' + curProdLid + ']').length) {
      rec.find('[data-product-lid=' + curProdLid + '] [href^="#prodpopup"]').triggerHandler('click')
    }
  }
}

function t778_updateSlider(recid) {
  var el = $('#rec' + recid);
  t_onFuncLoad('t_slds_SliderWidth', function () {
    t_slds_SliderWidth(recid)
  });
  var sliderWrapper = el.find('.t-slds__items-wrapper');
  var sliderWidth = el.find('.t-slds__container').width();
  var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
  sliderWrapper.css({
    transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
  });
  t_onFuncLoad('t_slds_UpdateSliderHeight', function () {
    t_slds_UpdateSliderHeight(recid)
  });
  t_onFuncLoad('t_slds_UpdateSliderArrowsHeight', function () {
    t_slds_UpdateSliderArrowsHeight(recid)
  })
}

function t778_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t-popup');
  popup.css('display', 'block');
  setTimeout(function () {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  }, 50);
  $('body').addClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  el.find('.t-popup').mousedown(function (e) {
    var windowWidth = $(window).width();
    var maxScrollBarWidth = 17;
    var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
    if (e.clientX > windowWithoutScrollBar) {
      return
    }
    if (e.target == this) {
      t778_closePopup()
    }
  });
  el.find('.t-popup__close, .t778__close-text').click(function (e) {
    t778_closePopup()
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 27) {
      t778_closePopup()
    }
  })
}

function t778_closePopup() {
  $('body').removeClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  $('.t-popup').removeClass('t-popup_show');
  var curUrl = window.location.href;
  var indexToRemove = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
    indexToRemove = curUrl.indexOf('%23!/tproduct/')
  }
  curUrl = curUrl.substring(0, indexToRemove);
  setTimeout(function () {
    $(".t-popup").scrollTop(0);
    $('.t-popup').not('.t-popup_show').css('display', 'none');
    if (typeof history.replaceState != 'undefined') {
      window.history.replaceState('', '', curUrl)
    }
  }, 300)
}

function t778_removeSizeStyles(styleStr) {
  if (typeof styleStr != "undefined" && (styleStr.indexOf('font-size') >= 0 || styleStr.indexOf('padding-top') >= 0 || styleStr.indexOf('padding-bottom') >= 0)) {
    var styleStrSplitted = styleStr.split(';');
    styleStr = "";
    for (var i = 0; i < styleStrSplitted.length; i++) {
      if (styleStrSplitted[i].indexOf('font-size') >= 0 || styleStrSplitted[i].indexOf('padding-top') >= 0 || styleStrSplitted[i].indexOf('padding-bottom') >= 0) {
        styleStrSplitted.splice(i, 1);
        i--;
        continue
      }
      if (styleStrSplitted[i] == "") {
        continue
      }
      styleStr += styleStrSplitted[i] + ";"
    }
  }
  return styleStr
}

function t778_copyTypography(recid) {
  var rec = $('#rec' + recid);
  var titleStyle = rec.find('.t778__title').attr('style');
  var descrStyle = rec.find('.t778__descr').attr('style');
  rec.find('.t-popup .t778__title').attr("style", t778_removeSizeStyles(titleStyle));
  rec.find('.t-popup .t778__descr, .t-popup .t778__text').attr("style", t778_removeSizeStyles(descrStyle))
}

function t778_unifyHeights(recid) {
  var t778_el = $('#rec' + recid),
    t778_blocksPerRow = t778_el.find(".t778__container").attr("data-blocks-per-row"),
    t778_cols = t778_el.find(".t778__textwrapper"),
    t778_mobScroll = t778_el.find(".t778__scroll-icon-wrapper").length;
  if ($(window).width() <= 480 && t778_mobScroll == 0) {
    t778_cols.css("height", "auto");
    return
  }
  var t778_perRow = +t778_blocksPerRow;
  if ($(window).width() <= 960 && t778_mobScroll > 0) {
    var t778_perRow = t778_cols.length
  } else {
    if ($(window).width() <= 960) {
      var t778_perRow = 2
    }
  }
  for (var i = 0; i < t778_cols.length; i += t778_perRow) {
    var t778_maxHeight = 0,
      t778_row = t778_cols.slice(i, i + t778_perRow);
    t778_row.each(function () {
      var t778_curText = $(this).find(".t778__textwrapper"),
        t778_curBtns = $(this).find(".t778__btn-wrapper_absolute"),
        t778_itemHeight = t778_curText.outerHeight() + t778_curBtns.outerHeight();
      if (t778_itemHeight > t778_maxHeight) {
        t778_maxHeight = t778_itemHeight
      }
    });
    t778_row.css("height", t778_maxHeight)
  }
}

function t786__init(recid) {
  setTimeout(function () {
    t_onFuncLoad('t_prod__init', function () {
      t_prod__init(recid)
    });
    t786_initPopup(recid);
    t786__hoverZoom_init(recid);
    t786__updateLazyLoad(recid);
    t786__alignButtons_init(recid);
    if (typeof t_store_addProductQuantityEvents !== 'undefined') {
      t786_initProductQuantity(recid)
    }
    $('body').trigger('twishlist_addbtn')
  }, 500)
}

function t786_initProductQuantity(recid) {
  var el = $('#rec' + recid);
  var productList = el.find(".t786__col, .t786__product-full");
  productList.each(function (i, product) {
    t_store_addProductQuantityEvents($(product))
  })
}

function t786__alignButtons_init(recid) {
  var el = $('#rec' + recid);
  if (el.find('[data-buttons-v-align]')[0]) {
    try {
      t786__alignButtons(recid);
      $(window).bind('resize', t_throttle(function () {
        if (typeof window.noAdaptive !== 'undefined' && window.noAdaptive === !0 && $isMobile) {
          return
        }
        t786__alignButtons(recid)
      }));
      el.find('.t786').bind('displayChanged', function () {
        t786__alignButtons(recid)
      });
      if ($isMobile) {
        $(window).on('orientationchange', function () {
          t786__alignButtons(recid)
        })
      }
    } catch (e) {
      console.log('buttons-v-align error: ' + e.message)
    }
  }
}

function t786__showMore(recid) {
  var el = $('#rec' + recid).find(".t786");
  var showmore = el.find('.t786__showmore');
  var cards_count = parseInt(el.attr('data-show-count'), 10);
  if (cards_count > 0) {
    if (showmore.text() === '') {
      showmore.find('td').text(t786__dict('loadmore'))
    }
    showmore.show();
    el.find('.t786__col').hide();
    var cards_size = el.find('.t786__col').size();
    var x = cards_count;
    var y = cards_count;
    t786__showSeparator(el, x);
    el.find('.t786__col:lt(' + x + ')').show();
    showmore.click(function () {
      x = (x + y <= cards_size) ? x + y : cards_size;
      el.find('.t786__col:lt(' + x + ')').show();
      if (x == cards_size) {
        showmore.hide()
      }
      t786__showSeparator(el, x);
      if ($('#rec' + recid).find('[data-buttons-v-align]')[0]) {
        t786__alignButtons(recid)
      }
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    })
  }
}

function t786__dict(msg) {
  var dict = [];
  dict.loadmore = {
    EN: 'Load more',
    RU: '?????????????????? ??????',
    FR: 'Charger plus',
    DE: 'Mehr laden',
    ES: 'Carga m??s',
    PT: 'Carregue mais',
    UK: '?????????????????????? ????',
    JA: '?????????????????????',
    ZH: '????????????',
  };
  var lang = window.browserLang;
  if (typeof dict[msg] !== 'undefined') {
    if (typeof dict[msg][lang] !== 'undefined' && dict[msg][lang] != '') {
      return dict[msg][lang]
    } else {
      return dict[msg].EN
    }
  }
  return 'Text not found "' + msg + '"'
}

function t786__showSeparator(el, x) {
  el.find('.t786__separator_number').addClass('t786__separator_hide');
  el.find('.t786__separator_hide').each(function () {
    if ($(this).attr('data-product-separator-number') <= x) {
      $(this).removeClass('t786__separator_hide')
    }
  })
}

function t786__alignButtons(recid) {
  var rec = $('#rec' + recid);
  var wrappers = rec.find('.t786__textwrapper');
  var maxHeight = 0;
  var itemsInRow = rec.find('.t-container').attr('data-blocks-per-row') * 1;
  var mobileView = $(window).width() <= 480;
  var tableView = $(window).width() <= 960 && $(window).width() > 480;
  var mobileOneRow = $(window).width() <= 960 && rec.find('.t786__container_mobile-flex')[0] ? !0 : !1;
  var mobileTwoItemsInRow = $(window).width() <= 480 && rec.find('.t786 .mobile-two-columns')[0] ? !0 : !1;
  if (mobileView) {
    itemsInRow = 1
  }
  if (tableView) {
    itemsInRow = 2
  }
  if (mobileTwoItemsInRow) {
    itemsInRow = 2
  }
  if (mobileOneRow) {
    itemsInRow = 999999
  }
  var i = 1;
  var wrappersInRow = [];
  $.each(wrappers, function (key, element) {
    element.style.height = 'auto';
    if (itemsInRow === 1) {
      element.style.height = 'auto'
    } else {
      wrappersInRow.push(element);
      if (element.offsetHeight > maxHeight) {
        maxHeight = element.offsetHeight
      }
      if (maxHeight > 0) {
        $(wrappersInRow).css('height', maxHeight)
      }
    }
    if (i === itemsInRow) {
      i = 0;
      maxHeight = 0;
      wrappersInRow = []
    }
    i++
  })
}

function t786__hoverZoom_init(recid) {
  if (isMobile) {
    return
  }
  var rec = $('#rec' + recid);
  try {
    if (rec.find('[data-hover-zoom]')[0]) {
      if (!jQuery.cachedZoomScript) {
        jQuery.cachedZoomScript = function (url) {
          var options = {
            dataType: 'script',
            cache: !0,
            url: url
          };
          return jQuery.ajax(options)
        }
      }
      $.cachedZoomScript('https://static.tildacdn.com/js/tilda-hover-zoom-1.0.min.js').done(function (script, textStatus) {
        if (textStatus == 'success') {
          setTimeout(function () {
            t_hoverZoom_init(recid, ".t-slds__container")
          }, 500)
        } else {
          console.log('Upload script error: ' + textStatus)
        }
      })
    }
  } catch (e) {
    console.log('Zoom image init error: ' + e.message)
  }
}

function t786__updateLazyLoad(recid) {
  var scrollContainer = $("#rec" + recid + " .t786__container_mobile-flex");
  var curMode = $(".t-records").attr("data-tilda-mode");
  if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
    scrollContainer.bind('scroll', t_throttle(function () {
      if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
          t_lazyload_update()
        })
      }
    }))
  }
}

function t786_initPopup(recid) {
  var rec = $('#rec' + recid);
  rec.find('[href^="#prodpopup"]').one("click", function (e) {
    e.preventDefault();
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    t_onFuncLoad('t_sldsInit', function () {
      t_sldsInit(recid + ' #t786__product-' + lid_prod + '')
    })
  });
  rec.find('[href^="#prodpopup"]').click(function (e) {
    e.preventDefault();
    if ($(e.target).hasClass('t1002__addBtn') || $(e.target).parents().hasClass('t1002__addBtn')) {
      return
    }
    t786_showPopup(recid);
    var el_popup = rec.find('.t-popup');
    var el_prod = $(this).closest('.js-product');
    var lid_prod = el_prod.attr('data-product-lid');
    el_popup.find('.js-product').css('display', 'none');
    var el_fullprod = el_popup.find('.js-product[data-product-lid="' + lid_prod + '"]');
    el_fullprod.css('display', 'block');
    var analitics = el_popup.attr('data-track-popup');
    if (analitics > '') {
      var virtTitle = el_fullprod.find('.js-product-name').text();
      if (!virtTitle) {
        virtTitle = 'prod' + lid_prod
      }
      Tilda.sendEventToStatistics(analitics, virtTitle)
    }
    var curUrl = window.location.href;
    if (curUrl.indexOf('#!/tproduct/') < 0 && curUrl.indexOf('%23!/tproduct/') < 0) {
      if (typeof history.replaceState != 'undefined') {
        window.history.replaceState('', '', window.location.href + '#!/tproduct/' + recid + '-' + lid_prod)
      }
    }
    t786_updateSlider(recid + ' #t786__product-' + lid_prod + '');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  });
  if ($('#record' + recid).length == 0) {
    t786_checkUrl(recid)
  }
  t786_copyTypography(recid)
}

function t786_checkUrl(recid) {
  var curUrl = window.location.href;
  var tprodIndex = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && tprodIndex < 0) {
    tprodIndex = curUrl.indexOf('%23!/tproduct/')
  }
  if (tprodIndex >= 0) {
    var curUrl = curUrl.substring(tprodIndex, curUrl.length);
    var curProdLid = curUrl.substring(curUrl.indexOf('-') + 1, curUrl.length);
    var rec = $('#rec' + recid);
    if (curUrl.indexOf(recid) >= 0 && rec.find('[data-product-lid=' + curProdLid + ']').length) {
      rec.find('[data-product-lid=' + curProdLid + '] [href^="#prodpopup"]').triggerHandler('click')
    }
  }
}

function t786_updateSlider(recid) {
  var el = $('#rec' + recid);
  t_onFuncLoad('t_slds_SliderWidth', function () {
    t_slds_SliderWidth(recid)
  });
  var sliderWrapper = el.find('.t-slds__items-wrapper');
  var sliderWidth = el.find('.t-slds__container').width();
  var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
  sliderWrapper.css({
    transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
  });
  t_onFuncLoad('t_slds_UpdateSliderHeight', function () {
    t_slds_UpdateSliderHeight(recid)
  });
  t_onFuncLoad('t_slds_UpdateSliderArrowsHeight', function () {
    t_slds_UpdateSliderArrowsHeight(recid)
  })
}

function t786_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t-popup');
  popup.css('display', 'block');
  setTimeout(function () {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
    if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  }, 50);
  $('body').addClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  el.find('.t-popup').mousedown(function (e) {
    var windowWidth = $(window).width();
    var maxScrollBarWidth = 17;
    var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
    if (e.clientX > windowWithoutScrollBar) {
      return
    }
    if (e.target == this) {
      t786_closePopup()
    }
  });
  el.find('.t-popup__close, .t786__close-text').click(function (e) {
    t786_closePopup()
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 27) {
      t786_closePopup()
    }
  })
}

function t786_closePopup() {
  $('body').removeClass('t-body_popupshowed');
  $('body').trigger('twishlist_addbtn');
  $('.t-popup').removeClass('t-popup_show');
  var curUrl = window.location.href;
  var indexToRemove = curUrl.indexOf('#!/tproduct/');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
    indexToRemove = curUrl.indexOf('%23!/tproduct/')
  }
  curUrl = curUrl.substring(0, indexToRemove);
  setTimeout(function () {
    $(".t-popup").scrollTop(0);
    $('.t-popup').not('.t-popup_show').css('display', 'none');
    if (typeof history.replaceState != 'undefined') {
      window.history.replaceState('', '', curUrl)
    }
  }, 300)
}

function t786_removeSizeStyles(styleStr) {
  if (typeof styleStr != "undefined" && (styleStr.indexOf('font-size') >= 0 || styleStr.indexOf('padding-top') >= 0 || styleStr.indexOf('padding-bottom') >= 0)) {
    var styleStrSplitted = styleStr.split(';');
    styleStr = "";
    for (var i = 0; i < styleStrSplitted.length; i++) {
      if (styleStrSplitted[i].indexOf('font-size') >= 0 || styleStrSplitted[i].indexOf('padding-top') >= 0 || styleStrSplitted[i].indexOf('padding-bottom') >= 0) {
        styleStrSplitted.splice(i, 1);
        i--;
        continue
      }
      if (styleStrSplitted[i] == "") {
        continue
      }
      styleStr += styleStrSplitted[i] + ";"
    }
  }
  return styleStr
}

function t786_copyTypography(recid) {
  var rec = $('#rec' + recid);
  var titleStyle = rec.find('.t786__title').attr('style');
  var descrStyle = rec.find('.t786__descr').attr('style');
  rec.find('.t-popup .t786__title').attr("style", t786_removeSizeStyles(titleStyle));
  rec.find('.t-popup .t786__descr, .t-popup .t786__text').attr("style", t786_removeSizeStyles(descrStyle))
}

function t835_init(recid) {
  var rec = document.querySelector('#rec' + recid);
  if (!rec) return;
  var quizWrapper = rec.querySelector('.t835__quiz-wrapper');
  var form = rec.querySelector('.t835 .t-form');
  if (!form) return;
  var quizQuestions = rec.querySelectorAll('.t835 .t-input-group');
  var prevBtn = rec.querySelector('.t835__btn_prev');
  var nextBtn = rec.querySelector('.t835__btn_next');
  var resultBtn = rec.querySelector('.t835__btn_result');
  var errorBoxMiddleWrapper = rec.querySelector('.t-form__errorbox-middle .t-form__errorbox-wrapper');
  var captureFormHTML = '<div class="t835__capture-form"></div>';
  var errorBoxMiddle = rec.querySelector('.t835 .t-form__errorbox-middle');
  var quizQuestionNumber = 0;
  errorBoxMiddle.insertAdjacentHTML('beforebegin', captureFormHTML);
  form.classList.remove('js-form-proccess');
  var currentQuestion = quizQuestions[quizQuestionNumber];
  if (!currentQuestion) return;
  currentQuestion.style.display = 'block';
  currentQuestion.classList.add('t-input-group-step_active');
  t835_workWithAnswerCode(rec);
  Array.prototype.forEach.call(quizQuestions, function (question, i) {
    question.setAttribute('data-question-number', i)
  });
  t835_wrapCaptureForm(rec);
  t835_showCounter(rec, quizQuestionNumber);
  t835_disabledPrevBtn(rec, quizQuestionNumber);
  t835_checkLength(rec);
  prevBtn.addEventListener('click', function (e) {
    if (quizQuestionNumber > 0) {
      quizQuestionNumber--
    }
    t835_setProgress(rec, -1);
    t835_runLazyLoad();
    t835_awayFromResultScreen(rec);
    t835_showCounter(rec, quizQuestionNumber);
    t835_hideError(rec, quizQuestionNumber);
    t835_disabledPrevBtn(rec, quizQuestionNumber);
    t835_switchQuestion(rec, quizQuestionNumber);
    t835_scrollToTop(quizWrapper);
    e.preventDefault()
  });
  nextBtn.addEventListener('click', function (e) {
    if (quizWrapper.classList.contains('t835__quiz-published')) {
      var showErrors = t835_setError(rec, quizQuestionNumber)
    }
    if (showErrors) {
      errorBoxMiddleWrapper.style.display = 'none'
    }
    if (!showErrors) {
      quizQuestionNumber++;
      if (prevBtn) prevBtn.removeAttribute('disabled');
      t835_setProgress(rec, 1);
      t835_showCounter(rec, quizQuestionNumber);
      t835_switchQuestion(rec, quizQuestionNumber);
      t835_scrollToTop(quizWrapper)
    }
    t835_runLazyLoad();
    e.preventDefault()
  });
  Array.prototype.forEach.call(quizQuestions, function (question) {
    question.addEventListener('keypress', function (e) {
      var activeStep = form.querySelector('.t-input-group-step_active');
      if (event.keyCode === 13 && !form.classList.contains('js-form-proccess') && !activeStep.classList.contains('t-input-group_ta')) {
        if (quizWrapper.classList.contains('t835__quiz-published')) {
          var showErrors = t835_setError(rec, quizQuestionNumber)
        }
        var questionArr = t835_createQuestionArr(rec);
        if (showErrors) {
          errorBoxMiddleWrapper.style.display = 'none'
        }
        if (prevBtn) prevBtn.removeAttribute('disabled');
        if (!showErrors) {
          quizQuestionNumber++;
          t835_setProgress(rec, 1);
          if (quizQuestionNumber < questionArr.length) {
            t835_switchQuestion(rec, quizQuestionNumber)
          } else {
            t835_switchResultScreen(rec);
            form.classList.add('js-form-proccess')
          }
          t835_scrollToTop(quizWrapper);
          t835_disabledPrevBtn(rec, quizQuestionNumber)
        }
        t835_runLazyLoad();
        e.preventDefault()
      }
    })
  });
  resultBtn.addEventListener('click', function (e) {
    if (quizWrapper.classList.contains('t835__quiz-published')) {
      var showErrors = t835_setError(rec, quizQuestionNumber)
    }
    if (showErrors) {
      errorBoxMiddleWrapper.style.display = 'none'
    }
    if (!showErrors) {
      quizQuestionNumber++;
      t835_setProgress(rec, 1);
      t835_switchResultScreen(rec);
      t835_scrollToTop(quizWrapper);
      form.classList.add('js-form-proccess');
      t835_disabledPrevBtn(rec, quizQuestionNumber);
      var specCommentInput = form.querySelector('input[name="form-spec-comments"]');
      if (form.getAttribute('data-formactiontype') != 1 && !specCommentInput) {
        form.insertAdjacentHTML('beforeend', '<div style="position: absolute; left: -5000px; bottom:0;"><input type="text" name="form-spec-comments" value="Its good" class="js-form-spec-comments"  tabindex="-1" /></div>')
      }
    }
    e.preventDefault()
  })
}

function t835_runLazyLoad() {
  var records = document.querySelector('.t-records:not([data-tilda-mode])');
  if (records) {
    var allRecs = document.querySelector('#allrecords');
    if (window.lazy === 'y' || allRecs.getAttribute('data-tilda-lazy') === 'yes') {
      t_onFuncLoad('t_lazyload_update', function () {
        t_lazyload_update()
      })
    }
  }
}

function t835_workWithAnswerCode(rec) {
  var inputGroupRi = rec.querySelector('.t-input-group_ri');
  if (inputGroupRi) {
    var inputsRi = inputGroupRi.querySelectorAll('input');
    Array.prototype.forEach.call(inputsRi, function (input) {
      var value = input.value;
      if (value.indexOf('value::') !== -1) {
        t835_setAnswerCode(input);
        var inputParent = input.parentNode;
        var label = inputParent.querySelector('.t-img-select__text');
        label.textContent = label.textContent.split('value::')[0].trim()
      }
    })
  }
  var inputGroupRd = rec.querySelector('.t-input-group_rd');
  if (inputGroupRd) {
    var inputsRd = inputGroupRd.querySelectorAll('input');
    Array.prototype.forEach.call(inputsRd, function (input) {
      var value = input.value;
      if (value.indexOf('value::') !== -1) {
        t835_setAnswerCode(input);
        var label = input.parentNode;
        label.innerHTML = function () {
          var html = input.innerHTML.split('value::')[0].trim();
          return html
        }
      }
    })
  }
  var inputGroupSb = rec.querySelector('.t-input-group_sb');
  if (inputGroupSb) {
    var options = inputGroupSb.querySelectorAll('option');
    Array.prototype.forEach.call(options, function (option) {
      var value = option.value;
      if (value.indexOf('value::') !== -1) {
        t835_setAnswerCode(option);
        option.textContent = option.textContent.split('value::')[0].trim()
      }
    })
  }
}

function t835_setAnswerCode(option) {
  var parameter = option.value.split('value::')[1].trim();
  option.value = parameter
}

function t835_scrollToTop(quizFormWrapper) {
  var topCoordinateForm = quizFormWrapper.getBoundingClientRect().top + window.pageYOffset;
  var paddingTop = 0;
  var blockContainer = quizFormWrapper.closest('.t835');
  if (topCoordinateForm >= window.scrollY || blockContainer.classList.contains('t835_scroll-disabled')) return;
  var menuFixed = document.querySelector('.t228__positionfixed');
  var menuFixedHeight = menuFixed ? parseFloat(getComputedStyle(menuFixed, null).height.replace('px', '')) : 0;
  if (menuFixed && !window.isMobile) {
    paddingTop = paddingTop + menuFixedHeight
  }
  window.scrollTo(0, topCoordinateForm - paddingTop)
}

function t835_checkLength(rec) {
  var nextBtn = rec.querySelector('.t835__btn_next');
  var resultBtn = rec.querySelector('.t835__btn_result');
  var questionArr = t835_createQuestionArr(rec);
  if (questionArr && questionArr.length < 2) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'block'
  }
}

function t835_showCounter(rec, quizQuestionNumber) {
  var counter = rec.querySelector('.t835__quiz-description-counter');
  if (!counter) return;
  var questionArr = t835_createQuestionArr(rec);
  counter.innerHTML = quizQuestionNumber + 1 + '/' + questionArr.length
}

function t835_setError(rec, quizQuestionNumber) {
  var questionsArr = t835_createQuestionArr(rec);
  var currentQuestion = questionsArr[quizQuestionNumber];
  var showErrors;
  if (typeof window.tildaForm !== 'object') return showErrors;
  var errors = window.tildaForm.validate(currentQuestion);
  currentQuestion.classList.add('js-error-control-box');
  var errorsTypeObj = errors[0];
  if (typeof errorsTypeObj !== 'undefined') {
    var errorType = errorsTypeObj.type[0];
    var form = rec.querySelector('.t835 .t-form');
    if (!form) return;
    var errorboxMiddle = form.querySelector('.t-form__errorbox-middle');
    var error = errorboxMiddle.querySelector('.js-rule-error-' + errorType);
    var inputError = currentQuestion.querySelector('.t-input-error');
    var errorTextCustom = error ? error.textContent : '';
    var errorText = '';
    if (errorTextCustom != '') {
      errorText = errorTextCustom
    } else {
      t_onFuncLoad('t_form_dict', function () {
        errorText = t_form_dict(errorType)
      })
    }
    showErrors = errorType == 'emptyfill' ? !1 : window.tildaForm.showErrors(currentQuestion, errors);
    inputError.innerHTML = errorText
  }
  return showErrors
}

function t835_hideError(rec, quizQuestionNumber) {
  var questionsArr = t835_createQuestionArr(rec);
  var currentQuestion = questionsArr[quizQuestionNumber];
  currentQuestion.classList.remove('js-error-control-box');
  var inputError = currentQuestion.querySelector('.t-input-error');
  inputError.innerHTML = ''
}

function t835_setProgress(rec, index) {
  var questionArr = t835_createQuestionArr(rec);
  var progressBar = rec.querySelector('.t835__progressbar');
  var progressbarWidth = parseFloat(getComputedStyle(progressBar, null).width.replace('px', ''));
  var progress = rec.querySelector('.t835__progress');
  var progressWidth = parseFloat(getComputedStyle(progress, null).width.replace('px', ''));
  var progressStep = progressbarWidth / (questionArr.length);
  var percentProgressWidth = (progressWidth + index * progressStep) / progressbarWidth * 100 + '%';
  if (progress) progress.style.width = percentProgressWidth
}

function t835_wrapCaptureForm(rec) {
  var captureForm = rec.querySelector('.t835__capture-form');
  var quizQuestions = rec.querySelectorAll('.t835 .t-input-group');
  var quizFormWrapper = rec.querySelector('.t835__quiz-form-wrapper');
  Array.prototype.forEach.call(quizQuestions, function (question) {
    var currentQuizQuestion = question;
    var emailInputExist = currentQuizQuestion.classList.contains('t-input-group_em');
    var nameInputExist = currentQuizQuestion.classList.contains('t-input-group_nm');
    var phoneInputExist = currentQuizQuestion.classList.contains('t-input-group_ph');
    var checkboxInputExist = currentQuizQuestion.classList.contains('t-input-group_cb');
    var quizQuestionNumber = currentQuizQuestion.getAttribute('data-question-number');
    var maxCountOfCaptureFields = quizFormWrapper.classList.contains('t835__quiz-form-wrapper_withcheckbox') ? 4 : 3;
    if (quizQuestionNumber >= quizQuestions.length - maxCountOfCaptureFields) {
      var isCaptureGroup = !0;
      if (quizFormWrapper.classList.contains('t835__quiz-form-wrapper_newcapturecondition')) {
        var inputsGroup = t835_getNextAll(currentQuizQuestion);
        Array.prototype.forEach.call(inputsGroup, function (group) {
          isCaptureGroup = group.classList.contains('t-input-group_cb') || group.classList.contains('t-input-group_em') || group.classList.contains('t-input-group_nm') || group.classList.contains('t-input-group_ph')
        })
      }
      if (isCaptureGroup) {
        if (quizFormWrapper.classList.contains('t835__quiz-form-wrapper_withcheckbox')) {
          if (emailInputExist || nameInputExist || phoneInputExist || checkboxInputExist) {
            currentQuizQuestion.classList.add('t835__t-input-group_capture');
            captureForm.appendChild(currentQuizQuestion)
          }
        } else if (emailInputExist || nameInputExist || phoneInputExist) {
          currentQuizQuestion.classList.add('t835__t-input-group_capture');
          captureForm.appendChild(currentQuizQuestion)
        }
      }
    }
  })
}

function t835_getNextAll(element) {
  var nextElements = [];
  var nextElement = element;
  while (nextElement.nextElementSibling) {
    if (nextElement.nextElementSibling.classList.contains('t-input-group')) {
      nextElements.push(nextElement.nextElementSibling)
    }
    nextElement = nextElement.nextElementSibling
  }
  return nextElements
}

function t835_createQuestionArr(rec) {
  var quizQuestions = rec.querySelectorAll('.t835 .t-input-group');
  var questionArr = [];
  Array.prototype.forEach.call(quizQuestions, function (question) {
    if (!question.classList.contains('t835__t-input-group_capture')) {
      questionArr.push(question)
    }
  });
  return questionArr
}

function t835_disabledPrevBtn(rec, quizQuestionNumber) {
  var prevBtn = rec.querySelector('.t835__btn_prev');
  quizQuestionNumber == 0 ? prevBtn.setAttribute('disabled', !0) : prevBtn.removeAttribute('disabled')
}

function t835_switchQuestion(rec, quizQuestionNumber) {
  var nextBtn = rec.querySelector('.t835__btn_next');
  var resultBtn = rec.querySelector('.t835__btn_result');
  var questionsArr = t835_createQuestionArr(rec);
  Array.prototype.forEach.call(questionsArr, function (question) {
    question.style.display = 'none';
    question.classList.remove('t-input-group-step_active')
  });
  questionsArr[quizQuestionNumber].style.display = 'block';
  questionsArr[quizQuestionNumber].classList.add('t-input-group-step_active');
  if (quizQuestionNumber === questionsArr.length - 1) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'block'
  } else {
    nextBtn.style.display = 'block';
    resultBtn.style.display = 'none'
  }
}

function t835_switchResultScreen(rec) {
  var captureForm = rec.querySelector('.t835__capture-form');
  var quizDescription = rec.querySelector('.t835__quiz-description');
  var resultTitle = rec.querySelector('.t835__result-title');
  var resultBtn = rec.querySelector('.t835__btn_result');
  var submitBtnWrapper = rec.querySelector('.t835 .t-form__submit');
  var questionsArr = t835_createQuestionArr(rec);
  Array.prototype.forEach.call(questionsArr, function (question) {
    question.style.display = 'none'
  });
  if (captureForm) captureForm.style.display = 'block';
  resultBtn.style.display = 'none';
  if (quizDescription) quizDescription.style.display = 'none';
  if (resultTitle) resultTitle.style.display = 'block';
  submitBtnWrapper.style.display = 'block'
}

function t835_awayFromResultScreen(rec) {
  var captureForm = rec.querySelector('.t835__capture-form');
  var quizDescription = rec.querySelector('.t835__quiz-description');
  var resultTitle = rec.querySelector('.t835__result-title');
  var submitBtnWrapper = rec.querySelector('.t835 .t-form__submit');
  submitBtnWrapper.style.display = 'none';
  if (captureForm) captureForm.style.display = 'none';
  if (quizDescription) quizDescription.style.display = 'block';
  if (resultTitle) resultTitle.style.display = 'none'
}

function t835_onSuccess(form) {
  if (!(form instanceof Element)) form = form[0];
  var inputsWrapper = form.querySelector('.t-form__inputsbox');
  if (!inputsWrapper) return;
  var inputsHeight = parseFloat(getComputedStyle(inputsWrapper, null).height.replace('px', ''));
  var inputsOffset = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
  var inputsBottom = inputsHeight + inputsOffset;
  var successBox = form.querySelector('.t-form__successbox');
  var targetOffset = successBox.getBoundingClientRect().top + window.pageYOffset;
  var wrapper = form.closest('.t835');
  var prevBtn = wrapper.querySelector('.t835__btn_prev');
  var target;
  if (window.innerWidth > 960) {
    target = targetOffset - 200
  } else {
    target = targetOffset - 100
  }
  var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  if (targetOffset > window.pageYOffset || (documentHeight - inputsBottom) < (window.innerHeight - 100)) {
    inputsWrapper.classList.add('t835__inputsbox_hidden');
    setTimeout(function () {
      var body = document.querySelector('.t-body');
      var bodyHeight = parseFloat(getComputedStyle(body, null).height.replace('px', ''));
      if (window.innerHeight > bodyHeight) {
        var tildaLabel = document.querySelector('.t-tildalabel');
        if (tildaLabel) {
          tildaLabel.style.transition = 'opacity 50ms ease';
          tildaLabel.style.opacity = 0
        }
      }
    }, 300)
  } else {
    t835_scrollToTargetBlock(target, 400);
    setTimeout(function () {
      inputsWrapper.classList.add('t835__inputsbox_hidden')
    }, 400)
  }
  var successurl = form.getAttribute('data-success-url');
  if (successurl && successurl.length > 0) {
    setTimeout(function () {
      window.location.href = successurl
    }, 500)
  }
  prevBtn.style.display = 'none'
}

function t835_scrollToTargetBlock(to, duration) {
  if (duration <= 0) return;
  var difference = to - window.pageYOffset;
  var perTick = difference / duration * 10;
  setTimeout(function () {
    window.scrollTo(0, window.pageYOffset + perTick);
    document.body.setAttribute('data-scrollable', 'true');
    if (window.pageYOffset === to) {
      document.body.removeAttribute('data-scrollable');
      return
    }
    t835_scrollToTargetBlock(to, duration - 10)
  }, 10)
}
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    while (el && el.nodeType === 1) {
      if (Element.prototype.matches.call(el, s)) {
        return el
      }
      el = el.parentElement || el.parentNode
    }
    return null
  }
}

function t862_init(recId) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t862');
  if (!container) return;
  var quizWrapper = rec.querySelector('.t862__quiz-wrapper');
  var form = rec.querySelector('.t-form');
  if (!form) return;
  var quizQuestions = rec.querySelectorAll('.t-input-group');
  var prevBtn = rec.querySelector('.t862__btn_prev');
  var nextBtn = rec.querySelector('.t862__btn_next');
  var resultBtn = rec.querySelector('.t862__btn_result');
  var errorBoxMiddle = rec.querySelector('.t-form__errorbox-middle');
  var captureFormHTML = '<div class="t862__capture-form"></div>';
  var quizQuestionNumber = 0;
  if (errorBoxMiddle) {
    var errorBoxMiddleWrapper = errorBoxMiddle.querySelector('.t-form__errorbox-wrapper')
  }
  errorBoxMiddle.insertAdjacentHTML('beforebegin', captureFormHTML);
  form.classList.remove('js-form-proccess');
  quizQuestions[quizQuestionNumber].style.display = 'block';
  quizQuestions[quizQuestionNumber].classList.add('t-input-group-step_active');
  rec.setAttribute('data-animationappear', 'off');
  rec.style.opacity = 1;
  t862_workWithAnswerCode(rec);
  for (var i = 0; i < quizQuestions.length; i++) {
    quizQuestions[i].setAttribute('data-question-number', i)
  }
  t862_wrapCaptureForm(rec);
  var captureForm = rec.querySelector('.t862__capture-form');
  var resultTitle = rec.querySelector('.t862__result-title');
  var resultText = resultTitle ? resultTitle.textContent : '';
  t862_showCounter(rec, quizQuestionNumber);
  t862_disabledPrevBtn(rec, quizQuestionNumber);
  t862_checkLength(rec);
  t862_openToHook(rec, quizQuestions, captureForm);
  prevBtn.addEventListener('click', function (event) {
    if (quizQuestionNumber > 0) {
      quizQuestionNumber--
    }
    t862_setProgress(rec, -1);
    t862__checkMode();
    t862_awayFromResultScreen(rec);
    t862_showCounter(rec, quizQuestionNumber);
    t862_hideError(rec, quizQuestionNumber);
    t862_disabledPrevBtn(rec, quizQuestionNumber);
    t862_switchQuestion(rec, quizQuestionNumber);
    t862_resizePopup(rec);
    event.preventDefault()
  });
  nextBtn.addEventListener('click', function (event) {
    var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
    if (showErrors && errorBoxMiddleWrapper) {
      errorBoxMiddleWrapper.style.display = 'none'
    }
    if (!showErrors) {
      quizQuestionNumber++;
      prevBtn.removeAttribute('disabled');
      t862_setProgress(rec, 1);
      t862_showCounter(rec, quizQuestionNumber);
      t862_switchQuestion(rec, quizQuestionNumber);
      t862_resizePopup(rec)
    }
    t862__checkMode();
    event.preventDefault()
  });
  for (var i = 0; i < quizQuestions.length; i++) {
    var quizQuestion = quizQuestions[i];
    quizQuestion.addEventListener('keypress', function (event) {
      var activeStep = form.querySelector('.t-input-group-step_active');
      if (event.code === 'Enter' && !form.classList.contains('js-form-proccess') && !activeStep.classList.contains('t-input-group_ta')) {
        var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
        var arrQuestion = t862_createQuestionArr(rec);
        if (showErrors && errorBoxMiddleWrapper) {
          errorBoxMiddleWrapper.style.display = 'none'
        }
        prevBtn.removeAttribute('disabled');
        if (!showErrors) {
          quizQuestionNumber++;
          t862_setProgress(rec, 1);
          t862_showCounter(rec, quizQuestionNumber);
          if (quizQuestionNumber < arrQuestion.length) {
            t862_switchQuestion(rec, quizQuestionNumber)
          } else {
            t862_switchResultScreen(rec);
            form.classList.add('js-form-proccess')
          }
          t862_disabledPrevBtn(rec, quizQuestionNumber)
        }
        t862__checkMode();
        event.preventDefault()
      }
    })
  }
  resultBtn.addEventListener('click', function (event) {
    var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
    if (showErrors && errorBoxMiddleWrapper) {
      errorBoxMiddleWrapper.style.display = 'none'
    }
    if (!showErrors) {
      quizQuestionNumber++;
      t862_setProgress(rec, 1);
      form.classList.add('js-form-proccess');
      t862_disabledPrevBtn(rec, quizQuestionNumber);
      if (!captureForm.innerHTML && !resultText) {
        t862_showCounter(rec, quizQuestionNumber);
        t862_switchQuestion(rec, quizQuestionNumber)
      } else {
        t862_switchResultScreen(rec)
      }
    }
    event.preventDefault()
  })
}

function t862_workWithAnswerCode(rec) {
  var riInputs = rec.querySelectorAll('.t-input-group_ri input');
  var rdInputs = rec.querySelectorAll('.t-input-group_rd input');
  var sbOptions = rec.querySelectorAll('.t-input-group_sb option');
  for (var i = 0; i < riInputs.length; i++) {
    var input = riInputs[i];
    if (input.value.indexOf('value::') !== -1) {
      t862_setAnswerCode(input);
      var text = input.parentNode.querySelector('.t-img-select__text');
      if (text) {
        text.textContent = text.textContent.split('value::')[0].trim()
      }
    }
  }
  for (var i = 0; i < rdInputs.length; i++) {
    var input = rdInputs[i];
    if (input.value.indexOf('value::') !== -1) {
      t862_setAnswerCode(input);
      var label = input.parentNode;
      if (label) {
        label.innerHTML = label.innerHTML.split('value::')[0].trim()
      }
    }
  }
  for (var i = 0; i < sbOptions.length; i++) {
    var option = sbOptions[i];
    if (option.value.indexOf('value::') !== -1) {
      t862_setAnswerCode(option);
      option.textContent = option.textContent.split('value::')[0].trim()
    }
  }
}

function t862_setAnswerCode(element) {
  element.value = element.value.split('value::')[1].trim()
}

function t862_wrapCaptureForm(rec) {
  var captureForm = rec.querySelector('.t862__capture-form');
  var quizQuestions = rec.querySelectorAll('.t-input-group');
  var quizFormWrapper = rec.querySelector('.t862__quiz-form-wrapper');
  for (var i = 0; i < quizQuestions.length; i++) {
    var quizQuestion = quizQuestions[i];
    var isEmail = quizQuestion.classList.contains('t-input-group_em');
    var isName = quizQuestion.classList.contains('t-input-group_nm');
    var isPhone = quizQuestion.classList.contains('t-input-group_ph');
    var isCheckbox = quizQuestion.classList.contains('t-input-group_cb');
    var quizQuestionNumber = quizQuestion.getAttribute('data-question-number');
    var maxCountOfCaptureFields = 4;
    if (quizQuestionNumber >= quizQuestions.length - maxCountOfCaptureFields) {
      var isCaptureGroup = !0;
      if (quizFormWrapper.classList.contains('t862__quiz-form-wrapper_newcapturecondition')) {
        var inputsGroup = t862__nextAll(quizQuestion, '.t-input-group');
        for (var j = 0; j < inputsGroup.length; j++) {
          var inputGroup = inputsGroup[j];
          isCaptureGroup = inputGroup.classList.contains('t-input-group_cb') || inputGroup.classList.contains('t-input-group_em') || inputGroup.classList.contains('t-input-group_nm') || inputGroup.classList.contains('t-input-group_ph')
        }
      }
      if (isCaptureGroup) {
        if (isEmail || isName || isPhone || isCheckbox) {
          quizQuestion.classList.add('t862__t-input-group_capture');
          captureForm.appendChild(quizQuestion)
        }
      }
    }
  }
}

function t862_showCounter(rec, quizQuestionNumber) {
  var counter = rec.querySelector('.t862__quiz-description-counter');
  if (!counter) return;
  var arrQuestion = t862_createQuestionArr(rec);
  counter.innerHTML = quizQuestionNumber + 1 + '/' + arrQuestion.length
}

function t862_createQuestionArr(rec) {
  var quizQuestions = rec.querySelectorAll('.t-input-group');
  var arrQuestion = [];
  for (var i = 0; i < quizQuestions.length; i++) {
    var quizQuestion = quizQuestions[i];
    if (!quizQuestion.classList.contains('t862__t-input-group_capture')) {
      arrQuestion.push(quizQuestion)
    }
  }
  return arrQuestion
}

function t862_disabledPrevBtn(rec, quizQuestionNumber) {
  var prevBtn = rec.querySelector('.t862__btn_prev');
  if (quizQuestionNumber === 0) {
    prevBtn.setAttribute('disabled', '')
  } else {
    prevBtn.removeAttribute('disabled')
  }
}

function t862_checkLength(rec) {
  var nextBtn = rec.querySelector('.t862__btn_next');
  var resultBtn = rec.querySelector('.t862__btn_result');
  var arrQuestion = t862_createQuestionArr(rec);
  var submitBtnWrapper = rec.querySelector('.t-form__submit');
  var captureForm = rec.querySelector('.t862__capture-form');
  var resultTitle = rec.querySelector('.t862__result-title');
  var resultText = resultTitle ? resultTitle.textContent : '';
  if (!captureForm.innerHTML && !resultText && arrQuestion.length < 2) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'none';
    submitBtnWrapper.style.display = 'block'
  } else if (arrQuestion.length < 2) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'block'
  }
}

function t862_openToHook(rec, quizQuestions, captureForm) {
  var popup = rec.querySelector('.t-popup');
  var popupCloseBtn = rec.querySelector('.t-popup__close');
  var hrefs = rec.querySelectorAll('a[href*="#"]');
  var hook = popup.getAttribute('data-tooltip-hook');
  var analitics = popup.getAttribute('data-track-popup');
  var escepeEvent = t862__escClosePopup.bind(popup, rec);
  if (hook) {
    document.addEventListener('click', function (event) {
      if (event.target.closest('a[href="' + hook + '"]')) {
        event.preventDefault();
        t862_showPopup(rec, quizQuestions, captureForm, escepeEvent);
        setTimeout(function () {
          t862_resizePopup(rec)
        }, 50);
        t862__lazyLoad();
        if (analitics) {
          var virtTitle = hook;
          if (virtTitle.substring(0, 7) == '#popup:') {
            virtTitle = virtTitle.substring(7)
          }
          Tilda.sendEventToStatistics(analitics, virtTitle)
        }
      }
    })
  }
  popup.addEventListener('click', function (event) {
    if (event.target === this) t862_closePopup(rec, escepeEvent)
  });
  popupCloseBtn.addEventListener('click', function () {
    t862_closePopup(rec, escepeEvent)
  });
  for (var i = 0; i < hrefs.length; i++) {
    hrefs[i].addEventListener('click', function () {
      var url = this.getAttribute('href');
      if (!url || (url.substring(0, 7) != '#price:' && url.substring(0, 7) != '#order:')) {
        t862_closePopup(rec, escepeEvent);
        if (!url || url.substring(0, 7) == '#popup:') {
          setTimeout(function () {
            document.body.classList.add('t-body_popupshowed')
          }, 300)
        }
      }
    })
  }
}

function t862_setProgress(rec, index) {
  var progressBar = rec.querySelector('.t862__progressbar');
  var progress = rec.querySelector('.t862__progress');
  var questionCount = t862_createQuestionArr(rec).length;
  var captureForm = rec.querySelector('.t862__capture-form');
  var resultTitle = rec.querySelector('.t862__result-title');
  var resultText = resultTitle ? resultTitle.textContent : '';
  var progressbarWidth = 0;
  var progressBarStyle = getComputedStyle(progressBar, null);
  var progressBarPaddingLeft = parseInt(progressBarStyle.paddingLeft) || 0;
  var progressBarPaddingRight = parseInt(progressBarStyle.paddingRight) || 0;
  progressbarWidth = progressBar.clientWidth - (progressBarPaddingLeft + progressBarPaddingRight);
  if (!captureForm.innerHTML && !resultText && questionCount > 0) {
    questionCount--
  }
  var progressWidth = progress.getAttribute('data-progress-bar');
  if (!progressWidth) {
    progressWidth = 0;
    progress.setAttribute('data-progress-bar', '0')
  }
  var progressStep = progressbarWidth / questionCount;
  var percentProgress = (parseFloat(progressWidth) + (index * progressStep)) / progressbarWidth * 100;
  if (isNaN(percentProgress) || percentProgress === -Infinity) {
    percentProgress = 0;
    progress.setAttribute('data-progress-bar', percentProgress)
  } else if (percentProgress === Infinity) {
    percentProgress = progressbarWidth;
    progress.setAttribute('data-progress-bar', percentProgress)
  } else {
    progress.setAttribute('data-progress-bar', progressbarWidth / 100 * percentProgress)
  }
  if (percentProgress > 100) {
    percentProgress = 100
  } else if (percentProgress < 0) {
    percentProgress = 0
  }
  if (progress) progress.style.width = percentProgress + '%'
}

function t862__checkMode() {
  if (document.getElementById('allrecords').getAttribute('data-tilda-mode')) {
    t862__lazyLoad()
  }
}

function t862__lazyLoad() {
  if (window.lazy === 'y' || document.getElementById('allrecords').getAttribute('data-tilda-lazy') === 'yes') {
    t_onFuncLoad('t_lazyload_update', function () {
      t_lazyload_update()
    })
  }
}

function t862_awayFromResultScreen(rec) {
  var captureForm = rec.querySelector('.t862__capture-form');
  var quizDescription = rec.querySelector('.t862__quiz-description');
  var resultTitle = rec.querySelector('.t862__result-title');
  var submitBtnWrapper = rec.querySelector('.t-form__submit');
  captureForm.style.display = 'none';
  if (resultTitle) resultTitle.style.display = 'none';
  if (submitBtnWrapper) submitBtnWrapper.style.display = 'none';
  if (quizDescription) quizDescription.style.display = 'block'
}

function t862_hideError(rec, quizQuestionNumber) {
  var arrQuestion = t862_createQuestionArr(rec);
  var activeQuestion = arrQuestion[quizQuestionNumber];
  if (!activeQuestion) return;
  activeQuestion.classList.remove('js-error-control-box');
  activeQuestion.querySelector('.t-input-error').innerHTML = ''
}

function t862_switchQuestion(rec, quizQuestionNumber) {
  var nextBtn = rec.querySelector('.t862__btn_next');
  var resultBtn = rec.querySelector('.t862__btn_result');
  var arrQuestion = t862_createQuestionArr(rec);
  var submitBtnWrapper = rec.querySelector('.t-form__submit');
  var captureForm = rec.querySelector('.t862__capture-form');
  var resultTitle = rec.querySelector('.t862__result-title');
  var resultText = resultTitle ? resultTitle.textContent : '';
  for (var i = 0; i < arrQuestion.length; i++) {
    var question = arrQuestion[i];
    question.style.display = 'none';
    question.classList.remove('t-input-group-step_active')
  }
  var activeQuestion = arrQuestion[quizQuestionNumber];
  var range = activeQuestion.querySelector('.t-range');
  activeQuestion.style.display = 'block';
  activeQuestion.classList.add('t-input-group-step_active');
  if (range) t862__triggerEvent(range, 'displayChanged');
  var captureFormHTML = captureForm.innerHTML;
  if (!captureFormHTML && !resultText && quizQuestionNumber === arrQuestion.length - 2) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'block';
    submitBtnWrapper.style.display = 'none'
  } else if (!captureFormHTML && !resultText && quizQuestionNumber === arrQuestion.length - 1) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'none';
    submitBtnWrapper.style.display = 'block'
  } else if (quizQuestionNumber === arrQuestion.length - 1) {
    nextBtn.style.display = 'none';
    resultBtn.style.display = 'block';
    submitBtnWrapper.style.display = 'none'
  } else {
    nextBtn.style.display = 'block';
    resultBtn.style.display = 'none';
    submitBtnWrapper.style.display = 'none'
  }
}

function t862_showError(rec, quizWrapper, quizQuestionNumber) {
  if (quizWrapper.classList.contains('t862__quiz-published')) {
    return t862_setError(rec, quizQuestionNumber)
  }
}

function t862_setError(rec, quizQuestionNumber) {
  var arrQuestion = t862_createQuestionArr(rec);
  var activeQuestion = arrQuestion[quizQuestionNumber];
  var showErrors;
  if (typeof window.tildaForm !== 'object') return showErrors;
  var arrErrors = window.tildaForm.validate(activeQuestion);
  var errorsTypeObj = arrErrors[0];
  if (activeQuestion) activeQuestion.classList.add('js-error-control-box');
  if (errorsTypeObj) {
    var errorType = errorsTypeObj.type[0];
    var error = rec.querySelector('.t-form .t-form__errorbox-middle .js-rule-error-' + errorType);
    var strError = '';
    if (error) strError = error.textContent;
    if (!strError) {
      t_onFuncLoad('t_form_dict', function () {
        strError = t_form_dict(errorType)
      })
    }
    if (errorType === 'emptyfill') {
      showErrors = !1
    } else {
      showErrors = window.tildaForm.showErrors(activeQuestion, arrErrors)
    }
    var inputError = activeQuestion.querySelector('.t-input-error');
    if (inputError) inputError.innerHTML = strError
  }
  return showErrors
}

function t862_switchResultScreen(rec) {
  var resultBtn = rec.querySelector('.t862__btn_result');
  var submitBtnWrapper = rec.querySelector('.t-form__submit');
  var captureForm = rec.querySelector('.t862__capture-form');
  var resultTitle = rec.querySelector('.t862__result-title');
  if (captureForm.innerHTML || resultTitle.textContent) {
    var quizDescription = rec.querySelector('.t862__quiz-description');
    var arrQuestion = t862_createQuestionArr(rec);
    for (var i = 0; i < arrQuestion.length; i++) {
      arrQuestion[i].style.display = 'none'
    }
    if (captureForm) captureForm.style.display = 'block';
    if (resultTitle) resultTitle.style.display = 'block';
    if (quizDescription) quizDescription.style.display = 'none'
  }
  resultBtn.style.display = 'none';
  submitBtnWrapper.style.display = 'block'
}

function t862_onSuccess(form) {
  var body = document.body;
  var html = document.documentElement;
  var scrollTop = window.pageYOffset;
  var windowHeight = window.innerHeight;
  var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  if (!(form instanceof Element)) form = form[0];
  var inputsWrapper = form.querySelector('.t-form__inputsbox');
  var inputsHeight = parseInt(getComputedStyle(inputsWrapper, null).height) || 0;
  var inputsRect = inputsWrapper.getBoundingClientRect();
  var inputsOffsetTop = inputsRect.top + scrollTop;
  var inputsBottom = inputsHeight + inputsOffsetTop;
  var successBox = form.querySelector('.t-form__successbox');
  var successBoxRect = successBox.getBoundingClientRect();
  var successBoxOffsetTop = successBoxRect.top + scrollTop;
  var prevBtn = form.closest('.t862').querySelector('.t862__btn_prev');
  var target;
  if (window.innerWidth > 960) {
    target = successBoxOffsetTop - 200
  } else {
    target = successBoxOffsetTop - 100
  }
  if (successBoxOffsetTop > scrollTop || documentHeight - inputsBottom < windowHeight - 100) {
    inputsWrapper.classList.add('t862__inputsbox_hidden');
    var tildaLabel = document.querySelector('.t-tildalabel');
    if (tildaLabel) {
      setTimeout(function () {
        if (windowHeight > documentHeight) {
          t862__fadeOut(tildaLabel)
        }
      }, 300)
    }
  } else {
    t862__scroll(target);
    setTimeout(function () {
      inputsWrapper.classList.add('t862__inputsbox_hidden')
    }, 400)
  }
  var successUrl = form.getAttribute('data-success-url');
  if (successUrl) {
    setTimeout(function () {
      window.location.href = successUrl
    }, 500)
  }
  prevBtn.style.display = 'none'
}

function t862_lockScroll() {
  var documentBody = document.body;
  if (!documentBody.classList.contains('t-body_scroll-locked')) {
    var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || documentBody.parentNode || documentBody).scrollTop;
    documentBody.classList.add('t-body_scroll-locked');
    documentBody.style.top = '-' + bodyScrollTop + 'px';
    documentBody.setAttribute('data-popup-scrolltop', bodyScrollTop)
  }
}

function t862_unlockScroll() {
  var documentBody = document.body;
  if (documentBody.classList.contains('t-body_scroll-locked')) {
    var bodyScrollTop = documentBody.getAttribute('data-popup-scrolltop');
    documentBody.classList.remove('t-body_scroll-locked');
    documentBody.style.top = '';
    documentBody.removeAttribute('data-popup-scrolltop');
    window.scrollTo(0, parseInt(bodyScrollTop))
  }
}

function t862_showPopup(rec, quizQuestions, captureForm, escapeEvent) {
  var windowWidth = window.innerWidth;
  var body = document.body;
  var popup = rec.querySelector('.t-popup');
  var popupContainer = popup.querySelector('.t-popup__container');
  var quiz = rec.querySelector('.t862__quiz');
  var range = rec.querySelector('.t-range');
  popup.style.display = 'block';
  if (range) t862__triggerEvent(range, 'popupOpened');
  t862__lazyLoad();
  setTimeout(function () {
    popup.classList.add('t-popup_show');
    popupContainer.classList.add('t-popup__container-animated');
    if (windowWidth > 640 && quiz.classList.contains('t862__quiz_fixedheight')) {
      t862_setHeight(rec, quizQuestions, captureForm)
    }
    if (windowWidth <= 640) t862_setMobileHeight();
    t862__showJivo('1', '1')
  }, 50);
  body.classList.add('t-body_popupshowed');
  body.classList.add('t862__body_popupshowed');
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    setTimeout(function () {
      t862_lockScroll()
    }, 500)
  }
  document.addEventListener('keydown', escapeEvent)
}

function t862__escClosePopup(rec, escapeEvent) {
  if (arguments[1].key === 'Escape') t862_closePopup(rec, escapeEvent)
}

function t862_setHeight(rec, quizQuestions, captureForm) {
  var quizWrapper = rec.querySelector('.t862__quiz-form-wrapper');
  var resultTitle = rec.querySelector('.t862__result-title');
  var resultDescr = rec.querySelector('.t862__quiz-description');
  var resultTitleHeight = resultTitle ? resultTitle.offsetHeight : 0;
  var quizDescriptionHeight = resultDescr ? resultDescr.offsetHeight : 0;
  var questions = [];
  var questionsHeight = [];
  for (var i = 0; i < quizQuestions.length; i++) {
    var quizQuestion = quizQuestions[i];
    if (!quizQuestion.classList.contains('t862__t-input-group_capture')) {
      questions.push(quizQuestion)
    }
  }
  for (var i = 0; i < questions.length; i++) {
    questionsHeight.push(questions[i].offsetHeight)
  }
  var maxHeightQuestion = Math.max.apply(null, questionsHeight);
  captureForm.style.display = 'block';
  var captureFormHeight = 0;
  var inputsBlock = captureForm.querySelectorAll('.t-input-block');
  for (var i = 0; i < inputsBlock.length; i++) {
    var inputBlock = inputsBlock[i];
    var inputBlockStyle = getComputedStyle(inputBlock, null);
    var inputBlockHeight = parseInt(inputBlockStyle.height) || 0;
    var inputBlockMarginBottom = parseInt(inputBlockStyle.marginBottom) || 0;
    captureFormHeight += (inputBlockHeight + inputBlockMarginBottom)
  }
  captureForm.style.display = 'none';
  var height = maxHeightQuestion > captureFormHeight ? maxHeightQuestion : captureFormHeight;
  for (var i = 0; i < questions.length; i++) {
    questions[i].style.minHeight = height + 'px'
  }
  captureForm.style.minHeight = height + 'px';
  quizWrapper.style.minHeight = height + 'px';
  var headerHeight = resultTitleHeight > quizDescriptionHeight ? resultTitleHeight : quizDescriptionHeight;
  var quizWrapperHeight = quizWrapper.offsetHeight;
  var btnHeight = rec.querySelector('.t862__btn-wrapper').offsetHeight;
  rec.querySelector('.t862__wrapper').style.minHeight = (headerHeight + quizWrapperHeight + btnHeight) + 'px'
}

function t862_setMobileHeight() {
  t862_calcVH();
  window.addEventListener('resize', t862_calcVH)
}

function t862_calcVH() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px')
}

function t862_closePopup(rec, escapeEvent) {
  var body = document.body;
  var popup = rec.querySelector('.t-popup');
  var popupActive = document.querySelector('.t-popup.t-popup_show');
  if (popup === popupActive) {
    body.classList.remove('t-body_popupshowed');
    body.classList.remove('t862__body_popupshowed')
  }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    t862_unlockScroll()
  }
  popup.classList.remove('t-popup_show');
  t862__showJivo('2147483647', '2147483648');
  setTimeout(function () {
    var popupHide = document.querySelectorAll('.t-popup:not(.t-popup_show)');
    for (var i = 0; i < popupHide.length; i++) {
      popupHide[i].style.display = 'none'
    }
  }, 300);
  document.removeEventListener('keydown', escapeEvent)
}

function t862_resizePopup(rec) {
  var windowHeight = window.innerHeight - 120;
  var popupContainer = rec.querySelector('.t-popup__container');
  var popupContainerStyle = getComputedStyle(popupContainer, null);
  var popupContainerPaddingTop = parseInt(popupContainerStyle.paddingTop) || 0;
  var popupContainerPaddingBottom = parseInt(popupContainerStyle.paddingBottom) || 0;
  var popupContainerHeight = popupContainer.clientHeight - (popupContainerPaddingTop + popupContainerPaddingBottom);
  if (popupContainerHeight > windowHeight) {
    popupContainer.classList.add('t-popup__container-static')
  } else {
    popupContainer.classList.remove('t-popup__container-static')
  }
}

function t862__showJivo(indexMobile, indexDesktop) {
  var jivoBtn = document.querySelectorAll('._show_1e.wrap_mW.__jivoMobileButton');
  var jivoLabel = document.querySelectorAll('.label_39#jvlabelWrap');
  for (var i = 0; i < jivoBtn.length; i++) {
    jivoBtn[i].style.zIndex = indexMobile
  }
  for (var i = 0; i < jivoLabel.length; i++) {
    jivoLabel[i].style.zIndex = indexDesktop
  }
}

function t862_sendPopupEventToStatistics(popupName) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupName.substring(0, 7) == '#popup:') {
    popupName = popupName.substring(7)
  }
  virtPage += popupName;
  virtTitle += popupName;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
  } else {
    if (ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {
          'hitType': 'pageview',
          'page': virtPage,
          'title': virtTitle
        })
      }
    }
    if (window.mainMetrika && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {
        title: virtTitle,
        referer: window.location.href
      })
    }
  }
}

function t862__nextAll(element, selector) {
  var nextElements = [];
  var nextElement = element;
  while (nextElement.nextElementSibling) {
    nextElement = nextElement.nextElementSibling;
    if (nextElement.matches(selector)) {
      nextElements.push(nextElement)
    }
  }
  return nextElements
}

function t862__triggerEvent(el, eventName) {
  var event;
  if (typeof window.CustomEvent === 'function') {
    event = new CustomEvent(eventName)
  } else if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, !0, !1)
  } else if (document.createEventObject) {
    event = document.createEventObject();
    event.eventType = eventName
  }
  event.eventName = eventName;
  if (el.dispatchEvent) {
    el.dispatchEvent(event)
  } else if (el.fireEvent) {
    el.fireEvent('on' + event.eventType, event)
  } else if (el[eventName]) {
    el[eventName]()
  } else if (el['on' + eventName]) {
    el['on' + eventName]()
  }
}

function t862__fadeOut(element) {
  var elementStyle = getComputedStyle(element, null);
  if (elementStyle.display === 'none' || elementStyle.opacity === '0') return;
  var opacity = 1;
  var timer = setInterval(function () {
    element.style.opacity = opacity;
    opacity -= 0.1;
    if (opacity <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
      element.style.opacity = null
    }
  }, 50)
}

function t862__scroll(target) {
  var duration = 400;
  var start = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var change = target - start;
  var currentTime = 0;
  var increment = 16;
  var documentBody = document.body;
  documentBody.setAttribute('data-scrollable', 'true');

  function t862__easeInOutCubic(currentTime) {
    if ((currentTime /= duration / 2) < 1) {
      return change / 2 * currentTime * currentTime * currentTime + start
    } else {
      return change / 2 * ((currentTime -= 2) * currentTime * currentTime + 2) + start
    }
  }

  function t862__animateScroll() {
    currentTime += increment;
    window.scrollTo(0, t862__easeInOutCubic(currentTime));
    if (currentTime < duration) {
      setTimeout(t862__animateScroll, increment)
    } else {
      documentBody.removeAttribute('data-scrollable')
    }
  }
  t862__animateScroll()
}

function t1000_init(recId, margin) {
  var rec = document.getElementById('rec' + recId);
  if (!rec) return;
  var container = rec.querySelector('.t1000');
  if (!container) return;
  t1000_setImageHeight(rec, margin);
  window.addEventListener('resize', t_throttle(function () {
    t1000_setImageHeight(rec, margin)
  }));
  if (typeof jQuery !== 'undefined') {
    $(container).bind('displayChanged', function () {
      t1000_setImageHeight(rec, margin)
    })
  } else {
    container.addEventListener('displayChanged', function () {
      t1000_setImageHeight(rec, margin)
    })
  }
}

function t1000_setImageHeight(rec, margin) {
  if (!rec) return;
  var container = rec.querySelector('.t1000');
  if (!container) return;
  var image = rec.querySelector('.t1000__background-image');
  if (window.innerWidth <= 960) {
    image.style.height = null;
    image.style.width = null
  } else {
    image.style.height = 'calc(100% + ' + margin + 'px)'
  }
  image.style.visibility = null
}