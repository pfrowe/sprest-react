"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var gd_sprest_1 = require("gd-sprest");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var __1 = require("..");
var _1 = require(".");
/**
 * Item Form
 */
var ItemForm = /** @class */ (function (_super) {
    __extends(ItemForm, _super);
    /**
     * Constructor
     */
    function ItemForm(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Reference to the attachments field
         */
        _this._attachmentField = null;
        /** The list form */
        _this._listForm = null;
        /**
         * Reference to the form fields
         */
        _this._formFields = {};
        /**
         * Reference to the query used to refresh the item
         */
        _this._query = null;
        /**
         * Method to load the list information
         */
        _this.loadListInfo = function () {
            var fields = null;
            var formFields = _this.props.fields;
            // Ensure the fields exist
            if (formFields) {
                fields = [];
                // Parse the fields
                for (var i = 0; i < formFields.length; i++) {
                    // Add the field
                    fields.push(formFields[i].name);
                }
            }
            // Create an instance of the list form
            new gd_sprest_1.Helper.ListForm({
                fields: fields,
                itemId: _this.props.item ? _this.props.item.Id : _this.props.itemId,
                listName: _this.props.listName,
                webUrl: _this.props.webUrl
            }).then(function (listInfo) {
                // Update the state
                _this.setState({ listInfo: listInfo });
            });
        };
        /**
         * Method to render the fields
         */
        _this.renderFields = function () {
            var formFields = [];
            var item = _this.state.listInfo.item;
            // See if we are displaying attachments
            if (_this.props.showAttachments) {
                formFields.push(React.createElement("div", { className: "ms-Grid-row", key: "row_Attachments" },
                    React.createElement("div", { className: "ms-Grid-col-md12" },
                        React.createElement(__1.Fields.FieldAttachments, { controlMode: _this.ControlMode, files: item ? item.AttachmentFiles : null, key: "Attachments", itemId: item.Id, listName: _this.props.listName, onAttachmentsRender: _this.props.onFieldRender == null ? null : function (attachments) { return _this.props.onFieldRender({ listName: _this.props.listName, name: "Attachments" }, attachments); }, onFileAdded: _this.props.onAttachmentAdded, onFileClick: _this.props.onAttachmentClick == null ? null : function (file) { return _this.props.onAttachmentClick(file, _this.ControlMode); }, onFileRender: _this.props.onAttachmentRender == null ? null : function (file) { return _this.props.onAttachmentRender(file, _this.ControlMode); }, onRender: _this.props.onRenderAttachments == null ? null : function (files) { return _this.props.onRenderAttachments(files, _this.ControlMode); }, ref: function (field) { _this._attachmentField = field; }, webUrl: _this.props.webUrl }))));
            }
            var _loop_1 = function (fieldName) {
                var field = _this.state.listInfo.fields[fieldName];
                var readOnly = false;
                // See if we are excluding this field
                if (_this.props.excludeFields && _this.props.excludeFields.indexOf(fieldName) >= 0) {
                    return "continue";
                }
                // See if this is a read-only field
                if (_this.props.readOnlyFields && _this.props.readOnlyFields.indexOf(fieldName) >= 0) {
                    // Set the flag
                    readOnly = true;
                }
                // Find the field information
                var fieldInfo = (_this.props.fields || []).find(function (fieldInfo) {
                    return fieldInfo.name == fieldName;
                });
                // Add the form field
                formFields.push(React.createElement("div", { className: "ms-Grid-row", key: "row_" + fieldName },
                    React.createElement("div", { className: "ms-Grid-col ms-md12" },
                        React.createElement(_1.Field, { controlMode: readOnly ? gd_sprest_1.SPTypes.ControlMode.Display : _this.ControlMode, defaultValue: item[field.InternalName], field: field, item: item, listName: _this.props.listName, key: field.InternalName, name: field.InternalName, onChange: fieldInfo ? fieldInfo.onChange : null, onFieldRender: _this.props.onFieldRender, onRender: fieldInfo ? fieldInfo.onRender : null, queryTop: _this.props.queryTop, ref: function (field) { field ? _this._formFields[field.props.name] = field : null; }, webUrl: _this.props.webUrl }))));
            };
            // Parse the fields
            for (var fieldName in _this.state.listInfo.fields) {
                _loop_1(fieldName);
            }
            // Return the form fields
            return formFields;
        };
        /**
         * Method to save the item attachments
         * @param itemId - The item id.
         */
        _this.saveAttachments = function (itemId) {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // See if attachments exist
                if (_this._attachmentField) {
                    // Save the attachments
                    _this._attachmentField.save(itemId).then(function () {
                        // Resolve the promise
                        resolve();
                    });
                }
                else {
                    // Resolve the promise
                    resolve();
                }
            });
        };
        // Set the state
        _this.state = {
            listInfo: null,
            refreshFl: false,
            saveFl: false,
            updateFl: false
        };
        return _this;
    }
    Object.defineProperty(ItemForm.prototype, "AttachmentField", {
        /**
         * Get the attachment field
         */
        get: function () { return this._attachmentField; },
        /**
         * Set the attachment field
         */
        set: function (field) { this._attachmentField = field; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "ControlMode", {
        /**
         * Get the control mode
         */
        get: function () {
            var controlMode = this.props.controlMode;
            // Default the value
            if (typeof (this.props.controlMode) !== "number") {
                controlMode = gd_sprest_1.SPTypes.ControlMode.Display;
            }
            // See if we are editing the form
            if (controlMode == gd_sprest_1.SPTypes.ControlMode.Edit) {
                // Ensure the item exists
                controlMode = this.state.listInfo.item && this.state.listInfo.item.Id > 0 ? gd_sprest_1.SPTypes.ControlMode.Edit : gd_sprest_1.SPTypes.ControlMode.New;
            }
            // Return the control mode
            return controlMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "FormFields", {
        /**
         * Get the form fields
         */
        get: function () { return this._formFields; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "Item", {
        /**
         * The list item
         */
        get: function () { return this.state.listInfo.item; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "List", {
        /**
         * Get the list
         */
        get: function () { return this.state.listInfo.list; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "ItemQuery", {
        /**
         * Get the item query
         */
        get: function () { return this._query; },
        /**
         * Set the item query
         */
        set: function (query) { this._query = query; },
        enumerable: true,
        configurable: true
    });
    /**
     * Method to get the form values
     */
    ItemForm.prototype.getFormValues = function () { return this.getValues(); };
    /**
     * Method to refresh the item
     */
    ItemForm.prototype.refresh = function () {
        // Update the state
        this.setState({ refreshFl: true });
    };
    /**
     * Render the component
     */
    ItemForm.prototype.render = function () {
        var _this = this;
        // See if the list has been loaded
        if (this.state.listInfo == null) {
            // Load the list information
            this.loadListInfo();
            // Return a spinner
            return (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Loading the list information..." }));
        }
        // See if we are refreshing the item
        if (this.state.refreshFl) {
            // Reload the item
            gd_sprest_1.Helper.ListForm.refreshItem(this.state.listInfo).then(function (item) {
                // Update the item
                var listInfo = _this.state.listInfo;
                listInfo.item = item;
                // Update the state
                _this.setState({
                    listInfo: listInfo,
                    refreshFl: false
                });
            });
            // Return a spinner
            return (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Refreshing the Item", size: office_ui_fabric_react_1.SpinnerSize.large }));
        }
        // See if we are updating the item
        if (this.state.updateFl) {
            // Return a spinner
            return (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Updating the Item", size: office_ui_fabric_react_1.SpinnerSize.large }));
        }
        // See if there is a custom renderer
        if (this.props.onRender) {
            // Render the custom event
            return (React.createElement("div", null,
                !this.state.saveFl ? null :
                    React.createElement(office_ui_fabric_react_1.Spinner, { label: "Saving the Item", size: office_ui_fabric_react_1.SpinnerSize.large }),
                React.createElement("div", { hidden: this.state.saveFl }, this.props.onRender(this.ControlMode))));
        }
        // Render the fields
        return (React.createElement("div", { className: "ms-Grid " + (this.props.className || "") },
            !this.state.saveFl ? null :
                React.createElement(office_ui_fabric_react_1.Spinner, { label: "Saving the Item", size: office_ui_fabric_react_1.SpinnerSize.large }),
            React.createElement("div", { hidden: this.state.saveFl }, this.renderFields())));
    };
    /**
     * Method to save the item form
     */
    ItemForm.prototype.save = function () {
        var _this = this;
        // Return a promise
        return new Promise(function (resolve, reject) {
            // Set the state
            _this.setState({ saveFl: true }, function () {
                var listInfo = _this.state.listInfo;
                // Save the item
                gd_sprest_1.Helper.ListForm.saveItem(_this.getFormValues(), _this.List)
                    .then(function (item) {
                    // Update the list information
                    listInfo.item = item;
                    // Save the attachments
                    _this.saveAttachments(item.Id);
                })
                    .then(function (item) {
                    // Refresh the item
                    gd_sprest_1.Helper.ListForm.refreshItem(listInfo).then(function (item) {
                        // Update the list information
                        listInfo.item = item;
                        // Update the state
                        _this.setState({ listInfo: listInfo, saveFl: false }, function () {
                            // Resolve the promise
                            resolve(item);
                        });
                    });
                });
            });
        });
    };
    /**
     * Method to update the item.
     */
    ItemForm.prototype.updateItem = function (fieldValues) {
        var _this = this;
        // Return a promise
        return new Promise(function (resolve, reject) {
            // Set the state
            _this.setState({ updateFl: true }, function () {
                var listInfo = _this.state.listInfo;
                // Update the item
                gd_sprest_1.Helper.ListForm.saveItem(listInfo, fieldValues).then(function (item) {
                    // Update the item
                    listInfo.item = item;
                    // Update the state
                    _this.setState({ listInfo: listInfo, updateFl: false });
                    // Resolve the promise
                    resolve(item);
                });
            });
        });
    };
    /**
     * Methods
     */
    /**
     * Method to get the form values
     */
    ItemForm.prototype.getValues = function () {
        var formValues = {};
        // Parse the fields
        for (var fieldName in this._formFields) {
            var field = this._formFields[fieldName];
            // Ensure the field exists
            if (field == null) {
                continue;
            }
            // See if this is a lookup or user field
            if (field.Info.type == gd_sprest_1.SPTypes.FieldType.Lookup ||
                field.Info.type == gd_sprest_1.SPTypes.FieldType.User) {
                // Ensure the field name is the "Id" field
                fieldName += fieldName.lastIndexOf("Id") == fieldName.length - 2 ? "" : "Id";
            }
            // Get the field value
            var fieldValue = field.Value;
            if (fieldValue) {
                // See if this is a multi-value field
                if (fieldValue.results) {
                    var results = [];
                    // Parse the results
                    for (var i = 0; i < fieldValue.results.length; i++) {
                        var result = fieldValue.results[i];
                        // See if this is a taxonomy field with multiple values
                        if (field.Info.typeAsString == "TaxonomyFieldTypeMulti") {
                            // Add the term
                            results.push(result.WssId + ";#" + result.Label + "|" + result.TermGuid);
                        }
                        else {
                            // Add the lookup id if it exists
                            results.push(result.ID || result);
                        }
                    }
                    // See if this is a taxonomy field with multiple values
                    if (field.Info.typeAsString == "TaxonomyFieldTypeMulti") {
                        // Set the hidden field name
                        formValues[field.Info.valueField] = results.join(";#");
                        // Continue the loop
                        continue;
                    }
                    else {
                        // Set the field value
                        fieldValue = { results: results };
                    }
                }
                else if (field.Info.type == gd_sprest_1.SPTypes.FieldType.Lookup ||
                    field.Info.type == gd_sprest_1.SPTypes.FieldType.User) {
                    // Clear the value if it doesn't exist
                    fieldValue = fieldValue > 0 ? fieldValue : null;
                }
            }
            else if (field.Info.type == gd_sprest_1.SPTypes.FieldType.MultiChoice) {
                // Default the value
                fieldValue = { results: [] };
            }
            // Set the field value
            formValues[fieldName] = fieldValue;
        }
        // Return the form values
        return formValues;
    };
    return ItemForm;
}(React.Component));
exports.ItemForm = ItemForm;
//# sourceMappingURL=itemForm.js.map