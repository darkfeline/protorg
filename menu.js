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
      title: 'Capture highlighted tabs',
      onclick: function(info, tab) {
        chrome.tabs.query({ highlighted: true, currentWindow: true }, function(tabs) {
          var urls = [];
          for (var i = 0; i < tabs.length; i++) {
            urls.push(tabs[i].url + '\n');
          }
          captureTextOnly(tab, urls.join(''));
        });
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

  function captureTextOnly(tab, text) {
    chrome.tabs.update(tab.id, {
      url: protoURL('capture', {
        template: 'Z',
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

  function formatQueryParams(params) {
    var parts = [];
    for (var key in params) {
      parts.push(`${key}=${encodeURIComponent(params[key])}`);
    }
    return parts.join('&');
  }

  // Main
  main();
})();
