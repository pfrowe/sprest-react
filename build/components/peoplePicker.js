"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var gd_sprest_1 = require("gd-sprest");
var Pickers_1 = require("office-ui-fabric-react/lib/Pickers");
/**
 * SharePoint People Picker
 */
var SPPeoplePicker = /** @class */ (function (_super) {
    __extends(SPPeoplePicker, _super);
    /**
     * Constructor
     */
    function SPPeoplePicker(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Global Variables
         */
        /**
         * The filter text
         */
        _this._filterText = "";
        /**
         * Methods
         */
        /**
         * Method to convert the user to persona value
         * @param users - An array of field user values.
         */
        _this.convertToPersonas = function (users) {
            if (users === void 0) { users = []; }
            var personas = [];
            // Ensure users exist
            if (users && users.length > 0) {
                var user = users[0];
                // See if this is an array of user ids
                if (typeof (user) === "number") {
                    var userInfo_1 = [];
                    // Get the web
                    _this.getWeb().then(function (web) {
                        var _loop_1 = function (i) {
                            // Get the user
                            web.SiteUsers(users[i] + "").execute(function (user) {
                                // Ensure the user exists
                                if (user.existsFl) {
                                    // Add the user information
                                    userInfo_1.push({
                                        ID: user.Id,
                                        UserName: user.LoginName,
                                        Title: user.Title
                                    });
                                }
                                // Else, see if groups are enabled
                                else if (_this.state.allowGroups) {
                                    // Get the group
                                    web.SiteGroups().getById(users[i]).execute(function (group) {
                                        // Ensure the group exists
                                        if (group.existsFl) {
                                            // Add the group information
                                            userInfo_1.push({
                                                ID: parseInt(group.Id + ""),
                                                UserName: group.LoginName,
                                                Title: group.Title
                                            });
                                        }
                                    });
                                }
                            }, true);
                        };
                        // Parse the users
                        for (var i = 0; i < users.length; i++) {
                            _loop_1(i);
                        }
                        // Wait for the requests to complete
                        web.done(function () {
                            // Update the state
                            _this.setState({
                                personas: _this.convertToPersonas(userInfo_1)
                            });
                        });
                    });
                }
                else {
                    // Parse the users
                    for (var i = 0; i < users.length; i++) {
                        var user_1 = users[i];
                        if (user_1.ID) {
                            // Add the persona
                            personas.push({
                                id: user_1.UserName,
                                itemID: user_1.ID + "",
                                primaryText: user_1.Title,
                                secondaryText: user_1.EMail,
                                tertiaryText: user_1.JobTitle,
                            });
                        }
                    }
                }
            }
            // Return the personas
            return personas;
        };
        /**
         * Gets the web.
         */
        _this.getWeb = function () {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // See if the url exists
                if (_this.props.webUrl) {
                    // Get the context for the web
                    gd_sprest_1.ContextInfo.getWeb(_this.props.webUrl).execute(function (info) {
                        // Resolve the web
                        resolve(gd_sprest_1.Web(_this.props.webUrl, { requestDigest: info.GetContextWebInformation.FormDigestValue }));
                    });
                }
                else {
                    // Resolve the web
                    resolve(gd_sprest_1.Web());
                }
            });
        };
        /**
         * Method executed when the value changes
         * @param personas - The persona values.
         */
        _this.onChange = function (personas) {
            // Update the personas
            personas = personas ? personas : [];
            if (personas.length > 1) {
                // Remove all values except for the last entry for single user types
                personas = _this.props.allowMultiple ? personas : personas.splice(personas.length - 1, 1);
            }
            // Update the state
            _this.setState({
                fieldValue: SPPeoplePicker.convertToFieldValue(personas),
                personas: personas
            }, function () {
                // Call the custom onChange event
                _this.props.props && _this.props.props.onChange ? _this.props.props.onChange(personas) : null;
            });
        };
        /**
         * Method to search for all sources
         * @param filterText - The filtered text.
         * @param personas - The selected users.
         */
        _this.searchAll = function (filterText, personas) {
            // Search all principal sources
            return _this.search(filterText, personas, gd_sprest_1.SPTypes.PrincipalSources.All);
        };
        /**
         * Method to search for the user
         * @param filterText - The filtered text.
         * @param personas - The selected users.
         */
        _this.search = function (filterText, personas, source) {
            // Save the filter
            _this._filterText = filterText.toLowerCase();
            // Ensure we have a minimum of 3 characters
            if (_this._filterText.length < 3) {
                return [];
            }
            // Return a promise
            return new Promise(function (resolve, reject) {
                // Wait for the user to finish typing
                setTimeout(function () {
                    // See if the user is still typing
                    if (_this._filterText != filterText.toLowerCase()) {
                        return;
                    }
                    // See if the filter exists
                    if (_this._filterText) {
                        // Search for the user
                        gd_sprest_1.PeoplePicker().clientPeoplePickerSearchUser({
                            MaximumEntitySuggestions: 15,
                            PrincipalSource: typeof (source) === "number" ? source : gd_sprest_1.SPTypes.PrincipalSources.UserInfoList,
                            PrincipalType: _this.state.allowGroups ? gd_sprest_1.SPTypes.PrincipalTypes.All : gd_sprest_1.SPTypes.PrincipalTypes.User,
                            QueryString: _this._filterText
                        }).execute(function (results) {
                            // Resolve the promise
                            resolve(_this.toArray(results));
                        });
                    }
                }, 500);
            });
        };
        /**
         * Method to convert the people picker results to an array
         */
        _this.toArray = function (results) {
            var users = [];
            // Parse the users
            for (var i = 0; i < results.ClientPeoplePickerSearchUser.length; i++) {
                var user = results.ClientPeoplePickerSearchUser[i];
                // Add the user
                users.push({
                    id: user.Key,
                    itemID: user.EntityData.SPUserID || user.EntityData.SPGroupID,
                    primaryText: user.DisplayText,
                    secondaryText: user.EntityData.Email,
                    tertiaryText: user.Description
                });
            }
            // Return the users
            return users;
        };
        // Get the personas
        var personas = props.props && props.props.defaultSelectedItems ? props.props.defaultSelectedItems : _this.convertToPersonas(props.fieldValue);
        // Set the state
        _this.state = {
            allowGroups: typeof (props.allowGroups) === "boolean" ? props.allowGroups : false,
            fieldValue: SPPeoplePicker.convertToFieldValue(personas),
            personas: personas
        };
        return _this;
    }
    // Render the component
    SPPeoplePicker.prototype.render = function () {
        var props = this.props.props || {};
        // Default the suggested properties
        var pickerSuggestionsProps = props.pickerSuggestionsProps || {
            className: "ms-PeoplePicker",
            loadingText: "Loading the users" + (this.state.allowGroups ? " and groups" : ""),
            noResultsFoundText: "No users " + (this.state.allowGroups ? "/groups" : "") + " were found.",
            searchForMoreText: "Search All",
            suggestionsHeaderText: "Suggested Users" + (this.state.allowGroups ? "/Groups" : "")
        };
        // Return the people picker
        return (React.createElement(Pickers_1.NormalPeoplePicker, __assign({}, props, { getTextFromItem: function (persona) { return persona.primaryText; }, onChange: this.onChange, onGetMoreResults: this.searchAll, onResolveSuggestions: this.search, pickerSuggestionsProps: pickerSuggestionsProps, selectedItems: this.state.personas })));
    };
    /**
     * Method to convert the personas to a field value
     * @param personas - The persona values.
     * @param allowMultiple - Flag to determine if multiple user selection is allowed.
     */
    SPPeoplePicker.convertToFieldValue = function (personas, allowMultiple) {
        var fieldValue = null;
        // See if we are allowing multiple
        if (allowMultiple) {
            // Default the field value
            fieldValue = { results: [] };
            // Parse the personas
            for (var i = 0; i < personas.length; i++) {
                // Add the user id
                fieldValue.results.push(personas[i].itemID);
            }
        }
        else {
            // Get the last persona
            var persona = personas.length > 0 ? personas[personas.length - 1] : null;
            // Set the field value
            fieldValue = persona ? persona.itemID : null;
        }
        // Return the field value
        return fieldValue;
    };
    return SPPeoplePicker;
}(React.Component));
exports.SPPeoplePicker = SPPeoplePicker;
