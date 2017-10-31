(function() {
  chrome.contextMenus.create({
    title: 'store-link',
    onclick: function(info, tab) {
      chrome.tabs.update(tab.id, {
        url: 'org-protocol://store-link?url=' + encodeURIComponent(tab.url) +
          '&title=' + encodeURIComponent(tab.title)
      });
    }
  });

  chrome.contextMenus.create({
    title: 'capture',
    onclick: function(info, tab) {
      chrome.tabs.update(tab.id, {
        url: 'org-protocol://capture?template=L&url=' + encodeURIComponent(tab.url) +
          '&title=' + encodeURIComponent(tab.title)
      });
    }
  });

  chrome.contextMenus.create({
    title: 'capture',
    contexts: ['selection'],
    onclick: function(info, tab) {
      chrome.tabs.update(tab.id, {
        url: 'org-protocol://capture?template=p&url=' + encodeURIComponent(tab.url) +
          '&title=' + encodeURIComponent(tab.title) +
          '&body=' + encodeURIComponent(info.selectionText)
      });
    }
  });
})();
