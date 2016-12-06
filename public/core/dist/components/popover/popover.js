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
var react_dom_1 = require("react-dom");
var Tether = require("tether");
var abstractComponent_1 = require("../../common/abstractComponent");
var Classes = require("../../common/classes");
var Errors = require("../../common/errors");
var PosUtils = require("../../common/position");
var TetherUtils = require("../../common/tetherUtils");
var Utils = require("../../common/utils");
var overlay_1 = require("../overlay/overlay");
var tooltip_1 = require("../tooltip/tooltip");
var Arrows = require("./arrows");
var SVG_SHADOW_PATH = "M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378" +
    "-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z";
var SVG_ARROW_PATH = "M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005" +
    "c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z";
(function (PopoverInteractionKind) {
    PopoverInteractionKind[PopoverInteractionKind["CLICK"] = 0] = "CLICK";
    PopoverInteractionKind[PopoverInteractionKind["CLICK_TARGET_ONLY"] = 1] = "CLICK_TARGET_ONLY";
    PopoverInteractionKind[PopoverInteractionKind["HOVER"] = 2] = "HOVER";
    PopoverInteractionKind[PopoverInteractionKind["HOVER_TARGET_ONLY"] = 3] = "HOVER_TARGET_ONLY";
})(exports.PopoverInteractionKind || (exports.PopoverInteractionKind = {}));
var PopoverInteractionKind = exports.PopoverInteractionKind;
var Popover = (function (_super) {
    __extends(Popover, _super);
    function Popover(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.displayName = "Blueprint.Popover";
        this.hasDarkParent = false;
        // a flag that is set to true while we are waiting for the underlying Portal to complete rendering
        this.isContentMounting = false;
        this.refHandlers = {
            popover: function (ref) {
                _this.popoverElement = ref;
                _this.updateTether();
                _this.updateArrowPosition();
            },
            target: function (ref) {
                _this.targetElement = ref;
            },
        };
        this.handleContentMount = function () {
            if (Utils.isFunction(_this.props.popoverDidOpen) && _this.isContentMounting) {
                _this.props.popoverDidOpen();
                _this.isContentMounting = false;
            }
        };
        this.handleMouseEnter = function (e) {
            // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
            // trigger the mouse leave event, as hovering over the popover shouldn't count.
            if (_this.props.inline
                && _this.isElementInPopover(e.target)
                && _this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY) {
                _this.handleMouseLeave(e);
            }
            else if (!_this.props.isDisabled) {
                // only begin opening popover when it is enabled
                _this.setOpenState(true, e, _this.props.hoverOpenDelay);
            }
        };
        this.handleMouseLeave = function (e) {
            // user-configurable closing delay is helpful when moving mouse from target to popover
            _this.setOpenState(false, e, _this.props.hoverCloseDelay);
        };
        this.handlePopoverClick = function (e) {
            var eventTarget = e.target;
            var shouldDismiss = eventTarget.closest("." + Classes.POPOVER_DISMISS) != null;
            var overrideDismiss = eventTarget.closest("." + Classes.POPOVER_DISMISS_OVERRIDE) != null;
            if (shouldDismiss && !overrideDismiss) {
                _this.setOpenState(false, e);
            }
        };
        this.handleOverlayClose = function (e) {
            var eventTarget = e.target;
            // if click was in target, target event listener will handle things, so don't close
            if (!Utils.elementIsOrContains(_this.targetElement, eventTarget)
                || e.nativeEvent instanceof KeyboardEvent) {
                _this.setOpenState(false, e);
            }
        };
        this.handleTargetClick = function (e) {
            // ensure click did not originate from within inline popover before closing
            if (!_this.props.isDisabled && !_this.isElementInPopover(e.target)) {
                if (_this.props.isOpen == null) {
                    _this.setState(function (prevState) { return ({ isOpen: !prevState.isOpen }); });
                }
                else {
                    _this.setOpenState(!_this.props.isOpen, e);
                }
            }
        };
        var isOpen = props.defaultIsOpen;
        if (props.isOpen != null) {
            isOpen = props.isOpen;
        }
        this.state = {
            isOpen: isOpen,
            ignoreTargetDimensions: false,
            targetHeight: 0,
            targetWidth: 0,
        };
    }
    Popover.prototype.render = function () {
        var _a = this.props, className = _a.className, interactionKind = _a.interactionKind;
        var targetProps;
        if (interactionKind === PopoverInteractionKind.HOVER
            || interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY) {
            targetProps = {
                onMouseEnter: this.handleMouseEnter,
                onMouseLeave: this.handleMouseLeave,
            };
        }
        else {
            targetProps = {
                onClick: this.handleTargetClick,
            };
        }
        targetProps.className = classNames(Classes.POPOVER_TARGET, (_b = {},
            _b[Classes.POPOVER_OPEN] = this.state.isOpen,
            _b
        ), className);
        targetProps.ref = this.refHandlers.target;
        var children = this.props.children;
        if (typeof this.props.children === "string") {
            // wrap text in a <span> so that we have a consistent way to interact with the target node(s)
            children = React.DOM.span({}, this.props.children);
        }
        else {
            var child = React.Children.only(this.props.children);
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            if (this.state.isOpen && child.type === tooltip_1.Tooltip) {
                children = React.cloneElement(child, { isDisabled: true });
            }
        }
        return React.createElement(this.props.rootElementTag, targetProps, children, React.createElement(overlay_1.Overlay, {autoFocus: this.props.autoFocus, backdropClassName: Classes.POPOVER_BACKDROP, backdropProps: this.props.backdropProps, canEscapeKeyClose: this.props.canEscapeKeyClose, canOutsideClickClose: this.props.interactionKind === PopoverInteractionKind.CLICK, className: this.props.portalClassName, didOpen: this.handleContentMount, enforceFocus: this.props.enforceFocus, hasBackdrop: this.props.isModal, inline: this.props.inline, isOpen: this.state.isOpen, lazy: this.props.lazy, onClose: this.handleOverlayClose, transitionDuration: this.props.transitionDuration, transitionName: Classes.POPOVER}, this.renderPopover()));
        var _b;
    };
    Popover.prototype.componentDidMount = function () {
        this.componentDOMChange();
    };
    Popover.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        if (nextProps.isDisabled) {
            // ok to use setOpenState here because isDisabled and isOpen are mutex.
            this.setOpenState(false);
        }
        else if (nextProps.isOpen !== this.props.isOpen) {
            // propagate isOpen prop directly to state, circumventing onInteraction callback
            // (which would be invoked if this went through setOpenState)
            this.setState({ isOpen: nextProps.isOpen });
        }
    };
    Popover.prototype.componentWillUpdate = function (_, nextState) {
        if (!this.state.isOpen && nextState.isOpen) {
            this.isContentMounting = true;
            Utils.safeInvoke(this.props.popoverWillOpen);
        }
        else if (this.state.isOpen && !nextState.isOpen) {
            Utils.safeInvoke(this.props.popoverWillClose);
        }
    };
    Popover.prototype.componentDidUpdate = function () {
        this.componentDOMChange();
    };
    Popover.prototype.componentWillUnmount = function () {
        this.clearTimeout();
        this.destroyTether();
    };
    Popover.prototype.validateProps = function (props) {
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER_UNCONTROLLED_ONINTERACTION);
        }
        if (props.isOpen != null && props.isDisabled) {
            throw new Error(Errors.POPOVER_CONTROLLED_DISABLED);
        }
        if (props.isModal && props.interactionKind !== PopoverInteractionKind.CLICK) {
            throw new Error(Errors.POPOVER_MODAL_INTERACTION);
        }
        if (props.isModal && props.inline) {
            throw new Error(Errors.POPOVER_MODAL_INLINE);
        }
        if (props.useSmartPositioning && props.inline) {
            throw new Error(Errors.POPOVER_SMART_POSITIONING_INLINE);
        }
        if (typeof props.children !== "string") {
            try {
                React.Children.only(props.children);
            }
            catch (e) {
                throw new Error(Errors.POPOVER_ONE_CHILD);
            }
        }
    };
    Popover.prototype.componentDOMChange = function () {
        this.setState({
            targetHeight: this.targetElement.clientHeight,
            targetWidth: this.targetElement.clientWidth,
        });
        if (!this.props.inline) {
            this.hasDarkParent = this.targetElement.closest("." + Classes.DARK) != null;
            this.updateTether();
        }
    };
    Popover.prototype.renderPopover = function () {
        var _a = this.props, inline = _a.inline, interactionKind = _a.interactionKind;
        var popoverHandlers = {
            // always check popover clicks for dismiss class
            onClick: this.handlePopoverClick,
        };
        if ((interactionKind === PopoverInteractionKind.HOVER)
            || (inline && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)) {
            popoverHandlers.onMouseEnter = this.handleMouseEnter;
            popoverHandlers.onMouseLeave = this.handleMouseLeave;
        }
        var positionClasses = TetherUtils.getAttachmentClasses(this.props.position).join(" ");
        var containerClasses = classNames(Classes.TRANSITION_CONTAINER, (_b = {}, _b[positionClasses] = inline, _b));
        var popoverClasses = classNames(Classes.POPOVER, (_c = {},
            _c[Classes.DARK] = this.props.inheritDarkTheme && this.hasDarkParent && !inline,
            _c
        ), this.props.popoverClassName);
        var styles = this.getArrowPositionStyles();
        var transform = { transformOrigin: this.getPopoverTransformOrigin() };
        return (React.createElement("div", {className: containerClasses, ref: this.refHandlers.popover, style: styles.container}, 
            React.createElement("div", __assign({className: popoverClasses, style: transform}, popoverHandlers), 
                React.createElement("div", {className: Classes.POPOVER_ARROW, style: styles.arrow}, 
                    React.createElement("svg", {viewBox: "0 0 30 30"}, 
                        React.createElement("path", {className: Classes.POPOVER_ARROW + "-border", d: SVG_SHADOW_PATH}), 
                        React.createElement("path", {className: Classes.POPOVER_ARROW + "-fill", d: SVG_ARROW_PATH}))
                ), 
                React.createElement("div", {className: Classes.POPOVER_CONTENT}, this.props.content))
        ));
        var _b, _c;
    };
    Popover.prototype.getArrowPositionStyles = function () {
        if (this.props.useSmartArrowPositioning) {
            var dimensions = { height: this.state.targetHeight, width: this.state.targetWidth };
            return Arrows.getArrowPositionStyles(this.props.position, this.props.arrowSize, this.state.ignoreTargetDimensions, dimensions, this.props.inline);
        }
        else {
            return {};
        }
    };
    Popover.prototype.getPopoverTransformOrigin = function () {
        // if smart positioning is enabled then we must rely CSS classes to put transform origin
        // on the correct side and cannot override it in JS. (https://github.com/HubSpot/tether/issues/154)
        if (this.props.useSmartArrowPositioning && !this.props.useSmartPositioning) {
            var dimensions = { height: this.state.targetHeight, width: this.state.targetWidth };
            return Arrows.getPopoverTransformOrigin(this.props.position, this.props.arrowSize, dimensions);
        }
        else {
            return undefined;
        }
    };
    Popover.prototype.updateArrowPosition = function () {
        if (this.popoverElement != null) {
            var arrow = this.popoverElement.getElementsByClassName(Classes.POPOVER_ARROW)[0];
            var centerWidth = (this.state.targetWidth + arrow.clientWidth) / 2;
            var centerHeight = (this.state.targetHeight + arrow.clientHeight) / 2;
            var ignoreWidth = centerWidth > this.popoverElement.clientWidth
                && PosUtils.isPositionHorizontal(this.props.position);
            var ignoreHeight = centerHeight > this.popoverElement.clientHeight
                && PosUtils.isPositionVertical(this.props.position);
            if (!this.state.ignoreTargetDimensions && (ignoreWidth || ignoreHeight)) {
                this.setState({ ignoreTargetDimensions: true });
            }
            else if (this.state.ignoreTargetDimensions && !ignoreWidth && !ignoreHeight) {
                this.setState({ ignoreTargetDimensions: false });
            }
        }
    };
    Popover.prototype.updateTether = function () {
        var _this = this;
        if (this.state.isOpen && !this.props.inline && this.popoverElement != null) {
            // the .pt-popover-target span we wrap the children in won't always be as big as its children
            // so instead, we'll position tether based off of its first child.
            // NOTE: use findDOMNode(this) directly because this.targetElement may not exist yet
            var target = react_dom_1.findDOMNode(this).childNodes[0];
            var tetherOptions = TetherUtils.createTetherOptions(this.popoverElement, target, this.props.position, this.props.useSmartPositioning, this.props.constraints);
            if (this.tether == null) {
                this.tether = new Tether(tetherOptions);
            }
            else {
                this.tether.setOptions(tetherOptions);
            }
            // if props.position has just changed, Tether unfortunately positions the popover based
            // on the margins from the previous position. delay a frame for styles to catch up.
            setTimeout(function () { return _this.tether.position(); });
        }
        else {
            this.destroyTether();
        }
    };
    Popover.prototype.destroyTether = function () {
        if (this.tether != null) {
            this.tether.destroy();
        }
    };
    // a wrapper around setState({isOpen}) that will call props.onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    Popover.prototype.setOpenState = function (isOpen, e, timeout) {
        var _this = this;
        // cancel any existing timeout because we have new state
        this.clearTimeout();
        if (timeout > 0) {
            this.openStateTimeout = setTimeout(function () { return _this.setOpenState(isOpen, e); }, timeout);
        }
        else {
            if (this.props.isOpen == null) {
                this.setState({ isOpen: isOpen });
            }
            else {
                Utils.safeInvoke(this.props.onInteraction, isOpen);
            }
            if (!isOpen) {
                Utils.safeInvoke(this.props.onClose, e);
            }
        }
    };
    // clear the timeout that might be started by setOpenState()
    Popover.prototype.clearTimeout = function () {
        clearTimeout(this.openStateTimeout);
        this.openStateTimeout = null;
    };
    Popover.prototype.isElementInPopover = function (element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    };
    Popover.defaultProps = {
        arrowSize: 30,
        className: "",
        content: React.createElement("span", null),
        defaultIsOpen: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        isDisabled: false,
        isModal: false,
        popoverClassName: "",
        position: PosUtils.Position.RIGHT,
        rootElementTag: "span",
        transitionDuration: 300,
        useSmartArrowPositioning: true,
        useSmartPositioning: false,
    };
    Popover = __decorate([
        PureRender
    ], Popover);
    return Popover;
}(abstractComponent_1.AbstractComponent));
exports.Popover = Popover;
exports.PopoverFactory = React.createFactory(Popover);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL3BvcG92ZXIvcG9wb3Zlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksVUFBVSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDcEQsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFDL0IsMEJBQTRCLFdBQVcsQ0FBQyxDQUFBO0FBQ3hDLElBQVksTUFBTSxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBRWpDLGtDQUFrQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ25FLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsSUFBWSxNQUFNLFdBQU0scUJBQXFCLENBQUMsQ0FBQTtBQUM5QyxJQUFZLFFBQVEsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBRWxELElBQVksV0FBVyxXQUFNLDBCQUEwQixDQUFDLENBQUE7QUFDeEQsSUFBWSxLQUFLLFdBQU0sb0JBQW9CLENBQUMsQ0FBQTtBQUM1Qyx3QkFBMkMsb0JBQW9CLENBQUMsQ0FBQTtBQUNoRSx3QkFBd0Isb0JBQW9CLENBQUMsQ0FBQTtBQUU3QyxJQUFZLE1BQU0sV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUVuQyxJQUFNLGVBQWUsR0FBRywyREFBMkQ7SUFDL0UsK0VBQStFLENBQUM7QUFDcEYsSUFBTSxjQUFjLEdBQUcseURBQXlEO0lBQzVFLGlGQUFpRixDQUFDO0FBRXRGLFdBQVksc0JBQXNCO0lBQzlCLHFFQUFLLENBQUE7SUFDTCw2RkFBaUIsQ0FBQTtJQUNqQixxRUFBSyxDQUFBO0lBQ0wsNkZBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUxXLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFLakM7QUFMRCxJQUFZLHNCQUFzQixHQUF0Qiw4QkFLWCxDQUFBO0FBdUpEO0lBQTZCLDJCQUErQztJQTBDeEUsaUJBQW1CLEtB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QWMsRUFBRSxNQUFNO1FBQ3RCLGtCQUFrQixFQUFFLEdBQUc7UUFDdkIsd0JBQXdCLEVBQUUsSUFBSTtRQUM5QixtQkFBbUIsRUFBRSxLQUFLO0tBQzdCLENBQUM7SUFwQk47UUFBQyxVQUFVO2VBQUE7SUE2WFgsY0FBQztBQUFELENBNVhBLEFBNFhDLENBNVg0QixxQ0FBaUIsR0E0WDdDO0FBNVhZLGVBQU8sVUE0WG5CLENBQUE7QUFFWSxzQkFBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMiLCJmaWxlIjoiY29tcG9uZW50cy9wb3BvdmVyL3BvcG92ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTUgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCAqIGFzIFB1cmVSZW5kZXIgZnJvbSBcInB1cmUtcmVuZGVyLWRlY29yYXRvclwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gXCJyZWFjdC1kb21cIjtcbmltcG9ydCAqIGFzIFRldGhlciBmcm9tIFwidGV0aGVyXCI7XG5cbmltcG9ydCB7IEFic3RyYWN0Q29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9hYnN0cmFjdENvbXBvbmVudFwiO1xuaW1wb3J0ICogYXMgQ2xhc3NlcyBmcm9tIFwiLi4vLi4vY29tbW9uL2NsYXNzZXNcIjtcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tIFwiLi4vLi4vY29tbW9uL2Vycm9yc1wiO1xuaW1wb3J0ICogYXMgUG9zVXRpbHMgZnJvbSBcIi4uLy4uL2NvbW1vbi9wb3NpdGlvblwiO1xuaW1wb3J0IHsgSVByb3BzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9wcm9wc1wiO1xuaW1wb3J0ICogYXMgVGV0aGVyVXRpbHMgZnJvbSBcIi4uLy4uL2NvbW1vbi90ZXRoZXJVdGlsc1wiO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsc1wiO1xuaW1wb3J0IHsgSU92ZXJsYXlhYmxlUHJvcHMsIE92ZXJsYXkgfSBmcm9tIFwiLi4vb3ZlcmxheS9vdmVybGF5XCI7XG5pbXBvcnQgeyBUb29sdGlwIH0gZnJvbSBcIi4uL3Rvb2x0aXAvdG9vbHRpcFwiO1xuXG5pbXBvcnQgKiBhcyBBcnJvd3MgZnJvbSBcIi4vYXJyb3dzXCI7XG5cbmNvbnN0IFNWR19TSEFET1dfUEFUSCA9IFwiTTguMTEgNi4zMDJjMS4wMTUtLjkzNiAxLjg4Ny0yLjkyMiAxLjg4Ny00LjI5N3YyNmMwLTEuMzc4XCIgK1xuICAgIFwiLS44NjgtMy4zNTctMS44ODgtNC4yOTdMLjkyNSAxNy4wOWMtMS4yMzctMS4xNC0xLjIzMy0zLjAzNCAwLTQuMTdMOC4xMSA2LjMwMnpcIjtcbmNvbnN0IFNWR19BUlJPV19QQVRIID0gXCJNOC43ODcgNy4wMzZjMS4yMi0xLjEyNSAyLjIxLTMuMzc2IDIuMjEtNS4wM1YwdjMwLTIuMDA1XCIgK1xuICAgIFwiYzAtMS42NTQtLjk4My0zLjktMi4yMS01LjAzbC03LjE4My02LjYxNmMtLjgxLS43NDYtLjgwMi0xLjk2IDAtMi43bDcuMTgzLTYuNjE0elwiO1xuXG5leHBvcnQgZW51bSBQb3BvdmVySW50ZXJhY3Rpb25LaW5kIHtcbiAgICBDTElDSyxcbiAgICBDTElDS19UQVJHRVRfT05MWSxcbiAgICBIT1ZFUixcbiAgICBIT1ZFUl9UQVJHRVRfT05MWSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUG9wb3ZlclByb3BzIGV4dGVuZHMgSU92ZXJsYXlhYmxlUHJvcHMsIElQcm9wcyB7XG4gICAgLyoqIEhUTUwgcHJvcHMgZm9yIHRoZSBiYWNrZHJvcCBlbGVtZW50LiBDYW4gYmUgY29tYmluZWQgd2l0aCBgYmFja2Ryb3BDbGFzc05hbWVgLiAqL1xuICAgIGJhY2tkcm9wUHJvcHM/OiBSZWFjdC5IVE1MUHJvcHM8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRlbnQgZGlzcGxheWVkIGluc2lkZSB0aGUgcG9wb3Zlci5cbiAgICAgKi9cbiAgICBjb250ZW50PzogSlNYLkVsZW1lbnQgfCBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGVuZ3RoIG9mIGEgc2lkZSBvZiB0aGUgc3F1YXJlIHVzZWQgdG8gcmVuZGVyIHRoZSBhcnJvdy5cbiAgICAgKiBAZGVmYXVsdCAzMFxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIGFycm93U2l6ZT86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cmFpbnRzIGZvciB0aGUgdW5kZXJseWluZyBUZXRoZXIgaW5zdGFuY2UuXG4gICAgICogU2VlIGh0dHA6Ly90ZXRoZXIuaW8vI2NvbnN0cmFpbnRzLlxuICAgICAqL1xuICAgIGNvbnN0cmFpbnRzPzogVGV0aGVyVXRpbHMuSVRldGhlckNvbnN0cmFpbnRbXTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgb3BlbmVkIHN0YXRlIHdoZW4gdW5jb250cm9sbGVkLlxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZGVmYXVsdElzT3Blbj86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoZSBwb3BvdmVyIHNob3VsZCByZW1haW4gb3BlbiBhZnRlciB0aGVcbiAgICAgKiB1c2VyIGhvdmVycyBvZmYgdGhlIHRyaWdnZXIuIFRoZSB0aW1lciBpcyBjYW5jZWxlZCBpZiB0aGUgdXNlciBtb3VzZXMgb3ZlciB0aGVcbiAgICAgKiB0YXJnZXQgYmVmb3JlIGl0IGV4cGlyZXMuIFRoaXMgb3B0aW9uIG9ubHkgYXBwbGllcyB3aGVuIGBpbnRlcmFjdGlvbktpbmRgIGlzIGBIT1ZFUmAgb3JcbiAgICAgKiBgSE9WRVJfVEFSR0VUX09OTFlgLlxuICAgICAqIEBkZWZhdWx0IDMwMFxuICAgICAqL1xuICAgIGhvdmVyQ2xvc2VEZWxheT86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgdGhlIHBvcG92ZXIgc2hvdWxkIHdhaXQgYmVmb3JlIG9wZW5pbmcgYWZ0ZXIgdGhlIHRoZVxuICAgICAqIHVzZXIgaG92ZXJzIG92ZXIgdGhlIHRyaWdnZXIuIFRoZSB0aW1lciBpcyBjYW5jZWxlZCBpZiB0aGUgdXNlciBtb3VzZXMgYXdheSBmcm9tIHRoZVxuICAgICAqIHRhcmdldCBiZWZvcmUgaXQgZXhwaXJlcy4gVGhpcyBvcHRpb24gb25seSBhcHBsaWVzIHdoZW4gYGludGVyYWN0aW9uS2luZGAgaXMgYEhPVkVSYCBvclxuICAgICAqIGBIT1ZFUl9UQVJHRVRfT05MWWAuXG4gICAgICogQGRlZmF1bHQgMTUwXG4gICAgICovXG4gICAgaG92ZXJPcGVuRGVsYXk/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIGEgbm9uLWlubGluZSBwb3BvdmVyIHNob3VsZCBhdXRvbWF0aWNhbGx5IGluaGVyaXQgdGhlIGRhcmsgdGhlbWUgZnJvbSBpdHMgcGFyZW50LlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBpbmhlcml0RGFya1RoZW1lPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBraW5kIG9mIGludGVyYWN0aW9uIHRoYXQgdHJpZ2dlcnMgdGhlIGRpc3BsYXkgb2YgdGhlIHBvcG92ZXIuXG4gICAgICogQGRlZmF1bHQgUG9wb3ZlckludGVyYWN0aW9uS2luZC5DTElDS1xuICAgICAqL1xuICAgIGludGVyYWN0aW9uS2luZD86IFBvcG92ZXJJbnRlcmFjdGlvbktpbmQ7XG5cbiAgICAvKipcbiAgICAgKiBQcmV2ZW50cyB0aGUgcG9wb3ZlciBmcm9tIGFwcGVhcmluZyB3aGVuIGB0cnVlYC5cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIGlzRGlzYWJsZWQ/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogRW5hYmxlcyBhbiBpbnZpc2libGUgb3ZlcmxheSBiZW5lYXRoIHRoZSBwb3BvdmVyIHRoYXQgY2FwdHVyZXMgY2xpY2tzIGFuZCBwcmV2ZW50c1xuICAgICAqIGludGVyYWN0aW9uIHdpdGggdGhlIHJlc3Qgb2YgdGhlIGRvY3VtZW50IHVudGlsIHRoZSBwb3BvdmVyIGlzIGNsb3NlZC5cbiAgICAgKiBUaGlzIHByb3AgaXMgb25seSBhdmFpbGFibGUgd2hlbiBgaW50ZXJhY3Rpb25LaW5kYCBpcyBgUG9wb3ZlckludGVyYWN0aW9uS2luZC5DTElDS2AuXG4gICAgICogV2hlbiBtb2RhbCBwb3BvdmVycyBhcmUgb3BlbmVkLCB0aGV5IGJlY29tZSBmb2N1c2VkLlxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgaXNNb2RhbD86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBwb3BvdmVyIGlzIHZpc2libGUuIFBhc3NpbmcgdGhpcyBwcm9wIHB1dHMgdGhlIHBvcG92ZXIgaW5cbiAgICAgKiBjb250cm9sbGVkIG1vZGUsIHdoZXJlIHRoZSBvbmx5IHdheSB0byBjaGFuZ2UgdmlzaWJpbGl0eSBpcyBieSB1cGRhdGluZyB0aGlzIHByb3BlcnR5LlxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIGlzT3Blbj86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBpbnZva2VkIGluIGNvbnRyb2xsZWQgbW9kZSB3aGVuIHRoZSBwb3BvdmVyIG9wZW4gc3RhdGUgKndvdWxkKiBjaGFuZ2UgZHVlIHRvXG4gICAgICogdXNlciBpbnRlcmFjdGlvbiBiYXNlZCBvbiB0aGUgdmFsdWUgb2YgYGludGVyYWN0aW9uS2luZGAuXG4gICAgICovXG4gICAgb25JbnRlcmFjdGlvbj86IChuZXh0T3BlblN0YXRlOiBib29sZWFuKSA9PiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogQSBzcGFjZS1kZWxpbWl0ZWQgc3RyaW5nIG9mIGNsYXNzIG5hbWVzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcG92ZXIgKGJ1dCBub3QgdGhlIHRhcmdldCkuXG4gICAgICovXG4gICAgcG9wb3ZlckNsYXNzTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGludm9rZWQgd2hlbiB0aGUgcG9wb3ZlciBvcGVucyBhZnRlciBpdCBpcyBhZGRlZCB0byB0aGUgRE9NLlxuICAgICAqL1xuICAgIHBvcG92ZXJEaWRPcGVuPzogKCkgPT4gdm9pZDtcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGludm9rZWQgd2hlbiBhIHBvcG92ZXIgYmVnaW5zIHRvIGNsb3NlLlxuICAgICAqL1xuICAgIHBvcG92ZXJXaWxsQ2xvc2U/OiAoKSA9PiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgaW52b2tlZCBiZWZvcmUgdGhlIHBvcG92ZXIgb3BlbnMuXG4gICAgICovXG4gICAgcG9wb3ZlcldpbGxPcGVuPzogKCkgPT4gdm9pZDtcblxuICAgIC8qKlxuICAgICAqIFNwYWNlLWRlbGltaXRlZCBzdHJpbmcgb2YgY2xhc3MgbmFtZXMgYXBwbGllZCB0byB0aGVcbiAgICAgKiBwb3J0YWwgdGhhdCBob2xkcyB0aGUgcG9wb3ZlciBpZiBgaW5saW5lID0gZmFsc2VgLlxuICAgICAqL1xuICAgIHBvcnRhbENsYXNzTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBwb3NpdGlvbiAocmVsYXRpdmUgdG8gdGhlIHRhcmdldCkgYXQgd2hpY2ggdGhlIHBvcG92ZXIgc2hvdWxkIGFwcGVhci5cbiAgICAgKiBAZGVmYXVsdCBCbHVlcHJpbnQuQ29tbW9uLlBvc2l0aW9uLlJJR0hUXG4gICAgICovXG4gICAgcG9zaXRpb24/OiBQb3NVdGlscy5Qb3NpdGlvbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBIVE1MIHRhZyB0byB1c2Ugd2hlbiByZW5kZXJpbmcgdGhlIHBvcG92ZXIgdGFyZ2V0IHdyYXBwZXIgZWxlbWVudCAoYC5wdC1wb3BvdmVyLXRhcmdldGApLlxuICAgICAqIEBkZWZhdWx0IFwic3BhblwiXG4gICAgICovXG4gICAgcm9vdEVsZW1lbnRUYWc/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBhcnJvdydzIG9mZnNldCBzaG91bGQgYmUgY29tcHV0ZWQgc3VjaCB0aGF0IGl0IGFsd2F5cyBwb2ludHMgYXQgdGhlIGNlbnRlclxuICAgICAqIG9mIHRoZSB0YXJnZXQuIElmIGZhbHNlLCBhcnJvdyBwb3NpdGlvbiBpcyBoYXJkY29kZWQgdmlhIENTUywgd2hpY2ggZXhwZWN0cyBhIDMwcHggdGFyZ2V0LlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICB1c2VTbWFydEFycm93UG9zaXRpb25pbmc/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgcG9wb3ZlciB3aWxsIHRyeSB0byByZXBvc2l0aW9uIGl0c2VsZlxuICAgICAqIGlmIHRoZXJlIGlzbid0IHJvb20gZm9yIGl0IGluIGl0cyBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqIFRoZSBwb3BvdmVyIHdpbGwgdHJ5IHRvIGZsaXAgdG8gdGhlIG9wcG9zaXRlIHNpZGUgb2YgdGhlIHRhcmdldCBlbGVtZW50IGJ1dFxuICAgICAqIHdpbGwgbm90IG1vdmUgdG8gYW4gYWRqYWNlbnQgc2lkZS5cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHVzZVNtYXJ0UG9zaXRpb25pbmc/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQb3BvdmVyU3RhdGUge1xuICAgIGlzT3Blbj86IGJvb2xlYW47XG4gICAgaWdub3JlVGFyZ2V0RGltZW5zaW9ucz86IGJvb2xlYW47XG4gICAgdGFyZ2V0SGVpZ2h0PzogbnVtYmVyO1xuICAgIHRhcmdldFdpZHRoPzogbnVtYmVyO1xufVxuXG5AUHVyZVJlbmRlclxuZXhwb3J0IGNsYXNzIFBvcG92ZXIgZXh0ZW5kcyBBYnN0cmFjdENvbXBvbmVudDxJUG9wb3ZlclByb3BzLCBJUG9wb3ZlclN0YXRlPiB7XG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0UHJvcHM6IElQb3BvdmVyUHJvcHMgPSB7XG4gICAgICAgIGFycm93U2l6ZTogMzAsXG4gICAgICAgIGNsYXNzTmFtZTogXCJcIixcbiAgICAgICAgY29udGVudDogPHNwYW4vPixcbiAgICAgICAgZGVmYXVsdElzT3BlbjogZmFsc2UsXG4gICAgICAgIGhvdmVyQ2xvc2VEZWxheTogMzAwLFxuICAgICAgICBob3Zlck9wZW5EZWxheTogMTUwLFxuICAgICAgICBpbmhlcml0RGFya1RoZW1lOiB0cnVlLFxuICAgICAgICBpbmxpbmU6IGZhbHNlLFxuICAgICAgICBpbnRlcmFjdGlvbktpbmQ6IFBvcG92ZXJJbnRlcmFjdGlvbktpbmQuQ0xJQ0ssXG4gICAgICAgIGlzRGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc01vZGFsOiBmYWxzZSxcbiAgICAgICAgcG9wb3ZlckNsYXNzTmFtZTogXCJcIixcbiAgICAgICAgcG9zaXRpb246IFBvc1V0aWxzLlBvc2l0aW9uLlJJR0hULFxuICAgICAgICByb290RWxlbWVudFRhZzogXCJzcGFuXCIsXG4gICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMzAwLFxuICAgICAgICB1c2VTbWFydEFycm93UG9zaXRpb25pbmc6IHRydWUsXG4gICAgICAgIHVzZVNtYXJ0UG9zaXRpb25pbmc6IGZhbHNlLFxuICAgIH07XG5cbiAgICBwdWJsaWMgZGlzcGxheU5hbWUgPSBcIkJsdWVwcmludC5Qb3BvdmVyXCI7XG5cbiAgICBwcml2YXRlIGhhc0RhcmtQYXJlbnQgPSBmYWxzZTtcbiAgICAvLyBhIGZsYWcgdGhhdCBpcyBzZXQgdG8gdHJ1ZSB3aGlsZSB3ZSBhcmUgd2FpdGluZyBmb3IgdGhlIHVuZGVybHlpbmcgUG9ydGFsIHRvIGNvbXBsZXRlIHJlbmRlcmluZ1xuICAgIHByaXZhdGUgaXNDb250ZW50TW91bnRpbmcgPSBmYWxzZTtcbiAgICBwcml2YXRlIG9wZW5TdGF0ZVRpbWVvdXQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHBvcG92ZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgdGV0aGVyOiBUZXRoZXI7XG5cbiAgICBwcml2YXRlIHJlZkhhbmRsZXJzID0ge1xuICAgICAgICBwb3BvdmVyOiAocmVmOiBIVE1MRGl2RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3BvdmVyRWxlbWVudCA9IHJlZjtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV0aGVyKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFycm93UG9zaXRpb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGFyZ2V0OiAocmVmOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50YXJnZXRFbGVtZW50ID0gcmVmO1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM/OiBJUG9wb3ZlclByb3BzLCBjb250ZXh0PzogYW55KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICBsZXQgaXNPcGVuID0gcHJvcHMuZGVmYXVsdElzT3BlbjtcbiAgICAgICAgaWYgKHByb3BzLmlzT3BlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICBpc09wZW4gPSBwcm9wcy5pc09wZW47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaXNPcGVuLFxuICAgICAgICAgICAgaWdub3JlVGFyZ2V0RGltZW5zaW9uczogZmFsc2UsXG4gICAgICAgICAgICB0YXJnZXRIZWlnaHQ6IDAsXG4gICAgICAgICAgICB0YXJnZXRXaWR0aDogMCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNsYXNzTmFtZSwgaW50ZXJhY3Rpb25LaW5kIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBsZXQgdGFyZ2V0UHJvcHM6IFJlYWN0LkhUTUxQcm9wczxIVE1MRWxlbWVudD47XG4gICAgICAgIGlmIChpbnRlcmFjdGlvbktpbmQgPT09IFBvcG92ZXJJbnRlcmFjdGlvbktpbmQuSE9WRVJcbiAgICAgICAgICAgIHx8IGludGVyYWN0aW9uS2luZCA9PT0gUG9wb3ZlckludGVyYWN0aW9uS2luZC5IT1ZFUl9UQVJHRVRfT05MWSkge1xuICAgICAgICAgICAgdGFyZ2V0UHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyOiB0aGlzLmhhbmRsZU1vdXNlRW50ZXIsXG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlOiB0aGlzLmhhbmRsZU1vdXNlTGVhdmUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAvLyBhbnkgb25lIG9mIHRoZSBDTElDSyogdmFsdWVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRQcm9wcyA9IHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZVRhcmdldENsaWNrLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRQcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWVzKENsYXNzZXMuUE9QT1ZFUl9UQVJHRVQsIHtcbiAgICAgICAgICAgIFtDbGFzc2VzLlBPUE9WRVJfT1BFTl06IHRoaXMuc3RhdGUuaXNPcGVuLFxuICAgICAgICB9LCBjbGFzc05hbWUpO1xuICAgICAgICB0YXJnZXRQcm9wcy5yZWYgPSB0aGlzLnJlZkhhbmRsZXJzLnRhcmdldDtcblxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuY2hpbGRyZW4gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIC8vIHdyYXAgdGV4dCBpbiBhIDxzcGFuPiBzbyB0aGF0IHdlIGhhdmUgYSBjb25zaXN0ZW50IHdheSB0byBpbnRlcmFjdCB3aXRoIHRoZSB0YXJnZXQgbm9kZShzKVxuICAgICAgICAgICAgY2hpbGRyZW4gPSBSZWFjdC5ET00uc3Bhbih7fSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IFJlYWN0LkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbikgYXMgUmVhY3QuUmVhY3RFbGVtZW50PGFueT47XG4gICAgICAgICAgICAvLyBmb3JjZSBkaXNhYmxlIHNpbmdsZSBUb29sdGlwIGNoaWxkIHdoZW4gcG9wb3ZlciBpcyBvcGVuIChCTFVFUFJJTlQtNTUyKVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNPcGVuICYmIGNoaWxkLnR5cGUgPT09IFRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwgeyBpc0Rpc2FibGVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5yb290RWxlbWVudFRhZywgdGFyZ2V0UHJvcHMsIGNoaWxkcmVuLFxuICAgICAgICAgICAgPE92ZXJsYXlcbiAgICAgICAgICAgICAgICBhdXRvRm9jdXM9e3RoaXMucHJvcHMuYXV0b0ZvY3VzfVxuICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xhc3NOYW1lPXtDbGFzc2VzLlBPUE9WRVJfQkFDS0RST1B9XG4gICAgICAgICAgICAgICAgYmFja2Ryb3BQcm9wcz17dGhpcy5wcm9wcy5iYWNrZHJvcFByb3BzfVxuICAgICAgICAgICAgICAgIGNhbkVzY2FwZUtleUNsb3NlPXt0aGlzLnByb3BzLmNhbkVzY2FwZUtleUNsb3NlfVxuICAgICAgICAgICAgICAgIGNhbk91dHNpZGVDbGlja0Nsb3NlPXt0aGlzLnByb3BzLmludGVyYWN0aW9uS2luZCA9PT0gUG9wb3ZlckludGVyYWN0aW9uS2luZC5DTElDS31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMucG9ydGFsQ2xhc3NOYW1lfVxuICAgICAgICAgICAgICAgIGRpZE9wZW49e3RoaXMuaGFuZGxlQ29udGVudE1vdW50fVxuICAgICAgICAgICAgICAgIGVuZm9yY2VGb2N1cz17dGhpcy5wcm9wcy5lbmZvcmNlRm9jdXN9XG4gICAgICAgICAgICAgICAgaGFzQmFja2Ryb3A9e3RoaXMucHJvcHMuaXNNb2RhbH1cbiAgICAgICAgICAgICAgICBpbmxpbmU9e3RoaXMucHJvcHMuaW5saW5lfVxuICAgICAgICAgICAgICAgIGlzT3Blbj17dGhpcy5zdGF0ZS5pc09wZW59XG4gICAgICAgICAgICAgICAgbGF6eT17dGhpcy5wcm9wcy5sYXp5fVxuICAgICAgICAgICAgICAgIG9uQ2xvc2U9e3RoaXMuaGFuZGxlT3ZlcmxheUNsb3NlfVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbj17dGhpcy5wcm9wcy50cmFuc2l0aW9uRHVyYXRpb259XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9e0NsYXNzZXMuUE9QT1ZFUn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJQb3BvdmVyKCl9XG4gICAgICAgICAgICA8L092ZXJsYXk+LFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRET01DaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IElQb3BvdmVyUHJvcHMpIHtcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xuXG4gICAgICAgIGlmIChuZXh0UHJvcHMuaXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgLy8gb2sgdG8gdXNlIHNldE9wZW5TdGF0ZSBoZXJlIGJlY2F1c2UgaXNEaXNhYmxlZCBhbmQgaXNPcGVuIGFyZSBtdXRleC5cbiAgICAgICAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0UHJvcHMuaXNPcGVuICE9PSB0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgLy8gcHJvcGFnYXRlIGlzT3BlbiBwcm9wIGRpcmVjdGx5IHRvIHN0YXRlLCBjaXJjdW12ZW50aW5nIG9uSW50ZXJhY3Rpb24gY2FsbGJhY2tcbiAgICAgICAgICAgIC8vICh3aGljaCB3b3VsZCBiZSBpbnZva2VkIGlmIHRoaXMgd2VudCB0aHJvdWdoIHNldE9wZW5TdGF0ZSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW46IG5leHRQcm9wcy5pc09wZW59KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsVXBkYXRlKF86IElQb3BvdmVyUHJvcHMsIG5leHRTdGF0ZTogSVBvcG92ZXJTdGF0ZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuICYmIG5leHRTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb250ZW50TW91bnRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgVXRpbHMuc2FmZUludm9rZSh0aGlzLnByb3BzLnBvcG92ZXJXaWxsT3Blbik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5pc09wZW4gJiYgIW5leHRTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgIFV0aWxzLnNhZmVJbnZva2UodGhpcy5wcm9wcy5wb3BvdmVyV2lsbENsb3NlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RE9NQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lUZXRoZXIoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmFsaWRhdGVQcm9wcyhwcm9wczogSVBvcG92ZXJQcm9wcyAmIHtjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZX0pIHtcbiAgICAgICAgaWYgKHByb3BzLmlzT3BlbiA9PSBudWxsICYmIHByb3BzLm9uSW50ZXJhY3Rpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKEVycm9ycy5QT1BPVkVSX1VOQ09OVFJPTExFRF9PTklOVEVSQUNUSU9OKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wcy5pc09wZW4gIT0gbnVsbCAmJiBwcm9wcy5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3JzLlBPUE9WRVJfQ09OVFJPTExFRF9ESVNBQkxFRCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcHMuaXNNb2RhbCAmJiBwcm9wcy5pbnRlcmFjdGlvbktpbmQgIT09IFBvcG92ZXJJbnRlcmFjdGlvbktpbmQuQ0xJQ0spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihFcnJvcnMuUE9QT1ZFUl9NT0RBTF9JTlRFUkFDVElPTik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcHMuaXNNb2RhbCAmJiBwcm9wcy5pbmxpbmUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihFcnJvcnMuUE9QT1ZFUl9NT0RBTF9JTkxJTkUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BzLnVzZVNtYXJ0UG9zaXRpb25pbmcgJiYgcHJvcHMuaW5saW5lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3JzLlBPUE9WRVJfU01BUlRfUE9TSVRJT05JTkdfSU5MSU5FKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcHMuY2hpbGRyZW4gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgUmVhY3QuQ2hpbGRyZW4ub25seShwcm9wcy5jaGlsZHJlbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEVycm9ycy5QT1BPVkVSX09ORV9DSElMRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbXBvbmVudERPTUNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0YXJnZXRIZWlnaHQ6IHRoaXMudGFyZ2V0RWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB0YXJnZXRXaWR0aDogdGhpcy50YXJnZXRFbGVtZW50LmNsaWVudFdpZHRoLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlubGluZSkge1xuICAgICAgICAgICAgdGhpcy5oYXNEYXJrUGFyZW50ID0gdGhpcy50YXJnZXRFbGVtZW50LmNsb3Nlc3QoYC4ke0NsYXNzZXMuREFSS31gKSAhPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXRoZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyUG9wb3ZlcigpIHtcbiAgICAgICAgY29uc3QgeyBpbmxpbmUsIGludGVyYWN0aW9uS2luZCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgbGV0IHBvcG92ZXJIYW5kbGVyczogUmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTERpdkVsZW1lbnQ+ID0ge1xuICAgICAgICAgICAgLy8gYWx3YXlzIGNoZWNrIHBvcG92ZXIgY2xpY2tzIGZvciBkaXNtaXNzIGNsYXNzXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZVBvcG92ZXJDbGljayxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKChpbnRlcmFjdGlvbktpbmQgPT09IFBvcG92ZXJJbnRlcmFjdGlvbktpbmQuSE9WRVIpXG4gICAgICAgICAgICB8fCAoaW5saW5lICYmIGludGVyYWN0aW9uS2luZCA9PT0gUG9wb3ZlckludGVyYWN0aW9uS2luZC5IT1ZFUl9UQVJHRVRfT05MWSkpIHtcbiAgICAgICAgICAgIHBvcG92ZXJIYW5kbGVycy5vbk1vdXNlRW50ZXIgPSB0aGlzLmhhbmRsZU1vdXNlRW50ZXI7XG4gICAgICAgICAgICBwb3BvdmVySGFuZGxlcnMub25Nb3VzZUxlYXZlID0gdGhpcy5oYW5kbGVNb3VzZUxlYXZlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25DbGFzc2VzID0gVGV0aGVyVXRpbHMuZ2V0QXR0YWNobWVudENsYXNzZXModGhpcy5wcm9wcy5wb3NpdGlvbikuam9pbihcIiBcIik7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNsYXNzZXMgPSBjbGFzc05hbWVzKENsYXNzZXMuVFJBTlNJVElPTl9DT05UQUlORVIsIHsgW3Bvc2l0aW9uQ2xhc3Nlc106IGlubGluZSB9KTtcbiAgICAgICAgY29uc3QgcG9wb3ZlckNsYXNzZXMgPSBjbGFzc05hbWVzKENsYXNzZXMuUE9QT1ZFUiwge1xuICAgICAgICAgICAgW0NsYXNzZXMuREFSS106IHRoaXMucHJvcHMuaW5oZXJpdERhcmtUaGVtZSAmJiB0aGlzLmhhc0RhcmtQYXJlbnQgJiYgIWlubGluZSxcbiAgICAgICAgfSwgdGhpcy5wcm9wcy5wb3BvdmVyQ2xhc3NOYW1lKTtcblxuICAgICAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmdldEFycm93UG9zaXRpb25TdHlsZXMoKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0geyB0cmFuc2Zvcm1PcmlnaW46IHRoaXMuZ2V0UG9wb3ZlclRyYW5zZm9ybU9yaWdpbigpIH07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjb250YWluZXJDbGFzc2VzfSByZWY9e3RoaXMucmVmSGFuZGxlcnMucG9wb3Zlcn0gc3R5bGU9e3N0eWxlcy5jb250YWluZXJ9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtwb3BvdmVyQ2xhc3Nlc30gc3R5bGU9e3RyYW5zZm9ybX0gey4uLnBvcG92ZXJIYW5kbGVyc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzc2VzLlBPUE9WRVJfQVJST1d9IHN0eWxlPXtzdHlsZXMuYXJyb3d9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDMwIDMwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3NOYW1lPXtDbGFzc2VzLlBPUE9WRVJfQVJST1cgKyBcIi1ib3JkZXJcIn0gZD17U1ZHX1NIQURPV19QQVRIfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzTmFtZT17Q2xhc3Nlcy5QT1BPVkVSX0FSUk9XICsgXCItZmlsbFwifSBkPXtTVkdfQVJST1dfUEFUSH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzZXMuUE9QT1ZFUl9DT05URU5UfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNvbnRlbnR9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBcnJvd1Bvc2l0aW9uU3R5bGVzKCk6IHsgYXJyb3c/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzLCBjb250YWluZXI/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzIH0ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy51c2VTbWFydEFycm93UG9zaXRpb25pbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7IGhlaWdodDogdGhpcy5zdGF0ZS50YXJnZXRIZWlnaHQsIHdpZHRoOiB0aGlzLnN0YXRlLnRhcmdldFdpZHRoIH07XG4gICAgICAgICAgICByZXR1cm4gQXJyb3dzLmdldEFycm93UG9zaXRpb25TdHlsZXModGhpcy5wcm9wcy5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFycm93U2l6ZSwgdGhpcy5zdGF0ZS5pZ25vcmVUYXJnZXREaW1lbnNpb25zLCBkaW1lbnNpb25zLCB0aGlzLnByb3BzLmlubGluZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBvcG92ZXJUcmFuc2Zvcm1PcmlnaW4oKTogc3RyaW5nIHtcbiAgICAgICAgLy8gaWYgc21hcnQgcG9zaXRpb25pbmcgaXMgZW5hYmxlZCB0aGVuIHdlIG11c3QgcmVseSBDU1MgY2xhc3NlcyB0byBwdXQgdHJhbnNmb3JtIG9yaWdpblxuICAgICAgICAvLyBvbiB0aGUgY29ycmVjdCBzaWRlIGFuZCBjYW5ub3Qgb3ZlcnJpZGUgaXQgaW4gSlMuIChodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC90ZXRoZXIvaXNzdWVzLzE1NClcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudXNlU21hcnRBcnJvd1Bvc2l0aW9uaW5nICYmICF0aGlzLnByb3BzLnVzZVNtYXJ0UG9zaXRpb25pbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7IGhlaWdodDogdGhpcy5zdGF0ZS50YXJnZXRIZWlnaHQsIHdpZHRoOiB0aGlzLnN0YXRlLnRhcmdldFdpZHRoIH07XG4gICAgICAgICAgICByZXR1cm4gQXJyb3dzLmdldFBvcG92ZXJUcmFuc2Zvcm1PcmlnaW4odGhpcy5wcm9wcy5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFycm93U2l6ZSwgZGltZW5zaW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVDb250ZW50TW91bnQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHRoaXMucHJvcHMucG9wb3ZlckRpZE9wZW4pICYmIHRoaXMuaXNDb250ZW50TW91bnRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucG9wb3ZlckRpZE9wZW4oKTtcbiAgICAgICAgICAgIHRoaXMuaXNDb250ZW50TW91bnRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlTW91c2VFbnRlciA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxFbGVtZW50PikgPT4ge1xuICAgICAgICAvLyBpZiB3ZSdyZSBlbnRlcmluZyB0aGUgcG9wb3ZlciwgYW5kIHRoZSBtb2RlIGlzIHNldCB0byBiZSBIT1ZFUl9UQVJHRVRfT05MWSwgd2Ugd2FudCB0byBtYW51YWxseVxuICAgICAgICAvLyB0cmlnZ2VyIHRoZSBtb3VzZSBsZWF2ZSBldmVudCwgYXMgaG92ZXJpbmcgb3ZlciB0aGUgcG9wb3ZlciBzaG91bGRuJ3QgY291bnQuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlubGluZVxuICAgICAgICAgICAgJiYgdGhpcy5pc0VsZW1lbnRJblBvcG92ZXIoZS50YXJnZXQgYXMgRWxlbWVudClcbiAgICAgICAgICAgICYmIHRoaXMucHJvcHMuaW50ZXJhY3Rpb25LaW5kID09PSBQb3BvdmVySW50ZXJhY3Rpb25LaW5kLkhPVkVSX1RBUkdFVF9PTkxZKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlTGVhdmUoZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMucHJvcHMuaXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgLy8gb25seSBiZWdpbiBvcGVuaW5nIHBvcG92ZXIgd2hlbiBpdCBpcyBlbmFibGVkXG4gICAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZSh0cnVlLCBlLCB0aGlzLnByb3BzLmhvdmVyT3BlbkRlbGF5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlTW91c2VMZWF2ZSA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxFbGVtZW50PikgPT4ge1xuICAgICAgICAvLyB1c2VyLWNvbmZpZ3VyYWJsZSBjbG9zaW5nIGRlbGF5IGlzIGhlbHBmdWwgd2hlbiBtb3ZpbmcgbW91c2UgZnJvbSB0YXJnZXQgdG8gcG9wb3ZlclxuICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSwgZSwgdGhpcy5wcm9wcy5ob3ZlckNsb3NlRGVsYXkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlUG9wb3ZlckNsaWNrID0gKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEVsZW1lbnQ+KSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNob3VsZERpc21pc3MgPSBldmVudFRhcmdldC5jbG9zZXN0KGAuJHtDbGFzc2VzLlBPUE9WRVJfRElTTUlTU31gKSAhPSBudWxsO1xuICAgICAgICBjb25zdCBvdmVycmlkZURpc21pc3MgPSBldmVudFRhcmdldC5jbG9zZXN0KGAuJHtDbGFzc2VzLlBPUE9WRVJfRElTTUlTU19PVkVSUklERX1gKSAhPSBudWxsO1xuICAgICAgICBpZiAoc2hvdWxkRGlzbWlzcyAmJiAhb3ZlcnJpZGVEaXNtaXNzKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSwgZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZU92ZXJsYXlDbG9zZSA9IChlOiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudD4pID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnRUYXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgLy8gaWYgY2xpY2sgd2FzIGluIHRhcmdldCwgdGFyZ2V0IGV2ZW50IGxpc3RlbmVyIHdpbGwgaGFuZGxlIHRoaW5ncywgc28gZG9uJ3QgY2xvc2VcbiAgICAgICAgaWYgKCFVdGlscy5lbGVtZW50SXNPckNvbnRhaW5zKHRoaXMudGFyZ2V0RWxlbWVudCwgZXZlbnRUYXJnZXQpXG4gICAgICAgICAgICAgICAgfHwgZS5uYXRpdmVFdmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlLCBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVGFyZ2V0Q2xpY2sgPSAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MRWxlbWVudD4pID0+IHtcbiAgICAgICAgLy8gZW5zdXJlIGNsaWNrIGRpZCBub3Qgb3JpZ2luYXRlIGZyb20gd2l0aGluIGlubGluZSBwb3BvdmVyIGJlZm9yZSBjbG9zaW5nXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5pc0Rpc2FibGVkICYmICF0aGlzLmlzRWxlbWVudEluUG9wb3ZlcihlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmlzT3BlbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgocHJldlN0YXRlKSA9PiAoeyBpc09wZW46ICFwcmV2U3RhdGUuaXNPcGVuIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUoIXRoaXMucHJvcHMuaXNPcGVuLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQXJyb3dQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucG9wb3ZlckVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgYXJyb3cgPSB0aGlzLnBvcG92ZXJFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoQ2xhc3Nlcy5QT1BPVkVSX0FSUk9XKVswXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlcldpZHRoID0gKHRoaXMuc3RhdGUudGFyZ2V0V2lkdGggKyBhcnJvdy5jbGllbnRXaWR0aCkgLyAyO1xuICAgICAgICAgICAgY29uc3QgY2VudGVySGVpZ2h0ID0gKHRoaXMuc3RhdGUudGFyZ2V0SGVpZ2h0ICsgYXJyb3cuY2xpZW50SGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgICAgIGNvbnN0IGlnbm9yZVdpZHRoID0gY2VudGVyV2lkdGggPiB0aGlzLnBvcG92ZXJFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICAgICAgICAgICAgJiYgUG9zVXRpbHMuaXNQb3NpdGlvbkhvcml6b250YWwodGhpcy5wcm9wcy5wb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zdCBpZ25vcmVIZWlnaHQgPSBjZW50ZXJIZWlnaHQgPiB0aGlzLnBvcG92ZXJFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgICAgICAgICAgICYmIFBvc1V0aWxzLmlzUG9zaXRpb25WZXJ0aWNhbCh0aGlzLnByb3BzLnBvc2l0aW9uKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmlnbm9yZVRhcmdldERpbWVuc2lvbnMgJiYgKGlnbm9yZVdpZHRoIHx8IGlnbm9yZUhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtpZ25vcmVUYXJnZXREaW1lbnNpb25zOiB0cnVlfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuaWdub3JlVGFyZ2V0RGltZW5zaW9ucyAmJiAhaWdub3JlV2lkdGggJiYgIWlnbm9yZUhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lnbm9yZVRhcmdldERpbWVuc2lvbnM6IGZhbHNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVRldGhlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNPcGVuICYmICF0aGlzLnByb3BzLmlubGluZSAmJiB0aGlzLnBvcG92ZXJFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIHRoZSAucHQtcG9wb3Zlci10YXJnZXQgc3BhbiB3ZSB3cmFwIHRoZSBjaGlsZHJlbiBpbiB3b24ndCBhbHdheXMgYmUgYXMgYmlnIGFzIGl0cyBjaGlsZHJlblxuICAgICAgICAgICAgLy8gc28gaW5zdGVhZCwgd2UnbGwgcG9zaXRpb24gdGV0aGVyIGJhc2VkIG9mZiBvZiBpdHMgZmlyc3QgY2hpbGQuXG4gICAgICAgICAgICAvLyBOT1RFOiB1c2UgZmluZERPTU5vZGUodGhpcykgZGlyZWN0bHkgYmVjYXVzZSB0aGlzLnRhcmdldEVsZW1lbnQgbWF5IG5vdCBleGlzdCB5ZXRcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRET01Ob2RlKHRoaXMpLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICBjb25zdCB0ZXRoZXJPcHRpb25zID0gVGV0aGVyVXRpbHMuY3JlYXRlVGV0aGVyT3B0aW9ucyhcbiAgICAgICAgICAgICAgICB0aGlzLnBvcG92ZXJFbGVtZW50LCB0YXJnZXQsIHRoaXMucHJvcHMucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy51c2VTbWFydFBvc2l0aW9uaW5nLCB0aGlzLnByb3BzLmNvbnN0cmFpbnRzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnRldGhlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXRoZXIgPSBuZXcgVGV0aGVyKHRldGhlck9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRldGhlci5zZXRPcHRpb25zKHRldGhlck9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBwcm9wcy5wb3NpdGlvbiBoYXMganVzdCBjaGFuZ2VkLCBUZXRoZXIgdW5mb3J0dW5hdGVseSBwb3NpdGlvbnMgdGhlIHBvcG92ZXIgYmFzZWRcbiAgICAgICAgICAgIC8vIG9uIHRoZSBtYXJnaW5zIGZyb20gdGhlIHByZXZpb3VzIHBvc2l0aW9uLiBkZWxheSBhIGZyYW1lIGZvciBzdHlsZXMgdG8gY2F0Y2ggdXAuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGV0aGVyLnBvc2l0aW9uKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95VGV0aGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lUZXRoZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnRldGhlciAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRldGhlci5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhIHdyYXBwZXIgYXJvdW5kIHNldFN0YXRlKHtpc09wZW59KSB0aGF0IHdpbGwgY2FsbCBwcm9wcy5vbkludGVyYWN0aW9uIGluc3RlYWQgd2hlbiBpbiBjb250cm9sbGVkIG1vZGUuXG4gICAgLy8gc3RhcnRzIGEgdGltZW91dCB0byBkZWxheSBjaGFuZ2luZyB0aGUgc3RhdGUgaWYgYSBub24temVybyBkdXJhdGlvbiBpcyBwcm92aWRlZC5cbiAgICBwcml2YXRlIHNldE9wZW5TdGF0ZShpc09wZW46IGJvb2xlYW4sIGU/OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudD4sIHRpbWVvdXQ/OiBudW1iZXIpIHtcbiAgICAgICAgLy8gY2FuY2VsIGFueSBleGlzdGluZyB0aW1lb3V0IGJlY2F1c2Ugd2UgaGF2ZSBuZXcgc3RhdGVcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgICAgICAgaWYgKHRpbWVvdXQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5TdGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0T3BlblN0YXRlKGlzT3BlbiwgZSksIHRpbWVvdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNPcGVuID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNPcGVuIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBVdGlscy5zYWZlSW52b2tlKHRoaXMucHJvcHMub25JbnRlcmFjdGlvbiwgaXNPcGVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgVXRpbHMuc2FmZUludm9rZSh0aGlzLnByb3BzLm9uQ2xvc2UsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2xlYXIgdGhlIHRpbWVvdXQgdGhhdCBtaWdodCBiZSBzdGFydGVkIGJ5IHNldE9wZW5TdGF0ZSgpXG4gICAgcHJpdmF0ZSBjbGVhclRpbWVvdXQoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm9wZW5TdGF0ZVRpbWVvdXQpO1xuICAgICAgICB0aGlzLm9wZW5TdGF0ZVRpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNFbGVtZW50SW5Qb3BvdmVyKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wb3ZlckVsZW1lbnQgIT0gbnVsbCAmJiB0aGlzLnBvcG92ZXJFbGVtZW50LmNvbnRhaW5zKGVsZW1lbnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFBvcG92ZXJGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShQb3BvdmVyKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
