import * as VerletJS from './verlet.js'


export function distanceConstraint (ctx, dc) {
	ctx.beginPath()
	ctx.moveTo(dc.a.pos[0], dc.a.pos[1])
	ctx.lineTo(dc.b.pos[0], dc.b.pos[1])
	ctx.strokeStyle = "#d8dde2"
	ctx.stroke()
}


export function pinConstraint (ctx, pc) {
	ctx.beginPath();
	ctx.arc(pc.pos[0], pc.pos.y, 6, 0, 2*Math.PI);
	ctx.fillStyle = "rgba(0,153,255,0.1)";
	ctx.fill();
}


export function angleConstraint (ctx, ac) {
	ctx.beginPath();
	ctx.moveTo(ac.a.pos[0], ac.a.pos[1]);
	ctx.lineTo(ac.b.pos[0], ac.b.pos[1]);
	ctx.lineTo(ac.c.pos[0], ac.c.pos[1]);
	const tmp = ctx.lineWidth;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(255,255,0,0.2)";
	ctx.stroke();
	ctx.lineWidth = tmp;
}


export function particle (ctx, p) {
	ctx.beginPath();
	ctx.arc(p.pos[0], p.pos[1], 2, 0, 2*Math.PI);
	ctx.fillStyle = "#2dad8f";
	ctx.fill();
}


const RENDER_LOOKUP = {
	angle: angleConstraint,
	distance: distanceConstraint,
	pin: pinConstraint,
}


export function verlet (v) {
	const { ctx, canvas, composites, draggedEntity, highlightColor } = v

	ctx.clearRect(0, 0, canvas.width, canvas.height);  
	
	for (const c of composites) {
		// draw constraints
		if (c.drawConstraints) {
			c.drawConstraints(ctx, c)
		} else {
			for (const i of c.constraints)
				RENDER_LOOKUP[i.type](ctx, i)
		}
		
		// draw particles
		if (c.drawParticles) {
			c.drawParticles(ctx, c)
		} else {
			for (const p of c.particles)
				particle(ctx, p)
		}
	}

	// highlight nearest / dragged entity
	const nearest = draggedEntity || VerletJS.nearestEntity(v)
	if (nearest) {
		ctx.beginPath()
		ctx.arc(nearest.pos[0], nearest.pos[1], 8, 0, 2*Math.PI)
		ctx.strokeStyle = highlightColor
		ctx.stroke()
	}
}
