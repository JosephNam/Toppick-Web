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
var React = require("react");
/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
var AbstractComponent = (function (_super) {
    __extends(AbstractComponent, _super);
    function AbstractComponent(props, context) {
        _super.call(this, props, context);
        this.validateProps(this.props);
    }
    AbstractComponent.prototype.componentWillReceiveProps = function (nextProps) {
        this.validateProps(nextProps);
    };
    /**
     * Ensures that the props specified for a component are valid.
     * Implementations should check that props are valid and usually throw an Error if they are not.
     * Implementations should not duplicate checks that the type system already guarantees.
     *
     * This method should be used instead of React's
     * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
     * In contrast to propTypes, these runtime checks are _always_ run, not just in development mode.
     */
    AbstractComponent.prototype.validateProps = function (_) {
        // implement in subclass
    };
    ;
    return AbstractComponent;
}(React.Component));
exports.AbstractComponent = AbstractComponent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tb24vYWJzdHJhY3RDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7Ozs7Ozs7QUFFSCxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUUvQjs7O0dBR0c7QUFDSDtJQUFzRCxxQ0FBcUI7SUFDdkUsMkJBQVksS0FBUyxFQUFFLE9BQWE7UUFDaEMsa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxxREFBeUIsR0FBaEMsVUFBaUMsU0FBMkM7UUFDeEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7SUFDUSx5Q0FBYSxHQUF2QixVQUF3QixDQUFtQztRQUN2RCx3QkFBd0I7SUFDNUIsQ0FBQzs7SUFDTCx3QkFBQztBQUFELENBdEJBLEFBc0JDLENBdEJxRCxLQUFLLENBQUMsU0FBUyxHQXNCcEU7QUF0QnFCLHlCQUFpQixvQkFzQnRDLENBQUEiLCJmaWxlIjoiY29tbW9uL2Fic3RyYWN0Q29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE1IFBhbGFudGlyIFRlY2hub2xvZ2llcywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEJTRC0zIExpY2Vuc2UgYXMgbW9kaWZpZWQgKHRoZSDigJxMaWNlbnNl4oCdKTsgeW91IG1heSBvYnRhaW4gYSBjb3B5XG4gKiBvZiB0aGUgbGljZW5zZSBhdCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGFsYW50aXIvYmx1ZXByaW50L2Jsb2IvbWFzdGVyL1BBVEVOVFNcbiAqL1xuXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBjb21wb25lbnQgdGhhdCBCbHVlcHJpbnQgY29tcG9uZW50cyBjYW4gZXh0ZW5kXG4gKiBpbiBvcmRlciB0byBhZGQgc29tZSBjb21tb24gZnVuY3Rpb25hbGl0eSBsaWtlIHJ1bnRpbWUgcHJvcHMgdmFsaWRhdGlvbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29tcG9uZW50PFAsIFM+IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFAsIFM+IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz86IFAsIGNvbnRleHQ/OiBhbnkpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB0aGlzLnZhbGlkYXRlUHJvcHModGhpcy5wcm9wcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBQICYge2NoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlfSkge1xuICAgICAgICB0aGlzLnZhbGlkYXRlUHJvcHMobmV4dFByb3BzKTtcbiAgICB9XG5cbiAgIC8qKlxuICAgICogRW5zdXJlcyB0aGF0IHRoZSBwcm9wcyBzcGVjaWZpZWQgZm9yIGEgY29tcG9uZW50IGFyZSB2YWxpZC5cbiAgICAqIEltcGxlbWVudGF0aW9ucyBzaG91bGQgY2hlY2sgdGhhdCBwcm9wcyBhcmUgdmFsaWQgYW5kIHVzdWFsbHkgdGhyb3cgYW4gRXJyb3IgaWYgdGhleSBhcmUgbm90LlxuICAgICogSW1wbGVtZW50YXRpb25zIHNob3VsZCBub3QgZHVwbGljYXRlIGNoZWNrcyB0aGF0IHRoZSB0eXBlIHN5c3RlbSBhbHJlYWR5IGd1YXJhbnRlZXMuXG4gICAgKlxuICAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBvZiBSZWFjdCdzXG4gICAgKiBbcHJvcFR5cGVzXShodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3JldXNhYmxlLWNvbXBvbmVudHMuaHRtbCNwcm9wLXZhbGlkYXRpb24pIGZlYXR1cmUuXG4gICAgKiBJbiBjb250cmFzdCB0byBwcm9wVHlwZXMsIHRoZXNlIHJ1bnRpbWUgY2hlY2tzIGFyZSBfYWx3YXlzXyBydW4sIG5vdCBqdXN0IGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAgKi9cbiAgICBwcm90ZWN0ZWQgdmFsaWRhdGVQcm9wcyhfOiBQICYge2NoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlfSkge1xuICAgICAgICAvLyBpbXBsZW1lbnQgaW4gc3ViY2xhc3NcbiAgICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
