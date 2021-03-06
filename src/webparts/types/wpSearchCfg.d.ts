import {
    WebPartFieldCfg, IWebPartFieldCfg, IWebPartFieldCfgPanel, IWebPartFieldCfgProps, IWebPartFieldCfgState
} from ".";

/**
 * WebPart Search Configuration Panel
 */
export class WebPartSearchCfg<Props extends IWebPartSearchCfgProps = IWebPartSearchCfgProps, State extends IWebPartSearchCfgState = IWebPartSearchCfgState> extends WebPartFieldCfg<Props, State> { }

/**
 * Search Configuration
 */
export interface IWebPartSearchCfg extends IWebPartFieldCfg {
    TagPickerFl?: boolean;
}

/**
 * Search Configuration Panel
 */
export interface IWebPartSearchCfgPanel extends IWebPartFieldCfgPanel {
    renderSearchPicker: () => JSX.Element;
}

/**
 * Search Configuration Properties
 */
export interface IWebPartSearchCfgProps extends IWebPartFieldCfgProps {
    cfg: IWebPartSearchCfg;
}

/**
 * Search Configuration State
 */
export interface IWebPartSearchCfgState extends IWebPartFieldCfgState {
    cfg: IWebPartSearchCfg;
}
