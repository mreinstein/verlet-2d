// generic verlet entities
import * as Composite          from './composite.js'
import * as DistanceConstraint from './constraint-distance.js'
import * as Particle           from './particle.js'
import { vec2 }                from 'https://cdn.skypack.dev/gl-matrix'


export function point (pos) {
	var composite = Composite.create()
	composite.particles.push(Particle.create(pos))
	return composite
}


export function lineSegments (vertices, stiffness) {
	
	const composite = Composite.create()

	vertices.forEach(function (vert, i) {
		composite.particles.push(Particle.create(vert))
		if (i > 0)
			composite.constraints.push(DistanceConstraint.create(composite.particles[i], composite.particles[i-1], stiffness))
	})
	
	return composite
}


export function cloth (origin, width, height, segments, pinMod, stiffness) {
	
	var composite = Composite.create();
	
	var xStride = width/segments;
	var yStride = height/segments;
	
	var x,y;
	for (y=0;y<segments;++y) {
		for (x=0;x<segments;++x) {
			var px = origin.x + x*xStride - width/2 + xStride/2;
			var py = origin.y + y*yStride - height/2 + yStride/2;
			composite.particles.push(new Particle(new Vec2(px, py)));
			
			if (x > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[y*segments+x-1], stiffness));
			
			if (y > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[(y-1)*segments+x], stiffness));
		}
	}
	
	for (x=0;x<segments;++x) {
		if (x%pinMod == 0)
			composite.pin(x)
	}
	
	return composite
}


export function tire (origin, radius, segments, spokeStiffness, treadStiffness) {
	const stride = (2*Math.PI)/segments
	
	const composite = Composite.create()
	
	// particles
	for (let i=0; i<segments; ++i) {
		const theta = i*stride;
		const pos = vec2.fromValues(origin[0] + Math.cos(theta)*radius, origin[1] + Math.sin(theta)*radius)
		composite.particles.push(Particle.create(pos))
	}
	
	const center = Particle.create(origin)
	composite.particles.push(center)
	
	// constraints
	for (let i=0; i<segments; ++i) {
		composite.constraints.push(DistanceConstraint.create(composite.particles[i], composite.particles[(i+1)%segments], treadStiffness));
		composite.constraints.push(DistanceConstraint.create(composite.particles[i], center, spokeStiffness))
		composite.constraints.push(DistanceConstraint.create(composite.particles[i], composite.particles[(i+5)%segments], treadStiffness));
	}

	return composite
}
