export class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (canvas: HTMLCanvasElement, currentScale: number, x: number, y: number) => [
      x * currentScale,
      canvas.height - y * currentScale,
    ];

    element.addEventListener("pointerdown", (event) => {
      this.active = true;
      this.pointers.set(
        event.pointerId,
        map(element, this.getScale(), event.clientX, event.clientY),
      );
    });

    const clearPointer = (event: PointerEvent) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    };

    element.addEventListener("pointerup", clearPointer);
    element.addEventListener("pointerleave", clearPointer);

    element.addEventListener("pointermove", (event) => {
      if (!this.active) {
        return;
      }
      this.lastCoords = [event.clientX, event.clientY];
      this.pointers.set(
        event.pointerId,
        map(element, this.getScale(), event.clientX, event.clientY),
      );
      this.moves = [this.moves[0] + event.movementX, this.moves[1] + event.movementY];
    });
  }

  getScale() {
    return this.scale;
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
  }

  get first() {
    return this.pointers.values().next().value ?? this.lastCoords;
  }
}
