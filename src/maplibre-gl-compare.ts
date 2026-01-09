import syncMove from "@mapbox/mapbox-gl-sync-move";
import maplibregl from "maplibre-gl";

type CompareOptions = {
  orientation: "horizontal" | "vertical";
  mousemove: boolean;
};

const defaultCompareOptions: CompareOptions = {
  orientation: "vertical",
  mousemove: false,
};

/**
 * @extends maplibre.Evented
 * @example
 * import { Compare } from "@maplibre/maplibre-gl-compare"
 * const compare = new Compare(beforeMap, afterMap, '#wrapper', {
 *   orientation: 'vertical',
 *   mousemove: true
 * });
 * @see [Swipe between maps](https://maplibre.org/maplibre-gl-js-docs/plugins/)
 */
class Compare extends maplibregl.Evented {
  private mapA: maplibregl.Map;
  private mapB: maplibregl.Map;
  private horizontal: boolean;
  private swiper: HTMLDivElement;
  private controlContainer: HTMLDivElement;
  private bounds: DOMRect;
  private clearSync: () => void;
  private onResize: () => void;
  public currentPosition = 0;
  public options: CompareOptions;

  /**
   * @param {Object} a The first MapLibre GL Map
   * @param {Object} b The second MapLibre GL Map
   * @param {string|HTMLElement} container An HTML Element, or an element selector string for the compare container. It should be a wrapper around the two map Elements.
   * @param {Object} options
   * @param {string} [options.orientation=vertical] The orientation of the compare slider. `vertical` creates a vertical slider bar to compare one map on the left (map A) with another map on the right (map B). `horizontal` creates a horizontal slider bar to compare on mop on the top (map A) and another map on the bottom (map B).
   * @param {boolean} [options.mousemove=false] If `true` the compare slider will move with the cursor, otherwise the slider will need to be dragged to move.
   */
  constructor(
    a: maplibregl.Map,
    b: maplibregl.Map,
    container: string | Element,
    options: Partial<CompareOptions> = {}
  ) {
    super();

    this.options = {
      ...defaultCompareOptions,
      ...options,
    };

    this.mapA = a;
    this.mapB = b;
    this.horizontal = this.options.orientation === "horizontal";
    this.swiper = document.createElement("div");
    this.swiper.className = this.horizontal
      ? "compare-swiper-horizontal"
      : "compare-swiper-vertical";

    this.controlContainer = document.createElement("div");
    this.controlContainer.className = this.horizontal
      ? "maplibregl-compare maplibregl-compare-horizontal"
      : "maplibregl-compare";
    this.controlContainer.appendChild(this.swiper);

    if (typeof container === "string" && document.body.querySelectorAll) {
      // get container with a selector
      const appendTarget = document.body.querySelectorAll(container)[0];
      if (!appendTarget) {
        throw new Error(
          "Cannot find element with specified container selector."
        );
      }
      appendTarget.appendChild(this.controlContainer);
    } else if (container instanceof Element && container.appendChild) {
      // get container directly
      container.appendChild(this.controlContainer);
    } else {
      throw new Error(
        "Invalid container specified. Must be CSS selector or HTML element."
      );
    }

    this.bounds = b.getContainer().getBoundingClientRect();
    const swiperPosition =
      (this.horizontal ? this.bounds.height : this.bounds.width) / 2;

    this._setPosition(swiperPosition);

    this.clearSync = syncMove(a, b);
    this.onResize = () => {
      this.bounds = b.getContainer().getBoundingClientRect();
      if (this.currentPosition) this._setPosition(this.currentPosition);
    };

    b.on("resize", this.onResize);

    if (this.options && this.options.mousemove) {
      a.getContainer().addEventListener("mousemove", this._onMove);
      b.getContainer().addEventListener("mousemove", this._onMove);
    }

    this.swiper.addEventListener("mousedown", this._onDown);
    this.swiper.addEventListener("touchstart", this._onDown);
  }

