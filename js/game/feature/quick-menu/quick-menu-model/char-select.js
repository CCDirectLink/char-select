ig.module("game.feature.quick-menu.quick-menu-model.char-select")
    .requires("game.feature.quick-menu.quick-menu-model")
    .defines(() => {
        sc.QuickMenuModel.inject({
            enterCharSelect() {
                this._switchStates(sc.QUICK_MENU_STATE.CHAR_SELECT);
            },

            isQuickCharSelect() {
                return this.currentState == sc.QUICK_MENU_STATE.CHAR_SELECT;
            },
        });
    });
