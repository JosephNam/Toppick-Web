/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var classNames = require("classnames");
var PureRender = require("pure-render-decorator");
var React = require("react");
var Classes = require("../../common/classes");
var utils_1 = require("../../common/utils");
var buttons_1 = require("../button/buttons");
var Toast = (function (_super) {
    __extends(Toast, _super);
    function Toast() {
        var _this = this;
        _super.apply(this, arguments);
        this.displayName = "Blueprint.Toast";
        this.handleActionClick = function (e) {
            utils_1.safeInvoke(_this.props.action.onClick, e);
            _this.triggerDismiss(false);
        };
        this.handleCloseClick = function () { return _this.triggerDismiss(false); };
        this.startTimeout = function () {
            if (_this.props.timeout > 0) {
                _this.timeoutId = setTimeout(function () { return _this.triggerDismiss(true); }, _this.props.timeout);
            }
        };
        this.clearTimeout = function () {
            clearTimeout(_this.timeoutId);
            _this.timeoutId = null;
        };
    }
    Toast.prototype.render = function () {
        var _a = this.props, className = _a.className, intent = _a.intent, message = _a.message;
        return (React.createElement("div", {className: classNames(Classes.TOAST, Classes.intentClass(intent), className), onBlur: this.startTimeout, onFocus: this.clearTimeout, onMouseEnter: this.clearTimeout, onMouseLeave: this.startTimeout}, 
            this.maybeRenderIcon(), 
            React.createElement("span", {className: Classes.TOAST_MESSAGE}, message), 
            React.createElement("div", {className: classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}, 
                this.maybeRenderActionButton(), 
                React.createElement(buttons_1.Button, {iconName: "cross", onClick: this.handleCloseClick}))));
    };
    Toast.prototype.componentDidMount = function () {
        this.startTimeout();
    };
    Toast.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.timeout <= 0 && this.props.timeout > 0) {
            this.startTimeout();
        }
        else if (prevProps.timeout > 0 && this.props.timeout <= 0) {
            this.clearTimeout();
        }
    };
    Toast.prototype.componentWillUnmount = function () {
        this.clearTimeout();
    };
    Toast.prototype.maybeRenderActionButton = function () {
        var action = this.props.action;
        return action == null ? undefined : React.createElement(buttons_1.Button, __assign({}, action, {intent: null, onClick: this.handleActionClick}));
    };
    Toast.prototype.maybeRenderIcon = function () {
        var iconName = this.props.iconName;
        if (iconName == null) {
            return undefined;
        }
        else {
            return React.createElement("span", {className: classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName))});
        }
    };
    Toast.prototype.triggerDismiss = function (didTimeoutExpire) {
        utils_1.safeInvoke(this.props.onDismiss, didTimeoutExpire);
        this.clearTimeout();
    };
    Toast.defaultProps = {
        className: "",
        message: "",
        timeout: 5000,
    };
    Toast = __decorate([
        PureRender
    ], Toast);
    return Toast;
}(React.Component));
exports.Toast = Toast;
exports.ToastFactory = React.createFactory(Toast);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL3RvYXN0L3RvYXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsSUFBWSxVQUFVLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDekMsSUFBWSxVQUFVLFdBQU0sdUJBQXVCLENBQUMsQ0FBQTtBQUNwRCxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUUvQixJQUFZLE9BQU8sV0FBTSxzQkFBc0IsQ0FBQyxDQUFBO0FBRWhELHNCQUEyQixvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUF1QixtQkFBbUIsQ0FBQyxDQUFBO0FBZ0MzQztJQUEyQix5QkFBZ0M7SUFBM0Q7UUFBQSxpQkFtRkM7UUFuRjBCLDhCQUFnQztRQU9oRCxnQkFBVyxHQUFHLGlCQUFpQixDQUFDO1FBc0QvQixzQkFBaUIsR0FBRyxVQUFDLENBQXNDO1lBQy9ELGtCQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFBO1FBRU8scUJBQWdCLEdBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQTFCLENBQTBCLENBQUM7UUFPcEQsaUJBQVksR0FBRztZQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBekIsQ0FBeUIsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JGLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFTyxpQkFBWSxHQUFHO1lB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QUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxJQUFJO0tBQ2hCLENBQUM7SUFOTjtRQUFDLFVBQVU7YUFBQTtJQW9GWCxZQUFDO0FBQUQsQ0FuRkEsQUFtRkMsQ0FuRjBCLEtBQUssQ0FBQyxTQUFTLEdBbUZ6QztBQW5GWSxhQUFLLFFBbUZqQixDQUFBO0FBRVksb0JBQVksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvdG9hc3QvdG9hc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCAqIGFzIFB1cmVSZW5kZXIgZnJvbSBcInB1cmUtcmVuZGVyLWRlY29yYXRvclwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCAqIGFzIENsYXNzZXMgZnJvbSBcIi4uLy4uL2NvbW1vbi9jbGFzc2VzXCI7XG5pbXBvcnQgeyBJQWN0aW9uUHJvcHMsIElJbnRlbnRQcm9wcywgSVByb3BzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9wcm9wc1wiO1xuaW1wb3J0IHsgc2FmZUludm9rZSB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbHNcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9idXR0b24vYnV0dG9uc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUb2FzdFByb3BzIGV4dGVuZHMgSVByb3BzLCBJSW50ZW50UHJvcHMge1xuICAgIC8qKlxuICAgICAqIEFjdGlvbiB0byBkaXNwbGF5IGluIGEgbWluaW1hbCBidXR0b24uIFRoZSB0b2FzdCBpcyBkaXNtaXNzZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZVxuICAgICAqIHVzZXIgY2xpY2tzIHRoZSBhY3Rpb24gYnV0dG9uLiBOb3RlIHRoYXQgdGhlIGBpbnRlbnRgIHByb3AgaXMgaWdub3JlZCAodGhlIGFjdGlvbiBidXR0b25cbiAgICAgKiBjYW5ub3QgaGF2ZSBpdHMgb3duIGludGVudCBjb2xvciB0aGF0IG1pZ2h0IGNvbmZsaWN0IHdpdGggdGhlIHRvYXN0J3MgaW50ZW50KS4gT21pdCB0aGlzXG4gICAgICogcHJvcCB0byBvbWl0IHRoZSBhY3Rpb24gYnV0dG9uLlxuICAgICAqL1xuICAgIGFjdGlvbj86IElBY3Rpb25Qcm9wcztcblxuICAgIC8qKiBOYW1lIG9mIGljb24gdG8gYXBwZWFyIGJlZm9yZSBtZXNzYWdlLiBTcGVjaWZ5IG9ubHkgdGhlIHBhcnQgb2YgdGhlIG5hbWUgYWZ0ZXIgYHB0LWljb24tYC4gKi9cbiAgICBpY29uTmFtZT86IHN0cmluZztcblxuICAgIC8qKiBNZXNzYWdlIHRvIGRpc3BsYXkgaW4gdGhlIGJvZHkgb2YgdGhlIHRvYXN0LiAqL1xuICAgIG1lc3NhZ2U6IHN0cmluZyB8IEpTWC5FbGVtZW50O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHRoZSB0b2FzdCBpcyBkaXNtaXNzZWQsIGVpdGhlciBieSB0aGUgdXNlciBvciBieSB0aGUgdGltZW91dC5cbiAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIGFyZ3VtZW50IGluZGljYXRlcyB3aGV0aGVyIHRoZSB0b2FzdCB3YXMgY2xvc2VkIGJlY2F1c2UgdGhlIHRpbWVvdXQgZXhwaXJlZC5cbiAgICAgKi9cbiAgICBvbkRpc21pc3M/OiAoZGlkVGltZW91dEV4cGlyZTogYm9vbGVhbikgPT4gdm9pZDtcblxuICAgIC8qKlxuICAgICAqIE1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhdXRvbWF0aWNhbGx5IGRpc21pc3NpbmcgdG9hc3QuXG4gICAgICogUHJvdmlkaW5nIGEgdmFsdWUgPD0gMCB3aWxsIGRpc2FibGUgdGhlIHRpbWVvdXQgKHRoaXMgaXMgZGlzY291cmFnZWQpLlxuICAgICAqIEBkZWZhdWx0IDUwMDBcbiAgICAgKi9cbiAgICB0aW1lb3V0PzogbnVtYmVyO1xufVxuXG5AUHVyZVJlbmRlclxuZXhwb3J0IGNsYXNzIFRvYXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PElUb2FzdFByb3BzLCB7fT4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzOiBJVG9hc3RQcm9wcyA9IHtcbiAgICAgICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICB0aW1lb3V0OiA1MDAwLFxuICAgIH07XG5cbiAgICBwdWJsaWMgZGlzcGxheU5hbWUgPSBcIkJsdWVwcmludC5Ub2FzdFwiO1xuXG4gICAgcHJpdmF0ZSB0aW1lb3V0SWQ6IG51bWJlcjtcblxuICAgIHB1YmxpYyByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgICAgICBjb25zdCB7IGNsYXNzTmFtZSwgaW50ZW50LCBtZXNzYWdlIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhDbGFzc2VzLlRPQVNULCBDbGFzc2VzLmludGVudENsYXNzKGludGVudCksIGNsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLnN0YXJ0VGltZW91dH1cbiAgICAgICAgICAgICAgICBvbkZvY3VzPXt0aGlzLmNsZWFyVGltZW91dH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuY2xlYXJUaW1lb3V0fVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5zdGFydFRpbWVvdXR9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RoaXMubWF5YmVSZW5kZXJJY29uKCl9XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtDbGFzc2VzLlRPQVNUX01FU1NBR0V9PnttZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhDbGFzc2VzLkJVVFRPTl9HUk9VUCwgQ2xhc3Nlcy5NSU5JTUFMKX0+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLm1heWJlUmVuZGVyQWN0aW9uQnV0dG9uKCl9XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gaWNvbk5hbWU9XCJjcm9zc1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xvc2VDbGlja30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wczogSVRvYXN0UHJvcHMpIHtcbiAgICAgICAgaWYgKHByZXZQcm9wcy50aW1lb3V0IDw9IDAgJiYgdGhpcy5wcm9wcy50aW1lb3V0ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVvdXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2UHJvcHMudGltZW91dCA+IDAgJiYgdGhpcy5wcm9wcy50aW1lb3V0IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXliZVJlbmRlckFjdGlvbkJ1dHRvbigpIHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBhY3Rpb24gPT0gbnVsbCA/IHVuZGVmaW5lZCA6IDxCdXR0b24gey4uLmFjdGlvbn0gaW50ZW50PXtudWxsfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUFjdGlvbkNsaWNrfSAvPjtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1heWJlUmVuZGVySWNvbigpIHtcbiAgICAgICAgY29uc3QgeyBpY29uTmFtZSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgaWYgKGljb25OYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWVzKENsYXNzZXMuSUNPTl9TVEFOREFSRCwgQ2xhc3Nlcy5pY29uQ2xhc3MoaWNvbk5hbWUpKX0gLz47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUFjdGlvbkNsaWNrID0gKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KSA9PiB7XG4gICAgICAgIHNhZmVJbnZva2UodGhpcy5wcm9wcy5hY3Rpb24ub25DbGljaywgZSk7XG4gICAgICAgIHRoaXMudHJpZ2dlckRpc21pc3MoZmFsc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlQ2xvc2VDbGljayA9ICgpID0+IHRoaXMudHJpZ2dlckRpc21pc3MoZmFsc2UpO1xuXG4gICAgcHJpdmF0ZSB0cmlnZ2VyRGlzbWlzcyhkaWRUaW1lb3V0RXhwaXJlOiBib29sZWFuKSB7XG4gICAgICAgIHNhZmVJbnZva2UodGhpcy5wcm9wcy5vbkRpc21pc3MsIGRpZFRpbWVvdXRFeHBpcmUpO1xuICAgICAgICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRUaW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy50aW1lb3V0ID4gMCkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMudHJpZ2dlckRpc21pc3ModHJ1ZSksIHRoaXMucHJvcHMudGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyVGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFRvYXN0RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoVG9hc3QpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
