/* global _satellite __satelliteLoadedCallback alloy */

import { getLibs } from './utils.js';

const [{ loadScript, getConfig, getMetadata }, placeholderMod] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);

const d = document;
const loc = window.location;
const { pathname } = loc;
let expressLandingPageType;

function getAssetDetails(el) {
  if (el.tagName === 'PICTURE') {
    return getAssetDetails(el.querySelector('img'));
  }
  // Get asset details
  const assetUrl = new URL(el.href // the reference for an a/svg tag
      || el.currentSrc // the active source in a picture/video/audio element
      || el.src); // the source for an image/video/iframe
  const match = assetUrl.href.match(/media_([a-f0-9]+)\.\w+/);
  let assetId;
  if (match) {
    [, assetId] = match;
  } else if (assetUrl.origin.endsWith('.adobeprojectm.com')) {
    [assetId] = assetUrl.pathname.split('/').splice(-2, 1);
  } else {
    assetId = `${assetUrl.pathname}`;
  }
  return {
    assetId,
    assetPath: assetUrl.href,
  };
}

function getPlacement(btn) {
  const parentBlock = btn.closest('[daa-lh^="b"]');
  let placement = 'outside-blocks';

  if (parentBlock) {
    const blockName = parentBlock.classList[0];
    const sameBlocks = btn.closest('main')?.querySelectorAll(`.${blockName}`);

    if (sameBlocks && sameBlocks.length > 1) {
      sameBlocks.forEach((b, i) => {
        if (b === parentBlock) {
          placement = `${blockName}-${i + 1}`;
        }
      });
    } else {
      placement = blockName;
    }

    if (['template-x'].includes(blockName) && btn.classList.contains('placeholder')) {
      placement = 'blank-template-cta';
    }
  }

  return placement;
}

function set(path, value) {
  const obj = window.alloy_all;
  const newPath = `data._adobe_corpnew.digitalData.${path}`;
  const segs = newPath.split('.');
  let temp = obj;
  let i = 0;
  const il = segs.length - 1;
  // get to the path
  // eslint-disable-next-line no-plusplus
  for (; i < il; i++) {
    const seg = segs[i];
    temp[seg] = temp[seg] || {};
    temp = temp[seg];
  }
  // set the value
  temp[segs[i]] = value;
  return obj;
}

export function sendEventToAdobeAnaltics(eventName) {
  _satellite.track('event', {
    xdm: {},
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          name: eventName,
          linkClicks: { value: 1 },
          type: 'other',
        },
      },
      _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName } } } },
    },
  });
}

function sendFrictionlessEventToAdobeAnaltics(block) {
  const eventName = 'view-quickaction-upload-page';
  _satellite.track('event', {
    xdm: {},
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          name: eventName,
          linkClicks: { value: 1 },
          type: 'other',
        },
      },
      _adobe_corpnew: {
        sdm: {
          event: {
            pagename: eventName,
            url: loc.href,
          },
          custom: {
            qa: {
              group: block.dataset.frictionlessgroup ?? 'unknown',
              type: block.dataset.frictionlesstype ?? 'unknown',
            },
          },
        },
      },
    },
  });
}

export function textToName(text) {
  const splits = text.toLowerCase().split(' ');
  const camelCase = splits.map((s, i) => (i ? s.charAt(0).toUpperCase() + s.substr(1) : s)).join('');
  return (camelCase);
}

