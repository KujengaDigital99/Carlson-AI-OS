'use strict';
const FONTS = 'C:\\laragon\\www\\kdr\\public\\fonts';

module.exports = {
  name:           'DBIA',
  brandColor:     '#00531E',
  overlayColor:   'rgba(0, 60, 22, 0.74)',
  accentColor:    '#AF8120',
  fontFamily:     'Raleway',
  defaultStyle:   'editorial',
  headlineWeight: 700,
  accentStyle:    'line',
  fonts: [
    { path: `${FONTS}\\Raleway-Regular.ttf`,   family: 'Raleway', weight: '400' },
    { path: `${FONTS}\\Raleway-SemiBold.ttf`,  family: 'Raleway', weight: '600' },
    { path: `${FONTS}\\Raleway-Bold.ttf`,      family: 'Raleway', weight: '700' },
    { path: `${FONTS}\\Raleway-ExtraBold.ttf`, family: 'Raleway', weight: '800' },
    { path: `${FONTS}\\Raleway-Black.ttf`,     family: 'Raleway', weight: '900' },
  ],
  logo: '',
};
