$(document).ready(function(){
	$(window).scroll(function(){
	if(this.scrollY > 20){
			$('.navbar').addClass("sticky");

	}
	else {
		$('.navbar').removeClass("sticky");
	}
	if(this.scrollY > 500) {
		$('.scroll-up-btn').addClass("show");		
	}
	else {
		$('.scroll-up-btn').removeClass("show");	
	}

		});


	//slide-up script
	$('.scroll-up-btn').click(function(){
		$('html').animate({scrollTop: 0});
	});


	//toggle menu/navbar script
$('.menu-btn').click(function(){
	$('.navbar .menu').toggleClass("active");
	$('.menu-btn i').toggleClass("active");
})

//owl carousel script
$('.carousel').owlCarousel({
	margin: 20, 
	loop: true,
	autoplayTimeOut: 2000, 
	autoplayHoverPause: true,
	responsive: {
		0: {
			items: 1,
			nav: false
		},

		600: {
			items: 2,
			nav: false
		},

		1000: {
			items: 3,
			nav: false
		}
	}
});
});
// Helper libs. Go to line 105 for the actual implementation.
class Vector {
  constructor(x, y) {
    this._compute(x, y);
  }
  _compute(x, y) {
    this.x = x;
    this.y = y;
    this.angle = Math.atan2(y, x);
    this.length = Math.sqrt(x * x + y * y);
  }
  setAngle(angle) {
    this.angle = angle;
    this.x = Math.cos(this.angle) * this.length;
    this.y = Math.sin(this.angle) * this.length;
  }
  setLength(length) {
    this.length = length;
    this.x = Math.cos(this.angle) * this.length;
    this.y = Math.sin(this.angle) * this.length;
  }
  add(v) {
    this._compute(this.x + v.x, this.y + v.y);
  }
  multiply(scalar) {
    this._compute(this.x * scalar, this.y * scalar);
  }
}

class Particle {
  constructor({
    radius,
    position,
    velocity = new Vector(0, 0),
    gravity = 0,
    mass = 1,
    friction = 0.99,
    update = true
  }) {
    this.radius = radius;
    this.position = position;
    this.velocity = velocity;
    this.mass = mass;
    this.gravity = new Vector(0, gravity);
    this.friction = friction;
    this.update = update;
  }

  angleTo(p) {
    return Math.atan2(
      p.position.y - this.position.y,
      p.position.x - this.position.x
    );
  }

  distanceTo(p) {
    const dx = p.position.x - this.position.x;
    const dy = p.position.y - this.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updatePosition() {
    if (this.update) {
      this.velocity.add(this.gravity);
      this.position.add(this.velocity);
    }
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  }

  screenWrap(width, height) {
    if (this.update) {
      const { x, y } = this.position;
      // Left boundary.
      if (x + this.radius < 0) {
        this.position.x = width + this.radius;
      }
      // Right boundary.
      if (x - this.radius > width) {
        this.position.x = 0 - this.radius;
      }
      // Top boundary.
      if (y + this.radius < 0) {
        this.position.y = height + this.radius;
      }
      // Bottom boundary.
      if (y - this.radius > height) {
        this.position.y = 0 - this.radius;
      }
    }
  }
}

// Where the actual magic happens.
const particleColors = ["#ea1d6f", "#eb466b", "#EB7139"];
const backgroundRgb = {
  r: 03,
  g: 04,
  b: 19
};

const PARTICLE_COUNT = 100;
const particles = [];
const canvas = document.getElementById("landing-canvas");
const ctx = canvas.getContext("2d");
const {
  width: canvasWidth,
  height: canvasHeight
} = canvas.getBoundingClientRect();
canvas.width = canvasWidth;
canvas.height = canvasHeight;

initializeParticles();

const effects = [
  effectLongTrails,
  effectCurves,
  effectStraightLines,
  effectClassicVelvet,
  effectSlowVelvet,
  effectDanglers
];

render();

/**
 * Create the particles and spring points based on the pixel positions in the canvas.
 */
function initializeParticles() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const velocity = new Vector(0, 0);
    velocity.setAngle(Math.random() * 2 * Math.PI);
    velocity.setLength(1);
    const particle = new Particle({
      radius: 1,
      position: new Vector(
        Math.round(Math.random() * canvasWidth),
        Math.round(Math.random() * canvasHeight)
      ),
      velocity
    });
    particles.push(particle);
  }
}

/**
 * Renders the particles on the screen.
 */
function render() {
  if (effects) {
    effects[0]();
  }
  requestAnimationFrame(render);
}

function effectLongTrails() {
  // Clear the canvas.
  ctx.fillStyle = `rgba(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}, .01)`;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // For each particle within the limit.
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];
    ctx.fillStyle = particleColors[i % particleColors.length];
    particle.render(ctx);
    particle.screenWrap(canvasWidth, canvasHeight);
    particle.updatePosition();
    particle.velocity.x += Math.random() > 0.5 ? 0.01 : -0.01;
    particle.velocity.y += Math.random() > 0.5 ? 0.01 : -0.01;
  }
}

function effectCurves() {
  // Clear the canvas.
  ctx.fillStyle = `rgba(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}, .1)`;
  // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // For each particle within the limit.
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];

    ctx.fillStyle = particleColors[i % particleColors.length];
    particle.render(ctx);
    particle.screenWrap(canvasWidth, canvasHeight);

    // particle.updatePosition();
    // particle.velocity.x = Math.random() > 0.5 ? 0.1 : -0.1;
    // particle.velocity.y = Math.random() > 0.5 ? 0.1 : -0.01;
    // particle.velocity.setLength(Math.random() * 5);
    particle.position.setAngle(2 * Math.random());
  }
}

function effectStraightLines() {
  // Clear the canvas.
  ctx.fillStyle = `rgba(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}, .001)`;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // For each particle within the limit.
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];

    const index = Math.floor(Math.random() * particleColors.length);
    ctx.fillStyle = particleColors[index];
    particle.render(ctx);
    particle.screenWrap(canvasWidth, canvasHeight);

    particle.updatePosition();
    particle.velocity.setLength(2);
  }
}

function effectClassicVelvet() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];

    particle.updatePosition();

    const index = Math.floor(Math.random() * particleColors.length);
    ctx.fillStyle = particleColors[index];
    particle.render(ctx);
    particle.screenWrap(canvasWidth, canvasHeight);

    particle.velocity.setAngle(
      Math.random() > 0.5
        ? Math.random() * 2 * Math.PI
        : Math.random() * -2 * Math.PI
    );
    particle.velocity.setLength(Math.random() * 5);
  }
}

function effectSlowVelvet() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];

    particle.updatePosition();

    const index = Math.floor(Math.random() * particleColors.length);
    ctx.fillStyle = particleColors[index];
    particle.render(ctx);
    particle.screenWrap(canvasWidth, canvasHeight);

    particle.velocity.setAngle(Math.random() * 2 * Math.PI);
    particle.velocity.setLength(Math.random() * 5);
  }
}

function effectDanglers() {
  // Clear the canvas.
  ctx.fillStyle = `rgba(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}, .1)`;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // For each particle within the limit.
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = particles[i];

    particle.updatePosition();

    const index = Math.floor(Math.random() * particleColors.length);
    ctx.fillStyle = particleColors[index];

    particle.render(ctx);

    particle.screenWrap(canvasWidth, canvasHeight);

    particle.velocity.setAngle(
      Math.random() > 0.5
        ? Math.random() * 2 * Math.PI
        : Math.random() * -2 * Math.PI
    );
    particle.velocity.setLength(Math.random() * 5);
  }
}

