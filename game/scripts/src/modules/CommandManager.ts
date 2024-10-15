import { reloadable } from "../utils/tstl-utils";

@reloadable
export class CommandManager {
    /** 白名单列表 */

    private _white_id_list: Record<number, boolean> = {
        /** 阿泽 */
        139620831: true,
    };

    private _is_cheat_mode: boolean = false;
    private _gamemode = GameRules.GetGameModeEntity();

    OnPlayerChat(data: PlayerChatEvent) {
        const { playerid, teamonly, userid } = data;
        const text = data.text.toLowerCase();
        const player = ID2Player(playerid);
        if (!IsValid(player)) return;
        const split_strs = text.split(" ");
        const cmd = split_strs[0] as Commands;
        // 检测指令合法性
        if (!this._IsValidCommand(cmd, playerid)) return;
        // 执行指令回调
        const command_data: CommandCallbackParams = {
            playerId: playerid,
            hero: player.GetAssignedHero(),
            params: split_strs.slice(1),
            player: player,
        };
        const callback = this._GetCommandCallback(cmd);
        if (!callback) return;
        callback(command_data);
    }

    private _IsValidCommand(cmd: Commands, playerId: PlayerID): boolean {
        if (IsInToolsMode()) return true;
        if (this._GetGMCommandCallbacks()[cmd]) {
            const steamid = PlayerResource.GetSteamAccountID(playerId);
            if (this._white_id_list[steamid]) return true;
        }
        if (this._GetDebugCommandCallbacks()[cmd]) {
            return this._is_cheat_mode;
        }
        return false;
    }

    /** 管理指令 */
    private _GetGMCommandCallbacks(): Record<GMCommands, CommandCallback> {
        return {
            [GMCommands.debug]: (data) => {
                // 检测到是测试人员的steamid，可以输入-debug来进入测试模式（如果有必要，提供debug面板）
                this._is_cheat_mode = true;
            },
            [GMCommands.get_key_v2]: (data) => {
                const version = data.params[0];
                const key = GetDedicatedServerKeyV3(version);
                Say(HeroList.GetHero(0), `${version}: ${key}`, true);
            },
            [GMCommands.get_key_v3]: (data) => {
                const version = data.params[0];
                const key = GetDedicatedServerKeyV3(version);
                Say(HeroList.GetHero(0), `${version}: ${key}`, true);
            },
        };
    }

    private _GetDebugCommandCallbacks(): Record<DebugCommands, CommandCallback> {
        return {
            [DebugCommands.t]: (data) => {},
            [DebugCommands.t2]: (data) => {},
            [DebugCommands.r]: (data) => {
                SendToConsole("cl_script_reload");
                SendToConsole("script_reload");
                GameRules.Playtesting_UpdateAddOnKeyValues();
                FireGameEvent("client_reload_game_keyvalues", {});
            },
            [DebugCommands.rs]: (data) => {
                SendToConsole("restart");
            },
            [DebugCommands.pr]: (data) => {
                SendToConsole("dota_portrait_reload");
            },
        };
    }

    private _GetCommandCallback(command: Commands): CommandCallback | undefined {
        return this._GetDebugCommandCallbacks()[command] ?? this._GetGMCommandCallbacks()[command];
    }

    constructor() {}
}

type Commands = DebugCommands | GMCommands;

const enum DebugCommands {
    /** 测试 */
    t = "t",
    /** 测试2 */
    t2 = "t2",
    /** 重载代码 */
    r = "r",
    /** 重开 */
    rs = "rs",
    /** 重载肖像 */
    pr = "pr",
}

const enum GMCommands {
    /** 检测到是测试人员的steamid，可以输入-debug来进入测试模式（如果有必要，提供debug面板） */
    debug = "-debug",
    /** 获取server key */
    get_key_v2 = "get_key_v2",
    /** 获取server key */
    get_key_v3 = "get_key_v3",
}
type CommandCallbackParams = {
    playerId: PlayerID;
    player: CDOTAPlayerController;
    hero?: CDOTA_BaseNPC_Hero;
    /** 参数 */
    params: string[];
};
type CommandCallback = (data: CommandCallbackParams) => void;
