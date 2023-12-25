
const canvas = document.getElementById('floatingSpheresCanvas');
const ctx = canvas.getContext('2d');
const header = document.getElementById('header');

canvas.width = header.offsetWidth;
canvas.height = header.offsetHeight;

const spheres = [];

class Sphere {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx; // Delta x - change in x
        this.dy = dy; // Delta y - change in y
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
            this.dx = -this.dx; // Reverse direction
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy; // Reverse direction
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
