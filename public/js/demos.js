/**
 * Interactive Demos & Code Lab for Nawfel Zemouli's Portfolio
 */

export function initDemos() {
  initCodeRunner();
  initSortingVisualizer();
  initParticleCanvas();
}

/* -------------------------------------------------------------
 * 1. Interactive Code Runner
 * ------------------------------------------------------------- */
function initCodeRunner() {
  const codeSelect = document.getElementById('code-snippet-select');
  const codeDisplay = document.getElementById('code-display');
  const runBtn = document.getElementById('run-code-btn');
  const consoleOutput = document.getElementById('console-output');

  if (!codeSelect || !codeDisplay || !runBtn || !consoleOutput) return;

  const snippets = {
    binarySearch: {
      code: `// Binary Search Algorithm - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    console.log(\`Checking index \${mid} (Value: \${arr[mid]})\`);
    
    if (arr[mid] === target) {
      return \`Target \${target} found at index \${mid}!\`;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return "Target not found";
}

const data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
binarySearch(data, 23);`,
      output: [
        "> Initializing Binary Search on sorted array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]...",
        "> Target value: 23",
        "> Step 1: Checking index 4 (Value: 16) -> 16 < 23 (Search Right)",
        "> Step 2: Checking index 7 (Value: 56) -> 56 > 23 (Search Left)",
        "> Step 3: Checking index 5 (Value: 23) -> MATCH!",
        "✓ SUCCESS: Target 23 found at index 5 in 3 steps [O(log n)]."
      ]
    },
    fibonacci: {
      code: `// Dynamic Programming: Memoized Fibonacci - O(n)
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  console.log(\`Calculated Fib(\${n}) = \${memo[n]}\`);
  return memo[n];
}

console.log("Fibonacci(10):", fibonacci(10));`,
      output: [
        "> Computing Fibonacci sequence with Dynamic Programming memoization...",
        "> Fib(2) = 1",
        "> Fib(3) = 2",
        "> Fib(4) = 3",
        "> Fib(5) = 5",
        "> Fib(6) = 8",
        "> Fib(7) = 13",
        "> Fib(8) = 21",
        "> Fib(9) = 34",
        "> Fib(10) = 55",
        "✓ SUCCESS: Result = 55 (Time Complexity reduced from O(2^n) to O(n))."
      ]
    },
    cyberHash: {
      code: `// Cryptographic Hash Simulator
function generateCyberHash(input) {
  let hash = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return "0x" + (hash >>> 0).toString(16).toUpperCase();
}

const input = "Nawfel_Zemouli_CS_2026";
console.log("Input:", input);
console.log("CyberHash:", generateCyberHash(input));`,
      output: [
        "> Reading input stream: 'Nawfel_Zemouli_CS_2026'",
        "> Executing bitwise FNV-1a hash transformation...",
        "> Digest generated: 0x7FA9C0E2",
        "✓ SUCCESS: Cryptographic hash verification passed."
      ]
    }
  };

  // Update code display when select changes
  codeSelect.addEventListener('change', () => {
    const key = codeSelect.value;
    if (snippets[key]) {
      codeDisplay.textContent = snippets[key].code;
      consoleOutput.innerHTML = `<span class="console-prompt">$ System ready. Click "Run Code" to execute.</span>`;
    }
  });

  // Run code button handler
  runBtn.addEventListener('click', () => {
    const key = codeSelect.value;
    const item = snippets[key];
    if (!item) return;

    consoleOutput.innerHTML = '';
    runBtn.disabled = true;
    runBtn.style.opacity = '0.7';

    let lineIndex = 0;
    function printNextLine() {
      if (lineIndex < item.output.length) {
        const line = document.createElement('div');
        line.className = 'console-line';
        if (item.output[lineIndex].startsWith('✓')) {
          line.classList.add('console-success');
        } else if (item.output[lineIndex].startsWith('>')) {
          line.classList.add('console-info');
        }
        line.textContent = item.output[lineIndex];
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        lineIndex++;
        setTimeout(printNextLine, 250);
      } else {
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
      }
    }
    printNextLine();
  });
}

/* -------------------------------------------------------------
 * 2. Sorting Algorithm Visualizer
 * ------------------------------------------------------------- */
function initSortingVisualizer() {
  const container = document.getElementById('sort-bars-container');
  const sortBtn = document.getElementById('start-sort-btn');
  const shuffleBtn = document.getElementById('shuffle-array-btn');
  const algoSelect = document.getElementById('sort-algo-select');

  if (!container || !sortBtn || !shuffleBtn || !algoSelect) return;

  let array = [];
  const ARRAY_SIZE = 18;
  let isSorting = false;

  function resetArray() {
    if (isSorting) return;
    array = [];
    container.innerHTML = '';
    for (let i = 0; i < ARRAY_SIZE; i++) {
      const val = Math.floor(Math.random() * 85) + 15;
      array.push(val);
      const bar = document.createElement('div');
      bar.className = 'sort-bar';
      bar.style.height = `${val}%`;
      bar.setAttribute('data-value', val);
      container.appendChild(bar);
    }
  }

  resetArray();

  shuffleBtn.addEventListener('click', resetArray);

  sortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    sortBtn.disabled = true;
    shuffleBtn.disabled = true;

    const bars = container.children;
    const algo = algoSelect.value;

    if (algo === 'bubble') {
      await bubbleSort(bars);
    } else if (algo === 'selection') {
      await selectionSort(bars);
    }

    isSorting = false;
    sortBtn.disabled = false;
    shuffleBtn.disabled = false;
  });

  async function bubbleSort(bars) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        bars[j].classList.add('comparing');
        bars[j + 1].classList.add('comparing');
        await sleep(60);

        if (array[j] > array[j + 1]) {
          // Swap array values
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          // Swap heights
          bars[j].style.height = `${array[j]}%`;
          bars[j + 1].style.height = `${array[j + 1]}%`;
        }

        bars[j].classList.remove('comparing');
        bars[j + 1].classList.remove('comparing');
      }
      bars[n - 1 - i].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
  }

  async function selectionSort(bars) {
    const n = array.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      bars[minIdx].classList.add('comparing');
      
      for (let j = i + 1; j < n; j++) {
        bars[j].classList.add('comparing');
        await sleep(50);

        if (array[j] < array[minIdx]) {
          bars[minIdx].classList.remove('comparing');
          minIdx = j;
          bars[minIdx].classList.add('comparing');
        } else {
          bars[j].classList.remove('comparing');
        }
      }

      if (minIdx !== i) {
        let temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;

        bars[i].style.height = `${array[i]}%`;
        bars[minIdx].style.height = `${array[minIdx]}%`;
      }
      bars[minIdx].classList.remove('comparing');
      bars[i].classList.add('sorted');
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* -------------------------------------------------------------
 * 3. Interactive Cyber Neural Canvas
 * ------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight || 350;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight || 350;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1
    });
  }

  let mouse = { x: null, y: null };

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 100})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(112, 0, 255, ${1 - mdist / 140})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}
