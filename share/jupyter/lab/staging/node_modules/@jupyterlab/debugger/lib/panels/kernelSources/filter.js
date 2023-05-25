// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';
const FilterBox = (props) => {
    const onFilterChange = (e) => {
        const filter = e.target.value;
        props.model.filter = filter;
    };
    return (React.createElement(InputGroup, { type: "text", onChange: onFilterChange, placeholder: "Filter the kernel sources", value: props.model.filter }));
};
/**
 * A widget which hosts a input textbox to filter on file names.
 */
export const KernelSourcesFilter = (props) => {
    return ReactWidget.create(React.createElement(UseSignal, { signal: props.model.filterChanged, initialArgs: props.model.filter }, model => React.createElement(FilterBox, { model: props.model })));
};
//# sourceMappingURL=filter.js.map