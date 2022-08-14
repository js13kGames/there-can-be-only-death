import { humanoid } from "./Sprites";

const MULTISELECT_BOX_SIZE = 60;
const MULTISELECT_BOX_MARGIN = 10;
const MULTISELECT_ROW_MAX = 8;
const MULTISELECT_BOX_PADDING = 10;

const ACTIONBOX_ROW_MAX = 3;

class HUD {
  constructor() {
    this.selected = [];
  }

  tick({ player }) {
    this.selected = player.selected;
  }

  draw(drawer) {
    // background
    drawer.rect({
      adjusted: false,
      fillColor: "#666",
      rect: [
        0,
        drawer.height - HUD.HUD_HEIGHT - HUD.HUD_PADDING * 2,
        drawer.width,
        HUD.HUD_HEIGHT + HUD.HUD_PADDING * 2,
      ],
    });

    // infobox
    const INFOBOX_X = HUD.HUD_HEIGHT + HUD.HUD_PADDING * 2;
    const INFOBOX_Y = drawer.height - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    drawer.rect({
      adjusted: false,
      fillColor: "#111",
      rect: [
        INFOBOX_X,
        INFOBOX_Y,
        drawer.width - HUD.HUD_HEIGHT * 2 - HUD.HUD_PADDING * 4,
        HUD.HUD_HEIGHT,
      ],
    });

    const INFOBOX_PADDING = 20;
    if (this.selected.length === 1) {
      // one selected
      const [entity] = this.selected;
      drawer.text({
        text: entity.name,
        x: INFOBOX_X + INFOBOX_PADDING,
        y: INFOBOX_Y + INFOBOX_PADDING,
        size: 5,
      });

      if (entity.type === "unit") {
        const colors = {
          skin: "#0f0",
          horns: "#0f0",
          eyes: "#666",
          body: "#666",
        };
        humanoid(
          INFOBOX_X + INFOBOX_PADDING,
          INFOBOX_Y + INFOBOX_PADDING + 60,
          1,
          colors,
          { size: 12 }
        ).forEach(({ c, r }) =>
          drawer.rect({
            adjusted: false,
            fillColor: c,
            rect: r,
          })
        );
      }
    } else if (this.selected.length > 1) {
      // multiple selected
      const units = this.selected.slice(0, MULTISELECT_ROW_MAX * 3);
      units.forEach((unit, i) => {
        const x =
          INFOBOX_X +
          INFOBOX_PADDING +
          MULTISELECT_BOX_SIZE * (i % MULTISELECT_ROW_MAX) +
          MULTISELECT_BOX_MARGIN * ((i % MULTISELECT_ROW_MAX) - 1);
        const y =
          INFOBOX_Y +
          INFOBOX_PADDING +
          MULTISELECT_BOX_SIZE * Math.floor(i / MULTISELECT_ROW_MAX) +
          MULTISELECT_BOX_MARGIN * (Math.floor(i / MULTISELECT_ROW_MAX) - 1);
        drawer.rect({
          adjusted: false,
          strokeColor: "#0f0",
          rect: [x, y, MULTISELECT_BOX_SIZE, MULTISELECT_BOX_SIZE],
        });
        const colors = {
          skin: "#0f0",
          horns: "#0f0",
          eyes: "#666",
          body: "#666",
        };
        humanoid(
          x + MULTISELECT_BOX_PADDING,
          y + MULTISELECT_BOX_PADDING * 1.5,
          1,
          colors
        ).forEach(({ c, r }) =>
          drawer.rect({
            adjusted: false,
            fillColor: c,
            rect: r,
          })
        );
      });
    }

    // actions
    const ACTIONBOX_X = drawer.width - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    const ACTIONBOX_Y = drawer.height - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    drawer.rect({
      adjusted: false,
      fillColor: "#111",
      rect: [ACTIONBOX_X, ACTIONBOX_Y, HUD.HUD_HEIGHT, HUD.HUD_HEIGHT],
    });
    if (this.selected.length === 1) {
      const [entity] = this.selected;
      entity.actions().forEach((action, i) => {
        const x =
          ACTIONBOX_X +
          INFOBOX_PADDING +
          MULTISELECT_BOX_SIZE * (i % ACTIONBOX_ROW_MAX) +
          MULTISELECT_BOX_MARGIN * ((i % ACTIONBOX_ROW_MAX) - 1);
        const y =
          INFOBOX_Y +
          INFOBOX_PADDING +
          MULTISELECT_BOX_SIZE * Math.floor(i / ACTIONBOX_ROW_MAX) +
          MULTISELECT_BOX_MARGIN * (Math.floor(i / ACTIONBOX_ROW_MAX) - 1);
        drawer.rect({
          adjusted: false,
          strokeColor: "#0f0",
          rect: [x, y, MULTISELECT_BOX_SIZE, MULTISELECT_BOX_SIZE],
        });
      });
    }
  }
}

HUD.HUD_HEIGHT = 250;
HUD.HUD_PADDING = 10;

export default HUD;
