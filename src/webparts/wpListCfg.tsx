import * as React from "react";
import { Web, SPTypes, Types } from "gd-sprest";
import { Dropdown, IDropdownOption, PrimaryButton, TextField, Spinner } from "office-ui-fabric-react";
import { IWebPartListCfgPanel, IWebPartListCfg, IWebPartListCfgProps, IWebPartListCfgState } from "../definitions";
import { WebPartCfgPanel } from ".";

/**
 * WebPart List Configuration Panel
 */
export class WebPartListCfg<Props extends IWebPartListCfgProps = IWebPartListCfgProps, State extends IWebPartListCfgState = IWebPartListCfgState> extends WebPartCfgPanel<Props, State> implements IWebPartListCfgPanel {
    /**
     * Constructor
     * @param props - The webpart list configuration properties.
     */
    constructor(props: Props) {
        super(props);

        // Set the query
        this._query = {
            OrderBy: ["Title"],
            Top: 500
        };
    }

    /**
     * Global Variables
     */

    /**
     * The OData query.
     */
    _query: Types.ODataQuery = null;

    /**
     * Reference to the list dropdown.
     */
    _listDropdown: Dropdown = null;

    /**
     * Reference to the refresh button.
     */
    _refreshButton: PrimaryButton = null;

    /**
     * Reference to the save button.
     */
    _saveButton: PrimaryButton = null;

    /**
     * Reference to the web url text field.
     */
    _webUrl: TextField = null;

    /**
     * Events
     */

    /**
     * The list change event
     * @param state - The current state, updates to this object will be saved.
     * @param option - The dropdown option.
     * @param idx - The dropdown option index.
     */
    onListChanged = (state: State, option?: IDropdownOption, idx?: number) => { }

    /**
     * The lists loaded event
     * @param newState - The new state, updates to this object will be saved.
     */
    onListsLoaded = (newState: State) => { }

    /**
     * The refresh button click event
     * @param ev - The button click event.
     */
    onRefresh = (ev: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Update the configuration
        let cfg = this.props.cfg;
        cfg.WebUrl = this._webUrl.state.value;

        // Load the lists
        this.loadLists(cfg);
    }

    /**
     * Overload Methods
     */

    /**
     * The render contents event
     * @param cfg - The webpart list configuration.
     */
    onRenderContents = (cfg: IWebPartListCfg) => {
        // See if the lists exists
        if (this.state.lists == null) {
            // Load the lists
            this.loadLists(cfg);

            // Return a loading indicator
            return (
                <Spinner label="Loading the lists..." />
            );
        }

        // Render the component
        return (
            <div>
                {this.renderWebUrl()}
                {this.renderList()}
            </div>
        );
    }

    /**
     * The render footer event
     */
    onRenderFooter = () => {
        // See if the lists exists
        if (this.state.lists != null) {
            return this.renderSaveButton();
        }

        // Render nothing
        return null;
    }

    /**
     * Methods
     */

    // Method to get the list
    getList = (option: IDropdownOption) => {
        let selectedList = null;

        // Parse the lists
        for (let i = 0; i < this.state.lists.length; i++) {
            let list = this.state.lists[i];

            // See if this is the target list
            if (list.Title == option.key) {
                // Set the list
                selectedList = list;
                break;
            }
        }

        // Return the list
        return selectedList;
    }

    /**
     * Method to load the lists for the drop down
     */
    private loadLists = (cfg: IWebPartListCfg) => {
        // Get the web
        (new Web(cfg.WebUrl))
            // Get the lists
            .Lists()
            // Set the query
            .query(this._query)
            // Execute the request
            .execute((lists) => {
                let options: Array<IDropdownOption> = [];
                let selectedList = null;

                // Parse the lists
                for (let i = 0; i < lists.results.length; i++) {
                    let list = lists.results[i];

                    // See if this is the selected list
                    if(list.Title == cfg.ListName) {
                        // Set the list
                        selectedList = list;
                    }

                    // Add the option
                    options.push({
                        key: list.Title,
                        text: list.Title
                    });
                }

                // Set the new state
                let newState = {
                    cfg,
                    lists: lists.results,
                    options,
                    selectedList
                } as State;

                // Call the on lists loaded method
                this.onListsLoaded(newState);

                // Set the state
                this.setState(newState);
            });
    }

    /**
     * Method to render the list property
     */
    renderList = () => {
        return (
            <Dropdown
                label="List:"
                onChanged={this.updateListName}
                ref={ddl => { this._listDropdown = ddl; }}
                options={this.state.options}
                selectedKey={this.state.cfg.ListName || ""}
            />
        );
    }

    /**
     * Method to render the save button
     */
    renderSaveButton = () => {
        return (
            <PrimaryButton
                onClick={this.onSave}
                ref={btn => { this._refreshButton = btn; }}
                text="Save"
            />
        );
    }

    /**
     * Method to render the web url property
     */
    renderWebUrl = () => {
        return [
            <TextField
                label="Relative Web Url:"
                key="webUrlTextField"
                ref={webUrl => { this._webUrl = webUrl; }}
                value={this.state.cfg.WebUrl || ""}
            />,
            <PrimaryButton
                key="webUrlRefreshButton"
                onClick={this.onRefresh}
                ref={btn => { this._refreshButton = btn; }}
                text="Refresh"
            />
        ];
    }

    /**
     * Method to save the webpart configuration
     */
    private onSave = (ev: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Save the webpart configuration
        this.saveConfiguration(this.state.cfg);
    }


    /**
     * Method to update the list name
     */
    private updateListName = (option?: IDropdownOption, idx?: number) => {
        let newState = Object.create(this.state);

        // Set the list name
        newState.cfg.ListName = option.text;
        newState.selectedList = this.getList(option);

        // Call the change event
        this.onListChanged(newState, option, idx);

        // Update the state
        this.setState(newState);
    }
}