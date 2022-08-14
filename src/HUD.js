export const ICON_BOX_SIZE = 60;
export const ICON_BOX_MARGIN = 10;

const INFOBOX_ICON_ROW_MAX = 8;

const INFOBOX_PADDING = 20;

const ACTIONBOX_ROW_MAX = 3;

class HUD {
  constructor() {
    this.selected = [];
  }

  tick({ drawer, mouseEvents, player }) {
    this.selected = player.selected;
    this.resources = player.resources;
    this.drawerWidth = drawer.width;
    this.drawerHeight = drawer.height;
    this.actionboxX = this.drawerWidth - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    this.actionboxY = this.drawerHeight - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    this.infoboxX = HUD.HUD_HEIGHT + HUD.HUD_PADDING * 2;
    this.infoboxY = drawer.height - HUD.HUD_HEIGHT - HUD.HUD_PADDING;
    this.actionBoxes = this.getActionBoxes({ player });

    if (
      this.selected.length &&
      (mouseEvents.clickTarget[0] || mouseEvents.clickTarget[1])
    ) {
      this.clickAction({ mouseEvents, player });
    }
  }

  clickAction({ mouseEvents, player }) {
    let [mouseX, mouseY] = mouseEvents.clickTarget;
    if (mouseX || mouseY) {
      this.actionBoxes.forEach(({ x, y, width, height, action }) => {
        if (
          mouseX >= x &&
          mouseX < x + width &&
          mouseY >= y &&
          mouseY < y + height
        ) {
          action.execute({ player });
        }
      });
    }
  }

  getActionBoxes({ player }) {
    if (this.selected.length === 0) return [];
    const [entity] = this.selected;
    return entity.actions({ player }).map((action, i) => {
      const x =
        this.actionboxX +
        INFOBOX_PADDING +
        ICON_BOX_SIZE * (i % ACTIONBOX_ROW_MAX) +
        ICON_BOX_MARGIN * ((i % ACTIONBOX_ROW_MAX) - 1);
      const y =
        this.infoboxY +
        INFOBOX_PADDING +
        ICON_BOX_SIZE * Math.floor(i / ACTIONBOX_ROW_MAX) +
        ICON_BOX_MARGIN * (Math.floor(i / ACTIONBOX_ROW_MAX) - 1);
      return {
        x,
        y,
        width: ICON_BOX_SIZE,
        height: ICON_BOX_SIZE,
        icon: action.drawIcon,
        action,
      };
    });
  }

  draw(drawer) {
    // resources
    const RESOURCES_X = drawer.width - 140;
    const RESOURCES_Y = 15;
    drawer.rect({
      adjusted: false,
      fillColor: "#69c",
      rect: [RESOURCES_X, RESOURCES_Y + 2, 20, 20],
    });
    drawer.text({
      text: `${this.resources}`,
      x: RESOURCES_X + 30,
      y: RESOURCES_Y,
      size: 5,
    });

    // hud background
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
    drawer.rect({
      adjusted: false,
      fillColor: "#111",
      rect: [
        this.infoboxX,
        this.infoboxY,
        drawer.width - HUD.HUD_HEIGHT * 2 - HUD.HUD_PADDING * 4,
        HUD.HUD_HEIGHT,
      ],
    });

    if (this.selected.length === 1) {
      // one selected
      const [entity] = this.selected;
      drawer.text({
        text: entity.name,
        x: this.infoboxX + INFOBOX_PADDING,
        y: this.infoboxY + INFOBOX_PADDING,
        size: 5,
      });

      entity.hudDraw(
        drawer,
        this.infoboxX + INFOBOX_PADDING,
        this.infoboxY + INFOBOX_PADDING + 60
      );
    } else if (this.selected.length > 1) {
      // multiple selected
      const units = this.selected.slice(0, INFOBOX_ICON_ROW_MAX * 3);
      units.forEach((unit, i) => {
        const x =
          this.infoboxX +
          INFOBOX_PADDING +
          ICON_BOX_SIZE * (i % INFOBOX_ICON_ROW_MAX) +
          ICON_BOX_MARGIN * ((i % INFOBOX_ICON_ROW_MAX) - 1);
        const y =
          this.infoboxY +
          INFOBOX_PADDING +
          ICON_BOX_SIZE * Math.floor(i / INFOBOX_ICON_ROW_MAX) +
          ICON_BOX_MARGIN * (Math.floor(i / INFOBOX_ICON_ROW_MAX) - 1);
        drawer.rect({
          adjusted: false,
          strokeColor: "#0f0",
          rect: [x, y, ICON_BOX_SIZE, ICON_BOX_SIZE],
        });
        drawer.rect({
          adjusted: false,
          strokeColor: "#0f0",
          rect: [x, y, ICON_BOX_SIZE, ICON_BOX_SIZE],
        });
        unit.hudDrawIcon(drawer, x, y);
      });
    }

    // actions
    drawer.rect({
      adjusted: false,
      fillColor: "#111",
      rect: [this.actionboxX, this.actionboxY, HUD.HUD_HEIGHT, HUD.HUD_HEIGHT],
    });
    if (this.selected.length === 1) {
      this.actionBoxes.forEach(({ x, y, width, height, icon, action }) => {
        drawer.rect({
          adjusted: false,
          strokeColor: action.actionable()
            ? "#0f0"
            : "rgba(100, 100, 100, 0.7)",
          rect: [x, y, width, height],
        });
        icon(drawer, x, y);
        if (!action.actionable()) {
          drawer.rect({
            adjusted: false,
            fillColor: "rgba(100, 100, 100, 0.7)",
            rect: [x, y, width, height],
          });
        }
      });
    }
  }
}

HUD.HUD_HEIGHT = 250;
HUD.HUD_PADDING = 10;

export default HUD;
