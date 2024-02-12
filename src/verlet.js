import * as AngleConstraint    from './constraint-angle.js'
import * as DistanceConstraint from './constraint-distance.js'
import * as PinConstraint      from './constraint-pin.js'
import { vec2 }                from 'https://cdn.skypack.dev/gl-matrix'


const RELAXATION_LOOKUP = {
	pin: PinConstraint.relax,
	angle: AngleConstraint.relax,
	distance: DistanceConstraint.relax,
}


export function create (width, height, canvas) {
	return {
		width, height, canvas,
		ctx: canvas.getContext("2d"),
		mouse: vec2.create(),
		mouseDown: false,
		draggedEntity: null,
		selectionRadius: 20,
		highlightColor: "#4f545c",
		gravity: vec2.fromValues(0, 0.2),
		friction: 0.99,
		groundFriction: 0.8,

		composites: [ ],
	}
}


export function frame (v, step) {
	const { height, composites, gravity, friction, groundFriction, draggedEntity, mouse } = v

	for (const c in composites) {
		for (const i in composites[c].particles) {
			const particles = composites[c].particles
			
			// calculate velocity
			const velocity = vec2.subtract(vec2.create(), particles[i].pos, particles[i].lastPos)
			vec2.scale(velocity, velocity, friction)
		
			// ground friction
			if (particles[i].pos[1] >= height-1 && vec2.squaredLength(velocity) > 0.000001) {
				const m = vec2.length(velocity)
				velocity[0] /= m
				velocity[1] /= m
				vec2.scale(velocity, velocity, m * groundFriction)
			}
		
			// save last frame state
			vec2.copy(particles[i].lastPos, particles[i].pos)
		
			// gravity
			vec2.add(particles[i].pos, particles[i].pos, gravity)
		
			// inertia  
			vec2.add(particles[i].pos, particles[i].pos, velocity)
		}
	}
	
	// handle dragging of entities
	if (draggedEntity)
		vec2.copy(draggedEntity.pos, mouse)
		
	// relax
	const stepCoef = 1 / step

	for (const c in composites) {
		const constraints = composites[c].constraints
		for (let i=0; i<step; ++i)
			for (const j in constraints) {
				const constraint = constraints[j]
				const relaxFn = RELAXATION_LOOKUP[constraint.type]
				relaxFn(constraint, stepCoef) 
			}
	}
	
	for (const c of Object.values(composites))
		for (const p of Object.values(c.particles))
			boundsSnap(v, p)
}


// keep all particles within the scene's dimensions
function boundsSnap (v, particle) {
	const { width, height } = v
	if (particle.pos[1] > height-1)
		particle.pos[1] = height-1
	
	if (particle.pos[0] < 0)
		particle.pos[0] = 0

	if (particle.pos[0] > width-1)
		particle.pos[0] = width-1
}


export function nearestEntity (v) {
	const { composites, mouse, selectionRadius } = v

	let d2Nearest = 0
	let entity, constraintsNearest
	
	// find nearest point
	for (const c in composites) {
		const particles = composites[c].particles
		for (const i in particles) {
			const d2 = vec2.squaredDistance(particles[i].pos, mouse)
			if (d2 <= selectionRadius*selectionRadius && (!entity || d2 < d2Nearest)) {
				entity = particles[i]
				constraintsNearest = composites[c].constraints
				d2Nearest = d2
			}
		}
	}

	// search for pinned constraints for this entity
	for (const i of constraintsNearest || [ ])
		if (i.type === 'pin' && i.a === entity)
			entity = i
	
	return entity
}
