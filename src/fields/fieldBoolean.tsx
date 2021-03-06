import * as React from "react";
import { SPTypes } from "gd-sprest";
import { Checkbox, ICheckboxProps } from "office-ui-fabric-react/lib/Checkbox";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IFieldBoolean, IFieldBooleanProps, IFieldBooleanState } from "./types";
import { BaseField } from ".";

/**
 * Boolean field
 */
export class FieldBoolean extends BaseField<IFieldBooleanProps, IFieldBooleanState> implements IFieldBoolean {
    /**
     * Render the field
     */
    renderField = () => {
        // See if a custom render method exists
        if (this.props.onRender) {
            return this.props.onRender(this.state.fieldInfo);
        }

        // Update the checkbox properties
        let props: ICheckboxProps = this.props.props || {};
        props.checked = this.getValue();
        props.onChange = this.onChange;

        // See if this is the display mode or a read-only field
        if (this.state.fieldInfo.readOnly || this.props.controlMode == SPTypes.ControlMode.Display) {
            // Return the value
            return (
                <div className={(this.props.className || "")}>
                    <Label>{props.label || this.state.fieldInfo.title}</Label>
                    <div>{this.getValue() ? "Yes" : "No"}</div>
                </div>
            );
        }

        // Render the component
        return (
            <div className={(this.props.className || "")}>
                <Label>{props.label || this.state.fieldInfo.title}</Label>
                <Checkbox {...props as any} />
            </div>
        );
    }

    /**
     * Methods
     */

    /**
     * Method to get the value
     */
    private getValue = () => {
        // Get the field value
        let value = this.getFieldValue();

        // Return a boolean value
        return typeof (value) === "boolean" ? value : false;
    }

    /**
     * The on change event
     */
    private onChange = (ev: React.MouseEvent<HTMLInputElement>, checked: boolean) => {
        // Update the value
        this.updateValue(checked);
    }
}