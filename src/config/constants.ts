export const TOTAL_LANES = 30;
export const VISIBLE_LANES = 8;
export const SIDEWALK_W = 100;
export const LANE_W = 100;
export const VIEWPORT_W = SIDEWALK_W + VISIBLE_LANES * LANE_W;
export const GAME_H = 400;
export const LUKE_R = 35;
export const LANE_Y = GAME_H / 2 + 30;
export const FINISH_X = SIDEWALK_W + TOTAL_LANES * LANE_W;

export const JUMP_SPEED = 0.1;
export const JUMP_HEIGHT = 50;
export const JUMP_SCALE_BOOST = 0.15;
export const CAMERA_LERP = 0.12;
export const CAMERA_SCROLL_START = 2;

export const MAX_TRAFFIC = 5;
export const TRAFFIC_SPAWN_INTERVAL = 50;
export const TRAFFIC_MIN_SPEED = 1.5;
export const TRAFFIC_MAX_SPEED = 3.5;

export const DEFAULT_BALANCE = 1000;
export const BET_OPTIONS = [0.5, 1, 2, 7] as const;

export const ROAD_COLOR = 0x555555;
export const SIDEWALK_COLOR = 0x7a7a7a;
export const BRICK_COLOR = 0x6a6a6a;
export const DIVIDER_COLOR = 0xffffff;
export const MANHOLE_FILL = 0x4e4e4e;
export const MANHOLE_STROKE = 0x666666;
export const MANHOLE_GRID = 0x5a5a5a;
export const BARRIER_YELLOW = 0xf1c40f;
export const BARRIER_BLACK = 0x333333;
export const BARRIER_POST = 0xaaaaaa;
export const COIN_FILL = 0xffd700;
export const COIN_STROKE = 0xdaa520;
export const BADGE_BG = 0x2a3a5c;

export const CAR_COLORS = [
  0x3498db, 0xe74c3c, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22,
];
export const TRAFFIC_COLORS = [
  0xf39c12, 0x1abc9c, 0x8e44ad, 0xc0392b, 0x2980b9,
];
