ig.module("game.feature.quick-menu.gui.circle-menu.char-select")
  .requires("game.feature.quick-menu.gui.circle-menu").defines(function() {
    sc.QuickMenuButtonGroup.inject({
        setButtons(...args) {
            args.forEach((btn, i) => btn && this.addFocusGui(btn, 0, i + 1));
        }
    });

    sc.QuickRingMenu.inject({
        charSelect: null,
        init() {
            this.parent();
    
            this.buttongroup.addPressCallback(data => {
                if (data.state && data.state === sc.QUICK_MENU_STATE.CHAR_SELECT) {
                    sc.quickmodel.enterCharSelect();
                    this._unfocusAll(data);
                }
            });
        },
    
        createButtons() {
            let angles = [];
            for(let currentAngle = 0; currentAngle < 360; currentAngle += 360 / 5) {
                angles.push({
                    x: 56 - 35 * Math.sin(currentAngle * Math.PI / 180),
                    y: 56 - 35 * Math.cos(currentAngle * Math.PI / 180)
                });
            }
    
            this.items = this._createRingButton("items", sc.QUICK_MENU_STATE.ITEMS, angles, 0, 1);
            this.check = this._createRingButton("analyze", sc.QUICK_MENU_STATE.CHECK, angles, 0, 2);
            this.party = this._createRingButton("party", sc.QUICK_MENU_STATE.PARTY, angles, 0, 3);
            this.map = this._createRingButton("map", sc.QUICK_MENU_STATE.MAP, angles, 0, 4);
            this.charSelect = this._createRingButton("char-select", sc.QUICK_MENU_STATE.CHAR_SELECT, angles, 0, 5);
            
            this.items.addChildGui(new sc.ItemTimerOverlay(this.items));
            this.buttongroup.setButtons(this.check, this.items, this.map, this.party, this.charSelect);
        }
    });

    const customRingMenuButtonGfx = new ig.Image("media/gui/CCCharSelect.png");
    const headGfxs = new ig.Image("media/gui/severed-heads.png");
    const charOffsets = new Map;
    charOffsets.set("Lea", {
        x: 4,
        y: 0
    });
    charOffsets.set("Shizuka", {
        x: 3,
        y: 0
    });
    charOffsets.set("Shizuka0", {
        x: 3,
        y: 0
    });
    charOffsets.set("Emilie", {
        x: 3,
        y: 1
    });
    charOffsets.set("Sergey", {
        x: 4,
        y: 1
    });
    charOffsets.set("Schneider", {
        x: 3,
        y: 0
    });
    charOffsets.set("Schneider2", {
        x: 3,
        y: 0
    });

    charOffsets.set("Hlin", {
        x: 3,
        y: 1
    });

    charOffsets.set("Grumpy", {
        x: 2,
        y: 0
    });

    charOffsets.set("Glasses", {
        x: 4,
        y: 1
    });

    charOffsets.set("Apollo", {
        x: 4,
        y: 1
    });

    charOffsets.set("Joern", {
        x: 4,
        y: 0
    });

    charOffsets.set("Triblader1", {
        x: 4,
        y: 1
    });

    charOffsets.set("Luke", {
        x: 3,
        y: 0
    });

    sc.RingMenuButton.inject({
        updateDrawables(src) {
            if (!this.head && this.state < 5) {
                this.parent(src);
            } else {
                src.addGfx(this.gfx, 0, 0, 400, 304, 32, 32);
                if (this.active) {
                    if (this.focus) {
                        src.addGfx(this.gfx, 0, 0, 400, 336, 32, 32).setAlpha(this.alpha)
                    } else {
                        if (this.pressed) {
                            src.addGfx(this.gfx, 0, 0, 400, 336, 32, 32)
                        }
                    }
                } else {
                    if (this.focus) {
                        src.addGfx(this.gfx, 0, 0, 400, 272, 32, 32);
                    }
                }
                const playerName = sc.model.player.config.name;
                const headIdx = sc.model.player.config.headIdx;
                if (charOffsets.has(playerName)) {
                    const {x,y} = charOffsets.get(playerName);
                    src.addGfx(headGfxs, x, y, (headIdx * 24), 0, 24, 24);
                } else {
                    src.addGfx(headGfxs, 4, 1, (headIdx * 24), 0, 24, 24);
                }
                
            }
        }
    });

    sc.QuickMenu.inject({
        init() {
            this.parent();
    
            this.charSelect = new sc.CharSelectMenu(this.ringmenu, this.ringmenu.items);
            this.addChildGui(this.charSelect);
        }
    });

});