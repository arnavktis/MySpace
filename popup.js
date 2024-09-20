document.getElementById("openSpotify").addEventListener("click", function() {
    chrome.tabs.create({ url: "https://open.spotify.com" });
  });
  