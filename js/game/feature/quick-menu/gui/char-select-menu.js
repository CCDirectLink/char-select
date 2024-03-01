ig.module("game.feature.quick-menu.gui.char-select-menu")
    .requires("impact.feature.gui.base.box")
    .defines(() => {
        sc.CharSelectMenu = ig.BoxGui.extend({
            gfx: new ig.Image("media/gui/basic.png"),
            ninepatch: new ig.NinePatch("media/gui/menu.png", {
                width: 8,
                height: 8,
                left: 8,
                top: 8,
                right: 8,
                bottom: 8,
                offsets: { default: { x: 432, y: 304 }, flipped: { x: 456, y: 304 } },
            }),
            transitions: {
                HIDDEN: { state: { alpha: 0 }, time: 0.2, timeFunction: KEY_SPLINES.LINEAR },
                DEFAULT: { state: {}, time: 0.2, timeFunction: KEY_SPLINES.LINEAR },
            },
            buttonGroup: null,
            button: null,
            base: null,
            anchor: null,
            list: null,
            _hidden: true,
            init(base, anchor) {
                this.parent(175, 147);
                this.base = base.hook;
                this.anchor = anchor.hook;

                this.buttonGroup = new sc.ButtonGroup(false, ig.BUTTON_GROUP_SELECT_TYPE.VERTICAL);
                this.buttonGroup.addSelectionCallback(this.onSelection.bind(this));
                this.buttonGroup.addPressCallback(this.onPress.bind(this));
                this.buttonGroup.setMouseFocusLostCallback(() => sc.quickmodel.setInfoText("", true));

                sc.Model.addObserver(sc.quickmodel, this);
                this.list = new sc.ButtonListBox(1, 0, 20);
                this.list.buttonInteract = sc.quickmodel.buttonInteract;
                this.list.setPos(2, 13);
                this.list.setSize(171, 123);
                this.list.setButtonGroup(this.buttonGroup);
                this.list.showBottomBar = false;
                this.addChildGui(this.list);

                let text = new sc.TextGui("Select a character", {
                    speed: ig.TextBlock.SPEED.IMMEDIATE,
                    font: sc.fontsystem.tinyFont,
                });
                text.setPos(8, 6);
                this.addChildGui(text);
                this.arrow = new sc.QuickItemArrow();
                this.addChildGui(this.arrow);
                this.doStateTransition("HIDDEN", true);
            },

            show() {
                if (this._hidden) {
                    this._hidden = false;
                    this.updateList(true);
                    let a = this.hook;
                    let b = {
                        x: this.base.pos.x + this.anchor.pos.x + Math.floor(this.anchor.size.x / 2),
                        y: this.base.pos.y + this.anchor.pos.y + Math.floor(this.anchor.size.y / 2),
                    };
                    let d = b.y + -46;
                    b.y = Math.max(10, Math.min(ig.system.height - 137 - 10 - 22 - 70, b.y + -46));
                    a.pos.y = b.y;
                    if (b.x + 240 < ig.system.width) {
                        this.currentTileOffset = "default";
                        a.pos.x = b.x + 27 + 30;
                        a.doPosTranstition(b.x + 27, b.y, 0.2, KEY_SPLINES.EASE_OUT);
                        this.arrow.setPosition(-10, 42 + (d - b.y), false);
                    } else {
                        this.currentTileOffset = "flipped";
                        a.pos.x = b.x - a.size.x - 27 - 30 - 1;
                        a.doPosTranstition(b.x - a.size.x - 27 - 1, b.y, 0.2, KEY_SPLINES.EASE_OUT);
                        this.arrow.setPosition(a.size.x + 1, 42 + (d - b.y), true);
                    }
                    a = sc.model.player.params;
                    //this.maxBuffs.setNumber(a.getMaxBuffs());
                    //this.currentBuffs.setNumber(a.currentItemBuffs);
                    ig.interact.setBlockDelay(0.2);
                    this.list.activate(sc.quickmodel.buttonInteract);
                    this.doStateTransition("DEFAULT");
                }
            },

            hide() {
                if (!this._hidden) {
                    this._hidden = true;
                    this.list.deactivate(sc.quickmodel.buttonInteract);
                    this.doStateTransition("HIDDEN");
                }
            },

            updateList() {
                let b = this.list.getScrollY();
                let c = this.buttonGroup.current.y;

                if (!sc.options.get("quick-cursor")) c = b = 0;

                this.buttonGroup.clear();
                this.list.clear(true);

                sc.PARTY_OPTIONS.forEach(name => {
                    let btn = new sc.ButtonGui(name, 143);
                    btn.headChild = new ig.Image("media/gui/severed-heads.png");
                    btn.setData({
                        name: name,
                        index: sc.party.models[name].config.headIdx,
                    });

                    btn.hook.screenCoords = {};
                    btn.textChild.setAlign(ig.GUI_ALIGN_X.LEFT, ig.GUI_ALIGN_Y.CENTER);
                    btn.textChild.setPos(7, 0);

                    this.list.addButton(btn);

                    btn.updateDrawables = function (src) {
                        src.addGfx(this.headChild, this.hook.size.x, 0, 24 * this.data.index, 0);
                    };
                });

                this.list._prevIndex = c;
                ig.input.mouseGuiActive ? this.buttonGroup.setCurrentFocus(0, c) : this.buttonGroup.focusCurrentButton(0, c, false);
                this.list.scrollToY(b, true);
            },

            update() {
                if (this.isVisible() && this.buttonGroup.isActive() && !ig.interact.isBlocked() && sc.control.menuBack()) {
                    sc.BUTTON_SOUND.back.play();
                    sc.quickmodel.enterNone();
                }
            },

            updateDrawables(src) {
                this.parent(src);
                src.addColor("#7E7E7E", 2, 135, 171, 1);
            },

            onSelection(btn) {
                sc.quickmodel.setInfoText(btn.data.description);
            },

            onPress(btn) {
                let name = btn.data.name;
                const config = sc.party.models[name].config;
                sc.model.player.setConfig(config);

                /* update the player sprite immediately */
                sc.model.player.setConfig(config);
                ig.ENTITY.Combatant.prototype.update.call(ig.game.playerEntity);
            },

            modelChanged(sender, event) {
                if (sender == sc.quickmodel) {
                    if (event == sc.QUICK_MODEL_EVENT.SWITCH_STATE) {
                        sc.quickmodel.isQuickCharSelect() ? this.show() : this.hide();
                    } else if (event == sc.QUICK_MODEL_EVENT.EXIT_MENU) {
                        this.hide();
                    }
                }
            },
        });
    });
