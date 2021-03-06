import { Helper } from "gd-sprest";
import { ITextFieldProps } from "office-ui-fabric-react";
import { BaseField, IBaseField, IBaseFieldProps, IBaseFieldState } from ".";

/**
 * Text Field
 */
export class FieldText extends BaseField<IFieldTextProps, IFieldTextState> { }

/**
 * Text Field Properties
 */
export interface IFieldTextProps extends IBaseFieldProps {
    /** Event triggered when the field value changes. */
    onChange?: (value: string) => void;

    /** The textfield properties. */
    props?: ITextFieldProps;
}

/**
 * Text Field State
 */
export interface IFieldTextState extends IBaseFieldState {
    /** The field information */
    fieldInfo: Helper.IListFormTextFieldInfo;
}

/**
 * Text Field
 */
export interface IFieldText extends IBaseField<IFieldTextProps, IFieldTextState> {
    /**
     * Event triggered after the field information is retrieved from SharePoint.
     */
    onFieldLoaded?: (info: any, state: IBaseFieldState) => void;
}