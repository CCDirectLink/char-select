import "./js/game/feature/quick-menu/gui/char-select-menu.js";
import "./js/game/feature/quick-menu/gui/circle-menu/char-select.js";
import "./js/game/feature/quick-menu/quick-menu-model/char-select.js";

ig.module("game.feature.player.player-skin.char-select")
  .requires("game.feature.player.player-skin").defines(function() {
    sc.PlayerSkinLibrary.inject({
        updateSkinSet: function(skinType) {
            const player = sc.model.player;
            if (skinType === "Appearance" && player.name !== "Lea") {
                const currentSkin = this.currentSkins[skinType];
                if (currentSkin) currentSkin.clearCached();
                this.currentSkins[skinType] = null;
                sc.Model.notifyObserver(this, sc.SKIN_EVENT.SKIN_UPDATE, skinType)
                return;
            }
            this.parent(skinType);
        }
    });
    ig.Game.inject({
        init: function() {
            this.parent();
            sc.Model.addObserver(sc.model.player, {
                modelChanged: function(model, messageType) {
                    if (model === sc.model.player && messageType === sc.PLAYER_MSG.CONFIG_CHANGED) {
                        sc.playerSkins.updateSkinSet("Appearance");
                    }
                }
            });
        }
    });


  });