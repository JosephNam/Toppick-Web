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
var classNames = require("classnames");
var React = require("react");
var Classes = require("../../common/classes");
(function (AnimationStates) {
    AnimationStates[AnimationStates["CLOSED"] = 0] = "CLOSED";
    AnimationStates[AnimationStates["OPENING"] = 1] = "OPENING";
    AnimationStates[AnimationStates["OPEN"] = 2] = "OPEN";
    AnimationStates[AnimationStates["CLOSING_START"] = 3] = "CLOSING_START";
    AnimationStates[AnimationStates["CLOSING_END"] = 4] = "CLOSING_END";
})(exports.AnimationStates || (exports.AnimationStates = {}));
var AnimationStates = exports.AnimationStates;
/*
 * A collapse can be in one of 5 states:
 * CLOSED
 * When in this state, the contents of the collapse is not rendered, the collapse height is 0,
 * and the body Y is at -height (so that the bottom of the body is at Y=0).
 *
 * OPEN
 * When in this state, the collapse height is set to auto, and the body Y is set to 0 (so the element can be seen
 * as normal).
 *
 * CLOSING_START
 * When in this state, height has been changed from auto to the measured height of the body to prepare for the
 * closing animation in CLOSING_END.
 *
 * CLOSING_END
 * When in this state, the height is set to 0 and the body Y is at -height. Both of these properties are transformed,
 * and then after the animation is complete, the state changes to CLOSED.
 *
 * OPENING
 * When in this state, the body is re-rendered, height is set to the measured body height and the body Y is set to 0.
 * This is all animated, and on complete, the state changes to OPEN.
 *
 * When changing the isOpen prop, the following happens to the states:
 * isOpen = true : CLOSED -> OPENING -> OPEN
 * isOpen = false: OPEN -> CLOSING_START -> CLOSING_END -> CLOSED
 * These are all animated.
 */
