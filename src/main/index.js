'use strict';

import CpMain from './core/CpMain'

//WindowManager.autoReloadElectron();

try {
    new CpMain();
} catch (e) {
    console.log(e)
}