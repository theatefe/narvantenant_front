"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const updateServiceWorker = reg => {
  if (reg.waiting) {
    reg.waiting.postMessage({
      type: "SKIP_WAITING"
    });
    reg.waiting.addEventListener("statechange", e => {
      if (e.target.state === "activated") {
        console.log("target", e.target);
        window.location.reload();
      }
    });
  }
};

const containerStyle = {
  position: "absolute",
  bottom: "160px",
  left: "50%",
  minWidth: "300px",
  maxWidth: "325px",
  height: "80px",
  borderRadius: "5px",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "row",
  transform: "translate(-50%, 0px)",
  overflow: "hidden",
  zIndex: 999,
  backgroundColor: "#0091F7",
};
const secondaryStyle = {
  margin: 0,
  padding: 0,
  width: "6px",
  height: "100%",
  backgroundColor: "#ce9c09"
};
const primaryStyle = {
  margin: 0,
  padding: "8px 10px 8px 15px",
  width: "100%",
  height: "100%"
};

class PwaUpdater extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateState", registration => {
      this.setState({
        update: true,
        registration
      });
    });

    _defineProperty(this, "handleClick", () => {
      updateServiceWorker(this.state.registration);
      this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
        update: false
      }));
    });

    this.state = {
      update: false,
      registration: null
    };
  }

  render() {
    const {
      notify
    } = this.props;
    document.addEventListener("updateServiceWorker", e => {
      const {
        waiting,
        registration
      } = e.detail;

      if (waiting && waiting === true && registration) {
        if (!notify) {
          // no notify, straight refresh
          updateServiceWorker(registration);
        } else {
          // show notification
          this.updateState(registration);
        }
      }
    });
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, this.state.update && this.state.registration ? /*#__PURE__*/_react.default.createElement("div", {
      id: "pwa-updater",
      onClick: this.handleClick,
      style: this.state.update && this.state.registration ? containerStyle : {
        display: "none"
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "secondary",
      style: secondaryStyle
    }), /*#__PURE__*/_react.default.createElement("div", {
      id: "primary",
      style: primaryStyle
    }, /*#__PURE__*/_react.default.createElement("h6", null, "نسخه جدید در دسترس قرار گرفت"), /*#__PURE__*/_react.default.createElement("p", null, "برای به روز رسانی، کلیک کنید ", /*#__PURE__*/_react.default.createElement("strong", null, " > ")))) : null);
  }

}

;
var _default = PwaUpdater;
exports.default = _default;