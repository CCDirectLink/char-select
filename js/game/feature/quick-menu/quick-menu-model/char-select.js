ig.module("game.feature.quick-menu.quick-menu-model.char-select")
    .requires("game.feature.quick-menu.quick-menu-model")
    .defines(() => {
        sc.QUICK_MENU_STATE["CHAR_SELECT"] = Math.max(...Object.values(sc.QUICK_MENU_STATE)) + 1;
        sc.QuickMenuModel.inject({
            enterCharSelect() {
                this._switchStates(sc.QUICK_MENU_STATE.CHAR_SELECT);
            },

            isQuickCharSelect() {
                return this.currentState == sc.QUICK_MENU_STATE.CHAR_SELECT;
            },
        });
    });
