document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("feedback_form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        var formData = new FormData(form);

        // AJAX request to send the form data to server-side script
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "send_email.php", true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert("Feedback submitted successfully!");
                form.reset(); // Clear the form after successful submission
            } else {
                alert("Error: Unable to submit feedback. Please try again later.");
            }
        };
        xhr.send(formData);
    });
});
