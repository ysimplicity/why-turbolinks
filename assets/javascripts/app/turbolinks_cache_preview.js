export const ATTRIBUTE_NAME = 'data-turbolinks-preview';

export default function isATurbolinksCachePreview() {
  return document.documentElement.hasAttribute(ATTRIBUTE_NAME);
}
