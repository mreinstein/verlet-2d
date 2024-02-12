import { vec2 } from 'https://cdn.skypack.dev/gl-matrix'


export function create (a, pos) {
	return {
		type: 'pin',
		a,
		pos: vec2.clone(pos),
	}
}


export function relax (pc, stepCoef) {
	vec2.copy(pc.a.pos, pc.pos)
}
