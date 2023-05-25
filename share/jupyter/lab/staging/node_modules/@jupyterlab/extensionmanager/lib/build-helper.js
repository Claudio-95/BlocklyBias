// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Dialog, showDialog, showErrorMessage } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import * as React from 'react';
/**
 * Instruct the server to perform a build
 *
 * @param builder the build manager
 */
export function doBuild(app, builder, translator) {
    translator = translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    if (builder.isAvailable) {
        return builder
            .build()
            .then(() => {
            return showDialog({
                title: trans.__('Build Complete'),
                body: (React.createElement("div", null,
                    trans.__('Build successfully completed, reload page?'),
                    React.createElement("br", null),
                    trans.__('You will lose any unsaved changes.'))),
                buttons: [
                    Dialog.cancelButton({
                        label: trans.__('Reload Without Saving'),
                        actions: ['reload']
                    }),
                    Dialog.okButton({ label: trans.__('Save and Reload') })
                ],
                hasClose: true
            });
        })
            .then(({ button: { accept, actions } }) => {
            if (accept) {
                void app.commands
                    .execute('docmanager:save')
                    .then(() => {
                    location.reload();
                })
                    .catch((err) => {
                    void showErrorMessage(trans.__('Save Failed'), {
                        message: React.createElement("pre", null, err.message)
                    });
                });
            }
            else if (actions.includes('reload')) {
                location.reload();
            }
        })
            .catch(err => {
            void showDialog({
                title: trans.__('Build Failed'),
                body: React.createElement("pre", null, err.message)
            });
        });
    }
    return Promise.resolve();
}
//# sourceMappingURL=build-helper.js.map