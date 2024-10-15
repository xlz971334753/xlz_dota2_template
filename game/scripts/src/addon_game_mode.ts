// NPM包和扩展
import "sunlight-dota2-utils/dist/index";
import "./extends/index_server";
import "./utils/_index";
import "./global/_index";
import { ActivateModules } from "./modules/_index";
import Precache from "./precache";

Object.assign(getfenv(), {
    Activate: () => {
        ActivateModules();
    },
    Precache: Precache,
});
