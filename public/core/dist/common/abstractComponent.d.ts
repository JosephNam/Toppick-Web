import * as React from "react";
/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
export declare abstract class AbstractComponent<P, S> extends React.Component<P, S> {
    constructor(props?: P, context?: any);
    componentWillReceiveProps(nextProps: P & {
        children?: React.ReactNode;
    }): void;
    /**
     * Ensures that the props specified for a component are valid.
     * Implementations should check that props are valid and usually throw an Error if they are not.
     * Implementations should not duplicate checks that the type system already guarantees.
     *
     * This method should be used instead of React's
     * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
     * In contrast to propTypes, these runtime checks are _always_ run, not just in development mode.
     */
    protected validateProps(_: P & {
        children?: React.ReactNode;
    }): void;
}