export async function trackBranchParameters($links) {
  const rootUrl = new URL(window.location.href);
  const params = rootUrl.searchParams;
  const pageUrl = window.location.pathname;

  const { referrer } = window.document;

  const [
    searchTerm,
    canvasHeight,
    canvasWidth,
    canvasUnit,
    sceneline,
    taskID,
    assetCollection,
    category,
    searchCategory,
    loadPrintAddon,
    tab,
    action,
    prompt,
    sdid,
    mv,
    mv2,
    sKwcId,
    efId,
    promoId,
    trackingId,
    cgen,
  ] = [
    getMetadata('branch-search-term'),
    getMetadata('branch-canvas-height'),
    getMetadata('branch-canvas-width'),
    getMetadata('branch-canvas-unit'),
    getMetadata('branch-sceneline'),
    getMetadata('branch-task-id'),
    getMetadata('branch-asset-collection'),
    getMetadata('branch-category'),
    getMetadata('branch-search-category'),
    getMetadata('branch-loadprintaddon'),
    getMetadata('branch-tab'),
    getMetadata('branch-action'),
    getMetadata('branch-prompt'),
    params.get('sdid'),
    params.get('mv'),
    params.get('mv2'),
    params.get('s_kwcid'),
    params.get('ef_id'),
    params.get('promoid'),
    params.get('trackingid'),
    params.get('cgen'),
  ];

  const promises = [];
  $links.forEach((a) => {
    if (a.href && a.href.match('adobesparkpost.app.link')) {
      a.rel = 'nofollow';
      const btnUrl = new URL(a.href);
      const urlParams = btnUrl.searchParams;
      const setParams = (k, v) => {
        if (v) urlParams.set(k, encodeURIComponent(v));
      };
      if (urlParams.has('acomx-dno')) {
        urlParams.delete('acomx-dno');
        btnUrl.search = urlParams.toString();
        a.href = decodeURIComponent(btnUrl.toString());
        return;
      }
      const placement = getPlacement(a);

      const prom = placeholderMod.replaceKey('search-branch-links', getConfig()).then((searchBranchLink) => {
        const isSearchBranchLink = searchBranchLink?.replace(/\s/g, '').split(',').includes(`${btnUrl.origin}${btnUrl.pathname}`);
        if (isSearchBranchLink) {
          setParams('category', category || 'templates');
          setParams('taskID', taskID);
          setParams('assetCollection', assetCollection);

          if (searchCategory) {
            setParams('searchCategory', searchCategory);
          } else if (searchTerm) {
            setParams('q', searchTerm);
          }
          if (loadPrintAddon) setParams('loadPrintAddon', loadPrintAddon);
          setParams('tab', tab);
          setParams('action', action);
          setParams('prompt', prompt);
        }
      });
      promises.push(prom);

      setParams('referrer', referrer);
      setParams('url', pageUrl);
      setParams('height', canvasHeight);
      setParams('width', canvasWidth);
      setParams('unit', canvasUnit);
      setParams('sceneline', sceneline);
      setParams('sdid', sdid);
      setParams('mv', mv);
      setParams('mv2', mv2);
      setParams('efid', efId);
      setParams('promoid', promoId);
      setParams('trackingid', trackingId);
      setParams('cgen', cgen);
      setParams('placement', placement);

      if (sKwcId) {
        const sKwcIdParameters = sKwcId.split('!');

        if (typeof sKwcIdParameters[2] !== 'undefined' && sKwcIdParameters[2] === '3') {
          setParams('customer_placement', 'Google%20AdWords');
        }

        if (typeof sKwcIdParameters[8] !== 'undefined' && sKwcIdParameters[8] !== '') {
          setParams('keyword', sKwcIdParameters[8]);
        }
      }

      btnUrl.search = urlParams.toString();
      a.href = decodeURIComponent(btnUrl.toString());
    }
  });
  await Promise.all(promises);
}

export function appendLinkText(eventName, a) {
  if (!a) return eventName;

  if (a.getAttribute('title')?.trim()) {
    return eventName + textToName(a.getAttribute('title').trim());
  }

  if (a.getAttribute('aria-label')?.trim()) {
    return eventName + textToName(a.getAttribute('aria-label').trim());
  }

  if (a.textContent?.trim()) {
    return eventName + textToName(a.textContent.trim());
  }

  const img = a.querySelector('img');
  const alt = img?.getAttribute('alt');
  if (alt) {
    return eventName + textToName(alt);
  }

  if (a.className) {
    return eventName + textToName(a.className);
  }

  return eventName;
}

