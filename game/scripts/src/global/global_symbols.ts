// 防重载
namespace GlobalSymbols {
    /** boolean 猴子猴孙复制技能标识 boolean */
    export const MonkeySoliderCopyRecord: symbol = GlobalSymbols.MonkeySoliderCopyRecord ?? Symbol("MonkeySoliderCopyRecord");
    /** timer 辅助技能计时器 TimerId */
    export const SubTemAbilityTimer: symbol = GlobalSymbols.SubTemAbilityTimer ?? Symbol("SubTemAbilityTimer");
    /** boolean 小僵尸移除标记 boolean */
    export const ZombieRemoveFlag: symbol = GlobalSymbols.ZombieRemoveFlag ?? Symbol("ZombieRemoveFlag");
    /** 是否是猴子猴孙标识 boolean */
    export const IsMonkeyArmy: symbol = GlobalSymbols.IsMonkeyArmy ?? Symbol("IsMonkeyArmy");
    /** 玩家买活惩罚标记 boolean */
    export const PlayerBuybackPunishment: symbol = GlobalSymbols.PlayerBuybackPunishment ?? Symbol("PlayerBuybackPunishment");
}
