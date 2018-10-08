(function() {
  function main() {
    // Context menu items
    chrome.contextMenus.create({
      title: 'Store tab link',
      onclick: function(info, tab) {
        storeTabLink(tab);
      },
    });

    chrome.contextMenus.create({
      title: 'Capture text',
      onclick: function(info, tab) {
        doWithHighlightedTabs(captureTab);
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

    // Commands
    chrome.commands.onCommand.addListener(function(command) {
      console.log('command: ' + command);
      switch (command) {
      case 'storeLink':
        callWithCurrentTab(storeTabLink);
        break;
      case 'capture':
        doWithHighlightedTabs(captureTab);
        break;
      }
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

  function captureTab(tab) {
    chrome.tabs.update(tab.id, {
      url: protoURL('capture', {
        template: 'L',
        url: tab.url,
        title: tab.title,
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

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  main();
})();
