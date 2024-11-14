document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Initialize Tui.Calendar
    var calendar = new tui.Calendar(calendarEl, {
        defaultView: 'month',
        taskView: true,
        scheduleView: true,
        useCreationPopup: true,
        useDetailPopup: true,
        calendars: [
            {
                id: '1',
                name: 'My Calendar',
                color: '#ffffff',
                bgColor: '#9e5fff',
                dragBgColor: '#9e5fff',
                borderColor: '#9e5fff'
            }
        ]
    });

    // Fetch events from the server
    fetch('/get-events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            var schedules = events.map(event => ({
                id: String(event.id),
                calendarId: '1',
                title: event.title,
                category: 'time',
                dueDateClass: '',
                start: event.start,
                end: event.end
            }));
            calendar.createSchedules(schedules);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });

    // Handle event creation
    calendar.on('beforeCreateSchedule', function(event) {
        $('#eventModal').modal('show');

        document.getElementById('saveEventButton').onclick = function() {
            var title = document.getElementById('eventTitle').value;
            if (title) {
                var newEvent = {
                    id: String(Date.now()),
                    calendarId: '1',
                    title: title,
                    category: 'time',
                    dueDateClass: '',
                    start: event.start,
                    end: event.end
                };
                calendar.createSchedules([newEvent]);

                // Send event data to the server
                fetch('/save-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newEvent)
                }).then(response => {
                    if (response.ok) {
                        console.log('Event saved successfully');
                    } else {
                        console.error('Failed to save event');
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });

                $('#eventModal').modal('hide');
            }
        };
    });
});