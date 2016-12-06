/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
var CSSTransitionGroup = require("react-addons-css-transition-group");
var Classes = require("../../common/classes");
var Keys = require("../../common/keys");
var utils_1 = require("../../common/utils");
var portal_1 = require("../portal/portal");
var Overlay = (function (_super) {
    __extends(Overlay, _super);
    function Overlay(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.displayName = "Blueprint.Overlay";
        this.refHandlers = {
            container: function (ref) { return _this.containerElement = ref; },
        };
        this.bringFocusInsideOverlay = function () {
            var containerElement = _this.containerElement;
            // container ref may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            if (containerElement == null || document.activeElement == null || !_this.props.isOpen) {
                return;
            }
            var isFocusOutsideModal = !containerElement.contains(document.activeElement);
            if (isFocusOutsideModal) {
                // element marked autofocus has higher priority than the other clowns
                var autofocusElement = containerElement.query("[autofocus]");
                if (autofocusElement != null) {
                    autofocusElement.focus();
                }
                else {
                    containerElement.focus();
                }
            }
        };
        this.handleBackdropMouseDown = function (e) {
            if (_this.props.canOutsideClickClose) {
                utils_1.safeInvoke(_this.props.onClose, e);
            }
            utils_1.safeInvoke(_this.props.backdropProps.onMouseDown, e);
        };
        this.handleDocumentClick = function (e) {
            var _a = _this.props, isOpen = _a.isOpen, onClose = _a.onClose;
            var eventTarget = e.target;
            var isClickInOverlay = _this.containerElement != null
                && _this.containerElement.contains(eventTarget);
            if (isOpen && _this.props.canOutsideClickClose && !isClickInOverlay) {
                // casting to any because this is a native event
                utils_1.safeInvoke(onClose, e);
            }
        };
        this.handleContentMount = function () {
            if (_this.props.isOpen) {
                utils_1.safeInvoke(_this.props.didOpen);
            }
            if (_this.props.autoFocus) {
                _this.bringFocusInsideOverlay();
            }
        };
        this.handleDocumentFocus = function (e) {
            if (_this.props.enforceFocus
                && _this.containerElement != null
                && !_this.containerElement.contains(e.target)) {
                e.stopImmediatePropagation();
                _this.bringFocusInsideOverlay();
            }
        };
        this.handleKeyDown = function (e) {
            var _a = _this.props, canEscapeKeyClose = _a.canEscapeKeyClose, onClose = _a.onClose;
            if (e.which === Keys.ESCAPE && canEscapeKeyClose) {
                utils_1.safeInvoke(onClose, e);
                // prevent browser-specific escape key behavior (Safari exits fullscreen)
                e.preventDefault();
            }
        };
        this.state = { hasEverOpened: props.isOpen };
    }
    Overlay.prototype.render = function () {
        // oh snap! no reason to render anything at all if we're being truly lazy
        if (this.props.lazy && !this.state.hasEverOpened) {
            return null;
        }
        var _a = this.props, children = _a.children, className = _a.className, inline = _a.inline, isOpen = _a.isOpen, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
        // add a special class to each child that will automatically set the appropriate
        // CSS position mode under the hood.
        var decoratedChildren = React.Children.map(children, function (child) {
            return React.cloneElement(child, {
                className: classNames(child.props.className, Classes.OVERLAY_CONTENT),
            });
        });
        var transitionGroup = (React.createElement(CSSTransitionGroup, {transitionAppear: true, transitionAppearTimeout: transitionDuration, transitionEnterTimeout: transitionDuration, transitionLeaveTimeout: transitionDuration, transitionName: transitionName}, 
            this.maybeRenderBackdrop(), 
            isOpen ? decoratedChildren : null));
        var mergedClassName = classNames(Classes.OVERLAY, (_b = {},
            _b[Classes.OVERLAY_OPEN] = isOpen,
            _b[Classes.OVERLAY_INLINE] = inline,
            _b
        ), className);
        var elementProps = {
            className: mergedClassName,
            onKeyDown: this.handleKeyDown,
            // make the container focusable so we can trap focus inside it (via `persistentFocus()`)
            tabIndex: 0,
        };
        if (inline) {
            return React.createElement("span", __assign({}, elementProps, {ref: this.refHandlers.container}), transitionGroup);
        }
        else {
            return (React.createElement(portal_1.Portal, __assign({}, elementProps, {containerRef: this.refHandlers.container, onChildrenMount: this.handleContentMount}), transitionGroup));
        }
        var _b;
    };
    Overlay.prototype.componentDidMount = function () {
        if (this.props.isOpen) {
            this.overlayWillOpen();
        }
    };
    Overlay.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({ hasEverOpened: this.state.hasEverOpened || nextProps.isOpen });
    };
    Overlay.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.isOpen && !this.props.isOpen) {
            this.overlayWillClose();
        }
        else if (!prevProps.isOpen && this.props.isOpen) {
            this.overlayWillOpen();
        }
    };
    Overlay.prototype.componentWillUnmount = function () {
        this.overlayWillClose();
    };
    Overlay.prototype.maybeRenderBackdrop = function () {
        var _a = this.props, backdropClassName = _a.backdropClassName, backdropProps = _a.backdropProps, hasBackdrop = _a.hasBackdrop, isOpen = _a.isOpen;
        if (hasBackdrop && isOpen) {
            return (React.createElement("div", __assign({}, backdropProps, {className: classNames(Classes.OVERLAY_BACKDROP, backdropClassName, backdropProps.className), onMouseDown: this.handleBackdropMouseDown, tabIndex: this.props.canOutsideClickClose ? 0 : null})));
        }
        else {
            return undefined;
        }
    };
    Overlay.prototype.overlayWillClose = function () {
        document.removeEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", this.handleDocumentClick);
        document.body.classList.remove(Classes.OVERLAY_OPEN);
        var openStack = Overlay.openStack;
        var idx = openStack.indexOf(this);
        if (idx > 0) {
            openStack.splice(idx, 1);
            var lastOpenedOverlay = Overlay.getLastOpened();
            if (openStack.length > 0 && lastOpenedOverlay.props.enforceFocus) {
                document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
            }
        }
    };
    Overlay.prototype.overlayWillOpen = function () {
        var openStack = Overlay.openStack;
        if (openStack.length > 0) {
            document.removeEventListener("focus", Overlay.getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);
        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }
        if (this.props.enforceFocus) {
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }
        if (this.props.inline) {
            utils_1.safeInvoke(this.props.didOpen);
            if (this.props.autoFocus) {
                this.bringFocusInsideOverlay();
            }
        }
        else if (this.props.hasBackdrop) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }
    };
    Overlay.defaultProps = {
        autoFocus: true,
        backdropProps: {},
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        inline: false,
        isOpen: false,
        lazy: true,
        transitionDuration: 300,
        transitionName: "pt-overlay",
    };
    Overlay.openStack = [];
    Overlay.getLastOpened = function () { return Overlay.openStack[Overlay.openStack.length - 1]; };
    Overlay = __decorate([
        PureRender
    ], Overlay);
    return Overlay;
}(React.Component));
exports.Overlay = Overlay;
exports.OverlayFactory = React.createFactory(Overlay);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL292ZXJsYXkvb3ZlcmxheS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksVUFBVSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDcEQsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFDL0IsSUFBWSxrQkFBa0IsV0FBTSxtQ0FBbUMsQ0FBQyxDQUFBO0FBRXhFLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsSUFBWSxJQUFJLFdBQU0sbUJBQW1CLENBQUMsQ0FBQTtBQUUxQyxzQkFBMkIsb0JBQW9CLENBQUMsQ0FBQTtBQUNoRCx1QkFBdUIsa0JBQWtCLENBQUMsQ0FBQTtBQTBHMUM7SUFBNkIsMkJBQTZDO0lBMEJ0RSxpQkFBbUIsS0FBcUIsRUFBRSxPQUFhO1FBMUIzRCxpQkF1T0M7UUE1TU8sa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBVG5CLGdCQUFXLEdBQUcsbUJBQW1CLENBQUM7UUFJakMsZ0JBQVcsR0FBRztZQUNsQixTQUFTLEVBQUUsVUFBQyxHQUFtQixJQUFLLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsRUFBM0IsQ0FBMkI7U0FDbEUsQ0FBQztRQThJTSw0QkFBdUIsR0FBRztZQUN0Qiw2Q0FBZ0IsQ0FBVTtZQUVsQyxpRkFBaUY7WUFDakYsMERBQTBEO1lBQzFELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsYUFBYSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkYsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQU0sbUJBQW1CLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsUUFB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QUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQS9DLENBQStDLENBQUM7SUFqQnpGO1FBQUMsVUFBVTtlQUFBO0lBd09YLGNBQUM7QUFBRCxDQXZPQSxBQXVPQyxDQXZPNEIsS0FBSyxDQUFDLFNBQVMsR0F1TzNDO0FBdk9ZLGVBQU8sVUF1T25CLENBQUE7QUFFWSxzQkFBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMiLCJmaWxlIjoiY29tcG9uZW50cy9vdmVybGF5L292ZXJsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTUgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCAqIGFzIFB1cmVSZW5kZXIgZnJvbSBcInB1cmUtcmVuZGVyLWRlY29yYXRvclwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgKiBhcyBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cFwiO1xuXG5pbXBvcnQgKiBhcyBDbGFzc2VzIGZyb20gXCIuLi8uLi9jb21tb24vY2xhc3Nlc1wiO1xuaW1wb3J0ICogYXMgS2V5cyBmcm9tIFwiLi4vLi4vY29tbW9uL2tleXNcIjtcbmltcG9ydCB7IElQcm9wcyB9IGZyb20gXCIuLi8uLi9jb21tb24vcHJvcHNcIjtcbmltcG9ydCB7IHNhZmVJbnZva2UgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxzXCI7XG5pbXBvcnQgeyBQb3J0YWwgfSBmcm9tIFwiLi4vcG9ydGFsL3BvcnRhbFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPdmVybGF5YWJsZVByb3BzIHtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBvdmVybGF5IHNob3VsZCBhY3F1aXJlIGFwcGxpY2F0aW9uIGZvY3VzIHdoZW4gaXQgZmlyc3Qgb3BlbnMuXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGF1dG9Gb2N1cz86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHByZXNzaW5nIHRoZSBgZXNjYCBrZXkgc2hvdWxkIGludm9rZSBgb25DbG9zZWAuXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGNhbkVzY2FwZUtleUNsb3NlPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIG92ZXJsYXkgc2hvdWxkIHByZXZlbnQgZm9jdXMgZnJvbSBsZWF2aW5nIGl0c2VsZi4gVGhhdCBpcywgaWYgdGhlIHVzZXIgYXR0ZW1wdHNcbiAgICAgKiB0byBmb2N1cyBhbiBlbGVtZW50IG91dHNpZGUgdGhlIG92ZXJsYXkgYW5kIHRoaXMgcHJvcCBpcyBlbmFibGVkLCB0aGVuIHRoZSBvdmVybGF5IHdpbGxcbiAgICAgKiBpbW1lZGlhdGVseSBicmluZyBmb2N1cyBiYWNrIHRvIGl0c2VsZi4gSWYgeW91IGFyZSBuZXN0aW5nIG92ZXJsYXkgY29tcG9uZW50cywgZWl0aGVyIGRpc2FibGVcbiAgICAgKiB0aGlzIHByb3Agb24gdGhlIFwib3V0ZXJtb3N0XCIgb3ZlcmxheXMgb3IgbWFyayB0aGUgbmVzdGVkIG9uZXMgYGlubGluZT17dHJ1ZX1gLlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmZvcmNlRm9jdXM/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgb3ZlcmxheSBzaG91bGQgYmUgcmVuZGVyZWQgaW5saW5lIG9yIGludG8gYSBuZXcgZWxlbWVudCBvbiBgZG9jdW1lbnQuYm9keWAuXG4gICAgICogVGhpcyBwcm9wIGVzc2VudGlhbGx5IGRldGVybWluZXMgd2hpY2ggZWxlbWVudCBpcyBjb3ZlcmVkIGJ5IHRoZSBiYWNrZHJvcDogaWYgYHRydWVgLFxuICAgICAqIHRoZW4gb25seSBpdHMgcGFyZW50IGlzIGNvdmVyZWQ7IG90aGVyd2lzZSwgdGhlIGVudGlyZSBhcHBsaWNhdGlvbiBpcyBjb3ZlcmVkLlxuICAgICAqIFNldCB0aGlzIHByb3AgdG8gdHJ1ZSB3aGVuIHRoaXMgY29tcG9uZW50IGlzIHVzZWQgaW5zaWRlIGFuIGBPdmVybGF5YCAoc3VjaCBhc1xuICAgICAqIGBEaWFsb2dgIG9yIGBQb3BvdmVyYCkgdG8gZW5zdXJlIHRoYXQgdGhpcyBjb21wb25lbnQgaXMgcmVuZGVyZWQgYWJvdmUgaXRzIHBhcmVudC5cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIGlubGluZT86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAgYW5kIG5vdCBgaW5saW5lYCwgdGhlIGBQb3J0YWxgIGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIGlzIGNyZWF0ZWQgYW5kIGF0dGFjaGVkXG4gICAgICogdG8gdGhlIERPTSB3aGVuIHRoZSBvdmVybGF5IGlzIG9wZW5lZCBmb3IgdGhlIGZpcnN0IHRpbWU7IG90aGVyd2lzZSB0aGlzIGhhcHBlbnMgd2hlbiB0aGVcbiAgICAgKiBjb21wb25lbnQgbW91bnRzLiBMYXp5IG1vdW50aW5nIHByb3ZpZGVzIG5vdGljZWFibGUgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnRzIGlmIHlvdSBoYXZlIGxvdHNcbiAgICAgKiBvZiBvdmVybGF5cyBhdCBvbmNlLCBzdWNoIGFzIG9uIGVhY2ggcm93IG9mIGEgdGFibGUuXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGxhenk/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGhvdyBsb25nIChpbiBtaWxsaXNlY29uZHMpIHRoZSBvdmVybGF5J3MgZW50ZXIvbGVhdmUgdHJhbnNpdGlvbiB0YWtlcy5cbiAgICAgKiBUaGlzIGlzIHVzZWQgYnkgUmVhY3QgYENTU1RyYW5zaXRpb25Hcm91cGAgdG8ga25vdyB3aGVuIGEgdHJhbnNpdGlvbiBjb21wbGV0ZXMgYW5kIG11c3QgbWF0Y2hcbiAgICAgKiB0aGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiBpbiBDU1MuIE9ubHkgc2V0IHRoaXMgcHJvcCBpZiB5b3Ugb3ZlcnJpZGUgQmx1ZXByaW50J3MgZGVmYXVsdFxuICAgICAqIHRyYW5zaXRpb25zIHdpdGggbmV3IHRyYW5zaXRpb25zIG9mIGEgZGlmZmVyZW50IGxlbmd0aC5cbiAgICAgKiBAZGVmYXVsdCAxMDBcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uRHVyYXRpb24/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gY2F1c2VzIHRoZSBvdmVybGF5IHRvIGNsb3NlLCBzdWNoIGFzXG4gICAgICogY2xpY2tpbmcgb24gdGhlIG92ZXJsYXkgb3IgcHJlc3NpbmcgdGhlIGBlc2NgIGtleSAoaWYgZW5hYmxlZCkuXG4gICAgICogUmVjZWl2ZXMgdGhlIGV2ZW50IGZyb20gdGhlIHVzZXIncyBpbnRlcmFjdGlvbiwgaWYgdGhlcmUgd2FzIGFuIGV2ZW50IChnZW5lcmFsbHkgZWl0aGVyIGFcbiAgICAgKiBtb3VzZSBvciBrZXkgZXZlbnQpLiBOb3RlIHRoYXQsIHNpbmNlIHRoaXMgY29tcG9uZW50IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGBpc09wZW5gIHByb3AsIGl0XG4gICAgICogd2lsbCBub3QgYWN0dWFsbHkgY2xvc2UgaXRzZWxmIHVudGlsIHRoYXQgcHJvcCBiZWNvbWVzIGBmYWxzZWAuXG4gICAgICovXG4gICAgb25DbG9zZT8oZXZlbnQ/OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudD4pOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElCYWNrZHJvcFByb3BzIHtcbiAgICAvKiogQ1NTIGNsYXNzIG5hbWVzIHRvIGFwcGx5IHRvIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gICAgYmFja2Ryb3BDbGFzc05hbWU/OiBzdHJpbmc7XG5cbiAgICAvKiogSFRNTCBwcm9wcyBmb3IgdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gICAgYmFja2Ryb3BQcm9wcz86IFJlYWN0LkhUTUxQcm9wczxIVE1MRGl2RWxlbWVudD47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIGNsaWNraW5nIG91dHNpZGUgdGhlIG92ZXJsYXkgZWxlbWVudCAoZWl0aGVyIG9uIGJhY2tkcm9wIHdoZW4gcHJlc2VudCBvciBvbiBkb2N1bWVudClcbiAgICAgKiBzaG91bGQgaW52b2tlIGBvbkNsb3NlYC5cbiAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgY2FuT3V0c2lkZUNsaWNrQ2xvc2U/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBhIGNvbnRhaW5lci1zcGFubmluZyBiYWNrZHJvcCBlbGVtZW50IHNob3VsZCBiZSByZW5kZXJlZCBiZWhpbmQgdGhlIGNvbnRlbnRzLlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU92ZXJsYXlQcm9wcyBleHRlbmRzIElPdmVybGF5YWJsZVByb3BzLCBJQmFja2Ryb3BQcm9wcywgSVByb3BzIHtcbiAgICAvKiogTGlmZWN5Y2xlIGNhbGxiYWNrIGludm9rZWQgYWZ0ZXIgdGhlIG92ZXJsYXkgb3BlbnMgYW5kIGlzIG1vdW50ZWQgaW4gdGhlIERPTS4gKi9cbiAgICBkaWRPcGVuPzogKCkgPT4gYW55O1xuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgb3ZlcmxheSBhbmQgaXRzIGNoaWxkcmVuLlxuICAgICAqIFRoaXMgcHJvcCBpcyByZXF1aXJlZCBiZWNhdXNlIHRoZSBjb21wb25lbnQgaXMgY29udHJvbGxlZC5cbiAgICAgKi9cbiAgICBpc09wZW46IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSB0cmFuc2l0aW9uIGZvciBpbnRlcm5hbCBgQ1NTVHJhbnNpdGlvbkdyb3VwYC5cbiAgICAgKiBQcm92aWRpbmcgeW91ciBvd24gbmFtZSBoZXJlIHdpbGwgcmVxdWlyZSBkZWZpbmluZyBuZXcgQ1NTIHRyYW5zaXRpb24gcHJvcGVydGllcy5cbiAgICAgKiBAZGVmYXVsdCBcInB0LW92ZXJsYXlcIlxuICAgICAqL1xuICAgIHRyYW5zaXRpb25OYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElPdmVybGF5U3RhdGUge1xuICAgIGhhc0V2ZXJPcGVuZWQ/OiBib29sZWFuO1xufVxuXG5AUHVyZVJlbmRlclxuZXhwb3J0IGNsYXNzIE92ZXJsYXkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SU92ZXJsYXlQcm9wcywgSU92ZXJsYXlTdGF0ZT4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzOiBJT3ZlcmxheVByb3BzID0ge1xuICAgICAgICBhdXRvRm9jdXM6IHRydWUsXG4gICAgICAgIGJhY2tkcm9wUHJvcHM6IHt9LFxuICAgICAgICBjYW5Fc2NhcGVLZXlDbG9zZTogdHJ1ZSxcbiAgICAgICAgY2FuT3V0c2lkZUNsaWNrQ2xvc2U6IHRydWUsXG4gICAgICAgIGVuZm9yY2VGb2N1czogdHJ1ZSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICAgIGlubGluZTogZmFsc2UsXG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGxhenk6IHRydWUsXG4gICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMzAwLFxuICAgICAgICB0cmFuc2l0aW9uTmFtZTogXCJwdC1vdmVybGF5XCIsXG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIG9wZW5TdGFjazogT3ZlcmxheVtdID0gW107XG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0TGFzdE9wZW5lZCA9ICgpID0+IE92ZXJsYXkub3BlblN0YWNrW092ZXJsYXkub3BlblN0YWNrLmxlbmd0aCAtIDFdO1xuXG4gICAgcHVibGljIGRpc3BsYXlOYW1lID0gXCJCbHVlcHJpbnQuT3ZlcmxheVwiO1xuXG4gICAgLy8gYW4gSFRNTEVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgYmFja2Ryb3AgYW5kIGFueSBjaGlsZHJlbiwgdG8gcXVlcnkgZm9yIGZvY3VzIHRhcmdldFxuICAgIHByaXZhdGUgY29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZWZIYW5kbGVycyA9IHtcbiAgICAgICAgY29udGFpbmVyOiAocmVmOiBIVE1MRGl2RWxlbWVudCkgPT4gdGhpcy5jb250YWluZXJFbGVtZW50ID0gcmVmLFxuICAgIH07XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM/OiBJT3ZlcmxheVByb3BzLCBjb250ZXh0PzogYW55KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgaGFzRXZlck9wZW5lZDogcHJvcHMuaXNPcGVuIH07XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpIHtcbiAgICAgICAgLy8gb2ggc25hcCEgbm8gcmVhc29uIHRvIHJlbmRlciBhbnl0aGluZyBhdCBhbGwgaWYgd2UncmUgYmVpbmcgdHJ1bHkgbGF6eVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5sYXp5ICYmICF0aGlzLnN0YXRlLmhhc0V2ZXJPcGVuZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBpbmxpbmUsIGlzT3BlbiwgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uTmFtZSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAvLyBhZGQgYSBzcGVjaWFsIGNsYXNzIHRvIGVhY2ggY2hpbGQgdGhhdCB3aWxsIGF1dG9tYXRpY2FsbHkgc2V0IHRoZSBhcHByb3ByaWF0ZVxuICAgICAgICAvLyBDU1MgcG9zaXRpb24gbW9kZSB1bmRlciB0aGUgaG9vZC5cbiAgICAgICAgY29uc3QgZGVjb3JhdGVkQ2hpbGRyZW4gPSBSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZDogUmVhY3QuUmVhY3RFbGVtZW50PGFueT4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMoY2hpbGQucHJvcHMuY2xhc3NOYW1lLCBDbGFzc2VzLk9WRVJMQVlfQ09OVEVOVCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbkdyb3VwID0gKFxuICAgICAgICAgICAgPENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25BcHBlYXI9e3RydWV9XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkFwcGVhclRpbWVvdXQ9e3RyYW5zaXRpb25EdXJhdGlvbn1cbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXt0cmFuc2l0aW9uRHVyYXRpb259XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17dHJhbnNpdGlvbkR1cmF0aW9ufVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPXt0cmFuc2l0aW9uTmFtZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5tYXliZVJlbmRlckJhY2tkcm9wKCl9XG4gICAgICAgICAgICAgICAge2lzT3BlbiA/IGRlY29yYXRlZENoaWxkcmVuIDogbnVsbH1cbiAgICAgICAgICAgIDwvQ1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IG1lcmdlZENsYXNzTmFtZSA9IGNsYXNzTmFtZXMoQ2xhc3Nlcy5PVkVSTEFZLCB7XG4gICAgICAgICAgICBbQ2xhc3Nlcy5PVkVSTEFZX09QRU5dOiBpc09wZW4sXG4gICAgICAgICAgICBbQ2xhc3Nlcy5PVkVSTEFZX0lOTElORV06IGlubGluZSxcbiAgICAgICAgfSwgY2xhc3NOYW1lKTtcblxuICAgICAgICBjb25zdCBlbGVtZW50UHJvcHMgPSB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IG1lcmdlZENsYXNzTmFtZSxcbiAgICAgICAgICAgIG9uS2V5RG93bjogdGhpcy5oYW5kbGVLZXlEb3duLFxuICAgICAgICAgICAgLy8gbWFrZSB0aGUgY29udGFpbmVyIGZvY3VzYWJsZSBzbyB3ZSBjYW4gdHJhcCBmb2N1cyBpbnNpZGUgaXQgKHZpYSBgcGVyc2lzdGVudEZvY3VzKClgKVxuICAgICAgICAgICAgdGFiSW5kZXg6IDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGlubGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIDxzcGFuIHsuLi5lbGVtZW50UHJvcHN9IHJlZj17dGhpcy5yZWZIYW5kbGVycy5jb250YWluZXJ9Pnt0cmFuc2l0aW9uR3JvdXB9PC9zcGFuPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFBvcnRhbFxuICAgICAgICAgICAgICAgICAgICB7Li4uZWxlbWVudFByb3BzfVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJSZWY9e3RoaXMucmVmSGFuZGxlcnMuY29udGFpbmVyfVxuICAgICAgICAgICAgICAgICAgICBvbkNoaWxkcmVuTW91bnQ9e3RoaXMuaGFuZGxlQ29udGVudE1vdW50fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3RyYW5zaXRpb25Hcm91cH1cbiAgICAgICAgICAgICAgICA8L1BvcnRhbD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5V2lsbE9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogSU92ZXJsYXlQcm9wcykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaGFzRXZlck9wZW5lZDogdGhpcy5zdGF0ZS5oYXNFdmVyT3BlbmVkIHx8IG5leHRQcm9wcy5pc09wZW4gfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IElPdmVybGF5UHJvcHMpIHtcbiAgICAgICAgaWYgKHByZXZQcm9wcy5pc09wZW4gJiYgIXRoaXMucHJvcHMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlXaWxsQ2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICghcHJldlByb3BzLmlzT3BlbiAmJiB0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5V2lsbE9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5V2lsbENsb3NlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXliZVJlbmRlckJhY2tkcm9wKCkge1xuICAgICAgICBjb25zdCB7IGJhY2tkcm9wQ2xhc3NOYW1lLCBiYWNrZHJvcFByb3BzLCBoYXNCYWNrZHJvcCwgaXNPcGVuIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZiAoaGFzQmFja2Ryb3AgJiYgaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgey4uLmJhY2tkcm9wUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhDbGFzc2VzLk9WRVJMQVlfQkFDS0RST1AsIGJhY2tkcm9wQ2xhc3NOYW1lLCBiYWNrZHJvcFByb3BzLmNsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZUJhY2tkcm9wTW91c2VEb3dufVxuICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17dGhpcy5wcm9wcy5jYW5PdXRzaWRlQ2xpY2tDbG9zZSA/IDAgOiBudWxsfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb3ZlcmxheVdpbGxDbG9zZSgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuaGFuZGxlRG9jdW1lbnRGb2N1cywgLyogdXNlQ2FwdHVyZSAqLyB0cnVlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShDbGFzc2VzLk9WRVJMQVlfT1BFTik7XG5cbiAgICAgICAgY29uc3QgeyBvcGVuU3RhY2sgfSA9IE92ZXJsYXk7XG4gICAgICAgIGNvbnN0IGlkeCA9IG9wZW5TdGFjay5pbmRleE9mKHRoaXMpO1xuICAgICAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgICAgICAgb3BlblN0YWNrLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgY29uc3QgbGFzdE9wZW5lZE92ZXJsYXkgPSBPdmVybGF5LmdldExhc3RPcGVuZWQoKTtcbiAgICAgICAgICAgIGlmIChvcGVuU3RhY2subGVuZ3RoID4gMCAmJiBsYXN0T3BlbmVkT3ZlcmxheS5wcm9wcy5lbmZvcmNlRm9jdXMpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgbGFzdE9wZW5lZE92ZXJsYXkuaGFuZGxlRG9jdW1lbnRGb2N1cywgLyogdXNlQ2FwdHVyZSAqLyB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb3ZlcmxheVdpbGxPcGVuKCkge1xuICAgICAgICBjb25zdCB7IG9wZW5TdGFjayB9ID0gT3ZlcmxheTtcbiAgICAgICAgaWYgKG9wZW5TdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgT3ZlcmxheS5nZXRMYXN0T3BlbmVkKCkuaGFuZGxlRG9jdW1lbnRGb2N1cywgLyogdXNlQ2FwdHVyZSAqLyB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBvcGVuU3RhY2sucHVzaCh0aGlzKTtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5jYW5PdXRzaWRlQ2xpY2tDbG9zZSAmJiAhdGhpcy5wcm9wcy5oYXNCYWNrZHJvcCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmVuZm9yY2VGb2N1cykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMuaGFuZGxlRG9jdW1lbnRGb2N1cywgLyogdXNlQ2FwdHVyZSAqLyB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5pbmxpbmUpIHtcbiAgICAgICAgICAgIHNhZmVJbnZva2UodGhpcy5wcm9wcy5kaWRPcGVuKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmF1dG9Gb2N1cykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJpbmdGb2N1c0luc2lkZU92ZXJsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmhhc0JhY2tkcm9wKSB7XG4gICAgICAgICAgICAvLyBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0byBwcmV2ZW50IHNjcm9sbGluZyBvZiBjb250ZW50IGJlbG93IHRoZSBvdmVybGF5XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ2xhc3Nlcy5PVkVSTEFZX09QRU4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBicmluZ0ZvY3VzSW5zaWRlT3ZlcmxheSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjb250YWluZXJFbGVtZW50IH0gPSB0aGlzO1xuXG4gICAgICAgIC8vIGNvbnRhaW5lciByZWYgbWF5IGJlIHVuZGVmaW5lZCBiZXR3ZWVuIGNvbXBvbmVudCBtb3VudGluZyBhbmQgUG9ydGFsIHJlbmRlcmluZ1xuICAgICAgICAvLyBhY3RpdmVFbGVtZW50IG1heSBiZSB1bmRlZmluZWQgaW4gc29tZSByYXJlIGNhc2VzIGluIElFXG4gICAgICAgIGlmIChjb250YWluZXJFbGVtZW50ID09IG51bGwgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBudWxsIHx8ICF0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNGb2N1c091dHNpZGVNb2RhbCA9ICFjb250YWluZXJFbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICBpZiAoaXNGb2N1c091dHNpZGVNb2RhbCkge1xuICAgICAgICAgICAgLy8gZWxlbWVudCBtYXJrZWQgYXV0b2ZvY3VzIGhhcyBoaWdoZXIgcHJpb3JpdHkgdGhhbiB0aGUgb3RoZXIgY2xvd25zXG4gICAgICAgICAgICBsZXQgYXV0b2ZvY3VzRWxlbWVudCA9IGNvbnRhaW5lckVsZW1lbnQucXVlcnkoXCJbYXV0b2ZvY3VzXVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmIChhdXRvZm9jdXNFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdXRvZm9jdXNFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlQmFja2Ryb3BNb3VzZURvd24gPSAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MRGl2RWxlbWVudD4pID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuY2FuT3V0c2lkZUNsaWNrQ2xvc2UpIHtcbiAgICAgICAgICAgIHNhZmVJbnZva2UodGhpcy5wcm9wcy5vbkNsb3NlLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBzYWZlSW52b2tlKHRoaXMucHJvcHMuYmFja2Ryb3BQcm9wcy5vbk1vdXNlRG93biwgZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVEb2N1bWVudENsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgeyBpc09wZW4sIG9uQ2xvc2UgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGlzQ2xpY2tJbk92ZXJsYXkgPSB0aGlzLmNvbnRhaW5lckVsZW1lbnQgIT0gbnVsbFxuICAgICAgICAgICAgJiYgdGhpcy5jb250YWluZXJFbGVtZW50LmNvbnRhaW5zKGV2ZW50VGFyZ2V0KTtcbiAgICAgICAgaWYgKGlzT3BlbiAmJiB0aGlzLnByb3BzLmNhbk91dHNpZGVDbGlja0Nsb3NlICYmICFpc0NsaWNrSW5PdmVybGF5KSB7XG4gICAgICAgICAgICAvLyBjYXN0aW5nIHRvIGFueSBiZWNhdXNlIHRoaXMgaXMgYSBuYXRpdmUgZXZlbnRcbiAgICAgICAgICAgIHNhZmVJbnZva2Uob25DbG9zZSwgZSBhcyBhbnkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVDb250ZW50TW91bnQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgc2FmZUludm9rZSh0aGlzLnByb3BzLmRpZE9wZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmF1dG9Gb2N1cykge1xuICAgICAgICAgICAgdGhpcy5icmluZ0ZvY3VzSW5zaWRlT3ZlcmxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVEb2N1bWVudEZvY3VzID0gKGU6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZW5mb3JjZUZvY3VzXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5jb250YWluZXJFbGVtZW50ICE9IG51bGxcbiAgICAgICAgICAgICAgICAmJiAhdGhpcy5jb250YWluZXJFbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuYnJpbmdGb2N1c0luc2lkZU92ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlS2V5RG93biA9IChlOiBSZWFjdC5LZXlib2FyZEV2ZW50PEhUTUxFbGVtZW50PikgPT4ge1xuICAgICAgICBjb25zdCB7IGNhbkVzY2FwZUtleUNsb3NlLCBvbkNsb3NlIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZiAoZS53aGljaCA9PT0gS2V5cy5FU0NBUEUgJiYgY2FuRXNjYXBlS2V5Q2xvc2UpIHtcbiAgICAgICAgICAgIHNhZmVJbnZva2Uob25DbG9zZSwgZSk7XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGJyb3dzZXItc3BlY2lmaWMgZXNjYXBlIGtleSBiZWhhdmlvciAoU2FmYXJpIGV4aXRzIGZ1bGxzY3JlZW4pXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBPdmVybGF5RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoT3ZlcmxheSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
