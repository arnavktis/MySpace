// // Hide the buttons initially
// document.getElementById("openSpotify").style.display = "none";
// document.getElementById("openYoutube").style.display = "none";
// document.getElementById("openGmail").style.display = "none";

// // Function to show and hide the Spotify button
// function toggleSpotifyButton() {
//     const spotifyButton = document.getElementById("openSpotify");
//     const isVisible = spotifyButton.style.display === "block";
//     spotifyButton.style.display = isVisible ? "none" : "block";

//     // Hide other buttons if Spotify button is shown
//     if (!isVisible) {
//         document.getElementById("openYoutube").style.display = "none";
//         document.getElementById("openGmail").style.display = "none";
//     }
// }

// // Function to show and hide the YouTube button
// function toggleYoutubeButton() {
//     const youtubeButton = document.getElementById("openYoutube");
//     const isVisible = youtubeButton.style.display === "block";
//     youtubeButton.style.display = isVisible ? "none" : "block";

//     // Hide other buttons if YouTube button is shown
//     if (!isVisible) {
//         document.getElementById("openSpotify").style.display = "none";
//         document.getElementById("openGmail").style.display = "none";
//     }
// }

// // Function to show and hide the Gmail button
// function toggleGmailButton() {
//     const gmailButton = document.getElementById("openGmail");
//     const isVisible = gmailButton.style.display === "block";
//     gmailButton.style.display = isVisible ? "none" : "block";

//     // Hide other buttons if Gmail button is shown
//     if (!isVisible) {
//         document.getElementById("openSpotify").style.display = "none";
//         document.getElementById("openYoutube").style.display = "none";
//     }
// }

// // Add event listeners to "My space" buttons
// document.getElementById("myspace").addEventListener("click", toggleSpotifyButton);
// document.getElementById("myspace2").addEventListener("click", toggleYoutubeButton);
// document.getElementById("myspace3").addEventListener("click", toggleGmailButton);

// // Add event listener to the Spotify button
// document.getElementById("openSpotify").addEventListener("click", function () {
//     chrome.tabs.create({ url: "https://open.spotify.com" });
// });

// // Add event listener to the YouTube button
// document.getElementById("openYoutube").addEventListener("click", function () {
//     chrome.tabs.create({ url: "https://www.youtube.com" });
// });

// // Add event listener to the Gmail button
// document.getElementById("openGmail").addEventListener("click", function () {
//     chrome.tabs.create({ url: "https://mail.google.com" });
// });

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
