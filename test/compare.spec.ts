import { test, expect } from "@playwright/test";

test.describe("MapLibre GL Compare", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/test-page.html");
    await page.waitForLoadState("networkidle");
  });

  test("Compare", async ({ page }) => {
    const result = await page.evaluate(() => {
      const a = new window.maplibregl.Map({
        container: document.createElement("div"),
        style: "https://demotiles.maplibre.org/style.json",
      });

      const b = new window.maplibregl.Map({
        container: document.createElement("div"),
        style: "https://demotiles.maplibre.org/style.json",
      });

      // insert the container's into the document so compare.setSlider test works
      document.body.appendChild(a.getContainer());
      document.body.appendChild(b.getContainer());

      const container = document.createElement("div");

      const compare = new (window.maplibregl as any).Compare(a, b, container);

      const mapAClipped = !!a.getContainer().style.clip;
      const mapBClipped = !!b.getContainer().style.clip;

      b.jumpTo({
        bearing: 20,
        center: { lat: 16, lng: -155 },
        pitch: 20,
        zoom: 3,
      });

      const zoomSynced = a.getZoom() === 3;
      const pitchSynced = a.getPitch() === 20;
      const bearingSynced = a.getBearing() === 20;
      const lngSynced = a.getCenter().lng === -155;
      const latSynced = a.getCenter().lat === 16;

      compare.setSlider(20);
      const sliderMoved = compare.currentPosition === 20;

      compare.remove();
      const mapANoLongerClipped = !a.getContainer().style.clip;
      const mapBNoLongerClipped = !b.getContainer().style.clip;

      b.jumpTo({
        bearing: 10,
        center: { lat: 26, lng: -105 },
        pitch: 30,
        zoom: 5,
      });

      const zoomNotSynced = a.getZoom() === 3;
      const pitchNotSynced = a.getPitch() === 20;
      const bearingNotSynced = a.getBearing() === 20;
      const lngNotSynced = a.getCenter().lng === -155;
      const latNotSynced = a.getCenter().lat === 16;

      return {
        mapAClipped,
        mapBClipped,
        zoomSynced,
        pitchSynced,
        bearingSynced,
        lngSynced,
        latSynced,
        sliderMoved,
        mapANoLongerClipped,
        mapBNoLongerClipped,
        zoomNotSynced,
        pitchNotSynced,
        bearingNotSynced,
        lngNotSynced,
        latNotSynced,
      };
    });

    // Assert all test results
    expect(result.mapAClipped).toBe(true);
    expect(result.mapBClipped).toBe(true);
    expect(result.zoomSynced).toBe(true);
    expect(result.pitchSynced).toBe(true);
    expect(result.bearingSynced).toBe(true);
    expect(result.lngSynced).toBe(true);
    expect(result.latSynced).toBe(true);
    expect(result.sliderMoved).toBe(true);
    expect(result.mapANoLongerClipped).toBe(true);
    expect(result.mapBNoLongerClipped).toBe(true);
    expect(result.zoomNotSynced).toBe(true);
    expect(result.pitchNotSynced).toBe(true);
    expect(result.bearingNotSynced).toBe(true);
    expect(result.lngNotSynced).toBe(true);
    expect(result.latNotSynced).toBe(true);
  });
});
