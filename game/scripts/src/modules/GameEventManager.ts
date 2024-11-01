import { reloadable } from "../utils/tstl-utils";

@reloadable
export class GameEventManager {
    private _OnPlayerChat(event: PlayerChatEvent) {
        Modules.CommandManager.OnPlayerChat(event);
    }

    constructor() {
        ListenToGameEvent("player_chat", (event) => this._OnPlayerChat(event), this);
    }
}
