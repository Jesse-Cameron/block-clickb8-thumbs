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

const getRandomImageUrl = url => {
  const imageId = getImageId(url);
  return `https://picsum.photos/seed/${imageId}/720/404`;
};

const redirectImage = requestDetails => {
  const redirectUrl = getRandomImageUrl(requestDetails.url);
  return {redirectUrl};
};

const addImageListener = () => browser.webRequest.onBeforeRequest.addListener(
  redirectImage,
  {
    urls: [youtubeImageDomainPattern],
    types: ['image']
  },
  ['blocking']
);

const swapButtonIcon = enabled => {
  const filename = enabled ? 'tv_off_18dp.png' : 'tv_on_18dp.png';
  const details = {
    path: {
      16: `button/1x/${filename}`,
      38: `button/2x/${filename}`
    }
  };
  browser.browserAction.setIcon(details);
};

browser.browserAction.onClicked.addListener(() => {
  if (browser.webRequest.onBeforeRequest.hasListener(redirectImage)) {
    browser.webRequest.onBeforeRequest.removeListener(redirectImage);
    swapButtonIcon(false);
  } else {
    addImageListener();
    swapButtonIcon(true);
  }
});

addImageListener();

console.log('Extension Loaded');
