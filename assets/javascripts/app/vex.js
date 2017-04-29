import vex from 'vex-js';
import vexDialog from 'vex-dialog';

vex.registerPlugin(vexDialog);

vex.defaultOptions.className = 'vex-theme-try_turbolinks';
vex.dialog.buttons.NO.text = 'Cancelar';

export default vex;
