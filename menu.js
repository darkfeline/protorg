(function() {
  function main() {
    chrome.contextMenus.create({
      title: 'Store tab link',
      onclick: function(info, tab) {
        storeTabLink(tab);
      },
    });

    chrome.contextMenus.create({
      title: 'Capture selection',
      contexts: ['selection'],
      onclick: function(info, tab) {
        captureText(tab, info.selectionText);
      },
    });

  chrome.contextMenus.create({
    title: 'Open source',
    onclick: function(info, tab) {
      openSource(tab);
    },
  });
  }

  // Org protocol functions
  function storeTabLink(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('store-link', {
        url: tab.url,
        title: tab.title,
      }),
    });
  }

  function captureText(tab, text) {
    chrome.tabs.update(tab.id, {
      url: protoURL('capture', {
        template: 'Z',
        url: tab.url,
        title: tab.title,
        body: text,
      }),
    });
  }

  function openSource(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('open-source', {
        url: tab.url,
      }),
    });
  }

  function protoURL(protocol, params) {
    var url = `org-protocol://${protocol}`;
    var query = formatQueryParams(params);
    if (query) {
      url += `?${query}`
    }
    return url;
  }

  // Helper functions
  function formatQueryParams(params) {
    var parts = [];
    for (var key in params) {
      parts.push(`${key}=${encodeURIComponent(params[key])}`);
    }
    return parts.join('&');
  }

  function callWithCurrentTab(f) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if tabs.length >= 1 {
        f(tabs[0])
      }
    });
  }

  function doWithHighlightedTabs(f) {
    chrome.tabs.query({ highlighted: true, currentWindow: true }, async function(tabs) {
      for ( var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        f(tab);
        await sleep(500);
      };
    });
  }

  // Main
  main();
})();
