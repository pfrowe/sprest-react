import * as React from "react";
import { TextField, ITextFieldProps } from "office-ui-fabric-react";
import { FieldNumberTypes, IFieldNumberProps, IFieldNumberState } from "../definitions";
import { Field } from "../common";

/**
 * Number Field
 */
export class FieldNumber extends Field<IFieldNumberProps, IFieldNumberState> {
    /**
     * Public Interface
     */

    // Method to render the component
    renderField() {
        let props: ITextFieldProps = this.props.props || {};

        // Update the properties
        props.errorMessage = props.errorMessage ? props.errorMessage : this.state.fieldInfo.errorMessage;
        props.label = props.label ? props.label : this.state.label;
        props.onChanged = this.onChange;
        props.required = typeof (props.required) === "boolean" ? props.required : this.state.fieldInfo.required;
        props.value = this.getValue();
        props.errorMessage = this.state.showErrorMessage ? (props.value ? "" : props.errorMessage) : "";

        // Return the component
        return (
            <TextField {...props as any} ref="number" />
        );
    }

    /**
     * Methods
     */

    // Method to return the value
    private getValue = () => {
        let value = this.getFieldValue();

        // Default the field type
        let fieldType = typeof (this.props.type) === "number" ? this.props.type : FieldNumberTypes.Integer;

        // Ensure a value exists and need to convert it
        if (value && fieldType == FieldNumberTypes.Integer) {
            // Convert the value to an integer
            let intValue = parseInt(value);
            value = intValue ? intValue.toString() : value;
        }

        // Return the value
        return value;
    }

    // The change event
    private onChange = (value: string) => {
        // Update the value
        this.updateValue(value);

        // Call the change event
        this.props.onChange ? this.props.onChange(parseInt(value)) : null;
    }
}