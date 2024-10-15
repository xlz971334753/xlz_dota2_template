import { reloadable } from "../utils/tstl-utils";

@reloadable
export class TestMap {
    constructor() {
        if (IsTestMap()) {
            this.activate();
            ListenToGameEvent("npc_spawned", (event) => this.npc_spawned(event), undefined);
            ListenToGameEvent("game_rules_state_change", () => this.game_rules_state_change(), undefined);
        }
    }

    private activate() {
        const gamemode = GameRules.GetGameModeEntity();

        GameRules.SetHeroSelectPenaltyTime(600); //选择英雄超时惩罚时间
        GameRules.SetPreGameTime(0); //战前准备（开始游戏倒计时）
        GameRules.SetShowcaseTime(0); // 载入界面
        GameRules.SetStrategyTime(0); //策略时间
        GameRules.SetStartingGold(99999); //玩家初始资金
        GameRules.SetPostGameTime(600); //游戏结束后多久自动断开连接
        GameRules.SetCustomGameSetupAutoLaunchDelay(0); //队伍选择界面时间
        GameRules.SetUseUniversalShopMode(true); //全能商店
        gamemode.SetPauseEnabled(true); // 允许暂停
        gamemode.SetFogOfWarDisabled(true); //关闭战争迷雾
        gamemode.SetBotThinkingEnabled(false);
        gamemode.SetCustomScanCooldown(0); //设置扫描冷却
        gamemode.SetCustomGlyphCooldown(0); //设置塔防冷却
        SendToConsole("dota_easybuy 1");
    }

    public static CreatDummyInTestMap() {
        if (IsTestMap()) {
            for (let index = 1; index <= 5; index++) {
                const name: string = "dummy_" + index;
                CreateUnitByName("npc_dota_hero_target_dummy", Entities.FindByName(null, name).GetAbsOrigin(), true, null, null, 4);
            }
        }
    }

    private npc_spawned(event) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        if (unit.IsRealHero()) {
            GameRules.SetGlyphCooldown(unit.GetTeam(), 0);
            unit as CDOTA_BaseNPC_Hero;
            if (!unit.HasShard()) {
                // unit.AddItemByName("item_aghanims_shard");
                // unit.AddItemByName("item_event_golden_axe");
                // unit.AddItemByName("item_event_silver_axe");
            }
            // Timer(() => {
            //     if (IsValid(unit)) {
            //         CustomPrecache(unit.GetUnitName(), "hero");
            //     }
            // }, 0.5);
        }
        const bad_fort = Entities.FindByName(null, "dota_badguys_fort");
        if (IsValid(bad_fort) && bad_fort.IsBaseNPC()) {
            bad_fort.RemoveModifierByName("modifier_invulnerable");
            bad_fort.RemoveModifierByName("modifier_backdoor_protection_active");
            bad_fort.RemoveModifierByName("modifier_backdoor_protection_in_base");
        }
    }

    private game_rules_state_change() {
        const newState = GameRules.State_Get();
        // GAME_IN_PROGRESS
        if (newState == GameState.GAME_IN_PROGRESS) {
            GameRules.SpawnNeutralCreeps();
        }
    }
}
