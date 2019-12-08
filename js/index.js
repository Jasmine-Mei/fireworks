function ExplosionParticle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.size = randInt(particlesMinSize, particlesMaxSize, true);
    this.g = 0.5;
    this.coordinates = [];
    this.coordinateCount = 2;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
}

ExplosionParticle.prototype.update = function (i) {

    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    if (this.size <= 1) {

        let remove = particles.splice(i, 1);

        return;
    }
    // Update
    this.x += this.xv;
    this.y += this.yv + this.g;
    this.size -= .1;
}

ExplosionParticle.prototype.draw = function (i) {
    offctx.beginPath();
    offctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    offctx.lineTo(this.x, this.y);
    offctx.strokeStyle = this.color;
    offctx.stroke();
    offctx.arc(this.x, this.y, this.size, Math.PI * 2, 0, false);
    offctx.closePath();
    offctx.fillStyle = this.color;
    offctx.fill();
}


// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {

    let num;
    if (positive === false) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    } else {
        num = Math.floor(Math.random() * max) + min;
    }

    return num;

}

function randomBetween(min, max) {
    if (min < 0) {
        return min + Math.random() * (Math.abs(min) + max);
    } else {
        return min + Math.random() * max;
    }
}


function Particle() {
    //
    this.ox = WIDTH / 2;
    this.oy = HEIGHT / 2;
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.tx = ~~randomBetween(0, WIDTH);
    this.ty = ~~randomBetween(0, HEIGHT);

    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.radius = 2;

    this.speed = 2;
    this.acceleration = 1.05;

    this.color = "rgba(" + Math.floor(randomBetween(0, 255)) + "," + Math.floor(randomBetween(0, 255)) + "," + Math.floor(randomBetween(0, 255)) + ",1)";

}


Particle.prototype.update = function (index) {

    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle()) * this.speed,
        vy = Math.sin(this.angle()) * this.speed;


    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled() >= this.distanceToTarget()) {
        this.generateExplosion();
        // remove the firework, use the index passed into the update function to determine which to remove
        let remove = points.splice(index, 1);




    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
}

Particle.prototype.distanceToTarget = function () {

    var dx = this.ox - this.tx,
        dy = this.oy - this.ty;
    return Math.sqrt(dx * dx + dy * dy);
}

Particle.prototype.distanceTraveled = function () {
    var dx = this.ox - this.x,
        dy = this.oy - this.y;
    return Math.sqrt(dx * dx + dy * dy);
}


Particle.prototype.angle = function () {
    return Math.atan2(this.ty - this.oy, this.tx - this.ox);
}

Particle.prototype.generateExplosion = function () {

    for (let i = 0; i < particlesPerExplosion; i++) {
        particles.push(
            new ExplosionParticle(this.tx, this.ty, this.color)
        );
    }

}

Particle.prototype.draw = function () {
    offctx.beginPath();
    offctx.fillStyle = this.color;
    offctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    offctx.lineTo(this.x, this.y);
    offctx.strokeStyle = this.color;
    offctx.stroke();
    offctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    offctx.fill();
    offctx.closePath();
}



var render = function () {
    //ctx.globalCompositeOperation = 'destination-out';
    offctx.fillStyle = "rgba(0,0,0,0.3)";
    offctx.fillRect(0, 0, WIDTH, HEIGHT);

    //ctx3.clearRect(0,0,WIDTH,HEIGHT);

    //ctx.globalCompositeOperation = 'lighter';

    let i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    i = points.length;
    while (i--) {
        points[i].draw();
        points[i].update(i);
    }
    ctx.putImageData(offctx.getImageData(0, 0, WIDTH, HEIGHT), 0, 0);
    if (tick >= 5) {
        points.push(new Particle());
        points.push(new Particle());
        points.push(new Particle());
        points.push(new Particle());
        points.push(new Particle());
        tick = 0;
    }
    ++tick;



    requestAnimationFrame(render);
};


window.onload = function () {
    canvas = document.createElement("canvas");
    HEIGHT = canvas.height = window.innerHeight;
    WIDTH = canvas.width = window.innerWidth;
    ctx = canvas.getContext("2d");

    offcanvas = document.createElement("canvas");
    offctx = offcanvas.getContext("2d");
    offcanvas.height = window.innerHeight;
    offcanvas.width = window.innerWidth;

    document.body.appendChild(canvas);
    points = generate(50);
    render();

}