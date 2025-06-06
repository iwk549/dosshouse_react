export function mockHTMLContext(pathname = "/") {
  // mock the HTML Canvas for QR Codes
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => {
      return {
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        fillText: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        measureText: jest.fn(() => ({ width: 0 })),
        transform: jest.fn(),
        rect: jest.fn(),
        clip: jest.fn(),
        quadraticCurveTo: jest.fn(),
      };
    },
  });

  // mock the clipboard
  const writeToClipboardMock = jest.fn();
  Object.assign(navigator, {
    clipboard: {
      writeText: writeToClipboardMock,
    },
  });

  // mock window.location for page reloads
  const originalLocation = window.location;
  const reloadMock = jest.fn();
  const replaceMock = jest.fn();
  const assignMock = jest.fn();
  delete window.location;
  window.location = {
    ...originalLocation,
    href: "",
    reload: reloadMock,
    replace: replaceMock,
    assign: assignMock,
    pathname,
  };

  return {
    writeToClipboardMock,
    reloadMock,
    replaceMock,
    assignMock,
    href: window.location.href,
  };
}