export function trackButtonClick(a) {
  let adobeEventName = 'adobe.com:express:cta:';
  let hemingwayAssetId;
  let hemingwayAssetPath;
  let hemingwayAssetPosition;

  const hemingwayAsset = a.querySelector('picture,video,audio,img')
      || a.closest('[class*="-container"],[class*="-wrapper"]')?.querySelector('picture,video,audio,img');
  const block = a.closest('.block');
  const urlConstructable = a.href || a.currentSrc || a.src;
  if (hemingwayAsset && block && urlConstructable) {
    const { assetId, assetPath } = getAssetDetails(hemingwayAsset);
    hemingwayAssetPath = assetPath;
    hemingwayAssetId = assetId;

    const siblings = [...block
      .querySelectorAll(`.${a.className.split(' ').join('.')}`)];
    hemingwayAssetPosition = siblings.indexOf(a);
  }

  const $tutorialContainer = a.closest('.tutorial-card');
  const $contentToggleContainer = a.closest('.content-toggle');
  // let cardPosition;

  if ($tutorialContainer) {
    const videoName = textToName(a.querySelector('h3').textContent.trim());
    adobeEventName = `${adobeEventName}tutorials:${videoName}:tutorialPressed`;
  } else if ($contentToggleContainer) {
    const toggleName = textToName(a.textContent.trim());
    adobeEventName = `${adobeEventName}contentToggle:${toggleName}:buttonPressed`;
  } else if (a.classList.contains('floating-button-lottie')) {
    adobeEventName = `${adobeEventName}floatingButton:scrollPressed`;
  } else if (a.classList.contains('video-player-inline-player-overlay')) {
    const sessionName = a.parentNode.parentNode.parentNode.querySelector('.video-player-session-number').textContent.trim();
    const videoName = a.parentNode.parentNode.parentNode.querySelector('.video-player-video-title').textContent.trim();
    adobeEventName = `${adobeEventName}playing:${sessionName}-${videoName}`;
  } else if (a.classList.contains('notch')) {
    adobeEventName = `${adobeEventName}splitAction:notch`;
  } else if (a.classList.contains('underlay')) {
    adobeEventName = `${adobeEventName}splitAction:background`;
  } else if (a.parentElement.classList.contains('floating-button')) {
    adobeEventName = `${adobeEventName}floatingButton:ctaPressed`;
  } else if (a.closest('.faq')) {
    adobeEventName = appendLinkText(`${adobeEventName}faq:`, a);
    // CTA in the hero
  } else if (a.closest('.hero')) {
    adobeEventName = appendLinkText(`${adobeEventName}hero:`, a);
    // Click in the pricing block
  } else if (expressLandingPageType === 'pricing') {
    if (a.tagName !== 'A') {
      adobeEventName += `pricing:pricing:${a.textContent.trim()}:Click`;
      // Creative cloud learn more
    } else if (a.id === 'free-trial') {
      adobeEventName += 'pricing:cta:StartForFree';
    } else if (a.id === '3-month-trial') {
      adobeEventName += 'pricing:cta:StartYour3MonthTrial';
      // View plans
    } else {
      adobeEventName = 'adobe.com:express:CTA:pricing:viewPlans:Click';
    }
    // quick actions clicks
  } else if (a.closest('.toc-container')) {
    if (a.classList.contains('toc-toggle')) {
      adobeEventName += 'toc:toggle:Click';
    } else if (a.classList.contains('toc-close')) {
      adobeEventName += 'toc:close:Click';
    } else if (a.classList.contains('toc-handle')) {
      adobeEventName += 'toc:close:Click:handle';
    } else if (a.classList.contains('toc-wrapper')) {
      adobeEventName += 'toc:close:Click:background';
    } else {
      adobeEventName = appendLinkText(`${adobeEventName}toc:link:Click:`, a);
    }
  } else if (a.closest('.template')) {
    adobeEventName = appendLinkText(adobeEventName, a);
  } else if (a.closest('.tabs-ax .tab-list-container')) {
    adobeEventName += `${a.closest('.tabs-ax')?.id}:${a.id}`;
    // Default clicks
  } else {
    adobeEventName = appendLinkText(adobeEventName, a);
  }

  // clicks using [data-lh and data-ll]
  let trackingHeader = a.closest('[data-lh]');
  if (trackingHeader || a.dataset.lh) {
    adobeEventName = 'adobe.com:express';
    let headerString = '';
    while (trackingHeader) {
      headerString = `:${textToName(trackingHeader.dataset.lh.trim())}${headerString}`;
      trackingHeader = trackingHeader.parentNode.closest('[data-lh]');
    }
    adobeEventName += headerString;
    if (a.dataset.ll) {
      adobeEventName += `:${textToName(a.dataset.ll.trim())}`;
    } else {
      adobeEventName += `:${textToName(a.innerText.trim())}`;
    }
  }

  _satellite.track('event', {
    xdm: {},
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          name: adobeEventName,
          linkClicks: { value: 1 },
          type: 'other',
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: { eventInfo: { eventName: adobeEventName } },
          ...(hemingwayAsset
            ? {
              asset: {
                assetInfo: {
                  assetId: hemingwayAssetId,
                  assetPath: hemingwayAssetPath,
                  assetPosition: hemingwayAssetPosition,
                },
              },
            }
            : {}),
        },
      },
    },
  });
}

