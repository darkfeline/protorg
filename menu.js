(function() {
  function formatQueryParams(params) {
    var parts = [];
    for (var key in params) {
      parts.push(`${key}=${encodeURIComponent(params[key])}`);
    }
    return parts.join('&');
  }

  function protoURL(protocol, params) {
    var url = `org-protocol://${protocol}`;
    var query = formatQueryParams(params);
    if (query) {
      url += `?${query}`
    }
    return url;
  }

  function storeTabLink(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('store-link', {
        url: tab.url,
        title: tab.title,
      }),
    });
  }

  function captureTab(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('capture', {
        template: 'L',
        url: tab.url,
        title: tab.title,
      }),
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function captureHighlightedTabs() {
    chrome.tabs.query({ highlighted: true, currentWindow: true }, async function(tabs) {
      for ( var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        captureTab(tab);
        await sleep(500);
      };
    });
  }

  chrome.contextMenus.create({
    title: 'Store tab link',
    onclick: function(info, tab) {
      storeTabLink(tab);
    },
  });

  chrome.contextMenus.create({
    title: 'Capture tab',
    onclick: function(info, tab) {
      captureTab(tab);
    },
  });

  chrome.contextMenus.create({
    title: 'Capture selected text',
    contexts: ['selection'],
    onclick: function(info, tab) {
      chrome.tabs.update(tab.id, {
        url: protoURL('capture', {
          template: 'T',
          url: tab.url,
          title: tab.title,
          body: info.selectionText,
        }),
      });
    },
  });

  chrome.contextMenus.create({
    title: 'Capture selected tabs',
    onclick: function(info, tab) {
      captureHighlightedTabs();
    },
  });

  chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
    case 'store':
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        storeTabLink(tabs[0]);
      });
      break;
    case 'capture':
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        captureTab(tabs[0]);
      });
      break;
    }
  });
})();
