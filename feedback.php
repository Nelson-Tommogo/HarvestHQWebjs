<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = 'nelsontommogo9@gmail.com';
    $subject = 'Feedback Submission';
    $message = '';

    foreach ($_POST as $key => $value) {
        $message .= $key . ': ' . $value . "\n";
    }

    // Send email
    if (mail($to, $subject, $message)) {
        http_response_code(200);
        echo 'Email sent successfully.';
    } else {
        http_response_code(500);
        echo 'Error: Unable to send email.';
    }
} else {
    http_response_code(400);
    echo 'Error: Invalid request.';
}
?>
