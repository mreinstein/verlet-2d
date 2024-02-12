import { vec2 } from 'https://cdn.skypack.dev/gl-matrix'


export function create (a, b, stiffness, distance /*optional*/) {
	return {
		type: 'distance',
		a,
		b,
		distance: distance ?? vec2.distance(a.pos, b.pos),
		stiffness
	}
}

export function relax (dc, stepCoef) {
	const m = vec2.squaredDistance(dc.a.pos, dc.b.pos)
	const normal = vec2.subtract(vec2.create(), dc.a.pos, dc.b.pos)
	const scaleAmt = ( (dc.distance*dc.distance - m) / m) * dc.stiffness*stepCoef
	vec2.scale(normal, normal, scaleAmt)
	
	vec2.add(dc.a.pos, dc.a.pos, normal)
	vec2.sub(dc.b.pos, dc.b.pos, normal)
}
