const API_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
  const pageTitleInput = document.getElementById("pageTitle");
  const pageUrlInput = document.getElementById("pageUrl");
  const tagsInput = document.getElementById("tags");
  const saveBtn = document.getElementById("saveBtn");
  const statusDiv = document.getElementById("status");

  // Get active tab metadata
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      pageTitleInput.value = tab.title || "";
      pageUrlInput.value = tab.url || "";
    }
  } catch (err) {
    console.error("Failed to query active tab:", err);
  }

  saveBtn.addEventListener("click", async () => {
    const title = pageTitleInput.value.trim();
    const url = pageUrlInput.value.trim();
    const tags = tagsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!url) {
      statusDiv.textContent = "Please enter a valid URL";
      statusDiv.className = "status";
      statusDiv.style.display = "block";
      statusDiv.style.color = "#ef4444";
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    const entryData = {
      id: "clipper_" + Date.now(),
      title: title || url,
      url: url,
      type: "resource-html",
      tags: tags,
      created_at: new Date().toISOString(),
      synced: false,
    };

    // Save offline first in chrome.storage.local
    try {
      const stored = await chrome.storage.local.get({ yeraOfflineEntries: [] });
      const entries = stored.yeraOfflineEntries;
      entries.push(entryData);
      await chrome.storage.local.set({ yeraOfflineEntries: entries });

      // Attempt background sync to server if online
      try {
        const res = await fetch(`${API_URL}/entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ url: url, type: "resource-html" }),
        });

        if (res.ok) {
          statusDiv.textContent = "✓ Saved & Synced with Yera Server!";
        } else {
          statusDiv.textContent = "✓ Saved Offline (Server sync pending)";
        }
      } catch (networkErr) {
        statusDiv.textContent = "✓ Saved Offline (Sync pending connection)";
      }

      statusDiv.className = "status success";
      saveBtn.textContent = "Saved!";
    } catch (err) {
      statusDiv.textContent = `Error: ${err.message || err}`;
      statusDiv.style.color = "#ef4444";
      statusDiv.style.display = "block";
      saveBtn.disabled = false;
      saveBtn.textContent = "Save to Yera";
    }
  });
});
