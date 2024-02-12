import * as PinConstraint from './constraint-pin.js'


export function create () {
	return {
		particles: [ ],
		constraints: [ ],
		drawParticles: null,
		drawConstraints: null,
	}
}


export function pin (c, index, pos) {
	pos = pos || c.particles[index].pos
	const pc = PinConstraint.create(c.particles[index], pos)
	c.constraints.push(pc)
	return pc
}
