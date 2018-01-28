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

  function storeLink(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('store-link', {
        url: tab.url,
        title: tab.title,
      }),
    });
  }

  function captureLink(tab) {
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
        captureLink(tab);
        await sleep(500);
      };
    });
  }

  chrome.contextMenus.create({
    title: 'store-link',
    onclick: function(info, tab) {
      storeLink(tab);
    },
  });

  chrome.contextMenus.create({
    title: 'capture',
    onclick: function(info, tab) {
      captureLink(tab);
    },
  });

  chrome.contextMenus.create({
    title: 'capture',
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
    title: 'capture-tabs',
    onclick: function(info, tab) {
      captureHighlightedTabs();
    },
  });

  chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
    case 'store':
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        storeLink(tabs[0]);
      });
      break;
    case 'capture':
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        captureLink(tabs[0]);
      });
      break;
    }
  });
})();
