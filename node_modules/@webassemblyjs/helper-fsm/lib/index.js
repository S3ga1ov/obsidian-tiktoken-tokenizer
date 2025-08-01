"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeTransition = makeTransition;
exports.FSM = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// $FlowIgnore
var STOP = Symbol("STOP");

function makeTransition(regex, nextState) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$n = _ref.n,
      n = _ref$n === void 0 ? 1 : _ref$n,
      allowedSeparator = _ref.allowedSeparator;

  return function (instance) {
    if (allowedSeparator) {
      if (instance.input[instance.ptr] === allowedSeparator) {
        if (regex.test(instance.input.substring(instance.ptr - 1, instance.ptr))) {
          // Consume the separator and stay in current state
          return [instance.currentState, 1];
        } else {
          return [instance.terminatingState, 0];
        }
      }
    }

    if (regex.test(instance.input.substring(instance.ptr, instance.ptr + n))) {
      return [nextState, n];
    }

    return false;
  };
}

function combineTransitions(transitions) {
  return function () {
    var match = false;
    var currentTransitions = transitions[this.currentState] || [];

    for (var i = 0; i < currentTransitions.length; ++i) {
      match = currentTransitions[i](this);

      if (match !== false) {
        break;
      }
    }

    return match || [this.terminatingState, 0];
  };
}

var FSM = /*#__PURE__*/function () {
  function FSM(transitions, initialState) {
    var terminatingState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : STOP;

    _classCallCheck(this, FSM);

    this.initialState = initialState;
    this.terminatingState = terminatingState;

    if (terminatingState === STOP || !transitions[terminatingState]) {
      transitions[terminatingState] = [];
    }

    this.transitionFunction = combineTransitions.call(this, transitions);
  }

  _createClass(FSM, [{
    key: "run",
    value: function run(input) {
      this.input = input;
      this.ptr = 0;
      this.currentState = this.initialState;
      var value = "";
      var eatLength, nextState;

      while (this.currentState !== this.terminatingState && this.ptr < this.input.length) {
        var _this$transitionFunct = this.transitionFunction();

        var _this$transitionFunct2 = _slicedToArray(_this$transitionFunct, 2);

        nextState = _this$transitionFunct2[0];
        eatLength = _this$transitionFunct2[1];
        value += this.input.substring(this.ptr, this.ptr += eatLength);
        this.currentState = nextState;
      }

      return value;
    }
  }]);

  return FSM;
}();

exports.FSM = FSM;