// Pure Canvas Confetti & Celebration Burst Utility

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star' | 'heart';
  alpha: number;
}

export function fireConfettiBurst(canvas: HTMLCanvasElement, durationMs = 4000) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    '#f59e0b', // amber
    '#fbbf24', // warm yellow
    '#ec4899', // rose pink
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#3b82f6', // sky blue
    '#f43f5e', // coral red
  ];

  const shapes: Array<'rect' | 'circle' | 'star' | 'heart'> = ['rect', 'circle', 'star', 'heart'];
  const particles: Particle[] = [];
  const count = 140;

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * (0.8 + Math.random() * 0.4) - Math.PI / 2; // upwards spread
    const speed = 7 + Math.random() * 12;
    particles.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.7,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.8),
      vy: -Math.abs(Math.sin(angle) * speed),
      radius: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      alpha: 1,
    });
  }

  let startTime = performance.now();
  let animId: number;

  function render(time: number) {
    const elapsed = time - startTime;
    if (elapsed > durationMs) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, 1 - elapsed / durationMs);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.radius, -p.radius * 0.6, p.radius * 2, p.radius * 1.2);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'heart') {
        ctx.beginPath();
        const topCurveHeight = p.radius * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -p.radius, 0, -p.radius, topCurveHeight);
        ctx.bezierCurveTo(-p.radius, (p.radius + topCurveHeight) / 2, 0, p.radius * 1.3, 0, p.radius * 1.5);
        ctx.bezierCurveTo(0, p.radius * 1.3, p.radius, (p.radius + topCurveHeight) / 2, p.radius, topCurveHeight);
        ctx.bezierCurveTo(p.radius, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        // star
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.radius, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.radius);
          ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.radius / 2), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.radius / 2));
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(animId);
}