  _setPointerEvents(v: "auto" | "none") {
    this.controlContainer.style.pointerEvents = v;
    this.swiper.style.pointerEvents = v;
  }

  _onDown = (e: MouseEvent | TouchEvent) => {
    if ((e as TouchEvent).touches) {
      document.addEventListener("touchmove", this._onMove);
      document.addEventListener("touchend", this._onTouchEnd);
    } else {
      document.addEventListener("mousemove", this._onMove);
      document.addEventListener("mouseup", this._onMouseUp);
    }
  };

  _setPosition(x: number) {
    x = Math.min(x, this.horizontal ? this.bounds.height : this.bounds.width);
    const pos = this.horizontal
      ? "translate(0, " + x + "px)"
      : "translate(" + x + "px, 0)";
    this.controlContainer.style.transform = pos;
    this.controlContainer.style.webkitTransform = pos;
    const clipA = this.horizontal
      ? "rect(0, 999em, " + x + "px, 0)"
      : "rect(0, " + x + "px, " + this.bounds.height + "px, 0)";
    const clipB = this.horizontal
      ? "rect(" + x + "px, 999em, " + this.bounds.height + "px,0)"
      : "rect(0, 999em, " + this.bounds.height + "px," + x + "px)";

    this.mapA.getContainer().style.clip = clipA;
    this.mapB.getContainer().style.clip = clipB;
    this.currentPosition = x;
  }

  _onMove = (e: MouseEvent | TouchEvent) => {
    if (this.options && this.options.mousemove) {
      this._setPointerEvents((e as TouchEvent).touches ? "auto" : "none");
    }

    this.horizontal
      ? this._setPosition(this._getY(e))
      : this._setPosition(this._getX(e));
  };

  _onMouseUp = () => {
    document.removeEventListener("mousemove", this._onMove);
    document.removeEventListener("mouseup", this._onMouseUp);
    this.fire("slideend", { currentPosition: this.currentPosition });
  };

  _onTouchEnd = () => {
    document.removeEventListener("touchmove", this._onMove);
    document.removeEventListener("touchend", this._onTouchEnd);
    this.fire("slideend", { currentPosition: this.currentPosition });
  };

  _getX(anyEvent: MouseEvent | TouchEvent) {
    const e = (
      (anyEvent as TouchEvent).touches
        ? (anyEvent as TouchEvent).touches[0]
        : anyEvent
    ) as MouseEvent | Touch;
    let x = e.clientX - this.bounds.left;
    if (x < 0) {
      x = 0;
    }
    if (x > this.bounds.width) {
      x = this.bounds.width;
    }
    return x;
  }

  _getY(anyEvent: MouseEvent | TouchEvent) {
    const e = (
      (anyEvent as TouchEvent).touches
        ? (anyEvent as TouchEvent).touches[0]
        : anyEvent
    ) as MouseEvent | Touch;
    let y = e.clientY - this.bounds.top;
    if (y < 0) {
      y = 0;
    }
    if (y > this.bounds.height) {
      y = this.bounds.height;
    }
    return y;
  }

  /**
   * Set the position of the slider.
   *
   * @param {number} x Slider position in pixels from left/top.
   */
  setSlider(x: number) {
    this._setPosition(x);
  }

  remove() {
    this.clearSync();
    this.mapB.off("resize", this.onResize);
    const aContainer = this.mapA.getContainer();

    if (aContainer) {
      aContainer.style.clip = "";
      aContainer.removeEventListener("mousemove", this._onMove);
    }

    const bContainer = this.mapB.getContainer();

    if (bContainer) {
      bContainer.style.clip = "";
      bContainer.removeEventListener("mousemove", this._onMove);
    }

    this.swiper.removeEventListener("mousedown", this._onDown);
    this.swiper.removeEventListener("touchstart", this._onDown);
    this.controlContainer.remove();
  }
}

export { Compare };

if (typeof window !== "undefined" && window.maplibregl) {
  // @ts-ignore
  window.maplibregl.Compare = Compare;
}
