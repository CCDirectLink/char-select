ig.module("game.feature.quick-menu.gui.circle-menu.char-select")
    .requires("game.feature.quick-menu.gui.circle-menu")
    .defines(() => {
        sc.QUICK_MENU_STATE["CHAR_SELECT"] = Math.max(...Object.values(sc.QUICK_MENU_STATE)) + 1;

        const headGfxs = new ig.Image("media/gui/severed-heads.png");

        nax.ccuilib.QuickRingMenuWidgets.addWidget({
            title: "Character selection menu",
            name: "char_select",
            description: "Open the character selection menu",
            imageNoCache: true,
            id: sc.QUICK_MENU_STATE.CHAR_SELECT,
            keepPressed: true,
            image: () => {
                const playerName = sc.model.player.config.name;
                const headIdx = sc.party.models[playerName].getHeadIdx();

                let pos = { x: 4, y: 1 };
                if (window.CHAR_SELECT_HEAD_OFFSETS.has(playerName)) {
                    pos = window.CHAR_SELECT_HEAD_OFFSETS.get(playerName);
                }
                return {
                    gfx: headGfxs,
                    pos,
                    srcPos: { x: headIdx * 24, y: 0 },
                    size: { x: 24, y: 24 },
                };
            },
            pressEvent: () => sc.quickmodel.enterCharSelect(),
        });

        sc.QuickMenu.inject({
            init() {
                this.parent();

                this.charSelect = new sc.CharSelectMenu(this.ringmenu, this.ringmenu.items);
                this.addChildGui(this.charSelect);
            },
        });
    });
