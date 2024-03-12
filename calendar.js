const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

gapi.load('client:auth2', initClient);

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listUpcomingEvents();
  } else {
    gapi.auth2.getAuthInstance().signIn();
  }
}

function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    const events = response.result.items;
    displayEvents(events);
  });
}

function displayEvents(events) {
  const calendarDiv = document.getElementById('calendar');
  let calendarHTML = '<table>';
  calendarHTML += '<tr><th>Date</th><th>Event</th></tr>';

  if (events.length > 0) {
    events.forEach(event => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      const eventClass = getEventClass(event.summary);

      calendarHTML += `
        <tr class="${eventClass}">
          <td>${start.toLocaleString()}</td>
          <td>${event.summary}</td>
        </tr>
      `;
    });
  } else {
    calendarHTML += '<tr><td colspan="2">No upcoming events found.</td></tr>';
  }

  calendarHTML += '</table>';
  calendarDiv.innerHTML = calendarHTML;
}

function getEventClass(summary) {
  if (summary.toLowerCase().includes('planting')) {
    return 'event-upcoming-planting';
  } else if (summary.toLowerCase().includes('crop plantation')) {
    return 'event-upcoming-crop-plantation';
  } else {
    return '';
  }
}
