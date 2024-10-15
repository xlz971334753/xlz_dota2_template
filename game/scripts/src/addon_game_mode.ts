// NPM包和扩展
import "sunlight-dota2-utils/dist/index";
import "./utils/index";
import { ActivateModules } from "./modules";
import Precache from "./utils/precache";

Object.assign(getfenv(), {
    Activate: () => {
        ActivateModules();
    },
    Precache: Precache,
});
