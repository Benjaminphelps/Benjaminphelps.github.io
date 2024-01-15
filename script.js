
const canvas = document.getElementById('floatingSpheresCanvas');
const ctx = canvas.getContext('2d');
const header = document.getElementById('header');

canvas.width = header.offsetWidth;
canvas.height = header.offsetHeight;

const spheres = [];

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const bumpRadius = 100; // Radius of effect
    const bumpStrength = 0.7; // New velocity strength

    spheres.forEach(sphere => {
        const dx = clickX - sphere.x;
        const dy = clickY - sphere.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bumpRadius) {
            const angle = Math.atan2(dy, dx);
            sphere.dx = -Math.cos(angle) * bumpStrength;
            sphere.dy = -Math.sin(angle) * bumpStrength;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var emailToCopy = "ben.phelps27@gmail.com"; 

    var emailButton = document.getElementById('emailButton');
    var copyMessage = document.getElementById('copyMessage');

    if (emailButton) {
        emailButton.addEventListener('click', function() {
            navigator.clipboard.writeText(emailToCopy).then(function() {
                // Show the copied message
                copyMessage.style.display = 'inline';

                // Hide the message after 2 seconds
                setTimeout(function() {
                    copyMessage.style.display = 'none';
                }, 2000);
            }).catch(function(error) {
                console.error('Error copying text: ', error);
              
            });
        });
    }
});



class Sphere {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.baseDx = dx; // Baseline velocity x
        this.baseDy = dy; // Baseline velocity y
    }


    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(0,0,0,  0)'; // Sphere color
        ctx.fill();
    }

    update() {
        // Check for boundary collision
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx; // Reverse x direction
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy; // Reverse y direction
        }

        // Gradually return to baseline velocity

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

class Pulse {
    constructor(sphere) {
        this.x = sphere.x;
        this.y = sphere.y;
        this.radius = 0; // Start radius
        this.maxRadius = 100; // Max radius before disappearing
        this.speed = 1; // Speed of pulse expansion
        this.active = true;
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.speed;
        } else {
            this.active = false;
        }
    }

    draw() {
        if (this.active) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(0, 0, 255, ' + (1 - this.radius / this.maxRadius) + ')'; // Blue pulse
            ctx.stroke();
        }
    }
}





function init() {
    spheres.length = 0; // Clear the existing spheres
    const speed = 0.4; // Set a constant speed for all spheres

    for (let i = 0; i <  40; i++) { 
        let radius = 1 * 4 + 5; 
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;

        // Calculate dx and dy for a consistent speed in random directions
        let angle = Math.random() * Math.PI * 2; // Random angle
        let dx = Math.cos(angle) * speed;
        let dy = Math.sin(angle) * speed;

        spheres.push(new Sphere(x, y, radius, dx, dy));
    }
}

let pulses = [];


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLinesAndSpheres();

    // Update and draw pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.update();
        pulse.draw();

        if (!pulse.active) {
            pulses.splice(i, 1);
            continue;
        }

        for (let sphere of spheres) {
            const dx = pulse.x - sphere.x;
            const dy = pulse.y - sphere.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= pulse.radius + sphere.radius && distance >= pulse.radius - sphere.radius) {
                // Prevent multiple pulses on the same sphere
                if (!sphere.pulsed) {
                    pulses.push(new Pulse(sphere));
                    sphere.pulsed = true; // Mark sphere as pulsed
                }
            } else {
                sphere.pulsed = false;
            }
        }
    }
}



function drawLinesAndSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        spheres[i].update();
        for (let j = i + 1; j < spheres.length; j++) {
            const dx = spheres[i].x - spheres[j].x;
            const dy = spheres[i].y - spheres[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) { // Adjust this value as needed
                ctx.beginPath();
                ctx.moveTo(spheres[i].x, spheres[i].y);
                ctx.lineTo(spheres[j].x, spheres[j].y);
                ctx.strokeStyle = 'rgba(113, 5, 185, 0.5)'; // Line color
                ctx.stroke();
            }
        }
    }
}

var indicator = document.getElementById('scroll-down-indicator');

function fadeOutOnScroll(element) {
  if (!element) {
    return;
  }
  
  var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
  var elementHeight = element.offsetHeight;
  var scrollTop = document.documentElement.scrollTop;
  
  var opacity = 1;
  
  if (scrollTop > distanceToTop) {
    opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
  }
  
  if (opacity >= 0) {
    element.style.opacity = opacity;
  }
}

function scrollHandler() {
  fadeOutOnScroll(indicator);
}


window.addEventListener('scroll', scrollHandler);

const projectData = [
    { id: '1', title: 'Project 1', description: 'I used a raspberry pi to display a users currently playing song album cover (via spotify API) onto an OLED screen.', url: 'google.com' },
    { id: '2', title: 'Project 2', description: 'Description of Project 2...' },
    { id: '3', title: 'Project 3', description: 'Description of Project 3...' },
    { id: '4', title: 'Project 4', description: 'Description of Project 4...' },
    { id: '5', title: 'Project 5', description: 'Description of Project 5...' },
    { id: '6', title: 'Project 6', description: 'Description of Project 6...' },
    
];

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const project = projectData.find(p => p.id === projectId);

        let infoContent = 'Information not found';
        if (project) {
            infoContent = `<strong>${project.title}</strong><p>${project.description}</p>`;
        }

        document.querySelector('.info-content').innerHTML = infoContent;
        document.querySelector('.info-box').style.display = 'block';
    });
});

// Function to update the info box based on the selected project
function updateInfoBox(projectId) {
    const project = projectData.find(p => p.id === projectId);
    let infoContent = 'Information not found';
    if (project) {
        infoContent = `<strong>${project.title}</strong><p>${project.description}</p>`;
    }
    document.querySelector('.info-content').innerHTML = infoContent;
    document.querySelector('.info-box').style.display = 'block'; // Ensure info box is visible

    if (project.url) {
        const link = document.createElement('a');
        link.setAttribute('href', project.url);
        link.textContent = 'Learn More'; // Text for the hyperlink
        link.setAttribute('target', '_blank'); // Open in a new tab

        projectDiv.appendChild(link);
    }
}

// Function to handle the selection of a project card
function selectProjectCard(card) {
    // Remove selected class from all cards
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('project-card-selected'));

    // Add selected class to the clicked card
    card.classList.add('project-card-selected');

    // Update the info box based on the selected project
    const projectId = card.getAttribute('data-project');
    updateInfoBox(projectId);
}

// Add click event listeners to all project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        selectProjectCard(this);
    });
});

// Default to Project 1 being selected on page load
window.onload = function() {
    const defaultSelectedCard = document.querySelector('.project-card[data-project="1"]');
    if (defaultSelectedCard) {
        selectProjectCard(defaultSelectedCard);
    }
};


init();
animate();
