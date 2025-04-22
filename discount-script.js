class WheelSpinner {
  constructor(container, sectors) {
    this.container = container;
    this.canvas = container.querySelector(".wheel-canvas");
    this.button = container.querySelector(".spin-button");

    this.ctx = this.canvas.getContext("2d");
    this.dia = this.ctx.canvas.width;
    this.rad = this.dia / 2;
    this.sectors = sectors;
    this.tot = sectors.length;
    this.arc = (2 * Math.PI) / this.tot;

    this.ang = 0;
    this.angVel = 0;
    this.spinClicked = false;
    this.friction = 0.991;

    this.PI = Math.PI;
    this.TAU = 2 * this.PI;

    this.init();
  }

  rand(m, M) {
    return Math.random() * (M - m) + m;
  }

  getIndex() {
    return Math.floor(this.tot - (this.ang / this.TAU) * this.tot) % this.tot;
  }

  drawSector(sector, i) {
    const ang = this.arc * i;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color;
    this.ctx.moveTo(this.rad, this.rad);
    this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc);
    this.ctx.lineTo(this.rad, this.rad);
    this.ctx.fill();

    this.ctx.translate(this.rad, this.rad);
    this.ctx.rotate(ang + this.arc / 2);
    this.ctx.textAlign = "right";
    this.ctx.fillStyle = sector.text;
    this.ctx.font = "bold 20px 'Lato', sans-serif";
    this.ctx.fillText(sector.label, this.rad - 10, 10);
    this.ctx.restore();
  }

  rotate() {
    const sector = this.sectors[this.getIndex()];
    this.canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`;
  
    // Always show correct initial color and label when loaded
    if (this.angVel || !this.spinClicked) {
      this.button.textContent = sector.label;
      this.button.style.background = sector.color;
      this.button.style.color = sector.text;
    }
  }
  
  

  frame() {
    if (!this.angVel && this.spinClicked) {
      const finalSector = this.sectors[this.getIndex()];
      this.spinClicked = false;

      this.canvas.dispatchEvent(
        new CustomEvent("spinEnd", {
          detail: finalSector,
        })
      );
      return;
    }

    this.angVel *= this.friction;
    if (this.angVel < 0.002) this.angVel = 0;
    this.ang += this.angVel;
    this.ang %= this.TAU;
    this.rotate();
  }

  engine() {
    this.frame();
    requestAnimationFrame(() => this.engine());
  }

  init() {
    this.sectors.forEach((s, i) => this.drawSector(s, i));
    this.rotate();
    this.engine();
    this.button.addEventListener("click", () => {
      if (!this.angVel) this.angVel = this.rand(0.25, 0.45);
      this.spinClicked = true;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sectorPresets = {
    wheel1: [
      { color: "#FFBC03", text: "#333", label: "350" },
      { color: "#FF5A10", text: "#333", label: "400" },
      { color: "#FFBC03", text: "#333", label: "450" },
      { color: "#FF5A10", text: "#333", label: "500" },
      { color: "#FFBC03", text: "#333", label: "550" },
      { color: "#FF5A10", text: "#333", label: "600" },
      { color: "#FFBC03", text: "#333", label: "650" },
      { color: "#FF5A10", text: "#333", label: "700" },
      { color: "#FFBC03", text: "#333", label: "750" },
      { color: "#FF5A10", text: "#333", label: "800" },
    ],
    wheel2: [
      { color: "#00CCFF", text: "#fff", label: "0" },
      { color: "#FF0099", text: "#fff", label: "2" },
      { color: "#33FF66", text: "#000", label: "5" },
      { color: "#00CCFF", text: "#fff", label: "10" },
      { color: "#FF0099", text: "#fff", label: "12" },
      { color: "#33FF66", text: "#000", label: "18" },
    ],
  };

  const containers = document.querySelectorAll(".wheel-container");
  const wheels = [];
  const wheelDoneStates = [];

  let currentWheelId = null;

  containers.forEach((container, index) => {
    const id = container.getAttribute("id") || `wheel${index + 1}`;
    currentWheelId = id; // store it for later use

    const canvas = container.querySelector("canvas");
    const sectors = sectorPresets[id] || sectorPresets["wheel1"]; // fallback

    const wheel = new WheelSpinner(container, sectors);
    wheels.push(wheel);
    wheelDoneStates.push(false);

    canvas.addEventListener("spinEnd", () => {
      wheelDoneStates[index] = true;

      if (wheelDoneStates.every(Boolean)) {
        document.querySelector(".cost-gst").disabled = false;
      }
    });
  });

  const costGstBtn = document.querySelector(".cost-gst");
  if (costGstBtn) costGstBtn.disabled = true;

  const gstPopup = document.getElementById("gstPopup");
const gstResultContent = document.getElementById("gstResultContent");
const closeGstPopup = document.getElementById("closeGstPopup");

costGstBtn?.addEventListener("click", () => {
  const values = wheels.map((w) =>
    parseFloat(w.sectors[w.getIndex()].label)
  );

  const cost = values[0] || 0;
  const gst = 12;
  const gstAmount = (cost * gst) / 100;
  const total = cost + gstAmount;
  localStorage.setItem("originalTotal", total.toFixed(2));


  // Inject result into popup
  gstResultContent.innerHTML = `
  <div class="calc-row"><span>Your Cost:</span><strong>₹${cost}</strong></div>
  <div class="calc-row"><span>Your GST (${gst}%):</span><strong>₹${gstAmount.toFixed(2)}</strong></div>
  <div class="calc-row total"><span>Total:</span><strong>₹${total.toFixed(2)}</strong></div>
`;


  gstPopup.classList.add("show");
  costGstBtn.disabled = true;
  wheelDoneStates.fill(false);
});


  // Popup modal handling
  // Close GST popup
  closeGstPopup?.addEventListener("click", () => {
    gstPopup.classList.remove("show");
  });
  window.addEventListener("click", (e) => {
    if (e.target === gstPopup) {
      gstPopup.classList.remove("show");
    }
  });  

});
