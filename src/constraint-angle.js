import { vec2 } from 'https://cdn.skypack.dev/gl-matrix'


/**
 * given 3 vertices, maintains the angle at b with the given stiffness:
 *  
 *   a ●   ● c     
 *      \ /  
 *       ●
 *       b
 */
export function create (a, b, c, stiffness) {
	return {
		type: 'angle',
		a,
		b,
		c,
		angle: angle2(b.pos, a.pos, c.pos),
		stiffness,
	}
}


export function relax (ac, stepCoef) {
	const angle = angle2(ac.b.pos, ac.a.pos, ac.c.pos)
	//const angle = ac.b.pos.angle2(ac.a.pos, ac.c.pos)
	let diff = angle - ac.angle
	
	if (diff <= -Math.PI)
		diff += 2*Math.PI
	else if (diff >= Math.PI)
		diff -= 2*Math.PI

	diff *= stepCoef * ac.stiffness
	
	// b is origin, a is point to rotate
	//vec2.rotate(out, a, b, rad)
	vec2.rotate(ac.a.pos, ac.a.pos, ac.b.pos, diff)
	vec2.rotate(ac.c.pos, ac.c.pos, ac.b.pos, -diff)
	vec2.rotate(ac.b.pos, ac.b.pos, ac.a.pos, diff)
	vec2.rotate(ac.b.pos, ac.b.pos, ac.c.pos, -diff)

	/*
	//                                   origin   theta
	ac.a.pos = rotate(ac.a.pos, ac.b.pos, diff)
	ac.c.pos = rotate(ac.c.pos, ac.b.pos, -diff)
	ac.b.pos = rotate(ac.b.pos, ac.a.pos, diff)
	ac.b.pos = rotate(ac.b.pos, ac.c.pos, -diff)
	*/
}


/*
function rotate (toRot, origin, theta) {
	const x = toRot[0] - origin[0]
	const y = toRot[1] - origin[1]
	return vec2.fromValues(x*Math.cos(theta) - y*Math.sin(theta) + origin[0], x*Math.sin(theta) + y*Math.cos(theta) + origin[1])
}
*/


function angle2 (t, vLeft, vRight) {
	const a = vec2.subtract(vec2.create(), vLeft, t)
	const b = vec2.subtract(vec2.create(), vRight, t)
	return angle(a, b)
	//return vLeft.sub(this).angle(vRight.sub(this));
}


function angle (t, v) {
	return Math.atan2(t[0]*v[1]-t[1]*v[0], t[0]*v[0]+t[1]*v[1])
	//return Math.atan2(t.x*v.y-t.y*v.x, t.x*v.x+t.y*v.y);
}
