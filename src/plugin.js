export default class CharSelect {
	prestart() {

		sc.CharSelectMenu = ig.BoxGui.extend({
			gfx: new ig.Image("media/gui/basic.png"),
			ninepatch: new ig.NinePatch("media/gui/menu.png", {
				width: 8,
				height: 8,
				left: 8,
				top: 8,
				right: 8,
				bottom: 8,
				offsets: {
					"default": {
						x: 432,
						y: 304
					},
					flipped: {
						x: 456,
						y: 304
					}
				}
			}),
			transitions: {
				HIDDEN: {
					state: {
						alpha: 0
					},
					time: 0.2,
					timeFunction: KEY_SPLINES.LINEAR
				},
				DEFAULT: {
					state: {},
					time: 0.2,
					timeFunction: KEY_SPLINES.LINEAR
				}
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
				this.buttonGroup.setMouseFocusLostCallback(function() {
					sc.quickmodel.setInfoText("", true);
				}.bind(this));

				sc.Model.addObserver(sc.quickmodel, this);
				this.list = new sc.ButtonListBox(1, 0, 20);
				this.list.buttonInteract = sc.quickmodel.buttonInteract;
				this.list.setPos(2, 13);
				this.list.setSize(171, 123);
				this.list.setButtonGroup(this.buttonGroup);
				this.list.showBottomBar = false;
				this.addChildGui(this.list);

				let text = new sc.TextGui(ig.lang.get("sc.gui.quick-menu.char-select"), {
					speed: ig.TextBlock.SPEED.IMMEDIATE,
					font: sc.fontsystem.tinyFont
				});
				text.setPos(8, 6);
				this.addChildGui(text);
				this.arrow = new sc.QuickItemArrow;
				this.addChildGui(this.arrow);
				this.doStateTransition("HIDDEN", true)
			},

			show() {
				if (this._hidden) {
					this._hidden = false;
					this.updateList(true);
					let a = this.hook;
					let b = {
						x: this.base.pos.x + this.anchor.pos.x + Math.floor(this.anchor.size.x / 2),
						y: this.base.pos.y + this.anchor.pos.y + Math.floor(this.anchor.size.y / 2)
					};
					let d = b.y + -46;
					b.y = Math.max(10, Math.min(ig.system.height - 137 - 10 - 22 - 70, b.y + -46));
					a.pos.y = b.y;
					if (b.x + 240 < ig.system.width) {
						this.currentTileOffset = "default";
						a.pos.x = b.x + 27 + 30;
						a.doPosTranstition(b.x + 27, b.y, 0.2, KEY_SPLINES.EASE_OUT);
						this.arrow.setPosition(-10, 42 + (d - b.y), false)
					} else {
						this.currentTileOffset = "flipped";
						a.pos.x = b.x - a.size.x - 27 - 30 - 1;
						a.doPosTranstition(b.x - a.size.x - 27 - 1, b.y, 0.2, KEY_SPLINES.EASE_OUT);
						this.arrow.setPosition(a.size.x + 1, 42 + (d - b.y), true)
					}
					a = sc.model.player.params;
					//this.maxBuffs.setNumber(a.getMaxBuffs());
					//this.currentBuffs.setNumber(a.currentItemBuffs);
					ig.interact.setBlockDelay(0.2);
					this.list.activate(sc.quickmodel.buttonInteract);
					this.doStateTransition("DEFAULT")
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

				["Lea", "Mirabelle", "Emilie"].forEach((name, i) => {
					let btn = new sc.ButtonGui(name, 143);
					btn.headChild = new ig.Image("media/gui/CCCharSelect.png");
					btn.setData({
						name: name,
						index: i
					});
					
					btn.hook.screenCoords = {};
					btn.textChild.setAlign(ig.GUI_ALIGN_X.LEFT, ig.GUI_ALIGN_Y.CENTER);
					btn.textChild.setPos(7, 0);

					this.list.addButton(btn);

					btn.updateDrawables = function(src) {
						src.addGfx(this.headChild, this.hook.size.x, 0, 16 + (24 * this.data.index), 0);
					};
				});

				this.list._prevIndex = c;
				ig.input.mouseGuiActive ? this.buttonGroup.setCurrentFocus(0, c) : this.buttonGroup.focusCurrentButton(0, c, false, a);
				this.list.scrollToY(b, true)
			},

			update() {
				if (this.isVisible() && (this.buttonGroup.isActive() && !ig.interact.isBlocked()) && sc.control.menuBack()) {
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
				console.log(btn.data.name);
			},

			modelChanged(sender, event) {
				if (sender == sc.quickmodel) {
					if (event == sc.QUICK_MODEL_EVENT.SWITCH_STATE) {
						sc.quickmodel.isQuickCharSelect() ? this.show() : this.hide();
					} else if (event == sc.QUICK_MODEL_EVENT.EXIT_MENU) {
						this.hide();
					}
				}
			}
		});

		//*
		sc.QuickMenuButtonGroup.inject({
			setButtons(...args) {
				args.forEach((btn, i) => btn && this.addFocusGui(btn, 0, i + 1));
			}
		});
		//*/

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
					src.addGfx(customRingMenuButtonGfx, 8, 8, 0, 0 + (this.active ? 0 : 16), 16, 16);
				}
			}
		});

		sc.QUICK_MENU_STATE["CHAR_SELECT"] = Math.max(...Object.values(sc.QUICK_MENU_STATE)) + 1;

		sc.QuickMenuModel.inject({
			enterCharSelect() {
				this._switchStates(sc.QUICK_MENU_STATE.CHAR_SELECT);
			},

			isQuickCharSelect() {
				return this.currentState == sc.QUICK_MENU_STATE.CHAR_SELECT;
			}
		});

		sc.QuickMenu.inject({
			init() {
				this.parent();

				this.charSelect = new sc.CharSelectMenu(this.ringmenu, this.ringmenu.items);
				this.addChildGui(this.charSelect);
			}
		});
	}
}