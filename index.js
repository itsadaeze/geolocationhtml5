// Define functions before calling them

function updateTicker() {
  updateTime(); 
}

function updateTime() {
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();
  document.getElementById('date-time').textContent = `Date: ${dateString} | Time: ${timeString} | `;
}

function updateLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      showPosition,
      showError,
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } else {
    document.getElementById('location-display').textContent = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Fetch location data using OpenStreetMap's Nominatim service
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.display_name) {
        document.getElementById('location-display').textContent = `Location: ${data.display_name} | `;
      } else {
        document.getElementById('location-display').textContent = `Location: Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)} | `;
      }
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      document.getElementById('location-display').textContent = `Error fetching location. Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)} | `;
    });
}

function showError(error) {
  console.error(error);  // Log error for better debugging
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("location-display").textContent = "User denied the request for Geolocation. | ";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("location-display").textContent = "Location information is unavailable. Please check your connection or device settings. | ";
      break;
    case error.TIMEOUT:
      document.getElementById("location-display").textContent = "The request to get user location timed out. | ";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("location-display").textContent = "An unknown error occurred while fetching location. | ";
      break;
  }
}

// Call the functions after they are defined
setInterval(updateTicker, 1000); // Update time every second
setInterval(updateLocation, 60000); // Update location every 60 seconds

// Initial call to update time and location
updateTicker();  // Initial update for time
updateLocation(); // Initial update for location
