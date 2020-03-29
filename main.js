/* global browser */

const youtubeImageDomainPattern = 'https://i.ytimg.com/*';
const youtubeImageIdRegex = /https?:\/\/i.ytimg.com\/vi(?:_webp)?\/?([^/s]+).*/;

const getRandomId = () => {
  return Math.floor(Math.random() * Math.floor(1000000));
};

const getImageId = url => {
  const foundId = url.match(youtubeImageIdRegex);
  return foundId ? foundId[1] : getRandomId();
};

const redirectImage = requestDetails => {
  const imageId = getImageId(requestDetails.url);
  return {
    redirectUrl: `https://picsum.photos/seed/${imageId}/720/404`
  };
};

browser.webRequest.onBeforeRequest.addListener(
  redirectImage,
  {
    urls: [youtubeImageDomainPattern],
    types: ['image']
  },
  ['blocking']
);

console.log('Extension Loaded');
