import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react";
import { Page } from "../common";
import { IWebPartCfg, IWebPartConfigurationProps, IWebPartConfigurationState } from "../definitions";
import { Panel } from '.';
declare var SP;

/**
 * Web Part Configuration
 */
export abstract class WebPartConfigurationPanel<Props extends IWebPartConfigurationProps = IWebPartConfigurationProps, State extends IWebPartConfigurationState = IWebPartConfigurationState> extends React.Component<Props, State> {
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
     * Required Methods
     */
    abstract onRenderContents: (cfg: IWebPartCfg) => any;

    /**
     * Public Interface
     */

    // Method to render the panel
    render() {
        return (
            <div>
                <PrimaryButton text="Edit Configuration" onClick={this.show} />
                <Panel headerText="Configuration" ref="panel">
                    <div ref="errorMessage" />
                    {this.onRenderContents(this.state.cfg)}
                </Panel>
            </div>
        )
    }

    /**
     * Methods
     */

    // Method to save the webpart configuration
    protected saveConfiguration = (wpCfg: any) => {
        // Clear the error message
        (this.refs["errorMessage"] as HTMLDivElement).innerText = "";

        // See if this webpart in the page content
        let wpContent = document.querySelector(".aspNetHidden input[name='" + this.props.cfg.WebPartId + "scriptcontent']") as HTMLInputElement;
        if(wpContent) {
            // Create an element so we can update the configuration
            let el = document.createElement("div");
            el.innerHTML = wpContent.value;

            // Get the configuration element and update it
            let cfg = el.querySelector("#" + this.props.cfgElementId) as HTMLDivElement;
            cfg.innerText = JSON.stringify(wpCfg);

            // Update the value
            wpContent.value = el.innerHTML;

            // Close the panel
            (this.refs["panel"] as Panel).hide();
        } else {
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
                    cfg.innerText = JSON.stringify(wpCfg);

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
                            window.location.href = window.location.href;
                        },
                        // Error
                        (...args) => {
                            // Set the error message
                            (this.refs["errorMessage"] as HTMLDivElement).innerText = args[1].get_message();
                        }
                    );
                }
            });
        }
    }

    // Method to show the panel
    private show = (ev: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Show the panel
        (this.refs["panel"] as Panel).show();
    }
}