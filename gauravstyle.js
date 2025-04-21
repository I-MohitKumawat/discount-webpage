let spunWheels = { 1: false, 2: false };
let cost = 0;
let discount = 0;

function drawWheel(canvasId, options) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const colors = ["#28a745", "#dc3545", "#f8c700", "#007bff", "#6c757d", "#28a745"];
  const radius = canvas.width / 2;
  const angle = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < options.length; i++) {
    const startAngle = i * angle;
    const endAngle = startAngle + angle;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "16px Poppins";
    ctx.fillText(options[i], radius - 10, 5);
    ctx.restore();
  }
}

function spinWheel(canvasId, wheelNumber) {
  if (spunWheels[wheelNumber]) return; // Prevent re-spinning the same wheel

  spunWheels[wheelNumber] = true;

  const canvas = document.getElementById(canvasId);
  let rotation = 0;
  const spins = Math.floor(Math.random() * 3) + 3;
  const totalRotation = 360 * spins + (Math.random() * 360);
  const duration = 2000;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentRotation = rotation + ease * totalRotation;

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const normalized = currentRotation % 360;
      if (wheelNumber === 1) {
        const wheel1Outcomes = [350, 450, 550, 650, 750];
        const outcomeIndex = Math.floor(normalized / 72);
        cost = wheel1Outcomes[outcomeIndex];
        document.getElementById("result1").textContent = cost;
      } else if (wheelNumber === 2) {
        const wheel2Outcomes = ["0", "2%", "5%", "10%", "12%", "18%"];
        const outcomeIndex = Math.floor(normalized / 60);
        discount = wheel2Outcomes[outcomeIndex];
        const gstStatus = discount === "0" ? "(No GST)" : "(GST)";
        document.getElementById("result2").textContent = `${discount} ${gstStatus}`;
      }

      document.getElementById(`spinBtn${wheelNumber}`).disabled = true;
    }
  }

  requestAnimationFrame(animate);
}

function handleCostGST() {
  const resultTable = document.getElementById("resultTable");
  resultTable.style.display = "block";
}

window.onload = function () {
  drawWheel("wheel1", [350, 450, 550, 650, 750]);
  drawWheel("wheel2", ["0", "2%", "5%", "10%", "12%", "18%"]);
};
