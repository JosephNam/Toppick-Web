/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var classNames = require("classnames");
var React = require("react");
var ReactDOM = require("react-dom");
var common_1 = require("../../common");
var components_1 = require("../../components");
var hotkey_1 = require("./hotkey");
var hotkeys_1 = require("./hotkeys");
var HotkeysDialog = (function () {
    function HotkeysDialog() {
        var _this = this;
        this.componentProps = {
            globalHotkeysGroup: "Global hotkeys",
        };
        this.hotkeysQueue = [];
        this.isDialogShowing = false;
        this.timeoutToken = 0;
        this.show = function () {
            _this.isDialogShowing = true;
            _this.render();
        };
        this.hide = function () {
            _this.isDialogShowing = false;
            _this.render();
        };
    }
    HotkeysDialog.prototype.render = function () {
        if (this.container == null) {
            this.container = this.getContainer();
        }
        ReactDOM.render(this.renderComponent(), this.container);
    };
    HotkeysDialog.prototype.unmount = function () {
        if (this.container != null) {
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.remove();
            delete this.container;
        }
    };
    /**
     * Because hotkeys can be registered globally and locally and because
     * event ordering cannot be guaranteed, we use this debouncing method to
     * allow all hotkey listeners to fire and add their hotkeys to the dialog.
     *
     * 10msec after the last listener adds their hotkeys, we render the dialog
     * and clear the queue.
     */
    HotkeysDialog.prototype.enqueueHotkeysForDisplay = function (hotkeys) {
        this.hotkeysQueue.push(hotkeys);
        // reset timeout for debounce
        clearTimeout(this.timeoutToken);
        this.timeoutToken = setTimeout(this.show, 10);
    };
    HotkeysDialog.prototype.isShowing = function () {
        return this.isDialogShowing;
    };
    HotkeysDialog.prototype.getContainer = function () {
        if (this.container == null) {
            this.container = document.createElement("div");
            this.container.classList.add(common_1.Classes.PORTAL);
            document.body.appendChild(this.container);
        }
        return this.container;
    };
    HotkeysDialog.prototype.renderComponent = function () {
        return (React.createElement(components_1.Dialog, __assign({}, this.componentProps, {className: classNames(this.componentProps.className, "pt-hotkey-dialog"), inline: true, isOpen: this.isDialogShowing, onClose: this.hide}), 
            React.createElement("div", {className: common_1.Classes.DIALOG_BODY}, this.renderHotkeys())
        ));
    };
    HotkeysDialog.prototype.renderHotkeys = function () {
        var _this = this;
        var hotkeys = this.emptyHotkeyQueue();
        var elements = hotkeys.map(function (hotkey, index) {
            var group = (hotkey.global === true && hotkey.group == null) ?
                _this.componentProps.globalHotkeysGroup : hotkey.group;
            return React.createElement(hotkey_1.Hotkey, __assign({key: index}, hotkey, {group: group}));
        });
        return React.createElement(hotkeys_1.Hotkeys, null, elements);
    };
    HotkeysDialog.prototype.emptyHotkeyQueue = function () {
        // flatten then empty the hotkeys queue
        var hotkeys = this.hotkeysQueue.reduce((function (arr, queued) { return arr.concat(queued); }), []);
        this.hotkeysQueue.length = 0;
        return hotkeys;
    };
    return HotkeysDialog;
}());
// singleton instance
var HOTKEYS_DIALOG = new HotkeysDialog();
function isHotkeysDialogShowing() {
    return HOTKEYS_DIALOG.isShowing();
}
exports.isHotkeysDialogShowing = isHotkeysDialogShowing;
function setHotkeysDialogProps(props) {
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            HOTKEYS_DIALOG.componentProps[key] = props[key];
        }
    }
}
exports.setHotkeysDialogProps = setHotkeysDialogProps;
function showHotkeysDialog(hotkeys) {
    HOTKEYS_DIALOG.enqueueHotkeysForDisplay(hotkeys);
}
exports.showHotkeysDialog = showHotkeysDialog;
function hideHotkeysDialog() {
    HOTKEYS_DIALOG.hide();
}
exports.hideHotkeysDialog = hideHotkeysDialog;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL2hvdGtleXMvaG90a2V5c0RpYWxvZy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7QUFFSCxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUMvQixJQUFZLFFBQVEsV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUV0Qyx1QkFBd0IsY0FBYyxDQUFDLENBQUE7QUFDdkMsMkJBQXFDLGtCQUFrQixDQUFDLENBQUE7QUFDeEQsdUJBQXFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2hELHdCQUF3QixXQUFXLENBQUMsQ0FBQTtBQVVwQztJQUFBO1FBQUEsaUJBZ0dDO1FBL0ZVLG1CQUFjLEdBQUc7WUFDcEIsa0JBQWtCLEVBQUUsZ0JBQWdCO1NBQ1QsQ0FBQztRQUd4QixpQkFBWSxHQUFHLEVBQXNCLENBQUM7UUFDdEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFpQ2xCLFNBQUksR0FBRztZQUNWLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUE7UUFFTSxTQUFJLEdBQUc7WUFDVixLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM3QixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFBO0lBK0NMLENBQUM7SUF0RlUsOEJBQU0sR0FBYjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxDQUFD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QUUsRUFBRSxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FoR0EsQUFnR0MsSUFBQTtBQUVELHFCQUFxQjtBQUNyQixJQUFNLGNBQWMsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBRTNDO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN0QyxDQUFDO0FBRmUsOEJBQXNCLHlCQUVyQyxDQUFBO0FBRUQsK0JBQXNDLEtBQTBCO0lBQzVELEdBQUcsQ0FBQyxDQUFDLElBQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsY0FBYyxDQUFDLGNBQXNCLENBQUMsR0FBRyxDQUFDLEdBQUksS0FBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQU5lLDZCQUFxQix3QkFNcEMsQ0FBQTtBQUVELDJCQUFrQyxPQUF1QjtJQUNyRCxjQUFjLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUZlLHlCQUFpQixvQkFFaEMsQ0FBQTtBQUVEO0lBQ0ksY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFGZSx5QkFBaUIsb0JBRWhDLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9ob3RrZXlzL2hvdGtleXNEaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG5pbXBvcnQgeyBDbGFzc2VzIH0gZnJvbSBcIi4uLy4uL2NvbW1vblwiO1xuaW1wb3J0IHsgRGlhbG9nLCBJRGlhbG9nUHJvcHMgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50c1wiO1xuaW1wb3J0IHsgSG90a2V5LCBJSG90a2V5UHJvcHMgfSBmcm9tIFwiLi9ob3RrZXlcIjtcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tIFwiLi9ob3RrZXlzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUhvdGtleXNEaWFsb2dQcm9wcyBleHRlbmRzIElEaWFsb2dQcm9wcyB7XG4gICAgLyoqXG4gICAgICogVGhpcyBzdHJpbmcgZGlzcGxheWVkIGFzIHRoZSBncm91cCBuYW1lIGluIHRoZSBob3RrZXlzIGRpYWxvZyBmb3IgYWxsXG4gICAgICogZ2xvYmFsIGhvdGtleXMuXG4gICAgICovXG4gICAgZ2xvYmFsSG90a2V5c0dyb3VwPzogc3RyaW5nO1xufVxuXG5jbGFzcyBIb3RrZXlzRGlhbG9nIHtcbiAgICBwdWJsaWMgY29tcG9uZW50UHJvcHMgPSB7XG4gICAgICAgIGdsb2JhbEhvdGtleXNHcm91cDogXCJHbG9iYWwgaG90a2V5c1wiLFxuICAgIH0gYXMgYW55IGFzIElIb3RrZXlzRGlhbG9nUHJvcHM7XG5cbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBob3RrZXlzUXVldWUgPSBbXSBhcyBJSG90a2V5UHJvcHNbXVtdO1xuICAgIHByaXZhdGUgaXNEaWFsb2dTaG93aW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0aW1lb3V0VG9rZW4gPSAwO1xuXG4gICAgcHVibGljIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5nZXRDb250YWluZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBSZWFjdERPTS5yZW5kZXIodGhpcy5yZW5kZXJDb21wb25lbnQoKSwgdGhpcy5jb250YWluZXIpIGFzIFJlYWN0LkNvbXBvbmVudDxhbnksIFJlYWN0LkNvbXBvbmVudFN0YXRlPjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5tb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZWNhdXNlIGhvdGtleXMgY2FuIGJlIHJlZ2lzdGVyZWQgZ2xvYmFsbHkgYW5kIGxvY2FsbHkgYW5kIGJlY2F1c2VcbiAgICAgKiBldmVudCBvcmRlcmluZyBjYW5ub3QgYmUgZ3VhcmFudGVlZCwgd2UgdXNlIHRoaXMgZGVib3VuY2luZyBtZXRob2QgdG9cbiAgICAgKiBhbGxvdyBhbGwgaG90a2V5IGxpc3RlbmVycyB0byBmaXJlIGFuZCBhZGQgdGhlaXIgaG90a2V5cyB0byB0aGUgZGlhbG9nLlxuICAgICAqXG4gICAgICogMTBtc2VjIGFmdGVyIHRoZSBsYXN0IGxpc3RlbmVyIGFkZHMgdGhlaXIgaG90a2V5cywgd2UgcmVuZGVyIHRoZSBkaWFsb2dcbiAgICAgKiBhbmQgY2xlYXIgdGhlIHF1ZXVlLlxuICAgICAqL1xuICAgIHB1YmxpYyBlbnF1ZXVlSG90a2V5c0ZvckRpc3BsYXkoaG90a2V5czogSUhvdGtleVByb3BzW10pIHtcbiAgICAgICAgdGhpcy5ob3RrZXlzUXVldWUucHVzaChob3RrZXlzKTtcblxuICAgICAgICAvLyByZXNldCB0aW1lb3V0IGZvciBkZWJvdW5jZVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VG9rZW4pO1xuICAgICAgICB0aGlzLnRpbWVvdXRUb2tlbiA9IHNldFRpbWVvdXQodGhpcy5zaG93LCAxMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3cgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNEaWFsb2dTaG93aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5pc0RpYWxvZ1Nob3dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNTaG93aW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0RpYWxvZ1Nob3dpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb250YWluZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKENsYXNzZXMuUE9SVEFMKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlckNvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxEaWFsb2dcbiAgICAgICAgICAgICAgICB7Li4udGhpcy5jb21wb25lbnRQcm9wc31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXModGhpcy5jb21wb25lbnRQcm9wcy5jbGFzc05hbWUsIFwicHQtaG90a2V5LWRpYWxvZ1wiKX1cbiAgICAgICAgICAgICAgICBpbmxpbmVcbiAgICAgICAgICAgICAgICBpc09wZW49e3RoaXMuaXNEaWFsb2dTaG93aW5nfVxuICAgICAgICAgICAgICAgIG9uQ2xvc2U9e3RoaXMuaGlkZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Nlcy5ESUFMT0dfQk9EWX0+e3RoaXMucmVuZGVySG90a2V5cygpfTwvZGl2PlxuICAgICAgICAgICAgPC9EaWFsb2c+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXJIb3RrZXlzKCkge1xuICAgICAgICBjb25zdCBob3RrZXlzID0gdGhpcy5lbXB0eUhvdGtleVF1ZXVlKCk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gaG90a2V5cy5tYXAoKGhvdGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gKGhvdGtleS5nbG9iYWwgPT09IHRydWUgJiYgaG90a2V5Lmdyb3VwID09IG51bGwpID9cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFByb3BzLmdsb2JhbEhvdGtleXNHcm91cCA6IGhvdGtleS5ncm91cDtcblxuICAgICAgICAgICAgcmV0dXJuIDxIb3RrZXkga2V5PXtpbmRleH0gey4uLmhvdGtleX0gZ3JvdXA9e2dyb3VwfSAvPjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIDxIb3RrZXlzPntlbGVtZW50c308L0hvdGtleXM+O1xuICAgIH1cblxuICAgIHByaXZhdGUgZW1wdHlIb3RrZXlRdWV1ZSgpIHtcbiAgICAgICAgLy8gZmxhdHRlbiB0aGVuIGVtcHR5IHRoZSBob3RrZXlzIHF1ZXVlXG4gICAgICAgIGNvbnN0IGhvdGtleXMgPSB0aGlzLmhvdGtleXNRdWV1ZS5yZWR1Y2UoKChhcnIsIHF1ZXVlZCkgPT4gYXJyLmNvbmNhdChxdWV1ZWQpKSwgW10pO1xuICAgICAgICB0aGlzLmhvdGtleXNRdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICByZXR1cm4gaG90a2V5cztcbiAgICB9XG59XG5cbi8vIHNpbmdsZXRvbiBpbnN0YW5jZVxuY29uc3QgSE9US0VZU19ESUFMT0cgPSBuZXcgSG90a2V5c0RpYWxvZygpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNIb3RrZXlzRGlhbG9nU2hvd2luZygpIHtcbiAgICByZXR1cm4gSE9US0VZU19ESUFMT0cuaXNTaG93aW5nKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRIb3RrZXlzRGlhbG9nUHJvcHMocHJvcHM6IElIb3RrZXlzRGlhbG9nUHJvcHMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xuICAgICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgKEhPVEtFWVNfRElBTE9HLmNvbXBvbmVudFByb3BzIGFzIGFueSlba2V5XSA9IChwcm9wcyBhcyBhbnkpW2tleV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93SG90a2V5c0RpYWxvZyhob3RrZXlzOiBJSG90a2V5UHJvcHNbXSkge1xuICAgIEhPVEtFWVNfRElBTE9HLmVucXVldWVIb3RrZXlzRm9yRGlzcGxheShob3RrZXlzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVIb3RrZXlzRGlhbG9nKCkge1xuICAgIEhPVEtFWVNfRElBTE9HLmhpZGUoKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