var Collapse = (function (_super) {
    __extends(Collapse, _super);
    function Collapse() {
        var _this = this;
        _super.apply(this, arguments);
        this.state = {
            animationState: AnimationStates.OPEN,
            height: "0px",
        };
        // The most recent non-0 height (once a height has been measured - is 0 until then)
        this.height = 0;
        this.contentsRefHandler = function (el) {
            _this.contents = el;
            if (el != null) {
                _this.height = _this.contents.clientHeight;
                _this.setState({
                    animationState: _this.props.isOpen ? AnimationStates.OPEN : AnimationStates.CLOSED,
                    height: _this.height + "px",
                });
            }
        };
    }
    Collapse.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (this.contents != null && this.contents.clientHeight !== 0) {
            this.height = this.contents.clientHeight;
        }
        if (this.props.isOpen !== nextProps.isOpen) {
            if (this.state.animationState !== AnimationStates.CLOSED && !nextProps.isOpen) {
                this.setState({
                    animationState: AnimationStates.CLOSING_START,
                    height: this.height + "px",
                });
            }
            else if (this.state.animationState !== AnimationStates.OPEN && nextProps.isOpen) {
                this.setState({
                    animationState: AnimationStates.OPENING,
                    height: this.height + "px",
                });
                this.delayedTimeout = setTimeout(function () { return _this.onDelayedStateChange(); }, this.props.transitionDuration);
            }
        }
    };
    Collapse.prototype.render = function () {
        var showContents = (this.state.animationState !== AnimationStates.CLOSED);
        var displayWithTransform = showContents && (this.state.animationState !== AnimationStates.CLOSING_END);
        var isAutoHeight = (this.state.height === "auto");
        var containerStyle = {
            height: showContents ? this.state.height : null,
            overflow: isAutoHeight ? "visible" : null,
            transition: isAutoHeight ? "none" : null,
        };
        var contentsStyle = {
            transform: displayWithTransform ? "translateY(0)" : "translateY(-" + this.height + "px)",
            transition: isAutoHeight ? "none" : null,
        };
        // quick type cast because there's no single overload that supports all three ReactTypes (str | Cmp | SFC)
        return React.createElement(this.props.component, {
            className: classNames(Classes.COLLAPSE, this.props.className),
            style: containerStyle,
        }, React.createElement("div", {className: "pt-collapse-body", ref: this.contentsRefHandler, style: contentsStyle}, showContents ? this.props.children : null));
    };
    Collapse.prototype.componentDidMount = function () {
        this.forceUpdate();
        if (this.props.isOpen) {
            this.setState({ animationState: AnimationStates.OPEN, height: "auto" });
        }
        else {
            this.setState({ animationState: AnimationStates.CLOSED });
        }
    };
    Collapse.prototype.componentDidUpdate = function () {
        var _this = this;
        if (this.state.animationState === AnimationStates.CLOSING_START) {
            this.closingTimeout =
                setTimeout(function () { return _this.setState({ animationState: AnimationStates.CLOSING_END, height: "0px" }); });
            this.delayedTimeout = setTimeout(function () { return _this.onDelayedStateChange(); }, this.props.transitionDuration);
        }
    };
    Collapse.prototype.componentWillUnmount = function () {
        clearTimeout(this.closingTimeout);
        clearTimeout(this.delayedTimeout);
    };
    Collapse.prototype.onDelayedStateChange = function () {
        switch (this.state.animationState) {
            case AnimationStates.OPENING:
                this.setState({ animationState: AnimationStates.OPEN, height: "auto" });
                break;
            case AnimationStates.CLOSING_END:
                this.setState({ animationState: AnimationStates.CLOSED });
                break;
            default:
                break;
        }
    };
    Collapse.displayName = "Blueprint.Collapse";
    Collapse.defaultProps = {
        component: "div",
        isOpen: false,
        transitionDuration: 200,
    };
    return Collapse;
}(React.Component));
exports.Collapse = Collapse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL2NvbGxhcHNlL2NvbGxhcHNlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRzs7Ozs7OztBQUVILElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBRS9CLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFpQ2hELFdBQVksZUFBZTtJQUN2Qix5REFBTSxDQUFBO0lBQ04sMkRBQU8sQ0FBQTtJQUNQLHFEQUFJLENBQUE7SUFDSix1RUFBYSxDQUFBO0lBQ2IsbUVBQVcsQ0FBQTtBQUNmLENBQUMsRUFOVyx1QkFBZSxLQUFmLHVCQUFlLFFBTTFCO0FBTkQsSUFBWSxlQUFlLEdBQWYsdUJBTVgsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNIO0lBQThCLDRCQUErQztJQUE3RTtRQUFBLGlCQWtIQztRQWxINkIsOEJBQStDO1FBU2xFLFVBQUssR0FBRztZQUNYLGNBQWMsRUFBRSxlQUFlLENBQUMsSUFBSTtZQUNwQyxNQUFNLEVBQUUsS0FBSztTQUNoQixDQUFDO1FBSUYsbUZBQW1GO1FBQzNFLFdBQU0sR0FBVyxDQUFDLENBQUM7UUEwRW5CLHVCQUFrQixHQUFHLFVBQUMsRUFBZTtZQUN6QyxLQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNuQixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO2dCQUN6QyxLQUFJLENBQUMsUUFBUSxDQUFDO29CQUNWLGNBQWMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQyxNQUFNO29CQUNqRixNQUFNLEVBQUssS0FBSSxDQUFDLE1BQU0sT0FBSTtpQkFDN0IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQTtJQWNMLENBQUM7SUE1RlUsNENBQXlCLEdBQWhDLFVBQWlDLFNBQXlCO1FBQTFELGlCQWtCQztRQWpCRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDN0MsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxLQUFLLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDVixjQUFjLEVBQUUsZUFBZSxDQUFDLGFBQWE7b0JBQzdDLE1BQU0sRUFBSyxJQUFJLENBQUMsTUFBTSxPQUFJO2lCQUM3QixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxLQUFLLGVBQWUsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hGLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ1YsY0FBYyxFQUFFLGVBQWUsQ0FBQyxPQUFPO29CQUN2QyxNQUFNLEVBQUssSUFBSSxDQUFDLE1BQU0sT0FBSTtpQkFDN0IsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBM0IsQ0FBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDdkcsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0seUJBQU0sR0FBYjtRQUNJLElBQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLElBQU0sb0JBQW9CLEdBQUcsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pHLElBQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7UUFFcEQsSUFBTSxjQUFjLEdBQUc7WUFDbkIsTUFBTSxFQUFFLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJO1lBQy9DLFFBQVEsRUFBRSxZQUFZLEdBQUcsU0FBUyxHQUFHLElBQUk7WUFDekMsVUFBVSxFQUFFLFlBQVksR0FBRyxNQUFNLEdBQUcsSUFBSTtTQUMzQyxDQUFDO1FBRUYsSUFBTSxhQUFhLEdBQUc7WUFDbEIsU0FBUyxFQUFFLG9CQUFvQixHQUFHLGVBQWUsR0FBRyxpQkFBZSxJQUFJLENBQUMsTUFBTSxRQUFLO1lBQ25GLFVBQVUsRUFBRSxZQUFZLEdBQUcsTUFBTSxHQUFHLElBQUk7U0FDM0MsQ0FBQztRQUVGLDBHQUEwRztRQUMxRyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQW1CLEVBQUU7WUFDdkQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzdELEtBQUssRUFBRSxjQUFjO1NBQ3hCLEVBQ0cscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGtCQUFtQixFQUFDLEtBQUssRUFBRSxhQUFjLEdBQ2hGLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFLLENBQ3pDLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFFTSxvQ0FBaUIsR0FBeEI7UUFDSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUM7SUFDTCxDQUFDO0lBRU0scUNBQWtCLEdBQXpCO1FBQUEsaUJBTUM7UUFMRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsS0FBSyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsY0FBYztnQkFDZixVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBN0UsQ0FBNkUsQ0FBQyxDQUFDO1lBQ3BHLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBM0IsQ0FBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdkcsQ0FBQztJQUNMLENBQUM7SUFFTSx1Q0FBb0IsR0FBM0I7UUFDSSxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQWFPLHVDQUFvQixHQUE1QjtRQUNJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNoQyxLQUFLLGVBQWUsQ0FBQyxPQUFPO2dCQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3hFLEtBQUssQ0FBQztZQUNWLEtBQUssZUFBZSxDQUFDLFdBQVc7Z0JBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQzFELEtBQUssQ0FBQztZQUNWO2dCQUNJLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDTCxDQUFDO0lBaEhhLG9CQUFXLEdBQUcsb0JBQW9CLENBQUM7SUFFbkMscUJBQVksR0FBbUI7UUFDekMsU0FBUyxFQUFFLEtBQUs7UUFDaEIsTUFBTSxFQUFFLEtBQUs7UUFDYixrQkFBa0IsRUFBRSxHQUFHO0tBQzFCLENBQUM7SUEyR04sZUFBQztBQUFELENBbEhBLEFBa0hDLENBbEg2QixLQUFLLENBQUMsU0FBUyxHQWtINUM7QUFsSFksZ0JBQVEsV0FrSHBCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9jb2xsYXBzZS9jb2xsYXBzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNSBQYWxhbnRpciBUZWNobm9sb2dpZXMsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QtMyBMaWNlbnNlIGFzIG1vZGlmaWVkICh0aGUg4oCcTGljZW5zZeKAnSk7IHlvdSBtYXkgb2J0YWluIGEgY29weVxuICogb2YgdGhlIGxpY2Vuc2UgYXQgaHR0cHM6Ly9naXRodWIuY29tL3BhbGFudGlyL2JsdWVwcmludC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKiBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3BhbGFudGlyL2JsdWVwcmludC9ibG9iL21hc3Rlci9QQVRFTlRTXG4gKi9cblxuaW1wb3J0ICogYXMgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCAqIGFzIENsYXNzZXMgZnJvbSBcIi4uLy4uL2NvbW1vbi9jbGFzc2VzXCI7XG5pbXBvcnQgeyBJUHJvcHMgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3Byb3BzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbGxhcHNlUHJvcHMgZXh0ZW5kcyBJUHJvcHMge1xuICAgIC8qKlxuICAgICAqIENvbXBvbmVudCB0byByZW5kZXIgYXMgdGhlIHJvb3QgZWxlbWVudC5cbiAgICAgKiBVc2VmdWwgd2hlbiByZW5kZXJpbmcgYSBDb2xsYXBzZSBpbnNpZGUgYSBgPHRhYmxlPmAsIGZvciBpbnN0YW5jZS5cbiAgICAgKiBAZGVmYXVsdCBcImRpdlwiXG4gICAgICovXG4gICAgY29tcG9uZW50PzogUmVhY3QuUmVhY3RUeXBlO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIG9wZW4gb3IgY2xvc2VkLlxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgaXNPcGVuPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsZW5ndGggb2YgdGltZSB0aGUgdHJhbnNpdGlvbiB0YWtlcywgaW4gbXMuIFRoaXMgbXVzdCBtYXRjaCB0aGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiBpbiBDU1MuXG4gICAgICogT25seSBzZXQgdGhpcyBwcm9wIGlmIHlvdSBvdmVycmlkZSBCbHVlcHJpbnQncyBkZWZhdWx0IHRyYW5zaXRpb25zIHdpdGggbmV3IHRyYW5zaXRpb25zIG9mIGEgZGlmZmVyZW50IGxlbmd0aC5cbiAgICAgKiBAZGVmYXVsdCAyMDBcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uRHVyYXRpb24/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbGxhcHNlU3RhdGUge1xuICAgIC8qKiBUaGUgaGVpZ2h0IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBjb250ZW50IGFuaW1hdGlvbnMuIFRoaXMgaXMgYSBDU1MgdmFsdWUsIG5vdCBqdXN0IGEgbnVtYmVyLiAqL1xuICAgIGhlaWdodD86IHN0cmluZztcblxuICAgIC8qKiBUaGUgc3RhdGUgdGhlIGVsZW1lbnQgaXMgY3VycmVudGx5IGluLiAqL1xuICAgIGFuaW1hdGlvblN0YXRlPzogQW5pbWF0aW9uU3RhdGVzO1xufVxuXG5leHBvcnQgZW51bSBBbmltYXRpb25TdGF0ZXMge1xuICAgIENMT1NFRCxcbiAgICBPUEVOSU5HLFxuICAgIE9QRU4sXG4gICAgQ0xPU0lOR19TVEFSVCxcbiAgICBDTE9TSU5HX0VORCxcbn1cblxuLypcbiAqIEEgY29sbGFwc2UgY2FuIGJlIGluIG9uZSBvZiA1IHN0YXRlczpcbiAqIENMT1NFRFxuICogV2hlbiBpbiB0aGlzIHN0YXRlLCB0aGUgY29udGVudHMgb2YgdGhlIGNvbGxhcHNlIGlzIG5vdCByZW5kZXJlZCwgdGhlIGNvbGxhcHNlIGhlaWdodCBpcyAwLFxuICogYW5kIHRoZSBib2R5IFkgaXMgYXQgLWhlaWdodCAoc28gdGhhdCB0aGUgYm90dG9tIG9mIHRoZSBib2R5IGlzIGF0IFk9MCkuXG4gKlxuICogT1BFTlxuICogV2hlbiBpbiB0aGlzIHN0YXRlLCB0aGUgY29sbGFwc2UgaGVpZ2h0IGlzIHNldCB0byBhdXRvLCBhbmQgdGhlIGJvZHkgWSBpcyBzZXQgdG8gMCAoc28gdGhlIGVsZW1lbnQgY2FuIGJlIHNlZW5cbiAqIGFzIG5vcm1hbCkuXG4gKlxuICogQ0xPU0lOR19TVEFSVFxuICogV2hlbiBpbiB0aGlzIHN0YXRlLCBoZWlnaHQgaGFzIGJlZW4gY2hhbmdlZCBmcm9tIGF1dG8gdG8gdGhlIG1lYXN1cmVkIGhlaWdodCBvZiB0aGUgYm9keSB0byBwcmVwYXJlIGZvciB0aGVcbiAqIGNsb3NpbmcgYW5pbWF0aW9uIGluIENMT1NJTkdfRU5ELlxuICpcbiAqIENMT1NJTkdfRU5EXG4gKiBXaGVuIGluIHRoaXMgc3RhdGUsIHRoZSBoZWlnaHQgaXMgc2V0IHRvIDAgYW5kIHRoZSBib2R5IFkgaXMgYXQgLWhlaWdodC4gQm90aCBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFyZSB0cmFuc2Zvcm1lZCxcbiAqIGFuZCB0aGVuIGFmdGVyIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGUsIHRoZSBzdGF0ZSBjaGFuZ2VzIHRvIENMT1NFRC5cbiAqXG4gKiBPUEVOSU5HXG4gKiBXaGVuIGluIHRoaXMgc3RhdGUsIHRoZSBib2R5IGlzIHJlLXJlbmRlcmVkLCBoZWlnaHQgaXMgc2V0IHRvIHRoZSBtZWFzdXJlZCBib2R5IGhlaWdodCBhbmQgdGhlIGJvZHkgWSBpcyBzZXQgdG8gMC5cbiAqIFRoaXMgaXMgYWxsIGFuaW1hdGVkLCBhbmQgb24gY29tcGxldGUsIHRoZSBzdGF0ZSBjaGFuZ2VzIHRvIE9QRU4uXG4gKlxuICogV2hlbiBjaGFuZ2luZyB0aGUgaXNPcGVuIHByb3AsIHRoZSBmb2xsb3dpbmcgaGFwcGVucyB0byB0aGUgc3RhdGVzOlxuICogaXNPcGVuID0gdHJ1ZSA6IENMT1NFRCAtPiBPUEVOSU5HIC0+IE9QRU5cbiAqIGlzT3BlbiA9IGZhbHNlOiBPUEVOIC0+IENMT1NJTkdfU1RBUlQgLT4gQ0xPU0lOR19FTkQgLT4gQ0xPU0VEXG4gKiBUaGVzZSBhcmUgYWxsIGFuaW1hdGVkLlxuICovXG5leHBvcnQgY2xhc3MgQ29sbGFwc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SUNvbGxhcHNlUHJvcHMsIElDb2xsYXBzZVN0YXRlPiB7XG4gICAgcHVibGljIHN0YXRpYyBkaXNwbGF5TmFtZSA9IFwiQmx1ZXByaW50LkNvbGxhcHNlXCI7XG5cbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHRQcm9wczogSUNvbGxhcHNlUHJvcHMgPSB7XG4gICAgICAgIGNvbXBvbmVudDogXCJkaXZcIixcbiAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAyMDAsXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0ZSA9IHtcbiAgICAgICAgYW5pbWF0aW9uU3RhdGU6IEFuaW1hdGlvblN0YXRlcy5PUEVOLFxuICAgICAgICBoZWlnaHQ6IFwiMHB4XCIsXG4gICAgfTtcblxuICAgIC8vIFRoZSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBjb2xsYXBzZS5cbiAgICBwcml2YXRlIGNvbnRlbnRzOiBIVE1MRWxlbWVudDtcbiAgICAvLyBUaGUgbW9zdCByZWNlbnQgbm9uLTAgaGVpZ2h0IChvbmNlIGEgaGVpZ2h0IGhhcyBiZWVuIG1lYXN1cmVkIC0gaXMgMCB1bnRpbCB0aGVuKVxuICAgIHByaXZhdGUgaGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBjbG9zaW5nVGltZW91dDogbnVtYmVyO1xuICAgIHByaXZhdGUgZGVsYXllZFRpbWVvdXQ6IG51bWJlcjtcblxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogSUNvbGxhcHNlUHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudHMgIT0gbnVsbCAmJiB0aGlzLmNvbnRlbnRzLmNsaWVudEhlaWdodCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNvbnRlbnRzLmNsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5pc09wZW4gIT09IG5leHRQcm9wcy5pc09wZW4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmFuaW1hdGlvblN0YXRlICE9PSBBbmltYXRpb25TdGF0ZXMuQ0xPU0VEICYmICFuZXh0UHJvcHMuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlOiBBbmltYXRpb25TdGF0ZXMuQ0xPU0lOR19TVEFSVCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLmhlaWdodH1weGAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYW5pbWF0aW9uU3RhdGUgIT09IEFuaW1hdGlvblN0YXRlcy5PUEVOICYmIG5leHRQcm9wcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGU6IEFuaW1hdGlvblN0YXRlcy5PUEVOSU5HLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGAke3RoaXMuaGVpZ2h0fXB4YCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGF5ZWRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLm9uRGVsYXllZFN0YXRlQ2hhbmdlKCksIHRoaXMucHJvcHMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHNob3dDb250ZW50cyA9ICh0aGlzLnN0YXRlLmFuaW1hdGlvblN0YXRlICE9PSBBbmltYXRpb25TdGF0ZXMuQ0xPU0VEKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVdpdGhUcmFuc2Zvcm0gPSBzaG93Q29udGVudHMgJiYgKHRoaXMuc3RhdGUuYW5pbWF0aW9uU3RhdGUgIT09IEFuaW1hdGlvblN0YXRlcy5DTE9TSU5HX0VORCk7XG4gICAgICAgIGNvbnN0IGlzQXV0b0hlaWdodCA9ICh0aGlzLnN0YXRlLmhlaWdodCA9PT0gXCJhdXRvXCIpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge1xuICAgICAgICAgICAgaGVpZ2h0OiBzaG93Q29udGVudHMgPyB0aGlzLnN0YXRlLmhlaWdodCA6IG51bGwsXG4gICAgICAgICAgICBvdmVyZmxvdzogaXNBdXRvSGVpZ2h0ID8gXCJ2aXNpYmxlXCIgOiBudWxsLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogaXNBdXRvSGVpZ2h0ID8gXCJub25lXCIgOiBudWxsLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnRzU3R5bGUgPSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IGRpc3BsYXlXaXRoVHJhbnNmb3JtID8gXCJ0cmFuc2xhdGVZKDApXCIgOiBgdHJhbnNsYXRlWSgtJHt0aGlzLmhlaWdodH1weClgLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogaXNBdXRvSGVpZ2h0ID8gXCJub25lXCIgOiBudWxsLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHF1aWNrIHR5cGUgY2FzdCBiZWNhdXNlIHRoZXJlJ3Mgbm8gc2luZ2xlIG92ZXJsb2FkIHRoYXQgc3VwcG9ydHMgYWxsIHRocmVlIFJlYWN0VHlwZXMgKHN0ciB8IENtcCB8IFNGQylcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5jb21wb25lbnQgYXMgc3RyaW5nLCB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMoQ2xhc3Nlcy5DT0xMQVBTRSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpLFxuICAgICAgICAgICAgc3R5bGU6IGNvbnRhaW5lclN0eWxlLFxuICAgICAgICB9LFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC1jb2xsYXBzZS1ib2R5XCIgcmVmPXt0aGlzLmNvbnRlbnRzUmVmSGFuZGxlcn0gc3R5bGU9e2NvbnRlbnRzU3R5bGV9PlxuICAgICAgICAgICAgICAgIHtzaG93Q29udGVudHMgPyB0aGlzLnByb3BzLmNoaWxkcmVuIDogbnVsbH1cbiAgICAgICAgICAgIDwvZGl2PixcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYW5pbWF0aW9uU3RhdGU6IEFuaW1hdGlvblN0YXRlcy5PUEVOLCBoZWlnaHQ6IFwiYXV0b1wiIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFuaW1hdGlvblN0YXRlOiBBbmltYXRpb25TdGF0ZXMuQ0xPU0VEIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYW5pbWF0aW9uU3RhdGUgPT09IEFuaW1hdGlvblN0YXRlcy5DTE9TSU5HX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NpbmdUaW1lb3V0ID1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoeyBhbmltYXRpb25TdGF0ZTogQW5pbWF0aW9uU3RhdGVzLkNMT1NJTkdfRU5ELCBoZWlnaHQ6IFwiMHB4XCIgfSkpO1xuICAgICAgICAgICAgdGhpcy5kZWxheWVkVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5vbkRlbGF5ZWRTdGF0ZUNoYW5nZSgpLCB0aGlzLnByb3BzLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNsb3NpbmdUaW1lb3V0KTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZFRpbWVvdXQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29udGVudHNSZWZIYW5kbGVyID0gKGVsOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRlbnRzID0gZWw7XG4gICAgICAgIGlmIChlbCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY29udGVudHMuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGU6IHRoaXMucHJvcHMuaXNPcGVuID8gQW5pbWF0aW9uU3RhdGVzLk9QRU4gOiBBbmltYXRpb25TdGF0ZXMuQ0xPU0VELFxuICAgICAgICAgICAgICAgIGhlaWdodDogYCR7dGhpcy5oZWlnaHR9cHhgLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRGVsYXllZFN0YXRlQ2hhbmdlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUuYW5pbWF0aW9uU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgQW5pbWF0aW9uU3RhdGVzLk9QRU5JTkc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFuaW1hdGlvblN0YXRlOiBBbmltYXRpb25TdGF0ZXMuT1BFTiwgaGVpZ2h0OiBcImF1dG9cIiB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQW5pbWF0aW9uU3RhdGVzLkNMT1NJTkdfRU5EOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhbmltYXRpb25TdGF0ZTogQW5pbWF0aW9uU3RhdGVzLkNMT1NFRCB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
