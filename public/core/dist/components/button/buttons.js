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
// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file
var classNames = require("classnames");
var React = require("react");
var Classes = require("../../common/classes");
var props_1 = require("../../common/props");
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
    }
    Button.prototype.render = function () {
        var _a = this.props, children = _a.children, disabled = _a.disabled, elementRef = _a.elementRef, onClick = _a.onClick, rightIconName = _a.rightIconName, text = _a.text;
        return (React.createElement("button", __assign({}, props_1.removeNonHTMLProps(this.props), {className: getButtonClasses(this.props), onClick: disabled ? undefined : onClick, type: "button", ref: elementRef}), 
            text, 
            children, 
            maybeRenderRightIcon(rightIconName)));
    };
    Button.displayName = "Blueprint.Button";
    return Button;
}(React.Component));
exports.Button = Button;
exports.ButtonFactory = React.createFactory(Button);
var AnchorButton = (function (_super) {
    __extends(AnchorButton, _super);
    function AnchorButton() {
        _super.apply(this, arguments);
    }
    AnchorButton.prototype.render = function () {
        var _a = this.props, children = _a.children, disabled = _a.disabled, href = _a.href, onClick = _a.onClick, rightIconName = _a.rightIconName, text = _a.text;
        return (React.createElement("a", __assign({}, props_1.removeNonHTMLProps(this.props), {className: getButtonClasses(this.props), href: disabled ? undefined : href, onClick: disabled ? undefined : onClick, ref: this.props.elementRef, role: "button", tabIndex: disabled ? undefined : 0}), 
            text, 
            children, 
            maybeRenderRightIcon(rightIconName)));
    };
    AnchorButton.displayName = "Blueprint.AnchorButton";
    return AnchorButton;
}(React.Component));
exports.AnchorButton = AnchorButton;
exports.AnchorButtonFactory = React.createFactory(AnchorButton);
function getButtonClasses(props) {
    return classNames(Classes.BUTTON, (_a = {}, _a[Classes.DISABLED] = props.disabled, _a), Classes.iconClass(props.iconName), Classes.intentClass(props.intent), props.className);
    var _a;
}
function maybeRenderRightIcon(iconName) {
    if (iconName == null) {
        return undefined;
    }
    else {
        return React.createElement("span", {className: classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName), Classes.ALIGN_RIGHT)});
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL2J1dHRvbi9idXR0b25zLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7Ozs7O0FBRUgseURBQXlEO0FBQ3pELHNDQUFzQztBQUV0QyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUUvQixJQUFZLE9BQU8sV0FBTSxzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELHNCQUFpRCxvQkFBb0IsQ0FBQyxDQUFBO0FBVXRFO0lBQTRCLDBCQUFzRTtJQUFsRztRQUE0Qiw4QkFBc0U7SUFtQmxHLENBQUM7SUFoQlUsdUJBQU0sR0FBYjtRQUNJLElBQUEsZUFBbUYsRUFBM0Usc0JBQVEsRUFBRSxzQkFBUSxFQUFFLDBCQUFVLEVBQUUsb0JBQU8sRUFBRSxnQ0FBYSxFQUFFLGNBQUksQ0FBZ0I7UUFDcEYsTUFBTSxDQUFDLENBQ0gscUJBQUMsTUFBTSxnQkFDQywwQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQ2xDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFFLEVBQ3hDLE9BQU8sRUFBRSxRQUFRLEdBQUcsU0FBUyxHQUFHLE9BQVEsRUFDeEMsSUFBSSxFQUFDLFFBQVEsRUFDYixHQUFHLEVBQUUsVUFBVztZQUVmLElBQUs7WUFDTCxRQUFTO1lBQ1Qsb0JBQW9CLENBQUMsYUFBYSxDQUFFLENBQ2hDLENBQ1osQ0FBQztJQUNOLENBQUM7SUFqQmEsa0JBQVcsR0FBRyxrQkFBa0IsQ0FBQztJQWtCbkQsYUFBQztBQUFELENBbkJBLEFBbUJDLENBbkIyQixLQUFLLENBQUMsU0FBUyxHQW1CMUM7QUFuQlksY0FBTSxTQW1CbEIsQ0FBQTtBQUVZLHFCQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV6RDtJQUFrQyxnQ0FBc0U7SUFBeEc7UUFBa0MsOEJBQXNFO0lBcUJ4RyxDQUFDO0lBbEJVLDZCQUFNLEdBQWI7UUFDSSxJQUFBLGVBQTZFLEVBQXJFLHNCQUFRLEVBQUUsc0JBQVEsRUFBRSxjQUFJLEVBQUUsb0JBQU8sRUFBRSxnQ0FBYSxFQUFFLGNBQUksQ0FBZ0I7UUFDOUUsTUFBTSxDQUFDLENBQ0gscUJBQUMsQ0FBQyxnQkFDTSwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQ2xDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFFLEVBQ3hDLElBQUksRUFBRSxRQUFRLEdBQUcsU0FBUyxHQUFHLElBQUssRUFDbEMsT0FBTyxFQUFFLFFBQVEsR0FBRyxTQUFTLEdBQUcsT0FBUSxFQUN4QyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFXLEVBQzNCLElBQUksRUFBQyxRQUFRLEVBQ2IsUUFBUSxFQUFFLFFBQVEsR0FBRyxTQUFTLEdBQUcsQ0FBRTtZQUVsQyxJQUFLO1lBQ0wsUUFBUztZQUNULG9CQUFvQixDQUFDLGFBQWEsQ0FBRSxDQUNyQyxDQUNQLENBQUM7SUFDTixDQUFDO0lBbkJhLHdCQUFXLEdBQUcsd0JBQXdCLENBQUM7SUFvQnpELG1CQUFDO0FBQUQsQ0FyQkEsQUFxQkMsQ0FyQmlDLEtBQUssQ0FBQyxTQUFTLEdBcUJoRDtBQXJCWSxvQkFBWSxlQXFCeEIsQ0FBQTtBQUVZLDJCQUFtQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFckUsMEJBQTBCLEtBQW1CO0lBQ3pDLE1BQU0sQ0FBQyxVQUFVLENBQ2IsT0FBTyxDQUFDLE1BQU0sRUFDZCxVQUFFLEdBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFFLEtBQUssQ0FBQyxRQUFRLEtBQUUsRUFDdEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQ2pDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUNqQyxLQUFLLENBQUMsU0FBUyxDQUNsQixDQUFDOztBQUNOLENBQUM7QUFFRCw4QkFBOEIsUUFBZ0I7SUFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMscUJBQUMsSUFBSSxJQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUUsRUFBRyxDQUFDO0lBQ3BILENBQUM7QUFDTCxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvYnV0dG9uL2J1dHRvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbi8vIEhBQ0tIQUNLOiB0aGVzZSBjb21wb25lbnRzIHNob3VsZCBnbyBpbiBzZXBhcmF0ZSBmaWxlc1xuLy8gdHNsaW50OmRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGVcblxuaW1wb3J0ICogYXMgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCAqIGFzIENsYXNzZXMgZnJvbSBcIi4uLy4uL2NvbW1vbi9jbGFzc2VzXCI7XG5pbXBvcnQgeyBJQWN0aW9uUHJvcHMsIHJlbW92ZU5vbkhUTUxQcm9wcyB9IGZyb20gXCIuLi8uLi9jb21tb24vcHJvcHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQnV0dG9uUHJvcHMgZXh0ZW5kcyBJQWN0aW9uUHJvcHMge1xuICAgIC8qKiBBIHJlZiBoYW5kbGVyIHRoYXQgcmVjZWl2ZXMgdGhlIG5hdGl2ZSBIVE1MIGVsZW1lbnQgYmFja2luZyB0aGlzIGNvbXBvbmVudC4gKi9cbiAgICBlbGVtZW50UmVmPzogKHJlZjogSFRNTEVsZW1lbnQpID0+IGFueTtcblxuICAgIC8qKiBOYW1lIG9mIGljb24gKHRoZSBwYXJ0IGFmdGVyIGBwdC1pY29uLWApIHRvIGFkZCB0byBidXR0b24uICovXG4gICAgcmlnaHRJY29uTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxSZWFjdC5IVE1MUHJvcHM8SFRNTEJ1dHRvbkVsZW1lbnQ+ICYgSUJ1dHRvblByb3BzLCB7fT4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheU5hbWUgPSBcIkJsdWVwcmludC5CdXR0b25cIjtcblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4sIGRpc2FibGVkLCBlbGVtZW50UmVmLCBvbkNsaWNrLCByaWdodEljb25OYW1lLCB0ZXh0IH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHsuLi5yZW1vdmVOb25IVE1MUHJvcHModGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtnZXRCdXR0b25DbGFzc2VzKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Rpc2FibGVkID8gdW5kZWZpbmVkIDogb25DbGlja31cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICByZWY9e2VsZW1lbnRSZWZ9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RleHR9XG4gICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIHttYXliZVJlbmRlclJpZ2h0SWNvbihyaWdodEljb25OYW1lKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJ1dHRvbkZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KEJ1dHRvbik7XG5cbmV4cG9ydCBjbGFzcyBBbmNob3JCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UmVhY3QuSFRNTFByb3BzPEhUTUxBbmNob3JFbGVtZW50PiAmIElCdXR0b25Qcm9wcywge30+IHtcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BsYXlOYW1lID0gXCJCbHVlcHJpbnQuQW5jaG9yQnV0dG9uXCI7XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNoaWxkcmVuLCBkaXNhYmxlZCwgaHJlZiwgb25DbGljaywgcmlnaHRJY29uTmFtZSwgdGV4dCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgey4uLnJlbW92ZU5vbkhUTUxQcm9wcyh0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2dldEJ1dHRvbkNsYXNzZXModGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgaHJlZj17ZGlzYWJsZWQgPyB1bmRlZmluZWQgOiBocmVmfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Rpc2FibGVkID8gdW5kZWZpbmVkIDogb25DbGlja31cbiAgICAgICAgICAgICAgICByZWY9e3RoaXMucHJvcHMuZWxlbWVudFJlZn1cbiAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICB0YWJJbmRleD17ZGlzYWJsZWQgPyB1bmRlZmluZWQgOiAwfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0ZXh0fVxuICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICB7bWF5YmVSZW5kZXJSaWdodEljb24ocmlnaHRJY29uTmFtZSl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQW5jaG9yQnV0dG9uRmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoQW5jaG9yQnV0dG9uKTtcblxuZnVuY3Rpb24gZ2V0QnV0dG9uQ2xhc3Nlcyhwcm9wczogSUJ1dHRvblByb3BzKSB7XG4gICAgcmV0dXJuIGNsYXNzTmFtZXMoXG4gICAgICAgIENsYXNzZXMuQlVUVE9OLFxuICAgICAgICB7IFtDbGFzc2VzLkRJU0FCTEVEXTogcHJvcHMuZGlzYWJsZWQgfSxcbiAgICAgICAgQ2xhc3Nlcy5pY29uQ2xhc3MocHJvcHMuaWNvbk5hbWUpLFxuICAgICAgICBDbGFzc2VzLmludGVudENsYXNzKHByb3BzLmludGVudCksXG4gICAgICAgIHByb3BzLmNsYXNzTmFtZSxcbiAgICApO1xufVxuXG5mdW5jdGlvbiBtYXliZVJlbmRlclJpZ2h0SWNvbihpY29uTmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKGljb25OYW1lID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWVzKENsYXNzZXMuSUNPTl9TVEFOREFSRCwgQ2xhc3Nlcy5pY29uQ2xhc3MoaWNvbk5hbWUpLCBDbGFzc2VzLkFMSUdOX1JJR0hUKX0gLz47XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
