export const SPREAD = 15;

export const CameraType = {
  OrthographicCamera: 'OrthographicCamera',
  PerspectiveCamera: 'PerspectiveCamera',
} as const;

export const LightType = {
  AmbientLight: 'AmbientLight',
  DirectionalLight: 'DirectionalLight',
  HemisphereLight: 'HemisphereLight',
  PointLight: 'PointLight',
  RectAreaLight: 'RectAreaLight',
  SpotLight: 'SpotLight',
} as const;