function trackVideoAnalytics(parameters) {
  const {
    videoName,
    videoId,
    videoLength,
    product,
    videoCategory,
    videoDescription,
    videoPlayer,
    videoMediaType,
  } = parameters;

  set('video.videoInfo.videoName', videoName);
  set('video.videoInfo.videoId', videoId);
  set('video.videoInfo.videoLength', videoLength);
  set('video.videoInfo.product', product);
  set('video.videoInfo.videoCategory', videoCategory);
  set('video.videoInfo.videoDescription', videoDescription);
  set('video.videoInfo.videoPlayer', videoPlayer);
  set('video.videoInfo.videoMediaType', videoMediaType);
}

function decorateAnalyticsEvents() {
  // for tracking all of the links
  d.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' || event.target.dataset.ll?.length) {
      trackButtonClick(event.target);
    }
  });

  // for tracking split action block notch and underlay background
  d.addEventListener('splitactionloaded', () => {
    const $notch = d.querySelector('main .split-action-container .notch');
    const $underlay = d.querySelector('main .split-action-container .underlay');

    if ($notch) {
      $notch.addEventListener('click', () => {
        trackButtonClick($notch);
      });
    }

    if ($underlay) {
      $underlay.addEventListener('click', () => {
        trackButtonClick($underlay);
      });
    }
  });

  // Tracking any link or links that is added after page loaded.
  d.addEventListener('linkspopulated', async (e) => {
    await trackBranchParameters(e.detail);
    e.detail.forEach(($link) => {
      $link.addEventListener('click', () => {
        trackButtonClick($link);
      });
    });
  });

  // tracking videos loaded asynchronously.
  d.addEventListener('videoloaded', (e) => {
    trackVideoAnalytics(e.detail.parameters);
    _satellite.track('videoloaded');
  });

  d.addEventListener('videoclosed', (e) => {
    sendEventToAdobeAnaltics(`adobe.com:express:cta:learn:columns:${e.detail.parameters.videoId}:videoClosed`);
  });
}

