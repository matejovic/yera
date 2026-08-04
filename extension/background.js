const API_URL = "http://localhost:8000";
const extAPI = typeof browser !== "undefined" ? browser : chrome;

// Register right-click context menu items
extAPI.runtime.onInstalled.addListener(() => {
  extAPI.contextMenus.create({
    id: "save-page-to-yera",
    title: "Save page to Yera",
    contexts: ["page"],
  });

  extAPI.contextMenus.create({
    id: "save-selection-to-yera",
    title: "Save selection to Yera Highlight",
    contexts: ["selection"],
  });
});

// Handle context menu clicks
extAPI.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-page-to-yera") {
    await saveOfflineFirst({
      title: tab?.title || info.pageUrl,
      url: info.pageUrl,
      type: "resource-html",
    });
  } else if (info.menuItemId === "save-selection-to-yera") {
    await saveOfflineFirst({
      title: "Highlight from " + (tab?.title || info.pageUrl),
      url: info.pageUrl,
      text: info.selectionText,
      type: "HIGHLIGHT",
    });
  }
});

async function saveOfflineFirst(data) {
  try {
    const stored = await extAPI.storage.local.get({ yeraOfflineEntries: [] });
    const entries = stored.yeraOfflineEntries || [];
    entries.push({
      ...data,
      id: "clipper_" + Date.now(),
      created_at: new Date().toISOString(),
      synced: false,
    });
    await extAPI.storage.local.set({ yeraOfflineEntries: entries });

    // Attempt background sync
    try {
      if (data.type === "HIGHLIGHT") {
        await fetch(`${API_URL}/highlight`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            parent_id: 1,
            text: data.text,
          }),
        });
      } else {
        await fetch(`${API_URL}/entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ url: data.url, type: data.type }),
        });
      }
    } catch (e) {
      console.log("Background sync pending connection:", e);
    }
  } catch (err) {
    console.error("Failed to save offline entry:", err);
  }
}
