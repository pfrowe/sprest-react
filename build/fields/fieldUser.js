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
var Label_1 = require("office-ui-fabric-react/lib/Label");
var components_1 = require("../components");
var _1 = require(".");
/**
 * User Field
 */
var FieldUser = /** @class */ (function (_super) {
    __extends(FieldUser, _super);
    function FieldUser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Render the field
         */
        _this.renderField = function () {
            // See if a custom render method exists
            if (_this.props.onRender) {
                return _this.props.onRender(_this.state.fieldInfo);
            }
            // Update the label properties
            var lblProps = _this.props.lblProps || {};
            lblProps.required = typeof (lblProps.required) === "boolean" ? lblProps.required : _this.state.fieldInfo.required;
            // Set the picker props
            var props = _this.props.pickerProps || {};
            props.disabled = _this.state.fieldInfo.readOnly || _this.props.controlMode == gd_sprest_1.SPTypes.ControlMode.Display;
            props.onChange = _this.onChange;
            // Render the component
            return (React.createElement("div", { className: (_this.props.className || "") },
                React.createElement(Label_1.Label, __assign({}, lblProps), lblProps.defaultValue || _this.state.fieldInfo.title),
                React.createElement(components_1.SPPeoplePicker, { allowGroups: _this.state.fieldInfo.allowGroups, allowMultiple: _this.state.fieldInfo.multi, fieldValue: _this.state.value ? _this.state.value.results || [_this.state.value] : null, props: props, webUrl: _this.props.webUrl })));
        };
        /**
         * Methods
         */
        /**
         * The get field value method
         */
        _this.getFieldValue = function () {
            var fieldValue = _this.state.value;
            // See if results exist
            if (fieldValue && fieldValue.results) {
                var results = [];
                // Parse the results
                for (var i = 0; i < fieldValue.results.length; i++) {
                    var lookupValue = fieldValue.results[i];
                    // Add the lookup id
                    results.push(lookupValue.ID || lookupValue);
                }
                // Update the field value
                fieldValue = { results: results };
            }
            else {
                // See if this is a multi value
                if (_this.state.fieldInfo.multi) {
                    // Ensure a value exists
                    fieldValue = fieldValue || { results: [] };
                }
                else {
                    // Ensure the value is valid
                    var userId = fieldValue.ID || fieldValue;
                    fieldValue = userId > 0 ? userId : null;
                }
            }
            // Return the field value
            return fieldValue;
        };
        /**
         * The change event
         * @param personas - The user personas.
         */
        _this.onChange = function (personas) {
            // Update the field value
            _this.updateValue(components_1.SPPeoplePicker.convertToFieldValue(personas, _this.state.fieldInfo.multi));
        };
        /**
         * The field loaded event
         * @param info - The field information.
         * @param state - The current state.
         */
        _this.onFieldLoaded = function (info, state) {
            var fldInfo = info;
            // Default the value
            state.value = _this.props.defaultValue || fldInfo.defaultValue;
            // See if this is a multi-lookup field
            if (fldInfo.multi) {
                var results = [];
                // Parse the users
                var users = (state.value ? state.value.results : state.value) || [];
                for (var i = 0; i < users.length; i++) {
                    // Add the item id
                    results.push(users[i].ID || users[i]);
                }
                // Set the value
                state.value = { results: results };
            }
            // Else, see if the value exists
            else if (state.value) {
                // Set the value
                state.value = state.value || state.value.ID;
            }
        };
        return _this;
    }
    return FieldUser;
}(_1.BaseField));
exports.FieldUser = FieldUser;
