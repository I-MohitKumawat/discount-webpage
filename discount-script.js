class WheelSpinner {
    constructor(canvasSelector, buttonSelector, sectors) {
      this.sectors = sectors;
      this.tot = sectors.length;
      this.canvas = document.querySelector(canvasSelector);
      this.ctx = this.canvas.getContext("2d");
      this.dia = this.ctx.canvas.width;
      this.rad = this.dia / 2;
      this.arc = (2 * Math.PI) / this.tot;
      this.button = document.querySelector(buttonSelector);
  
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
  
      this.button.textContent = !this.angVel ? "SPIN" : sector.label;
      this.button.style.background = sector.color;
      this.button.style.color = sector.text;
    }
  
    frame() {
        if (!this.angVel && this.spinClicked) {
            const finalSector = this.sectors[this.getIndex()];
            console.log(`🎉 You won: ${finalSector.label}`);
            this.spinClicked = false;
          
            // 🆕 Fire a custom event when spin ends
            this.canvas.dispatchEvent(new CustomEvent("spinEnd", {
              detail: finalSector
            }));
          
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
  const wheel1 = new WheelSpinner("#wheel1", "#spin1", [
    { color: "#FFBC03", text: "#333", label: "350" },
    { color: "#FF5A10", text: "#333", label: "450" },
    { color: "#FFBC03", text: "#333", label: "550" },
    { color: "#FF5A10", text: "#333", label: "750" },
  ]);
  
  const wheel2 = new WheelSpinner("#wheel2", "#spin2", [
    { color: "#00CCFF", text: "#fff", label: "0" },
    { color: "#FF0099", text: "#fff", label: "2" },
    { color: "#33FF66", text: "#000", label: "5" },
    { color: "#00CCFF", text: "#fff", label: "10" },
    { color: "#FF0099", text: "#fff", label: "12" },
    { color: "#33FF66", text: "#000", label: "18" },
  ]);


  const costGstBtn = document.querySelector('.cost-gst');
  const resultDiv = document.getElementById('result');
  
  // Disable the button initially
  costGstBtn.disabled = true;
  
  // 🔧 Include only the wheels you want to track here
  const wheels = [wheel1]; // or [wheel1, wheel2], etc.
  
  const wheelDoneStates = new Array(wheels.length).fill(false);
  
  // ✅ Listen for spinEnd events only on the wheels in the array
  wheels.forEach((wheel, index) => {
    wheel.canvas.addEventListener("spinEnd", () => {
      wheelDoneStates[index] = true;
  
      // Enable button only when ALL wheels you listed are done
      if (wheelDoneStates.every(done => done)) {
        costGstBtn.disabled = false;
      }
    });
  });
  
  // 💥 Handle button click
  costGstBtn.addEventListener('click', () => {
    const values = wheels.map(w => parseFloat(w.sectors[w.getIndex()].label));
  
    const cost = values[0];        // First wheel = cost
    const gst = values[1] || 0;    // Second wheel = GST, or 0 if not provided
  
    const gstAmount = (cost * gst) / 100;
    const total = cost + gstAmount;
  
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <p>Your Cost: <strong>₹${cost}</strong></p>
      <p>Your GST (${gst}%): <strong>₹${gstAmount.toFixed(2)}</strong></p>
      <p><strong>Total: ₹${total.toFixed(2)}</strong></p>
    `;
  
    // Reset for next round
    costGstBtn.disabled = true;
    wheelDoneStates.fill(false);
  });
  


  const openBtn = document.getElementById('openPopup');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closePopup');

    openBtn.addEventListener('click', () => {
      popup.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });
  


