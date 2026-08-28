/**
 * Interactive Tactile Neural Widget next to Name
 * Nawfel Zemouli Portfolio
 */

export function initTactileWidget() {
  const canvas = document.getElementById('tactile-canvas');
  const widget = document.getElementById('tactile-neural-widget');

  if (!canvas || !widget) return;

  const ctx = canvas.getContext('2d');
  const size = 160;
  canvas.width = size;
  canvas.height = size;

  const center = size / 2;
  const nodes = [];
  const nodeCount = 12;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const dist = 35 + Math.random() * 20;
    nodes.push({
      angle: angle,
      dist: dist,
      speed: (Math.random() - 0.5) * 0.03,
      radius: Math.random() * 3 + 2,
      pulse: Math.random() * Math.PI
    });
  }

  let mouse = { x: center, y: center, hover: false };
  let ripples = [];

  widget.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.hover = true;
  });

  widget.addEventListener('mouseleave', () => {
    mouse.x = center;
    mouse.y = center;
    mouse.hover = false;
  });

  widget.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    ripples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 5,
      alpha: 1
    });
  });

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // Draw central core glow
    const gradient = ctx.createRadialGradient(center, center, 5, center, center, 50);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, 50, 0, Math.PI * 2);
    ctx.fill();

    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 2.5;
      r.alpha -= 0.03;

      if (r.alpha <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw neural node network
    const currentNodes = nodes.map(node => {
      node.angle += node.speed;
      node.pulse += 0.04;

      let x = center + Math.cos(node.angle) * (node.dist + Math.sin(node.pulse) * 4);
      let y = center + Math.sin(node.angle) * (node.dist + Math.sin(node.pulse) * 4);

      // Tactile magnet pull towards cursor on hover
      if (mouse.hover) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        x += dx * 0.15;
        y += dy * 0.15;
      }

      return { x, y, radius: node.radius };
    });

    // Connect nodes with cyan glowing lines
    for (let i = 0; i < currentNodes.length; i++) {
      for (let j = i + 1; j < currentNodes.length; j++) {
        const n1 = currentNodes[i];
        const n2 = currentNodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 55) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 55})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw node dots
      const node = currentNodes[i];
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
    }

    // Draw outer orbital ring
    ctx.beginPath();
    ctx.arc(center, center, 65, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    requestAnimationFrame(draw);
  }

  draw();
}
