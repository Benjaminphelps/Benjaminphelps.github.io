document.getElementById('emailbutton').addEventListener('click', function() {
    // Copy email to clipboard
    navigator.clipboard.writeText('your.email@example.com').then(function() {
        // Show copied message
        var copyMessage = document.getElementById('copyMessage');
        copyMessage.style.display = 'inline';
        
        // Hide the message after 2 seconds
        setTimeout(function() {
            copyMessage.style.display = 'none';
        }, 2000);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});