function martechLoadedCB() {
  /* eslint-disable no-underscore-dangle */
  //------------------------------------------------------------------------------------
  // gathering the data
  //------------------------------------------------------------------------------------
  const locale = getConfig().locale.prefix;
  const pathSegments = pathname.substr(1).split('/');
  if (locale !== '') pathSegments.shift();
  const pageName = `adobe.com:${pathSegments.join(':')}`;

  let category;
  if (pathname.includes('/create/')
      || pathname.includes('/feature/')) {
    category = 'design';
    if (pathname.includes('/image')) category = 'photo';
    if (pathname.includes('/video')) category = 'video';
  }

  // home
  if (
    pathname === '/express'
      || pathname === '/express/'
  ) {
    expressLandingPageType = 'home';
    // seo
  } else if (
    pathname === '/express/create'
      || pathname.includes('/create/')
      || pathname === '/express/make'
      || pathname.includes('/make/')
      || pathname === '/express/feature'
      || pathname.includes('/feature/')
      || pathname === '/express/discover'
      || pathname.includes('/discover/')
  ) {
    expressLandingPageType = 'seo';
    // learn
  } else if (
    pathname === '/express/tools'
      || pathname.includes('/tools/')
  ) {
    expressLandingPageType = 'quickAction';
  } else if (
    pathname === '/express/learn'
      || (
        pathname.includes('/learn/')
        && !pathname.includes('/blog/')
      )
  ) {
    expressLandingPageType = 'learn';
    // blog
  } else if (
    pathname === '/express/learn/blog'
      || pathname.includes('/learn/blog/')
  ) {
    expressLandingPageType = 'blog';
    // pricing
  } else if (
    pathname.includes('/pricing')
  ) {
    expressLandingPageType = 'pricing';
    // edu
  } else if (
    pathname.includes('/education/')
  ) {
    expressLandingPageType = 'edu';
    // other
  } else {
    expressLandingPageType = 'other';
  }

  //----------------------------------------------------------------------------
  // set some global and persistent data layer properties
  //----------------------------------------------------------------------------
  set('page.pageInfo.pageName', pageName);
  set('page.pageInfo.siteSection', 'adobe.com:express');
  set('page.pageInfo.category', category);

  //----------------------------------------------------------------------------
  // spark specific global and persistent data layer properties
  //----------------------------------------------------------------------------
  set('page.pageInfo.pageurl', loc.href);
  set('page.pageInfo.namespace', 'express');

  //------------------------------------------------------------------------------------
  // Fire extra express events
  //------------------------------------------------------------------------------------
  const quickActionBlock = d.querySelector('.frictionless-quick-action.block');
  if (quickActionBlock) {
    sendFrictionlessEventToAdobeAnaltics(quickActionBlock);
  }
  decorateAnalyticsEvents();

  const ENABLE_PRICING_MODAL_AUDIENCE = 'enablePricingModal';
  const RETURNING_VISITOR_SEGMENT_ID = 23153796;

  const QUICK_ACTION_SEGMENTS = [
    [24241150, 'enableRemoveBackgroundRating'],
    [24793469, 'enableConvertToGifRating'],
    [24793470, 'enableConvertToJpgRating'],
    [24793471, 'enableConvertToMp4Rating'],
    [24793472, 'enableConvertToPngRating'],
    [24793473, 'enableConvertToSvgRating'],
    [24793474, 'enableCropImageRating'],
    [24793475, 'enableCropVideoRating'],
    [24793476, 'enableLogoMakerRating'],
    [24793477, 'enableMergeVideoRating'],
    [24793478, 'enableQrGeneratorRating'],
    [24793479, 'enableResizeImageRating'],
    [24793480, 'enableChangeSpeedRating'],
    [24793481, 'enableTrimVideoRating'],
    [24793483, 'enableResizeVideoRating'],
    [24793488, 'enableReverseVideoRating'],
  ];

  async function getAudiences() {
    const getSegments = async (ecid) => {
      const { default: BlockMediator } = await import('./block-mediator.min.js');

      BlockMediator.set('audiences', []);
      BlockMediator.set('segments', []);
      if (!ecid) return;
      window.setAudienceManagerSegments = (json) => {
        if (json && json.segments && json.segments.includes(RETURNING_VISITOR_SEGMENT_ID)) {
          const audiences = BlockMediator.get('audiences');
          const segments = BlockMediator.get('segments');
          audiences.push(ENABLE_PRICING_MODAL_AUDIENCE);
          segments.push(RETURNING_VISITOR_SEGMENT_ID);

          sendEventToAdobeAnaltics('pricingModalUserInSegment');
        }

        QUICK_ACTION_SEGMENTS.forEach((QUICK_ACTION_SEGMENT) => {
          if (json && json.segments && json.segments.includes(QUICK_ACTION_SEGMENT[0])) {
            const audiences = BlockMediator.get('audiences');
            const segments = BlockMediator.get('segments');
            audiences.push(QUICK_ACTION_SEGMENT[1]);
            segments.push(QUICK_ACTION_SEGMENT[0]);
          }
        });

        document.dispatchEvent(new Event('context_loaded'));
      };
      // TODO: What the heck is this?  This needs to be behind one trust and cmp
      loadScript(`https://adobe.demdex.net/event?d_dst=1&d_rtbd=json&d_cb=setAudienceManagerSegments&d_cts=2&d_mid=${ecid}`);
    };

    await _satellite.alloyConfigurePromise;
    const data = await alloy('getIdentity');
    getSegments(data?.identity?.ECID || null);
  }

  __satelliteLoadedCallback(getAudiences);
}

