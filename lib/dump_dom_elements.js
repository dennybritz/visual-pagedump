'use strict';

// The function below is executed in the browser.

module.exports = () => {
  /* eslint-disable */
  var data = [];
  for (var i = 0; i < document.all.length; i++) {
    element = document.all[i];
    clientRect = element.getBoundingClientRect();
    dataObj = {
      id: i,
      parentId: Array.prototype.indexOf.call(document.all, element.parentElement),
      html: element.outerHTML,
      location: { 
        top: clientRect.top,
        right: clientRect.right,
        bottom: clientRect.bottom,
        left: clientRect.left,
      },
      size: {
        width: clientRect.width,
        height: clientRect.height,
      }
    };
    data.push(dataObj);
  }
  return data;
  /* eslint-enable */
};
