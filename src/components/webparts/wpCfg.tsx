import * as React from "react";
import { Types } from "gd-sprest";
import { Dropdown, PrimaryButton, TextField } from "office-ui-fabric-react";
import { Page } from "../../common";
import { IWebPartCfg, IWebPartCfgProps, IWebPartCfgState } from "../../definitions";
import { Panel } from '..';
declare var SP;

/**
 * Web Part Configuration
 */
export abstract class WebPartConfigurationPanel<Props extends IWebPartCfgProps = IWebPartCfgProps, State extends IWebPartCfgState = IWebPartCfgState> extends React.Component<Props, State> {
    /**
     * Constructor
     */
    constructor(props: Props) {
        super(props);

        // Set the state
        this.state = {
            cfg: props.cfg || {}
        } as any;
    }

    /**
     * Global Variables
     */
    private _errorMessage: HTMLDivElement = null;
    private _panel: Panel = null;
    protected _refreshButton: PrimaryButton = null;
    protected _saveButton: PrimaryButton = null;
    protected _webUrl: TextField = null;


    /**
     * Required Methods
     */
    abstract onRenderContents: (cfg: IWebPartCfg) => any;

    /**
     * Events
     */

    // The render footer event
    onRenderFooter = () => { }

    // The render header event
    onRenderHeader = () => { }

    /**
     * Public Interface
     */

    // Method to render the panel
    render() {
        return (
            <div>
                <PrimaryButton text="Edit Configuration" onClick={this.show} />
                <Panel headerText="Configuration" ref={panel => { this._panel = panel; }}>
                    <div ref={errorMessage => { this._errorMessage = errorMessage; }} />
                    {this.onRenderHeader()}
                    {this.onRenderContents(this.state.cfg)}
                    {this.onRenderFooter()}
                </Panel>
            </div >
        )
    }

    /**
     * Methods
     */

    // Method to save the webpart configuration
    protected saveConfiguration = (wpCfg: any) => {
        // Clear the error message
        this._errorMessage.innerText = "";

        // Update the webpart content elements
        if (this.updateWebPartContentElements(this.props.cfg.WebPartId, wpCfg)) {
            // Close the panel
            this._panel.hide();
            return;
        }

        // Get the target webpart
        Page.getWebPart(this.props.cfg.WebPartId).then((wpInfo) => {
            // Get the content
            let content = wpInfo && wpInfo.Properties.get_fieldValues()["Content"];
            if (content) {
                // Create an element so we can update the configuration
                let el = document.createElement("div");
                el.innerHTML = content;

                // Get the configuration element and update it
                let cfg = el.querySelector("#" + this.props.cfgElementId) as HTMLDivElement;
                cfg ? cfg.innerText = JSON.stringify(wpCfg) : null;

                // Update the webpart
                wpInfo.Properties.set_item("Content", el.innerHTML);
                wpInfo.WebPartDefinition.saveWebPartChanges();
                wpInfo.Context.load(wpInfo.WebPartDefinition);

                // Execute the request
                wpInfo.Context.executeQueryAsync(
                    // Success
                    () => {
                        // Disable the edit page warning
                        if (SP && SP.Ribbon && SP.Ribbon.PageState && SP.Ribbon.PageState.PageStateHandler) {
                            SP.Ribbon.PageState.PageStateHandler.ignoreNextUnload = true;
                        }

                        // Refresh the page
                        window.location.href = window.location.pathname + "?DisplayMode=Design";
                    },
                    // Error
                    (...args) => {
                        // Set the error message
                        this._errorMessage.innerText = args[1].get_message();
                    }
                );
            }
        });
    }

    // Method to show the panel
    private show = (ev: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Show the panel
        this._panel.show();
    }

    // Method to update the webpart content elements
    private updateWebPartContentElements = (wpId: string, wpCfg): boolean => {
        // Get the webpart element
        let elWebPart = document.querySelector("div[webpartid='" + wpId + "']");
        if (elWebPart) {
            let wpContent = null;
            let wpPageContent = null;

            // Get the associated webpart id
            let wpId2 = elWebPart.getAttribute("webpartid2");

            // Update the configuration
            var cfg = elWebPart.querySelector("#" + this.props.cfgElementId) as HTMLDivElement;
            cfg ? cfg.innerText = JSON.stringify(wpCfg) : null;

            // Parse the hidden elements on the page
            let hiddenElements = document.querySelectorAll("input[type='hidden']");
            for (let i = 0; i < hiddenElements.length; i++) {
                let elHidden: HTMLInputElement = hiddenElements[i] as any;

                // See if we have found the webpart content and page content hidden elements
                if (wpContent && wpPageContent) { continue; }

                // See if this is a hidden webpart content element
                if (elHidden.name && elHidden.name.indexOf("scriptcontent") == elHidden.name.length - 13) {
                    // See if it's for this webpart
                    if (elHidden.name.indexOf(wpId2) == 0) {
                        // Set the webpart content element
                        wpContent = elHidden;

                        // Update the configuration in the webpart content element
                        this.updateConfigurationInElement(wpContent, wpCfg);
                    }

                    // Continue the loop
                    continue;
                }

                // Create an element and set the inner html to the value
                let el = document.createElement("div");
                el.innerHTML = elHidden.value;

                // See if this is a hidden field element
                if (el.querySelector("#" + this.props.cfgElementId)) {
                    // Set the webpart page content
                    wpPageContent = elHidden;

                    // Update the configuration in the webpart content element
                    this.updateConfigurationInElement(wpPageContent, wpCfg);

                    // Continue the loop
                    continue;
                }
            }

            // Return true, if the page content exists
            return wpPageContent != null;
        }

        // Webpart is not in a content field
        return false;
    }

    // Method to update the configuration element
    private updateConfigurationInElement = (elTarget: HTMLInputElement, wpCfg) => {
        // Create an element so we can update the configuration
        let el = document.createElement("div");
        el.innerHTML = elTarget.value;

        // Get the configuration element and update it
        let cfg = el.querySelector("#" + this.props.cfgElementId) as HTMLDivElement;
        cfg ? cfg.innerText = JSON.stringify(wpCfg) : null;

        // Update the value
        elTarget.value = el.innerHTML;
    }
}