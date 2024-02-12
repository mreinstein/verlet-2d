import { vec2 } from 'https://cdn.skypack.dev/gl-matrix'


export function create (pos) {
	return {
		pos: vec2.clone(pos),
		lastPos: vec2.clone(pos),
	}
}
