document.getElementById("link-list").style.display = "none";

// Function to toggle visibility of the parent element
function toggleLinkList() {
  const linkList = document.getElementById("link-list");
  linkList.style.display =
    linkList.style.display === "block" ? "none" : "block"; // Toggle the visibility
}

// Add event listeners to buttons for toggling
document.getElementById("myspace").addEventListener("click", toggleLinkList);
document.getElementById("myspace2").addEventListener("click", toggleLinkList);
document.getElementById("myspace3").addEventListener("click", toggleLinkList);

// Add event listeners to the individual buttons inside the link-list
document.getElementById("openSpotify").addEventListener("click", () => {
  console.log("Spotify button clicked");
  chrome.tabs.create({ url: "https://open.spotify.com" });
});
document.getElementById("openYoutube").addEventListener("click", () => {
  console.log("YouTube button clicked");
  chrome.tabs.create({ url: "https://www.youtube.com" });
});
document.getElementById("openGmail").addEventListener("click", () => {
  console.log("Gmail button clicked");
  chrome.tabs.create({ url: "https://mail.google.com" });
});

document.getElementById('user').addEventListener('click', function() {
  // Open the locally hosted index.html page
  chrome.tabs.create({ url: "http://localhost:3000/" });
});
