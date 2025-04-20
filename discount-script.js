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
    { color: "#FFBC03", text: "#333", label: "Sweets" },
    { color: "#FF5A10", text: "#333", label: "You lose" },
  ]);
  
  const wheel2 = new WheelSpinner("#wheel2", "#spin2", [
    { color: "#00CCFF", text: "#fff", label: "Gold" },
    { color: "#FF0099", text: "#fff", label: "Nothing" },
    { color: "#33FF66", text: "#000", label: "Silver" },
  ]);
  