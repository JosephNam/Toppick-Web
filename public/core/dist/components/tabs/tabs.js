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
var react_dom_1 = require("react-dom");
var abstractComponent_1 = require("../../common/abstractComponent");
var Classes = require("../../common/classes");
var Errors = require("../../common/errors");
var Keys = require("../../common/keys");
var Utils = require("../../common/utils");
var tab_1 = require("./tab");
var tabList_1 = require("./tabList");
var tabPanel_1 = require("./tabPanel");
var TAB_CSS_SELECTOR = "li[role=tab]";
var Tabs = (function (_super) {
    __extends(Tabs, _super);
    function Tabs(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.displayName = "Blueprint.Tabs";
        // state is initialized in the constructor but getStateFromProps needs state defined
        this.state = {};
        this.panelIds = [];
        this.tabIds = [];
        this.handleClick = function (e) {
            _this.handleTabSelectingEvent(e);
        };
        this.handleKeyPress = function (e) {
            var insideTab = e.target.closest("." + Classes.TAB) != null;
            if (insideTab && (e.which === Keys.SPACE || e.which === Keys.ENTER)) {
                e.preventDefault();
                _this.handleTabSelectingEvent(e);
            }
        };
        this.handleKeyDown = function (e) {
            // don't want to handle keyDown events inside a tab panel
            var insideTabList = e.target.closest("." + Classes.TAB_LIST) != null;
            if (!insideTabList) {
                return;
            }
            var focusedTabIndex = _this.getFocusedTabIndex();
            if (focusedTabIndex === -1) {
                return;
            }
            if (e.which === Keys.ARROW_LEFT) {
                e.preventDefault();
                // find previous tab that isn't disabled
                var newTabIndex = focusedTabIndex - 1;
                var tabIsDisabled = _this.isTabDisabled(newTabIndex);
                while (tabIsDisabled && newTabIndex !== -1) {
                    newTabIndex--;
                    tabIsDisabled = _this.isTabDisabled(newTabIndex);
                }
                if (newTabIndex !== -1) {
                    _this.focusTab(newTabIndex);
                }
            }
            else if (e.which === Keys.ARROW_RIGHT) {
                e.preventDefault();
                // find next tab that isn't disabled
                var tabsCount = _this.getTabsCount();
                var newTabIndex = focusedTabIndex + 1;
                var tabIsDisabled = _this.isTabDisabled(newTabIndex);
                while (tabIsDisabled && newTabIndex !== tabsCount) {
                    newTabIndex++;
                    tabIsDisabled = _this.isTabDisabled(newTabIndex);
                }
                if (newTabIndex !== tabsCount) {
                    _this.focusTab(newTabIndex);
                }
            }
        };
        this.handleTabSelectingEvent = function (e) {
            var tabElement = e.target.closest(TAB_CSS_SELECTOR);
            // select only if Tab is one of us and is enabled
            if (tabElement != null
                && _this.tabIds.indexOf(tabElement.id) >= 0
                && tabElement.getAttribute("aria-disabled") !== "true") {
                var index = tabElement.parentElement.queryAll(TAB_CSS_SELECTOR).indexOf(tabElement);
                _this.setSelectedTabIndex(index);
            }
        };
        this.state = this.getStateFromProps(this.props);
    }
    Tabs.prototype.render = function () {
        return (React.createElement("div", {className: classNames(Classes.TABS, this.props.className), onClick: this.handleClick, onKeyPress: this.handleKeyPress, onKeyDown: this.handleKeyDown}, this.getChildren()));
    };
    Tabs.prototype.componentWillReceiveProps = function (newProps) {
        var newState = this.getStateFromProps(newProps);
        var newIndex = newState.selectedTabIndex;
        if (newIndex !== this.state.selectedTabIndex) {
            this.setSelectedTabIndex(newIndex);
        }
        this.setState(newState);
    };
    Tabs.prototype.componentDidMount = function () {
        var _this = this;
        var selectedTab = react_dom_1.findDOMNode(this.refs[("tabs-" + this.state.selectedTabIndex)]);
        this.moveTimeout = setTimeout(function () { return _this.moveIndicator(selectedTab); });
    };
    Tabs.prototype.componentDidUpdate = function (_, prevState) {
        var _this = this;
        var newIndex = this.state.selectedTabIndex;
        if (newIndex !== prevState.selectedTabIndex) {
            var tabElement_1 = react_dom_1.findDOMNode(this.refs[("tabs-" + newIndex)]);
            // need to measure on the next frame in case the Tab children simultaneously change
            this.moveTimeout = setTimeout(function () { return _this.moveIndicator(tabElement_1); });
        }
    };
    Tabs.prototype.componentWillUnmount = function () {
        clearTimeout(this.moveTimeout);
    };
    Tabs.prototype.validateProps = function (props) {
        if (React.Children.count(props.children) > 0) {
            var child = React.Children.toArray(props.children)[0];
            if (child != null && child.type !== tabList_1.TabList) {
                throw new Error(Errors.TABS_FIRST_CHILD);
            }
            if (this.getTabsCount() !== this.getPanelsCount()) {
                throw new Error(Errors.TABS_MISMATCH);
            }
        }
    };
    /**
     * Calculate the new height, width, and position of the tab indicator.
     * Store the CSS values so the transition animation can start.
     */
    Tabs.prototype.moveIndicator = function (_a) {
        var clientHeight = _a.clientHeight, clientWidth = _a.clientWidth, offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop;
        var indicatorWrapperStyle = {
            height: clientHeight,
            transform: "translateX(" + Math.floor(offsetLeft) + "px) translateY(" + Math.floor(offsetTop) + "px)",
            width: clientWidth,
        };
        this.setState({ indicatorWrapperStyle: indicatorWrapperStyle });
    };
    /**
     * Most of the component logic lives here. We clone the children provided by the user to set up refs,
     * accessibility attributes, and selection props correctly.
     */
    Tabs.prototype.getChildren = function () {
        var _this = this;
        for (var unassignedTabs = this.getTabsCount() - this.tabIds.length; unassignedTabs > 0; unassignedTabs--) {
            this.tabIds.push(generateTabId());
            this.panelIds.push(generatePanelId());
        }
        var childIndex = 0;
        return React.Children.map(this.props.children, function (child) {
            var result;
            // can be null if conditionally rendering TabList / TabPanel
            if (child == null) {
                return null;
            }
            if (childIndex === 0) {
                // clone TabList / Tab elements
                result = _this.cloneTabList(child);
            }
            else {
                var tabPanelIndex = childIndex - 1;
                var shouldRenderTabPanel = _this.state.selectedTabIndex === tabPanelIndex;
                result = shouldRenderTabPanel ? _this.cloneTabPanel(child, tabPanelIndex) : null;
            }
            childIndex++;
            return result;
        });
    };
    Tabs.prototype.cloneTabList = function (child) {
        var _this = this;
        var tabIndex = 0;
        var tabs = React.Children.map(child.props.children, function (tab) {
            // can be null if conditionally rendering Tab
            if (tab == null) {
                return null;
            }
            var clonedTab = React.cloneElement(tab, {
                id: _this.tabIds[tabIndex],
                isSelected: _this.state.selectedTabIndex === tabIndex,
                panelId: _this.panelIds[tabIndex],
                ref: "tabs-" + tabIndex,
            });
            tabIndex++;
            return clonedTab;
        });
        return React.cloneElement(child, {
            children: tabs,
            indicatorWrapperStyle: this.state.indicatorWrapperStyle,
            ref: "tablist",
        });
    };
    Tabs.prototype.cloneTabPanel = function (child, tabIndex) {
        return React.cloneElement(child, {
            id: this.panelIds[tabIndex],
            isSelected: this.state.selectedTabIndex === tabIndex,
            ref: "panels-" + tabIndex,
            tabId: this.tabIds[tabIndex],
        });
    };
    Tabs.prototype.focusTab = function (index) {
        var ref = "tabs-" + index;
        var tab = react_dom_1.findDOMNode(this.refs[ref]);
        tab.focus();
    };
    Tabs.prototype.getFocusedTabIndex = function () {
        var focusedElement = document.activeElement;
        if (focusedElement != null && focusedElement.classList.contains(Classes.TAB)) {
            var tabId = focusedElement.id;
            return this.tabIds.indexOf(tabId);
        }
        return -1;
    };
    Tabs.prototype.getTabs = function () {
        if (this.props.children == null) {
            return [];
        }
        var tabs = [];
        if (React.Children.count(this.props.children) > 0) {
            var firstChild = React.Children.toArray(this.props.children)[0];
            if (firstChild != null) {
                React.Children.forEach(firstChild.props.children, function (tabListChild) {
                    if (tabListChild.type === tab_1.Tab) {
                        tabs.push(tabListChild);
                    }
                });
            }
        }
        return tabs;
    };
    Tabs.prototype.getTabsCount = function () {
        return this.getTabs().length;
    };
    Tabs.prototype.getPanelsCount = function () {
        if (this.props.children == null) {
            return 0;
        }
        var index = 0;
        var panelCount = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === tabPanel_1.TabPanel) {
                panelCount++;
            }
            index++;
        });
        return panelCount;
    };
    Tabs.prototype.getStateFromProps = function (props) {
        var selectedTabIndex = props.selectedTabIndex, initialSelectedTabIndex = props.initialSelectedTabIndex;
        if (this.isValidTabIndex(selectedTabIndex)) {
            return { selectedTabIndex: selectedTabIndex };
        }
        else if (this.isValidTabIndex(initialSelectedTabIndex) && this.state.selectedTabIndex == null) {
            return { selectedTabIndex: initialSelectedTabIndex };
        }
        else {
            return this.state;
        }
    };
    Tabs.prototype.isTabDisabled = function (index) {
        var tab = this.getTabs()[index];
        return tab != null && tab.props.isDisabled;
    };
    Tabs.prototype.isValidTabIndex = function (index) {
        return index != null && index >= 0 && index < this.getTabsCount();
    };
    /**
     * Updates the component's state if uncontrolled and calls onChange.
     */
    Tabs.prototype.setSelectedTabIndex = function (index) {
        if (index === this.state.selectedTabIndex || !this.isValidTabIndex(index)) {
            return;
        }
        var prevSelectedIndex = this.state.selectedTabIndex;
        if (this.props.selectedTabIndex == null) {
            this.setState({
                selectedTabIndex: index,
            });
        }
        if (Utils.isFunction(this.props.onChange)) {
            this.props.onChange(index, prevSelectedIndex);
        }
    };
    Tabs.defaultProps = {
        initialSelectedTabIndex: 0,
    };
    Tabs = __decorate([
        PureRender
    ], Tabs);
    return Tabs;
}(abstractComponent_1.AbstractComponent));
exports.Tabs = Tabs;
var tabCount = 0;
function generateTabId() {
    return "pt-tab-" + tabCount++;
}
var panelCount = 0;
function generatePanelId() {
    return "pt-tab-panel-" + panelCount++;
}
exports.TabsFactory = React.createFactory(Tabs);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL3RhYnMvdGFicy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7QUFFSCxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLFVBQVUsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3BELElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBQy9CLDBCQUE0QixXQUFXLENBQUMsQ0FBQTtBQUV4QyxrQ0FBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxJQUFZLE9BQU8sV0FBTSxzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELElBQVksTUFBTSxXQUFNLHFCQUFxQixDQUFDLENBQUE7QUFDOUMsSUFBWSxJQUFJLFdBQU0sbUJBQW1CLENBQUMsQ0FBQTtBQUUxQyxJQUFZLEtBQUssV0FBTSxvQkFBb0IsQ0FBQyxDQUFBO0FBRTVDLG9CQUErQixPQUFPLENBQUMsQ0FBQTtBQUN2Qyx3QkFBdUMsV0FBVyxDQUFDLENBQUE7QUFDbkQseUJBQXlDLFlBQVksQ0FBQyxDQUFBO0FBc0N0RCxJQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztBQUd4QztJQUEwQix3QkFBeUM7SUFjL0QsY0FBWSxLQUFrQixFQUFFLE9BQWE7UUFkakQsaUJBMFRDO1FBM1NPLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQVZuQixnQkFBVyxHQUFHLGdCQUFnQixDQUFDO1FBQ3RDLG9GQUFvRjtRQUM3RSxVQUFLLEdBQWUsRUFBRSxDQUFDO1FBRXRCLGFBQVEsR0FBYSxFQUFFLENBQUM7UUFDeEIsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQThEdEIsZ0JBQVcsR0FBRyxVQUFDLENBQXVDO1lBQzFELEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFFTyxtQkFBYyxHQUFHLFVBQUMsQ0FBc0M7WUFDNUQsSUFBTSxTQUFTLEdBQUksQ0FB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QUFDO2dCQUNWLGdCQUFnQixFQUFFLEtBQUs7YUFDMUIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUF4VGEsaUJBQVksR0FBZTtRQUNyQyx1QkFBdUIsRUFBRSxDQUFDO0tBQzdCLENBQUM7SUFKTjtRQUFDLFVBQVU7WUFBQTtJQTJUWCxXQUFDO0FBQUQsQ0ExVEEsQUEwVEMsQ0ExVHlCLHFDQUFpQixHQTBUMUM7QUExVFksWUFBSSxPQTBUaEIsQ0FBQTtBQUVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQjtJQUNJLE1BQU0sQ0FBQyxZQUFVLFFBQVEsRUFBSSxDQUFDO0FBQ2xDLENBQUM7QUFFRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkI7SUFDSSxNQUFNLENBQUMsa0JBQWdCLFVBQVUsRUFBSSxDQUFDO0FBQzFDLENBQUM7QUFFWSxtQkFBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiY29tcG9uZW50cy90YWJzL3RhYnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTUgUGFsYW50aXIgVGVjaG5vbG9naWVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQlNELTMgTGljZW5zZSBhcyBtb2RpZmllZCAodGhlIOKAnExpY2Vuc2XigJ0pOyB5b3UgbWF5IG9idGFpbiBhIGNvcHlcbiAqIG9mIHRoZSBsaWNlbnNlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxhbnRpci9ibHVlcHJpbnQvYmxvYi9tYXN0ZXIvUEFURU5UU1xuICovXG5cbmltcG9ydCAqIGFzIGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCAqIGFzIFB1cmVSZW5kZXIgZnJvbSBcInB1cmUtcmVuZGVyLWRlY29yYXRvclwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gXCJyZWFjdC1kb21cIjtcblxuaW1wb3J0IHsgQWJzdHJhY3RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2Fic3RyYWN0Q29tcG9uZW50XCI7XG5pbXBvcnQgKiBhcyBDbGFzc2VzIGZyb20gXCIuLi8uLi9jb21tb24vY2xhc3Nlc1wiO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gXCIuLi8uLi9jb21tb24vZXJyb3JzXCI7XG5pbXBvcnQgKiBhcyBLZXlzIGZyb20gXCIuLi8uLi9jb21tb24va2V5c1wiO1xuaW1wb3J0IHsgSVByb3BzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9wcm9wc1wiO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsc1wiO1xuXG5pbXBvcnQgeyBJVGFiUHJvcHMsIFRhYiB9IGZyb20gXCIuL3RhYlwiO1xuaW1wb3J0IHsgSVRhYkxpc3RQcm9wcywgVGFiTGlzdCB9IGZyb20gXCIuL3RhYkxpc3RcIjtcbmltcG9ydCB7IElUYWJQYW5lbFByb3BzLCBUYWJQYW5lbCB9IGZyb20gXCIuL3RhYlBhbmVsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRhYnNQcm9wcyBleHRlbmRzIElQcm9wcyB7XG4gICAgLyoqXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSBpbml0aWFsbHkgc2VsZWN0ZWQgdGFiIHdoZW4gdGhpcyBjb21wb25lbnQgcmVuZGVycy5cbiAgICAgKiBUaGlzIHByb3AgaGFzIG5vIGVmZmVjdCBpZiBgc2VsZWN0ZWRUYWJJbmRleGAgaXMgYWxzbyBwcm92aWRlZC5cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgaW5pdGlhbFNlbGVjdGVkVGFiSW5kZXg/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0YWIuXG4gICAgICogVXNlIHRoaXMgcHJvcCBpZiB5b3Ugd2FudCB0byBleHBsaWNpdGx5IGNvbnRyb2wgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgcGFuZWxcbiAgICAgKiB5b3Vyc2VsZiB3aXRoIHRoZSBgb25DaGFuZ2VgIGV2ZW50IGhhbmRsZXIuXG4gICAgICogSWYgdGhpcyBwcm9wIGlzIGxlZnQgdW5kZWZpbmVkLCB0aGUgY29tcG9uZW50IGNoYW5nZXMgdGFiIHBhbmVscyBhdXRvbWF0aWNhbGx5XG4gICAgICogd2hlbiB0YWJzIGFyZSBjbGlja2VkLlxuICAgICAqL1xuICAgIHNlbGVjdGVkVGFiSW5kZXg/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRhYnMgaW4gdGhlIHRhYiBsaXN0IGFyZSBjbGlja2VkLlxuICAgICAqL1xuICAgIG9uQ2hhbmdlPyhzZWxlY3RlZFRhYkluZGV4OiBudW1iZXIsIHByZXZTZWxlY3RlZFRhYkluZGV4OiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUYWJzU3RhdGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIENTUyBydWxlcyB0byB1c2Ugb24gdGhlIGluZGljYXRvciB3cmFwcGVyIG9mIHRoZSB0YWIgbGlzdC5cbiAgICAgKi9cbiAgICBpbmRpY2F0b3JXcmFwcGVyU3R5bGU/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGFiLlxuICAgICAqIElmIGEgcHJvcCB3aXRoIHRoZSBzYW1lIG5hbWUgaXMgc2V0LCB0aGlzIGJpdCBvZiBzdGF0ZSBzaW1wbHkgYWxpYXNlcyB0aGUgcHJvcC5cbiAgICAgKi9cbiAgICBzZWxlY3RlZFRhYkluZGV4PzogbnVtYmVyO1xufVxuXG5jb25zdCBUQUJfQ1NTX1NFTEVDVE9SID0gXCJsaVtyb2xlPXRhYl1cIjtcblxuQFB1cmVSZW5kZXJcbmV4cG9ydCBjbGFzcyBUYWJzIGV4dGVuZHMgQWJzdHJhY3RDb21wb25lbnQ8SVRhYnNQcm9wcywgSVRhYnNTdGF0ZT4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzOiBJVGFic1Byb3BzID0ge1xuICAgICAgICBpbml0aWFsU2VsZWN0ZWRUYWJJbmRleDogMCxcbiAgICB9O1xuXG4gICAgcHVibGljIGRpc3BsYXlOYW1lID0gXCJCbHVlcHJpbnQuVGFic1wiO1xuICAgIC8vIHN0YXRlIGlzIGluaXRpYWxpemVkIGluIHRoZSBjb25zdHJ1Y3RvciBidXQgZ2V0U3RhdGVGcm9tUHJvcHMgbmVlZHMgc3RhdGUgZGVmaW5lZFxuICAgIHB1YmxpYyBzdGF0ZTogSVRhYnNTdGF0ZSA9IHt9O1xuXG4gICAgcHJpdmF0ZSBwYW5lbElkczogc3RyaW5nW10gPSBbXTtcbiAgICBwcml2YXRlIHRhYklkczogc3RyaW5nW10gPSBbXTtcblxuICAgIHByaXZhdGUgbW92ZVRpbWVvdXQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzPzogSVRhYnNQcm9wcywgY29udGV4dD86IGFueSkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVByb3BzKHRoaXMucHJvcHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKENsYXNzZXMuVEFCUywgdGhpcy5wcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVLZXlQcmVzc31cbiAgICAgICAgICAgICAgICBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRDaGlsZHJlbigpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHM6IElUYWJzUHJvcHMpIHtcbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVByb3BzKG5ld1Byb3BzKTtcbiAgICAgICAgY29uc3QgbmV3SW5kZXggPSBuZXdTdGF0ZS5zZWxlY3RlZFRhYkluZGV4O1xuICAgICAgICBpZiAobmV3SW5kZXggIT09IHRoaXMuc3RhdGUuc2VsZWN0ZWRUYWJJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFRhYkluZGV4KG5ld0luZGV4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGFiID0gZmluZERPTU5vZGUodGhpcy5yZWZzW2B0YWJzLSR7dGhpcy5zdGF0ZS5zZWxlY3RlZFRhYkluZGV4fWBdKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgdGhpcy5tb3ZlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5tb3ZlSW5kaWNhdG9yKHNlbGVjdGVkVGFiKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudERpZFVwZGF0ZShfOiBJVGFic1Byb3BzLCBwcmV2U3RhdGU6IElUYWJzU3RhdGUpIHtcbiAgICAgICAgY29uc3QgbmV3SW5kZXggPSB0aGlzLnN0YXRlLnNlbGVjdGVkVGFiSW5kZXg7XG4gICAgICAgIGlmIChuZXdJbmRleCAhPT0gcHJldlN0YXRlLnNlbGVjdGVkVGFiSW5kZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhYkVsZW1lbnQgPSBmaW5kRE9NTm9kZSh0aGlzLnJlZnNbYHRhYnMtJHtuZXdJbmRleH1gXSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAvLyBuZWVkIHRvIG1lYXN1cmUgb24gdGhlIG5leHQgZnJhbWUgaW4gY2FzZSB0aGUgVGFiIGNoaWxkcmVuIHNpbXVsdGFuZW91c2x5IGNoYW5nZVxuICAgICAgICAgICAgdGhpcy5tb3ZlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5tb3ZlSW5kaWNhdG9yKHRhYkVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubW92ZVRpbWVvdXQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2YWxpZGF0ZVByb3BzKHByb3BzOiBJVGFic1Byb3BzICYge2NoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlfSkge1xuICAgICAgICBpZiAoUmVhY3QuQ2hpbGRyZW4uY291bnQocHJvcHMuY2hpbGRyZW4pID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBSZWFjdC5DaGlsZHJlbi50b0FycmF5KHByb3BzLmNoaWxkcmVuKVswXSBhcyBSZWFjdC5SZWFjdEVsZW1lbnQ8YW55PjtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkLnR5cGUgIT09IFRhYkxpc3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3JzLlRBQlNfRklSU1RfQ0hJTEQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRUYWJzQ291bnQoKSAhPT0gdGhpcy5nZXRQYW5lbHNDb3VudCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEVycm9ycy5UQUJTX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlQ2xpY2sgPSAoZTogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlVGFiU2VsZWN0aW5nRXZlbnQoZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVLZXlQcmVzcyA9IChlOiBSZWFjdC5LZXlib2FyZEV2ZW50PEhUTUxEaXZFbGVtZW50PikgPT4ge1xuICAgICAgICBjb25zdCBpbnNpZGVUYWIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoYC4ke0NsYXNzZXMuVEFCfWApICE9IG51bGw7XG4gICAgICAgIGlmIChpbnNpZGVUYWIgJiYgKGUud2hpY2ggPT09IEtleXMuU1BBQ0UgfHwgZS53aGljaCA9PT0gS2V5cy5FTlRFUikpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVGFiU2VsZWN0aW5nRXZlbnQoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUtleURvd24gPSAoZTogUmVhY3QuS2V5Ym9hcmRFdmVudDxIVE1MRGl2RWxlbWVudD4pID0+IHtcbiAgICAgICAgLy8gZG9uJ3Qgd2FudCB0byBoYW5kbGUga2V5RG93biBldmVudHMgaW5zaWRlIGEgdGFiIHBhbmVsXG4gICAgICAgIGNvbnN0IGluc2lkZVRhYkxpc3QgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoYC4ke0NsYXNzZXMuVEFCX0xJU1R9YCkgIT0gbnVsbDtcbiAgICAgICAgaWYgKCFpbnNpZGVUYWJMaXN0KSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnN0IGZvY3VzZWRUYWJJbmRleCA9IHRoaXMuZ2V0Rm9jdXNlZFRhYkluZGV4KCk7XG4gICAgICAgIGlmIChmb2N1c2VkVGFiSW5kZXggPT09IC0xKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmIChlLndoaWNoID09PSBLZXlzLkFSUk9XX0xFRlQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gZmluZCBwcmV2aW91cyB0YWIgdGhhdCBpc24ndCBkaXNhYmxlZFxuICAgICAgICAgICAgbGV0IG5ld1RhYkluZGV4ID0gZm9jdXNlZFRhYkluZGV4IC0gMTtcbiAgICAgICAgICAgIGxldCB0YWJJc0Rpc2FibGVkID0gdGhpcy5pc1RhYkRpc2FibGVkKG5ld1RhYkluZGV4KTtcblxuICAgICAgICAgICAgd2hpbGUgKHRhYklzRGlzYWJsZWQgJiYgbmV3VGFiSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbmV3VGFiSW5kZXgtLTtcbiAgICAgICAgICAgICAgICB0YWJJc0Rpc2FibGVkID0gdGhpcy5pc1RhYkRpc2FibGVkKG5ld1RhYkluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1RhYkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNUYWIobmV3VGFiSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT09IEtleXMuQVJST1dfUklHSFQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gZmluZCBuZXh0IHRhYiB0aGF0IGlzbid0IGRpc2FibGVkXG4gICAgICAgICAgICBjb25zdCB0YWJzQ291bnQgPSB0aGlzLmdldFRhYnNDb3VudCgpO1xuXG4gICAgICAgICAgICBsZXQgbmV3VGFiSW5kZXggPSBmb2N1c2VkVGFiSW5kZXggKyAxO1xuICAgICAgICAgICAgbGV0IHRhYklzRGlzYWJsZWQgPSB0aGlzLmlzVGFiRGlzYWJsZWQobmV3VGFiSW5kZXgpO1xuXG4gICAgICAgICAgICB3aGlsZSAodGFiSXNEaXNhYmxlZCAmJiBuZXdUYWJJbmRleCAhPT0gdGFic0NvdW50KSB7XG4gICAgICAgICAgICAgICAgbmV3VGFiSW5kZXgrKztcbiAgICAgICAgICAgICAgICB0YWJJc0Rpc2FibGVkID0gdGhpcy5pc1RhYkRpc2FibGVkKG5ld1RhYkluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1RhYkluZGV4ICE9PSB0YWJzQ291bnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzVGFiKG5ld1RhYkluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVGFiU2VsZWN0aW5nRXZlbnQgPSAoZTogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhYkVsZW1lbnQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoVEFCX0NTU19TRUxFQ1RPUikgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgLy8gc2VsZWN0IG9ubHkgaWYgVGFiIGlzIG9uZSBvZiB1cyBhbmQgaXMgZW5hYmxlZFxuICAgICAgICBpZiAodGFiRWxlbWVudCAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgdGhpcy50YWJJZHMuaW5kZXhPZih0YWJFbGVtZW50LmlkKSA+PSAwXG4gICAgICAgICAgICAgICAgJiYgdGFiRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIpICE9PSBcInRydWVcIikge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YWJFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlBbGwoVEFCX0NTU19TRUxFQ1RPUikuaW5kZXhPZih0YWJFbGVtZW50KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFRhYkluZGV4KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSB0aGUgbmV3IGhlaWdodCwgd2lkdGgsIGFuZCBwb3NpdGlvbiBvZiB0aGUgdGFiIGluZGljYXRvci5cbiAgICAgKiBTdG9yZSB0aGUgQ1NTIHZhbHVlcyBzbyB0aGUgdHJhbnNpdGlvbiBhbmltYXRpb24gY2FuIHN0YXJ0LlxuICAgICAqL1xuICAgIHByaXZhdGUgbW92ZUluZGljYXRvcih7IGNsaWVudEhlaWdodCwgY2xpZW50V2lkdGgsIG9mZnNldExlZnQsIG9mZnNldFRvcCB9OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCBpbmRpY2F0b3JXcmFwcGVyU3R5bGUgPSB7XG4gICAgICAgICAgICBoZWlnaHQ6IGNsaWVudEhlaWdodCxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVgoJHtNYXRoLmZsb29yKG9mZnNldExlZnQpfXB4KSB0cmFuc2xhdGVZKCR7TWF0aC5mbG9vcihvZmZzZXRUb3ApfXB4KWAsXG4gICAgICAgICAgICB3aWR0aDogY2xpZW50V2lkdGgsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpbmRpY2F0b3JXcmFwcGVyU3R5bGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW9zdCBvZiB0aGUgY29tcG9uZW50IGxvZ2ljIGxpdmVzIGhlcmUuIFdlIGNsb25lIHRoZSBjaGlsZHJlbiBwcm92aWRlZCBieSB0aGUgdXNlciB0byBzZXQgdXAgcmVmcyxcbiAgICAgKiBhY2Nlc3NpYmlsaXR5IGF0dHJpYnV0ZXMsIGFuZCBzZWxlY3Rpb24gcHJvcHMgY29ycmVjdGx5LlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgICAgIGZvciAobGV0IHVuYXNzaWduZWRUYWJzID0gdGhpcy5nZXRUYWJzQ291bnQoKSAtIHRoaXMudGFiSWRzLmxlbmd0aDsgdW5hc3NpZ25lZFRhYnMgPiAwOyB1bmFzc2lnbmVkVGFicy0tKSB7XG4gICAgICAgICAgICB0aGlzLnRhYklkcy5wdXNoKGdlbmVyYXRlVGFiSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsSWRzLnB1c2goZ2VuZXJhdGVQYW5lbElkKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoaWxkSW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIChjaGlsZDogUmVhY3QuUmVhY3RFbGVtZW50PGFueT4pID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IFJlYWN0LlJlYWN0RWxlbWVudDxhbnk+O1xuXG4gICAgICAgICAgICAvLyBjYW4gYmUgbnVsbCBpZiBjb25kaXRpb25hbGx5IHJlbmRlcmluZyBUYWJMaXN0IC8gVGFiUGFuZWxcbiAgICAgICAgICAgIGlmIChjaGlsZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvbmUgVGFiTGlzdCAvIFRhYiBlbGVtZW50c1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2xvbmVUYWJMaXN0KGNoaWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFiUGFuZWxJbmRleCA9IGNoaWxkSW5kZXggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZFJlbmRlclRhYlBhbmVsID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYkluZGV4ID09PSB0YWJQYW5lbEluZGV4O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNob3VsZFJlbmRlclRhYlBhbmVsID8gdGhpcy5jbG9uZVRhYlBhbmVsKGNoaWxkLCB0YWJQYW5lbEluZGV4KSA6IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkSW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xvbmVUYWJMaXN0KGNoaWxkOiBSZWFjdC5SZWFjdEVsZW1lbnQ8SVRhYkxpc3RQcm9wcyAmIHtjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZX0+KSB7XG4gICAgICAgIGxldCB0YWJJbmRleCA9IDA7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGQucHJvcHMuY2hpbGRyZW4sICh0YWI6IFJlYWN0LlJlYWN0RWxlbWVudDxhbnk+KSA9PiB7XG4gICAgICAgICAgICAvLyBjYW4gYmUgbnVsbCBpZiBjb25kaXRpb25hbGx5IHJlbmRlcmluZyBUYWJcbiAgICAgICAgICAgIGlmICh0YWIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjbG9uZWRUYWIgPSBSZWFjdC5jbG9uZUVsZW1lbnQodGFiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMudGFiSWRzW3RhYkluZGV4XSxcbiAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiB0aGlzLnN0YXRlLnNlbGVjdGVkVGFiSW5kZXggPT09IHRhYkluZGV4LFxuICAgICAgICAgICAgICAgIHBhbmVsSWQ6IHRoaXMucGFuZWxJZHNbdGFiSW5kZXhdLFxuICAgICAgICAgICAgICAgIHJlZjogYHRhYnMtJHt0YWJJbmRleH1gLFxuICAgICAgICAgICAgfSBhcyBJVGFiUHJvcHMpO1xuICAgICAgICAgICAgdGFiSW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiBjbG9uZWRUYWI7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7XG4gICAgICAgICAgICBjaGlsZHJlbjogdGFicyxcbiAgICAgICAgICAgIGluZGljYXRvcldyYXBwZXJTdHlsZTogdGhpcy5zdGF0ZS5pbmRpY2F0b3JXcmFwcGVyU3R5bGUsXG4gICAgICAgICAgICByZWY6IFwidGFibGlzdFwiLFxuICAgICAgICB9IGFzIElUYWJMaXN0UHJvcHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xvbmVUYWJQYW5lbChjaGlsZDogUmVhY3QuUmVhY3RFbGVtZW50PGFueT4sIHRhYkluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwge1xuICAgICAgICAgICAgaWQ6IHRoaXMucGFuZWxJZHNbdGFiSW5kZXhdLFxuICAgICAgICAgICAgaXNTZWxlY3RlZDogdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYkluZGV4ID09PSB0YWJJbmRleCxcbiAgICAgICAgICAgIHJlZjogYHBhbmVscy0ke3RhYkluZGV4fWAsXG4gICAgICAgICAgICB0YWJJZDogdGhpcy50YWJJZHNbdGFiSW5kZXhdLFxuICAgICAgICB9IGFzIElUYWJQYW5lbFByb3BzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZvY3VzVGFiKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmVmID0gYHRhYnMtJHtpbmRleH1gO1xuICAgICAgICBjb25zdCB0YWIgPSBmaW5kRE9NTm9kZSh0aGlzLnJlZnNbcmVmXSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIHRhYi5mb2N1cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Rm9jdXNlZFRhYkluZGV4KCkge1xuICAgICAgICBjb25zdCBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmIChmb2N1c2VkRWxlbWVudCAhPSBudWxsICYmIGZvY3VzZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDbGFzc2VzLlRBQikpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhYklkID0gZm9jdXNlZEVsZW1lbnQuaWQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWJJZHMuaW5kZXhPZih0YWJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGFicygpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0YWJzOiBBcnJheTxSZWFjdC5SZWFjdEVsZW1lbnQ8SVRhYlByb3BzPj4gPSBbXTtcbiAgICAgICAgaWYgKFJlYWN0LkNoaWxkcmVuLmNvdW50KHRoaXMucHJvcHMuY2hpbGRyZW4pID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGlsZCA9IFJlYWN0LkNoaWxkcmVuLnRvQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbilbMF0gYXMgUmVhY3QuUmVhY3RFbGVtZW50PGFueT47XG4gICAgICAgICAgICBpZiAoZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChmaXJzdENoaWxkLnByb3BzLmNoaWxkcmVuLCAodGFiTGlzdENoaWxkOiBSZWFjdC5SZWFjdEVsZW1lbnQ8YW55PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFiTGlzdENoaWxkLnR5cGUgPT09IFRhYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFicy5wdXNoKHRhYkxpc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFicztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRhYnNDb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGFicygpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBhbmVsc0NvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5jaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBwYW5lbENvdW50ID0gMDtcbiAgICAgICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaCh0aGlzLnByb3BzLmNoaWxkcmVuLCAoY2hpbGQ6IFJlYWN0LlJlYWN0RWxlbWVudDxhbnk+KSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gVGFiUGFuZWwpIHtcbiAgICAgICAgICAgICAgICBwYW5lbENvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcGFuZWxDb3VudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN0YXRlRnJvbVByb3BzKHByb3BzOiBJVGFic1Byb3BzKTogSVRhYnNTdGF0ZSB7XG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRUYWJJbmRleCwgaW5pdGlhbFNlbGVjdGVkVGFiSW5kZXggfSA9IHByb3BzO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWRUYWJJbmRleChzZWxlY3RlZFRhYkluZGV4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc2VsZWN0ZWRUYWJJbmRleCB9O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNWYWxpZFRhYkluZGV4KGluaXRpYWxTZWxlY3RlZFRhYkluZGV4KSAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkVGFiSW5kZXggPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc2VsZWN0ZWRUYWJJbmRleDogaW5pdGlhbFNlbGVjdGVkVGFiSW5kZXggfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1RhYkRpc2FibGVkKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgdGFiID0gdGhpcy5nZXRUYWJzKClbaW5kZXhdO1xuICAgICAgICByZXR1cm4gdGFiICE9IG51bGwgJiYgdGFiLnByb3BzLmlzRGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1ZhbGlkVGFiSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gaW5kZXggIT0gbnVsbCAmJiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5nZXRUYWJzQ291bnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBjb21wb25lbnQncyBzdGF0ZSBpZiB1bmNvbnRyb2xsZWQgYW5kIGNhbGxzIG9uQ2hhbmdlLlxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0U2VsZWN0ZWRUYWJJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYkluZGV4IHx8ICF0aGlzLmlzVmFsaWRUYWJJbmRleChpbmRleCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByZXZTZWxlY3RlZEluZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYkluZGV4O1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGVkVGFiSW5kZXggPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRUYWJJbmRleDogaW5kZXgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHRoaXMucHJvcHMub25DaGFuZ2UpKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGluZGV4LCBwcmV2U2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmxldCB0YWJDb3VudCA9IDA7XG5mdW5jdGlvbiBnZW5lcmF0ZVRhYklkKCkge1xuICAgIHJldHVybiBgcHQtdGFiLSR7dGFiQ291bnQrK31gO1xufVxuXG5sZXQgcGFuZWxDb3VudCA9IDA7XG5mdW5jdGlvbiBnZW5lcmF0ZVBhbmVsSWQoKSB7XG4gICAgcmV0dXJuIGBwdC10YWItcGFuZWwtJHtwYW5lbENvdW50Kyt9YDtcbn1cblxuZXhwb3J0IGNvbnN0IFRhYnNGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShUYWJzKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
