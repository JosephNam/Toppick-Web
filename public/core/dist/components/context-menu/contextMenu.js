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
var React = require("react");
var ReactDOM = require("react-dom");
var Classes = require("../../common/classes");
var position_1 = require("../../common/position");
var utils_1 = require("../../common/utils");
var popover_1 = require("../popover/popover");
var CONSTRAINTS = [{ attachment: "together", pin: true, to: "window" }];
var TRANSITION_DURATION = 100;
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu() {
        var _this = this;
        _super.apply(this, arguments);
        this.state = {
            isOpen: false,
        };
        this.cancelContextMenu = function (e) { return e.preventDefault(); };
        this.handleBackdropContextMenu = function (e) {
            // HACKHACK: React function to remove from the event pool (not sure why it's not in typings #66)
            e.persist();
            e.preventDefault();
            // wait for backdrop to disappear so we can find the "real" element at event coordinates.
            // timeout duration is equivalent to transition duration so we know it's animated out.
            setTimeout(function () {
                // retrigger context menu event at the element beneath the backdrop.
                // if it has a `contextmenu` event handler then it'll be invoked.
                // if it doesn't, no native menu will show (at least on OSX) :(
                var newTarget = document.elementFromPoint(e.clientX, e.clientY);
                newTarget.dispatchEvent(new MouseEvent("contextmenu", e));
            }, TRANSITION_DURATION);
        };
        this.handlePopoverInteraction = function (nextOpenState) {
            if (!nextOpenState) {
                _this.hide();
            }
        };
    }
    ContextMenu.prototype.render = function () {
        // prevent right-clicking in a context menu
        var content = React.createElement("div", {onContextMenu: this.cancelContextMenu}, this.state.menu);
        return (React.createElement(popover_1.Popover, {backdropProps: { onContextMenu: this.handleBackdropContextMenu }, constraints: CONSTRAINTS, content: content, enforceFocus: false, isModal: true, isOpen: this.state.isOpen, onInteraction: this.handlePopoverInteraction, position: position_1.Position.RIGHT_TOP, popoverClassName: Classes.MINIMAL, useSmartArrowPositioning: false, transitionDuration: TRANSITION_DURATION}, 
            React.createElement("div", {className: Classes.CONTEXT_MENU_POPOVER_TARGET, style: this.state.offset})
        ));
    };
    ContextMenu.prototype.show = function (menu, offset, onClose) {
        this.setState({ isOpen: true, menu: menu, offset: offset, onClose: onClose });
    };
    ContextMenu.prototype.hide = function () {
        var onClose = this.state.onClose;
        this.setState({ isOpen: false, onClose: null });
        utils_1.safeInvoke(onClose);
    };
    return ContextMenu;
}(React.Component));
var contextMenu;
/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 */
function show(menu, offset, onClose) {
    if (contextMenu == null) {
        var contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU);
        document.body.appendChild(contextMenuElement);
        contextMenu = ReactDOM.render(React.createElement(ContextMenu, null), contextMenuElement);
    }
    contextMenu.show(menu, offset, onClose);
}
exports.show = show;
/** Hide the open context menu. */
function hide() {
    if (contextMenu != null) {
        contextMenu.hide();
    }
}
exports.hide = hide;
/** Return whether a context menu is currently open. */
function isOpen() {
    return contextMenu != null && contextMenu.state.isOpen;
}
exports.isOpen = isOpen;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL2NvbnRleHQtbWVudS9jb250ZXh0TWVudS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7QUFFSCxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUMvQixJQUFZLFFBQVEsV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUV0QyxJQUFZLE9BQU8sV0FBTSxzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELHlCQUF5Qix1QkFBdUIsQ0FBQyxDQUFBO0FBQ2pELHNCQUEyQixvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUF3QixvQkFBb0IsQ0FBQyxDQUFBO0FBYzdDLElBQU0sV0FBVyxHQUFHLENBQUUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFFLENBQUM7QUFDNUUsSUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUM7QUFFaEM7SUFBMEIsK0JBQXNDO0lBQWhFO1FBQUEsaUJBMkRDO1FBM0R5Qiw4QkFBc0M7UUFDckQsVUFBSyxHQUFzQjtZQUM5QixNQUFNLEVBQUUsS0FBSztTQUNoQixDQUFDO1FBa0NNLHNCQUFpQixHQUFHLFVBQUMsQ0FBdUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBbEIsQ0FBa0IsQ0FBQztRQUVwRiw4QkFBeUIsR0FBRyxVQUFDLENBQW1DO1lBQ3BFLGdHQUFnRztZQUMvRixDQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25CLHlGQUF5RjtZQUN6RixzRkFBc0Y7WUFDdEYsVUFBVSxDQUFDO2dCQUNQLG9FQUFvRTtnQkFDcEUsaUVBQWlFO2dCQUNqRSwrREFBK0Q7Z0JBQy9ELElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FB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QUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0FBQ0wsQ0FBQztBQUplLFlBQUksT0FJbkIsQ0FBQTtBQUVELHVEQUF1RDtBQUN2RDtJQUNJLE1BQU0sQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzNELENBQUM7QUFGZSxjQUFNLFNBRXJCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9jb250ZXh0LW1lbnUvY29udGV4dE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG5pbXBvcnQgKiBhcyBDbGFzc2VzIGZyb20gXCIuLi8uLi9jb21tb24vY2xhc3Nlc1wiO1xuaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL3Bvc2l0aW9uXCI7XG5pbXBvcnQgeyBzYWZlSW52b2tlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsc1wiO1xuaW1wb3J0IHsgUG9wb3ZlciB9IGZyb20gXCIuLi9wb3BvdmVyL3BvcG92ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJT2Zmc2V0IHtcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgdG9wOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJQ29udGV4dE1lbnVTdGF0ZSB7XG4gICAgaXNPcGVuPzogYm9vbGVhbjtcbiAgICBtZW51PzogSlNYLkVsZW1lbnQ7XG4gICAgb2Zmc2V0PzogSU9mZnNldDtcbiAgICBvbkNsb3NlPzogKCkgPT4gdm9pZDtcbn1cblxuY29uc3QgQ09OU1RSQUlOVFMgPSBbIHsgYXR0YWNobWVudDogXCJ0b2dldGhlclwiLCBwaW46IHRydWUsIHRvOiBcIndpbmRvd1wiIH0gXTtcbmNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT04gPSAxMDA7XG5cbmNsYXNzIENvbnRleHRNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHt9LCBJQ29udGV4dE1lbnVTdGF0ZT4ge1xuICAgIHB1YmxpYyBzdGF0ZTogSUNvbnRleHRNZW51U3RhdGUgPSB7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgfTtcblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIC8vIHByZXZlbnQgcmlnaHQtY2xpY2tpbmcgaW4gYSBjb250ZXh0IG1lbnVcbiAgICAgICAgY29uc3QgY29udGVudCA9IDxkaXYgb25Db250ZXh0TWVudT17dGhpcy5jYW5jZWxDb250ZXh0TWVudX0+e3RoaXMuc3RhdGUubWVudX08L2Rpdj47XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UG9wb3ZlclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wUHJvcHM9e3sgb25Db250ZXh0TWVudTogdGhpcy5oYW5kbGVCYWNrZHJvcENvbnRleHRNZW51IH19XG4gICAgICAgICAgICAgICAgY29uc3RyYWludHM9e0NPTlNUUkFJTlRTfVxuICAgICAgICAgICAgICAgIGNvbnRlbnQ9e2NvbnRlbnR9XG4gICAgICAgICAgICAgICAgZW5mb3JjZUZvY3VzPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBpc01vZGFsPXt0cnVlfVxuICAgICAgICAgICAgICAgIGlzT3Blbj17dGhpcy5zdGF0ZS5pc09wZW59XG4gICAgICAgICAgICAgICAgb25JbnRlcmFjdGlvbj17dGhpcy5oYW5kbGVQb3BvdmVySW50ZXJhY3Rpb259XG4gICAgICAgICAgICAgICAgcG9zaXRpb249e1Bvc2l0aW9uLlJJR0hUX1RPUH1cbiAgICAgICAgICAgICAgICBwb3BvdmVyQ2xhc3NOYW1lPXtDbGFzc2VzLk1JTklNQUx9XG4gICAgICAgICAgICAgICAgdXNlU21hcnRBcnJvd1Bvc2l0aW9uaW5nPXtmYWxzZX1cbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb249e1RSQU5TSVRJT05fRFVSQVRJT059XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzZXMuQ09OVEVYVF9NRU5VX1BPUE9WRVJfVEFSR0VUfSBzdHlsZT17dGhpcy5zdGF0ZS5vZmZzZXR9IC8+XG4gICAgICAgICAgICA8L1BvcG92ZXI+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3cobWVudTogSlNYLkVsZW1lbnQsIG9mZnNldDogSU9mZnNldCwgb25DbG9zZT86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzT3BlbjogdHJ1ZSwgbWVudSwgb2Zmc2V0LCBvbkNsb3NlIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlKCkge1xuICAgICAgICBjb25zdCB7IG9uQ2xvc2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW46IGZhbHNlLCBvbkNsb3NlOiBudWxsIH0pO1xuICAgICAgICBzYWZlSW52b2tlKG9uQ2xvc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FuY2VsQ29udGV4dE1lbnUgPSAoZTogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBwcml2YXRlIGhhbmRsZUJhY2tkcm9wQ29udGV4dE1lbnUgPSAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MRGl2RWxlbWVudD4pID0+IHtcbiAgICAgICAgLy8gSEFDS0hBQ0s6IFJlYWN0IGZ1bmN0aW9uIHRvIHJlbW92ZSBmcm9tIHRoZSBldmVudCBwb29sIChub3Qgc3VyZSB3aHkgaXQncyBub3QgaW4gdHlwaW5ncyAjNjYpXG4gICAgICAgIChlIGFzIGFueSkucGVyc2lzdCgpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIHdhaXQgZm9yIGJhY2tkcm9wIHRvIGRpc2FwcGVhciBzbyB3ZSBjYW4gZmluZCB0aGUgXCJyZWFsXCIgZWxlbWVudCBhdCBldmVudCBjb29yZGluYXRlcy5cbiAgICAgICAgLy8gdGltZW91dCBkdXJhdGlvbiBpcyBlcXVpdmFsZW50IHRvIHRyYW5zaXRpb24gZHVyYXRpb24gc28gd2Uga25vdyBpdCdzIGFuaW1hdGVkIG91dC5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyByZXRyaWdnZXIgY29udGV4dCBtZW51IGV2ZW50IGF0IHRoZSBlbGVtZW50IGJlbmVhdGggdGhlIGJhY2tkcm9wLlxuICAgICAgICAgICAgLy8gaWYgaXQgaGFzIGEgYGNvbnRleHRtZW51YCBldmVudCBoYW5kbGVyIHRoZW4gaXQnbGwgYmUgaW52b2tlZC5cbiAgICAgICAgICAgIC8vIGlmIGl0IGRvZXNuJ3QsIG5vIG5hdGl2ZSBtZW51IHdpbGwgc2hvdyAoYXQgbGVhc3Qgb24gT1NYKSA6KFxuICAgICAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgICAgICBuZXdUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudChcImNvbnRleHRtZW51XCIsIGUpKTtcbiAgICAgICAgfSwgVFJBTlNJVElPTl9EVVJBVElPTik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVQb3BvdmVySW50ZXJhY3Rpb24gPSAobmV4dE9wZW5TdGF0ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICBpZiAoIW5leHRPcGVuU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXQgY29udGV4dE1lbnU6IENvbnRleHRNZW51O1xuXG4vKipcbiAqIFNob3cgdGhlIGdpdmVuIG1lbnUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gb2Zmc2V0IGZyb20gdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgdmlld3BvcnQuXG4gKiBUaGUgbWVudSB3aWxsIGFwcGVhciBiZWxvdy1yaWdodCBvZiB0aGlzIHBvaW50IGFuZCB3aWxsIGZsaXAgdG8gYmVsb3ctbGVmdCBpZiB0aGVyZSBpcyBub3QgZW5vdWdoXG4gKiByb29tIG9uc2NyZWVuLiBUaGUgb3B0aW9uYWwgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhpcyBtZW51IGNsb3Nlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3cobWVudTogSlNYLkVsZW1lbnQsIG9mZnNldDogSU9mZnNldCwgb25DbG9zZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAoY29udGV4dE1lbnUgPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjb250ZXh0TWVudUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250ZXh0TWVudUVsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc2VzLkNPTlRFWFRfTUVOVSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGV4dE1lbnVFbGVtZW50KTtcbiAgICAgICAgY29udGV4dE1lbnUgPSBSZWFjdERPTS5yZW5kZXIoPENvbnRleHRNZW51IC8+LCBjb250ZXh0TWVudUVsZW1lbnQpIGFzIENvbnRleHRNZW51O1xuICAgIH1cblxuICAgIGNvbnRleHRNZW51LnNob3cobWVudSwgb2Zmc2V0LCBvbkNsb3NlKTtcbn1cblxuLyoqIEhpZGUgdGhlIG9wZW4gY29udGV4dCBtZW51LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgaWYgKGNvbnRleHRNZW51ICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dE1lbnUuaGlkZSgpO1xuICAgIH1cbn1cblxuLyoqIFJldHVybiB3aGV0aGVyIGEgY29udGV4dCBtZW51IGlzIGN1cnJlbnRseSBvcGVuLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3BlbigpIHtcbiAgICByZXR1cm4gY29udGV4dE1lbnUgIT0gbnVsbCAmJiBjb250ZXh0TWVudS5zdGF0ZS5pc09wZW47XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
