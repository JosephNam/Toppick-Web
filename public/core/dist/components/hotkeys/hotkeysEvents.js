/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
var react_1 = require("react");
var utils_1 = require("../../common/utils");
var hotkey_1 = require("./hotkey");
var hotkeyParser_1 = require("./hotkeyParser");
var hotkeysDialog_1 = require("./hotkeysDialog");
var SHOW_DIALOG_KEY_COMBO = hotkeyParser_1.parseKeyCombo("?");
(function (HotkeyScope) {
    HotkeyScope[HotkeyScope["LOCAL"] = 0] = "LOCAL";
    HotkeyScope[HotkeyScope["GLOBAL"] = 1] = "GLOBAL";
})(exports.HotkeyScope || (exports.HotkeyScope = {}));
var HotkeyScope = exports.HotkeyScope;
var HotkeysEvents = (function () {
    function HotkeysEvents(scope) {
        var _this = this;
        this.scope = scope;
        this.actions = [];
        this.handleKeyDown = function (e) {
            if (_this.isTextInput(e) || hotkeysDialog_1.isHotkeysDialogShowing()) {
                return;
            }
            var combo = hotkeyParser_1.getKeyCombo(e);
            if (hotkeyParser_1.comboMatches(SHOW_DIALOG_KEY_COMBO, combo)) {
                hotkeysDialog_1.showHotkeysDialog(_this.actions.map(function (action) { return action.props; }));
                return;
            }
            for (var _i = 0, _a = _this.actions; _i < _a.length; _i++) {
                var action = _a[_i];
                if (hotkeyParser_1.comboMatches(action.combo, combo)) {
                    utils_1.safeInvoke(action.props.onKeyDown, e);
                }
            }
        };
        this.handleKeyUp = function (e) {
            if (_this.isTextInput(e) || hotkeysDialog_1.isHotkeysDialogShowing()) {
                return;
            }
            var combo = hotkeyParser_1.getKeyCombo(e);
            for (var _i = 0, _a = _this.actions; _i < _a.length; _i++) {
                var action = _a[_i];
                if (hotkeyParser_1.comboMatches(action.combo, combo)) {
                    utils_1.safeInvoke(action.props.onKeyUp, e);
                }
            }
        };
    }
    HotkeysEvents.prototype.count = function () {
        return this.actions.length;
    };
    HotkeysEvents.prototype.clear = function () {
        this.actions = [];
    };
    HotkeysEvents.prototype.setHotkeys = function (props) {
        var _this = this;
        var actions = [];
        react_1.Children.forEach(props.children, function (child) {
            if (hotkey_1.Hotkey.isInstance(child) && _this.isScope(child.props)) {
                actions.push({
                    combo: hotkeyParser_1.parseKeyCombo(child.props.combo),
                    props: child.props,
                });
            }
        });
        this.actions = actions;
    };
    HotkeysEvents.prototype.isScope = function (props) {
        return (props.global ? HotkeyScope.GLOBAL : HotkeyScope.LOCAL) === this.scope;
    };
    HotkeysEvents.prototype.isTextInput = function (e) {
        var elem = e.target;
        // we check these cases for unit testing, but this should not happen
        // during normal operation
        if (elem == null || elem.closest == null) {
            return false;
        }
        var editable = elem.closest("input, textarea, [contenteditable=true]");
        if (editable == null) {
            return false;
        }
        // don't let checkboxes, switches, and radio buttons prevent hotkey behavior
        if (editable.tagName.toLowerCase() === "input") {
            var inputType = editable.type;
            if (inputType === "checkbox" || inputType === "radio") {
                return false;
            }
        }
        // don't let read-only fields prevent hotkey behavior
        if (editable.readOnly) {
            return false;
        }
        return true;
    };
    return HotkeysEvents;
}());
exports.HotkeysEvents = HotkeysEvents;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL2hvdGtleXMvaG90a2V5c0V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRzs7QUFFSCxzQkFBa0QsT0FBTyxDQUFDLENBQUE7QUFDMUQsc0JBQTJCLG9CQUFvQixDQUFDLENBQUE7QUFFaEQsdUJBQXFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2hELDZCQUFvRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBRXJGLDhCQUEwRCxpQkFBaUIsQ0FBQyxDQUFBO0FBRTVFLElBQU0scUJBQXFCLEdBQUcsNEJBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVqRCxXQUFZLFdBQVc7SUFDbkIsK0NBQUssQ0FBQTtJQUNMLGlEQUFNLENBQUE7QUFDVixDQUFDLEVBSFcsbUJBQVcsS0FBWCxtQkFBVyxRQUd0QjtBQUhELElBQVksV0FBVyxHQUFYLG1CQUdYLENBQUE7QUFPRDtJQUdJLHVCQUEyQixLQUFrQjtRQUhqRCxpQkE0RkM7UUF6RjhCLFVBQUssR0FBTCxLQUFLLENBQWE7UUFGckMsWUFBTyxHQUFHLEVBQXFCLENBQUM7UUEwQmpDLGtCQUFhLEdBQUcsVUFBQyxDQUFnQjtZQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLHNDQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBTSxLQUFLLEdBQUcsMEJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3QixFQUFFLENBQUMsQ0FBQywyQkFBWSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsaUNBQWlCLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxNQUFNLENBQUMsS0FBSyxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sQ0FBQztZQUNYLENBQUM7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QUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsNEVBQTRFO1FBQzVFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFNLFNBQVMsR0FBSSxRQUE2QixDQUFDLElBQUksQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssVUFBVSxJQUFJLFNBQVMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO1FBRUQscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFFLFFBQTZCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTCxvQkFBQztBQUFELENBNUZBLEFBNEZDLElBQUE7QUE1RlkscUJBQWEsZ0JBNEZ6QixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvaG90a2V5cy9ob3RrZXlzRXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE2IFBhbGFudGlyIFRlY2hub2xvZ2llcywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEJTRC0zIExpY2Vuc2UgYXMgbW9kaWZpZWQgKHRoZSDigJxMaWNlbnNl4oCdKTsgeW91IG1heSBvYnRhaW4gYSBjb3B5XG4gKiBvZiB0aGUgbGljZW5zZSBhdCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL1BBVEVOVFNcbiAqL1xuXG5pbXBvcnQgeyBDaGlsZHJlbiwgUmVhY3RFbGVtZW50LCBSZWFjdE5vZGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHNhZmVJbnZva2UgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxzXCI7XG5cbmltcG9ydCB7IEhvdGtleSwgSUhvdGtleVByb3BzIH0gZnJvbSBcIi4vaG90a2V5XCI7XG5pbXBvcnQgeyBjb21ib01hdGNoZXMsIGdldEtleUNvbWJvLCBJS2V5Q29tYm8sIHBhcnNlS2V5Q29tYm8gfSBmcm9tIFwiLi9ob3RrZXlQYXJzZXJcIjtcbmltcG9ydCB7IElIb3RrZXlzUHJvcHMgfSBmcm9tIFwiLi9ob3RrZXlzXCI7XG5pbXBvcnQgeyBpc0hvdGtleXNEaWFsb2dTaG93aW5nLCBzaG93SG90a2V5c0RpYWxvZyB9IGZyb20gXCIuL2hvdGtleXNEaWFsb2dcIjtcblxuY29uc3QgU0hPV19ESUFMT0dfS0VZX0NPTUJPID0gcGFyc2VLZXlDb21ibyhcIj9cIik7XG5cbmV4cG9ydCBlbnVtIEhvdGtleVNjb3BlIHtcbiAgICBMT0NBTCxcbiAgICBHTE9CQUwsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUhvdGtleUFjdGlvbiB7XG4gICAgY29tYm86IElLZXlDb21ibztcbiAgICBwcm9wczogSUhvdGtleVByb3BzO1xufVxuXG5leHBvcnQgY2xhc3MgSG90a2V5c0V2ZW50cyB7XG4gICAgcHJpdmF0ZSBhY3Rpb25zID0gW10gYXMgSUhvdGtleUFjdGlvbltdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgc2NvcGU6IEhvdGtleVNjb3BlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25zLmxlbmd0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRIb3RrZXlzKHByb3BzOiBJSG90a2V5c1Byb3BzICYgeyBjaGlsZHJlbjogUmVhY3ROb2RlW10gfSkge1xuICAgICAgICBjb25zdCBhY3Rpb25zID0gW10gYXMgSUhvdGtleUFjdGlvbltdO1xuICAgICAgICBDaGlsZHJlbi5mb3JFYWNoKHByb3BzLmNoaWxkcmVuLCAoY2hpbGQ6IFJlYWN0RWxlbWVudDxhbnk+KSA9PiB7XG4gICAgICAgICAgICBpZiAoSG90a2V5LmlzSW5zdGFuY2UoY2hpbGQpICYmIHRoaXMuaXNTY29wZShjaGlsZC5wcm9wcykpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb21ibzogcGFyc2VLZXlDb21ibyhjaGlsZC5wcm9wcy5jb21ibyksXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiBjaGlsZC5wcm9wcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUtleURvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc1RleHRJbnB1dChlKSB8fCBpc0hvdGtleXNEaWFsb2dTaG93aW5nKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbWJvID0gZ2V0S2V5Q29tYm8oZSk7XG5cbiAgICAgICAgaWYgKGNvbWJvTWF0Y2hlcyhTSE9XX0RJQUxPR19LRVlfQ09NQk8sIGNvbWJvKSkge1xuICAgICAgICAgICAgc2hvd0hvdGtleXNEaWFsb2codGhpcy5hY3Rpb25zLm1hcCgoYWN0aW9uKSA9PiBhY3Rpb24ucHJvcHMpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgYWN0aW9uIG9mIHRoaXMuYWN0aW9ucykge1xuICAgICAgICAgICAgaWYgKGNvbWJvTWF0Y2hlcyhhY3Rpb24uY29tYm8sIGNvbWJvKSkge1xuICAgICAgICAgICAgICAgIHNhZmVJbnZva2UoYWN0aW9uLnByb3BzLm9uS2V5RG93biwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlS2V5VXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc1RleHRJbnB1dChlKSB8fCBpc0hvdGtleXNEaWFsb2dTaG93aW5nKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbWJvID0gZ2V0S2V5Q29tYm8oZSk7XG4gICAgICAgIGZvciAoY29uc3QgYWN0aW9uIG9mIHRoaXMuYWN0aW9ucykge1xuICAgICAgICAgICAgaWYgKGNvbWJvTWF0Y2hlcyhhY3Rpb24uY29tYm8sIGNvbWJvKSkge1xuICAgICAgICAgICAgICAgIHNhZmVJbnZva2UoYWN0aW9uLnByb3BzLm9uS2V5VXAsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1Njb3BlKHByb3BzOiBJSG90a2V5UHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIChwcm9wcy5nbG9iYWwgPyBIb3RrZXlTY29wZS5HTE9CQUwgOiBIb3RrZXlTY29wZS5MT0NBTCkgPT09IHRoaXMuc2NvcGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1RleHRJbnB1dChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgLy8gd2UgY2hlY2sgdGhlc2UgY2FzZXMgZm9yIHVuaXQgdGVzdGluZywgYnV0IHRoaXMgc2hvdWxkIG5vdCBoYXBwZW5cbiAgICAgICAgLy8gZHVyaW5nIG5vcm1hbCBvcGVyYXRpb25cbiAgICAgICAgaWYgKGVsZW0gPT0gbnVsbCB8fCBlbGVtLmNsb3Nlc3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZWRpdGFibGUgPSBlbGVtLmNsb3Nlc3QoXCJpbnB1dCwgdGV4dGFyZWEsIFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1cIik7XG5cbiAgICAgICAgaWYgKGVkaXRhYmxlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRvbid0IGxldCBjaGVja2JveGVzLCBzd2l0Y2hlcywgYW5kIHJhZGlvIGJ1dHRvbnMgcHJldmVudCBob3RrZXkgYmVoYXZpb3JcbiAgICAgICAgaWYgKGVkaXRhYmxlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSAoZWRpdGFibGUgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZTtcbiAgICAgICAgICAgIGlmIChpbnB1dFR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCBpbnB1dFR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRvbid0IGxldCByZWFkLW9ubHkgZmllbGRzIHByZXZlbnQgaG90a2V5IGJlaGF2aW9yXG4gICAgICAgIGlmICgoZWRpdGFibGUgYXMgSFRNTElucHV0RWxlbWVudCkucmVhZE9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
