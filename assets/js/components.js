// Load navbar and footer dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('/assets/js/navbar-v2.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));        

    
    // Load footer
    fetch('/assets/js/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
