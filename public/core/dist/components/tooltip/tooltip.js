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
var Classes = require("../../common/classes");
var position_1 = require("../../common/position");
var popover_1 = require("../popover/popover");
var Tooltip = (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        _super.apply(this, arguments);
        this.displayName = "Blueprint.Tooltip";
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, children = _a.children, intent = _a.intent, tooltipClassName = _a.tooltipClassName;
        var classes = classNames(Classes.TOOLTIP, Classes.intentClass(intent), tooltipClassName);
        return (React.createElement(popover_1.Popover, __assign({}, this.props, {arrowSize: 22, autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, interactionKind: popover_1.PopoverInteractionKind.HOVER_TARGET_ONLY, lazy: true, popoverClassName: classes, transitionDuration: 200}), children));
    };
    Tooltip.defaultProps = {
        className: "",
        content: "",
        hoverCloseDelay: 0,
        hoverOpenDelay: 150,
        isDisabled: false,
        position: position_1.Position.TOP,
        rootElementTag: "span",
        tooltipClassName: "",
        transitionDuration: 100,
        useSmartArrowPositioning: true,
        useSmartPositioning: false,
    };
    Tooltip = __decorate([
        PureRender
    ], Tooltip);
    return Tooltip;
}(React.Component));
exports.Tooltip = Tooltip;
exports.TooltipFactory = React.createFactory(Tooltip);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksVUFBVSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDcEQsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFFL0IsSUFBWSxPQUFPLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUNoRCx5QkFBeUIsdUJBQXVCLENBQUMsQ0FBQTtBQUlqRCx3QkFBZ0Qsb0JBQW9CLENBQUMsQ0FBQTtBQThHckU7SUFBNkIsMkJBQWtDO0lBQS9EO1FBQTZCLDhCQUFrQztRQWVwRCxnQkFBVyxHQUFHLG1CQUFtQixDQUFDO0lBc0I3QyxDQUFDO0lBcEJVLHdCQUFNLEdBQWI7UUFDSSxJQUFBLGVBQXlELEVBQWpELHNCQUFRLEVBQUUsa0JBQU0sRUFBRSxzQ0FBZ0IsQ0FBZ0I7UUFDMUQsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNGLE1BQU0sQ0FBQyxDQUNILG9CQUFDLGlCQUFPLGVBQ0EsSUFBSSxDQUFDLEtBQUssR0FDZCxTQUFTLEVBQUUsRUFBRyxFQUNkLFNBQVMsRUFBRSxLQUFNLEVBQ2pCLGlCQUFpQixFQUFFLEtBQU0sRUFDekIsWUFBWSxFQUFFLEtBQU0sRUFDcEIsZUFBZSxFQUFFLGdDQUFzQixDQUFDLGlCQUFrQixFQUMxRCxJQUFJLEVBQUUsSUFBSyxFQUNYLGdCQUFnQixFQUFFLE9BQVEsRUFDMUIsa0JBQWtCLEVBQUUsR0FBSSxJQUV2QixRQUFTLENBQ0osQ0FDYixDQUFDO0lBQ04sQ0FBQztJQW5DYSxvQkFBWSxHQUFrQjtRQUN4QyxTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsZUFBZSxFQUFFLENBQUM7UUFDbEIsY0FBYyxFQUFFLEdBQUc7UUFDbkIsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFLG1CQUFRLENBQUMsR0FBRztRQUN0QixjQUFjLEVBQUUsTUFBTTtRQUN0QixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLGtCQUFrQixFQUFFLEdBQUc7UUFDdkIsd0JBQXdCLEVBQUUsSUFBSTtRQUM5QixtQkFBbUIsRUFBRSxLQUFLO0tBQzdCLENBQUM7SUFkTjtRQUFDLFVBQVU7ZUFBQTtJQXNDWCxjQUFDO0FBQUQsQ0FyQ0EsQUFxQ0MsQ0FyQzRCLEtBQUssQ0FBQyxTQUFTLEdBcUMzQztBQXJDWSxlQUFPLFVBcUNuQixDQUFBO0FBRVksc0JBQWMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE1IFBhbGFudGlyIFRlY2hub2xvZ2llcywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEJTRC0zIExpY2Vuc2UgYXMgbW9kaWZpZWQgKHRoZSDigJxMaWNlbnNl4oCdKTsgeW91IG1heSBvYnRhaW4gYSBjb3B5XG4gKiBvZiB0aGUgbGljZW5zZSBhdCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL1BBVEVOVFNcbiAqL1xuXG5pbXBvcnQgKiBhcyBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgKiBhcyBQdXJlUmVuZGVyIGZyb20gXCJwdXJlLXJlbmRlci1kZWNvcmF0b3JcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgKiBhcyBDbGFzc2VzIGZyb20gXCIuLi8uLi9jb21tb24vY2xhc3Nlc1wiO1xuaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL3Bvc2l0aW9uXCI7XG5pbXBvcnQgeyBJSW50ZW50UHJvcHMsIElQcm9wcyB9IGZyb20gXCIuLi8uLi9jb21tb24vcHJvcHNcIjtcbmltcG9ydCB7IElUZXRoZXJDb25zdHJhaW50IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi90ZXRoZXJVdGlsc1wiO1xuXG5pbXBvcnQgeyBQb3BvdmVyLCBQb3BvdmVySW50ZXJhY3Rpb25LaW5kIH0gZnJvbSBcIi4uL3BvcG92ZXIvcG9wb3ZlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUb29sdGlwUHJvcHMgZXh0ZW5kcyBJUHJvcHMsIElJbnRlbnRQcm9wcyB7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRlbnQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpbnNpZGUgb2YgdGhlIHRvb2x0aXAuXG4gICAgICovXG4gICAgY29udGVudDogSlNYLkVsZW1lbnQgfCBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJhaW50cyBmb3IgdGhlIHVuZGVybHlpbmcgVGV0aGVyIGluc3RhbmNlLlxuICAgICAqIEBzZWUgaHR0cDovL2dpdGh1Yi5odWJzcG90LmNvbS90ZXRoZXIvI2NvbnN0cmFpbnRzXG4gICAgICovXG4gICAgY29uc3RyYWludHM/OiBJVGV0aGVyQ29uc3RyYWludFtdO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgdG9vbHRpcCBpcyBpbml0aWFsbHkgb3Blbi5cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIGRlZmF1bHRJc09wZW4/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIGluIG1pbGxpc2Vjb25kcyB0aGUgdG9vbHRpcCBzaG91bGQgcmVtYWluIG9wZW4gYWZ0ZXIgdGhlXG4gICAgICogdXNlciBob3ZlcnMgb2ZmIHRoZSB0cmlnZ2VyLiBUaGUgdGltZXIgaXMgY2FuY2VsZWQgaWYgdGhlIHVzZXIgbW91c2VzIG92ZXIgdGhlXG4gICAgICogdGFyZ2V0IGJlZm9yZSBpdCBleHBpcmVzLlxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBob3ZlckNsb3NlRGVsYXk/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoZSB0b29sdGlwIHNob3VsZCB3YWl0IGJlZm9yZSBvcGVuaW5nIGFmdGVyIHRoZVxuICAgICAqIHVzZXIgaG92ZXJzIG92ZXIgdGhlIHRyaWdnZXIuIFRoZSB0aW1lciBpcyBjYW5jZWxlZCBpZiB0aGUgdXNlciBtb3VzZXMgYXdheSBmcm9tIHRoZVxuICAgICAqIHRhcmdldCBiZWZvcmUgaXQgZXhwaXJlcy5cbiAgICAgKiBAZGVmYXVsdCAxNTBcbiAgICAgKi9cbiAgICBob3Zlck9wZW5EZWxheT86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHRvb2x0aXAgaXMgcmVuZGVyZWQgaW5saW5lIChhcyBhIHNpYmxpbmcgb2YgdGhlIHRhcmdldCBlbGVtZW50KS5cbiAgICAgKiBJZiBmYWxzZSwgaXQgaXMgYXR0YWNoZWQgdG8gYSBuZXcgZWxlbWVudCBhcHBlbmRlZCB0byA8Ym9keT4uXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBpbmxpbmU/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogUHJldmVudHMgdGhlIHRvb2x0aXAgZnJvbSBhcHBlYXJpbmcgd2hlbiBgdHJ1ZWAuXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBpc0Rpc2FibGVkPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoZSB0b29sdGlwIGlzIHZpc2libGUuIFBhc3NpbmcgdGhpcyBwcm9wZXJ0eSB3aWxsIHB1dCB0aGUgdG9vbHRpcCBpblxuICAgICAqIGNvbnRyb2xsZWQgbW9kZSwgd2hlcmUgdGhlIG9ubHkgd2F5IHRvIGNoYW5nZSB2aXNpYmlsaXR5IGlzIGJ5IHVwZGF0aW5nIHRoaXMgcHJvcGVydHkuXG4gICAgICogQGRlZmF1bHQgdW5kZWZpbmVkXG4gICAgICovXG4gICAgaXNPcGVuPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGludm9rZWQgaW4gY29udHJvbGxlZCBtb2RlIHdoZW4gdGhlIHRvb2x0aXAgb3BlbiBzdGF0ZSAqd291bGQqIGNoYW5nZSBkdWUgdG9cbiAgICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICAqL1xuICAgIG9uSW50ZXJhY3Rpb24/OiAobmV4dE9wZW5TdGF0ZTogYm9vbGVhbikgPT4gdm9pZDtcblxuICAgIC8qKlxuICAgICAqIFNwYWNlLWRlbGltaXRlZCBzdHJpbmcgb2YgY2xhc3MgbmFtZXMgYXBwbGllZCB0byB0aGVcbiAgICAgKiBwb3J0YWwgd2hpY2ggaG9sZHMgdGhlIHRvb2x0aXAgaWYgYGlubGluZSA9IGZhbHNlYC5cbiAgICAgKi9cbiAgICBwb3J0YWxDbGFzc05hbWU/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcG9zaXRpb24gKHJlbGF0aXZlIHRvIHRoZSB0YXJnZXQpIGF0IHdoaWNoIHRoZSB0b29sdGlwIHNob3VsZCBhcHBlYXIuXG4gICAgICogQGRlZmF1bHQgUG9zaXRpb24uVE9QXG4gICAgICovXG4gICAgcG9zaXRpb24/OiBQb3NpdGlvbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBIVE1MIHRhZyB0byB1c2Ugd2hlbiByZW5kZXJpbmcgdGhlIHRvb2x0aXAgdGFyZ2V0IHdyYXBwZXIgZWxlbWVudC5cbiAgICAgKiBAZGVmYXVsdCBcInNwYW5cIlxuICAgICAqL1xuICAgIHJvb3RFbGVtZW50VGFnPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBzcGFjZS1kZWxpbWl0ZWQgc3RyaW5nIG9mIGNsYXNzIG5hbWVzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIHRvb2x0aXAgKGJ1dCBub3QgdGhlIHRhcmdldCkuXG4gICAgICovXG4gICAgdG9vbHRpcENsYXNzTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBob3cgbG9uZyAoaW4gbWlsbGlzZWNvbmRzKSB0aGUgdG9vbHRpcCdzIGFwcGVhci9kaXNhcHBlYXIgdHJhbnNpdGlvbiB0YWtlcy5cbiAgICAgKiBUaGlzIGlzIHVzZWQgYnkgUmVhY3QgYENTU1RyYW5zaXRpb25Hcm91cGAgdG8ga25vdyB3aGVuIGEgdHJhbnNpdGlvbiBjb21wbGV0ZXNcbiAgICAgKiBhbmQgbXVzdCBtYXRjaCB0aGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiBpbiBDU1MuXG4gICAgICogT25seSBzZXQgdGhpcyBwcm9wIGlmIHlvdSBvdmVycmlkZSBCbHVlcHJpbnQncyBkZWZhdWx0IHRyYW5zaXRpb25zIHdpdGggbmV3IHRyYW5zaXRpb25zIG9mIGEgZGlmZmVyZW50IGxlbmd0aC5cbiAgICAgKiBAZGVmYXVsdCAxMDBcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uRHVyYXRpb24/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBhcnJvdydzIG9mZnNldCBzaG91bGQgYmUgY29tcHV0ZWQgc3VjaCB0aGF0IGl0IGFsd2F5cyBwb2ludHMgYXQgdGhlIGNlbnRlclxuICAgICAqIG9mIHRoZSB0YXJnZXQuIElmIGZhbHNlLCBhcnJvdyBwb3NpdGlvbiBpcyBoYXJkY29kZWQgdmlhIENTUywgd2hpY2ggZXhwZWN0cyBhIDMwcHggdGFyZ2V0LlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICB1c2VTbWFydEFycm93UG9zaXRpb25pbmc/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgdG9vbHRpcCB3aWxsIHRyeSB0byByZXBvc2l0aW9uIGl0c2VsZlxuICAgICAqIGlmIHRoZXJlIGlzbid0IHJvb20gZm9yIGl0IGluIGl0cyBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdXNlU21hcnRQb3NpdGlvbmluZz86IGJvb2xlYW47XG59XG5cbkBQdXJlUmVuZGVyXG5leHBvcnQgY2xhc3MgVG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxJVG9vbHRpcFByb3BzLCB7fT4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzOiBJVG9vbHRpcFByb3BzID0ge1xuICAgICAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwiXCIsXG4gICAgICAgIGhvdmVyQ2xvc2VEZWxheTogMCxcbiAgICAgICAgaG92ZXJPcGVuRGVsYXk6IDE1MCxcbiAgICAgICAgaXNEaXNhYmxlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiBQb3NpdGlvbi5UT1AsXG4gICAgICAgIHJvb3RFbGVtZW50VGFnOiBcInNwYW5cIixcbiAgICAgICAgdG9vbHRpcENsYXNzTmFtZTogXCJcIixcbiAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAxMDAsXG4gICAgICAgIHVzZVNtYXJ0QXJyb3dQb3NpdGlvbmluZzogdHJ1ZSxcbiAgICAgICAgdXNlU21hcnRQb3NpdGlvbmluZzogZmFsc2UsXG4gICAgfTtcblxuICAgIHB1YmxpYyBkaXNwbGF5TmFtZSA9IFwiQmx1ZXByaW50LlRvb2x0aXBcIjtcblxuICAgIHB1YmxpYyByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgICAgICBjb25zdCB7IGNoaWxkcmVuLCBpbnRlbnQsIHRvb2x0aXBDbGFzc05hbWUgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc05hbWVzKENsYXNzZXMuVE9PTFRJUCwgQ2xhc3Nlcy5pbnRlbnRDbGFzcyhpbnRlbnQpLCB0b29sdGlwQ2xhc3NOYW1lKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBvcG92ZXJcbiAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICBhcnJvd1NpemU9ezIyfVxuICAgICAgICAgICAgICAgIGF1dG9Gb2N1cz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgY2FuRXNjYXBlS2V5Q2xvc2U9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGVuZm9yY2VGb2N1cz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25LaW5kPXtQb3BvdmVySW50ZXJhY3Rpb25LaW5kLkhPVkVSX1RBUkdFVF9PTkxZfVxuICAgICAgICAgICAgICAgIGxhenk9e3RydWV9XG4gICAgICAgICAgICAgICAgcG9wb3ZlckNsYXNzTmFtZT17Y2xhc3Nlc31cbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb249ezIwMH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L1BvcG92ZXI+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgVG9vbHRpcEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFRvb2x0aXApO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
