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
var TabList = (function (_super) {
    __extends(TabList, _super);
    function TabList() {
        _super.apply(this, arguments);
        this.displayName = "Blueprint.TabList";
        this.state = {
            shouldAnimate: false,
        };
    }
    TabList.prototype.render = function () {
        return (React.createElement("ul", {className: classNames(Classes.TAB_LIST, this.props.className), role: "tablist"}, 
            React.createElement("div", {className: classNames("pt-tab-indicator-wrapper", { "pt-no-animation": !this.state.shouldAnimate }), style: this.props.indicatorWrapperStyle}, 
                React.createElement("div", {className: "pt-tab-indicator"})
            ), 
            this.props.children));
    };
    TabList.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (prevProps.indicatorWrapperStyle == null) {
            setTimeout(function () { return _this.setState({ shouldAnimate: true }); });
        }
    };
    TabList = __decorate([
        PureRender
    ], TabList);
    return TabList;
}(React.Component));
exports.TabList = TabList;
exports.TabListFactory = React.createFactory(TabList);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL3RhYnMvdGFiTGlzdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7QUFFSCxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLFVBQVUsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3BELElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBRS9CLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFtQmhEO0lBQTZCLDJCQUFrQztJQUEvRDtRQUE2Qiw4QkFBa0M7UUFDcEQsZ0JBQVcsR0FBRyxtQkFBbUIsQ0FBQztRQUNsQyxVQUFLLEdBQWtCO1lBQzFCLGFBQWEsRUFBRSxLQUFLO1NBQ3ZCLENBQUM7SUF3Qk4sQ0FBQztJQXRCVSx3QkFBTSxHQUFiO1FBQ0ksTUFBTSxDQUFDLENBQ0gscUJBQUMsRUFBRSxJQUNDLFNBQVMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxFQUM5RCxJQUFJLEVBQUMsU0FBUztZQUVkLHFCQUFDLEdBQUcsSUFDQSxTQUFTLEVBQUUsVUFBVSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFFLEVBQ3BHLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFzQjtnQkFFeEMscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBRzthQUNsQztZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUyxDQUNwQixDQUNSLENBQUM7SUFDTixDQUFDO0lBRU0sb0NBQWtCLEdBQXpCLFVBQTBCLFNBQXdCO1FBQWxELGlCQUlDO1FBSEcsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztRQUM3RCxDQUFDO0lBQ0wsQ0FBQztJQTVCTDtRQUFDLFVBQVU7ZUFBQTtJQTZCWCxjQUFDO0FBQUQsQ0E1QkEsQUE0QkMsQ0E1QjRCLEtBQUssQ0FBQyxTQUFTLEdBNEIzQztBQTVCWSxlQUFPLFVBNEJuQixDQUFBO0FBRVksc0JBQWMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvdGFicy90YWJMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE1IFBhbGFudGlyIFRlY2hub2xvZ2llcywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEJTRC0zIExpY2Vuc2UgYXMgbW9kaWZpZWQgKHRoZSDigJxMaWNlbnNl4oCdKTsgeW91IG1heSBvYnRhaW4gYSBjb3B5XG4gKiBvZiB0aGUgbGljZW5zZSBhdCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL1BBVEVOVFNcbiAqL1xuXG5pbXBvcnQgKiBhcyBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgKiBhcyBQdXJlUmVuZGVyIGZyb20gXCJwdXJlLXJlbmRlci1kZWNvcmF0b3JcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgKiBhcyBDbGFzc2VzIGZyb20gXCIuLi8uLi9jb21tb24vY2xhc3Nlc1wiO1xuaW1wb3J0IHsgSVByb3BzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9wcm9wc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUYWJMaXN0UHJvcHMgZXh0ZW5kcyBJUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIENTUyBydWxlcyB0byB1c2Ugb24gdGhlIGluZGljYXRvciB3cmFwcGVyLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIGluZGljYXRvcldyYXBwZXJTdHlsZT86IFJlYWN0LkNTU1Byb3BlcnRpZXM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRhYkxpc3RTdGF0ZSB7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgYW5pbWF0aW9uIHNob3VsZCBiZSBydW4gd2hlbiB0cmFuc2Zvcm0gY2hhbmdlcy5cbiAgICAgKi9cbiAgICBzaG91bGRBbmltYXRlPzogYm9vbGVhbjtcbn1cblxuQFB1cmVSZW5kZXJcbmV4cG9ydCBjbGFzcyBUYWJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PElUYWJMaXN0UHJvcHMsIHt9PiB7XG4gICAgcHVibGljIGRpc3BsYXlOYW1lID0gXCJCbHVlcHJpbnQuVGFiTGlzdFwiO1xuICAgIHB1YmxpYyBzdGF0ZTogSVRhYkxpc3RTdGF0ZSA9IHtcbiAgICAgICAgc2hvdWxkQW5pbWF0ZTogZmFsc2UsXG4gICAgfTtcblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoQ2xhc3Nlcy5UQUJfTElTVCwgdGhpcy5wcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgICAgICAgIHJvbGU9XCJ0YWJsaXN0XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcInB0LXRhYi1pbmRpY2F0b3Itd3JhcHBlclwiLCB7IFwicHQtbm8tYW5pbWF0aW9uXCI6ICF0aGlzLnN0YXRlLnNob3VsZEFuaW1hdGUgfSl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLmluZGljYXRvcldyYXBwZXJTdHlsZX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtdGFiLWluZGljYXRvclwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzOiBJVGFiTGlzdFByb3BzKSB7XG4gICAgICAgIGlmIChwcmV2UHJvcHMuaW5kaWNhdG9yV3JhcHBlclN0eWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IHNob3VsZEFuaW1hdGU6IHRydWUgfSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgVGFiTGlzdEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFRhYkxpc3QpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
