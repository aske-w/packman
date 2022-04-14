export const pathKey = {
  PLAYGROUND: 'playground',
  GAME: 'game',
  STRIP: 'strip',
  BIN: 'bin',
  ONLINE_STRIP: 'online-strip',
  ACHIEVEMENTS: 'achievements',
  ABOUT: 'about',
  DESIGN_STRIP: "design-strip"
};

export const pathName = {
  STRIP_PLAYGROUND: `/playground/${pathKey.STRIP}`,
  BIN_PLAYGROUND: `/playground/${pathKey.BIN}`,
  GAME: '/game',
  STRIP_GAME: `/game/${pathKey.STRIP}`,
  BIN_GAME: `/game/${pathKey.BIN}`,
  ONLINE_STRIP_GAME: `/game/${pathKey.ONLINE_STRIP}`,
  ACHIEVEMENTS: '/achievements',
  ABOUT: `${pathKey.ABOUT}`,
  DESIGN_STRIP_GAME: `/game/${pathKey.DESIGN_STRIP}`
};
