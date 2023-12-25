
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
        ctx.fillStyle = 'rgba(204, 209, 217, 1)'; // Sphere color
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

    for (let i = 0; i < 30; i++) { // Adjust the number of spheres as desired
        let radius = 1 * 4 + 5; // Adjust size as needed
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

            if (distance < 100) { // Adjust this value as needed
                ctx.beginPath();
                ctx.moveTo(spheres[i].x, spheres[i].y);
                ctx.lineTo(spheres[j].x, spheres[j].y);
                ctx.strokeStyle = 'rgba(204, 209, 217, 0.5)'; // Line color
                ctx.stroke();
            }
        }
    }
}



init();
animate();
