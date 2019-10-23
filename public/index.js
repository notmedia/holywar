const MAP_SIZE = 6;
const FIELD_SIZE_PX = 60;
const PLAYER_STEP_PX = 1;
const PLAYER_SIZE_PX = 40;
// const CIRCLE_SIZE_PX = 15

const data = [
  {
    row: 5,
    column: 1,
  },
  {
    row: 3,
    column: 0,
  },
  {
    row: 2,
    column: 1,
  },
  {
    row: 4,
    column: 5,
  },
  {
    row: 3,
    column: 2,
  },
]

const app = new PIXI.Application({
  transparent: true,
  width: MAP_SIZE * FIELD_SIZE_PX * 2,
  height: MAP_SIZE * FIELD_SIZE_PX * 2,
});

document.body.appendChild(app.view);

const mapContainer = getMap(MAP_SIZE, 0, 0);
const player = getPlayer(mapContainer, 0, 0);

app.stage.addChild(mapContainer.map);
mapContainer.map.addChild(player);

animate(mapContainer);

function animate(map) {
  const position = getNextPlayerXY(map, player.x - FIELD_SIZE_PX / 2, player.y - FIELD_SIZE_PX / 2);
  if (position) {
    player.x = position.x + FIELD_SIZE_PX / 2;
    player.y = position.y + FIELD_SIZE_PX / 2;

    app.render(player);
    requestAnimationFrame(() => animate(map));
  }
}

function getNextPlayerXY(map, x, y) {
  const step = Array.isArray(data) ? data[0] : data;

  if (step) {
    const position = getFieldXY(map, step.row, step.column);
    if (position) {
      if (x < position.x) {
        x += PLAYER_STEP_PX;
      } else {
        x -= PLAYER_STEP_PX;
      }

      if (y < position.y) {
        y += PLAYER_STEP_PX;
      } else {
        y -= PLAYER_STEP_PX;
      }

      if (x === position.x && y === position.y) {
        data.shift();
      }

      return { x, y };
    }
  }
}

function getFieldXY(map, row, column) {
  const key = map.fieldsKeys.find((item) => item.row === row && item.column === column);
  return map.fields.get(key);
}

function getPlayer(map, startRow, startColumn) {
  const ghost = PIXI.Sprite.from('./images/ghost.png');
  const position = getFieldXY(map, startRow, startColumn);

  ghost.width = PLAYER_SIZE_PX;
  ghost.height = PLAYER_SIZE_PX;
  ghost.x = position.x;
  ghost.y = position.y;

  ghost.angle = 45;

  ghost.anchor.set(0.5);

  return ghost;

  // const graphics = new PIXI.Graphics();
  // const position = getFieldXY(map, startRow, startColumn);

  // graphics.lineStyle(2, 0xFFFFFF, 2);
  // graphics.beginFill(0xDE3249, 1);
  // graphics.drawCircle(position.x, position.y, CIRCLE_SIZE_PX);
  // graphics.endFill();

  // return graphics;
}

function getMap(size, startX, startY) {
  const fields = new Map();
  const fieldsKeys = [];
  const map = new PIXI.Container();
  const graphics = new PIXI.Graphics();

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const x = startX + row * FIELD_SIZE_PX;
      const y = startY + column * FIELD_SIZE_PX;
      const key = { row, column };
      fieldsKeys.push(key);
      fields.set(key, { x, y })

      graphics.lineStyle(2, 0xFFFFFF, 1);

      let color = 0x2F4D6A;
      if (column < MAP_SIZE / 3 || row > 1 && column < MAP_SIZE * 0.75 - 1) {
        color = 0x5C83A2;
      }

      graphics.beginFill(color);
      graphics.drawRect(x, y, FIELD_SIZE_PX, FIELD_SIZE_PX);
      graphics.endFill();
    }
  }

  map.addChild(graphics);

  map.angle = -45;
  map.y = map.height / 2 + 100;
  map.x = map.width / 2;

  return {
    map,
    fields,
    fieldsKeys,
  }
}