export default async function decorateTrackingEvents() {
  martechLoadedCB();
  const $links = d.querySelectorAll('main a');

  // for adding branch parameters to branch links
  await trackBranchParameters($links);

  // for tracking the faq
  d.querySelectorAll('main .faq-accordion').forEach(($a) => {
    $a.addEventListener('click', () => {
      trackButtonClick($a);
    });
  });

  // for tracking the content toggle buttons
  d.querySelectorAll('main .content-toggle button').forEach(($button) => {
    $button.addEventListener('click', () => {
      trackButtonClick($button);
    });
  });

  // for tracking just the sticky banner close button
  const $button = d.querySelector('.sticky-promo-bar button.close');
  if ($button) {
    $button.addEventListener('click', () => {
      sendEventToAdobeAnaltics('adobe.com:express:cta:startYourFreeTrial:close');
    });
  }

  // Tracking any video column blocks.
  const $columnVideos = d.querySelectorAll('.column-video');
  if ($columnVideos.length) {
    $columnVideos.forEach(($columnVideo) => {
      const $parent = $columnVideo.closest('.columns');
      const $a = $parent.querySelector('a');
      const adobeEventName = appendLinkText(`adobe.com:express:cta:learn:columns:${expressLandingPageType}:`, $a);

      $parent.addEventListener('click', (e) => {
        e.stopPropagation();
        sendEventToAdobeAnaltics(adobeEventName);
      });
    });
  }

  const toggleBar = d.querySelector('.toggle-bar.block');
  if (toggleBar) {
    const tgBtns = toggleBar.querySelectorAll('button.toggle-bar-button');

    tgBtns.forEach((btn) => {
      const textEl = btn.querySelector('.text-wrapper');
      let texts = [];

      if (textEl) {
        let child = textEl.firstChild;
        while (child) {
          if (child.nodeType === 3) {
            texts.push(child.data);
          }
          child = child.nextSibling;
        }
      }

      texts = texts.join('') || textEl.textContent.trim();
      const eventName = `adobe.com:express:homepage:intentToggle:${textToName(texts)}`;
      btn.addEventListener('click', () => {
        sendEventToAdobeAnaltics(eventName);
      });
    });
  }

  // for tracking the tab-ax tabs
  d.querySelectorAll('main .tabs-ax .tab-list-container button[role="tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      trackButtonClick(btn);
    });
  });

  d.querySelectorAll('main .pricing-table .toggle-content').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const buttonEl = toggle.querySelector('span[role="button"]');
      const action = buttonEl && buttonEl.getAttribute('aria-expanded') === 'true' ? 'closed' : 'opened';
      sendEventToAdobeAnaltics(`adobe.com:express:cta:pricing:tableToggle:${action || ''}`);
    });
  });
}
