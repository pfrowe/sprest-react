import { Helper } from "gd-sprest";
import { IDropdownOption, IDropdownProps } from "office-ui-fabric-react";
import { BaseField, IBaseField, IBaseFieldProps, IBaseFieldState } from ".";

/**
 * Lookup Field
 */
export class FieldLookup extends BaseField<IFieldLookupProps, IFieldLookupState> implements IFieldLookup { }

/**
 * Lookup Field Properties
 */
export interface IFieldLookupProps extends IBaseFieldProps {
    /** Event triggered when the field value changes. */
    onChange?: (value: IDropdownOption | Array<string | number>) => void;

    /** The dropdown list properties. */
    props?: IDropdownProps;
}

/**
 * Lookup Field State
 */
export interface IFieldLookupState extends IBaseFieldState {
    /** The field information */
    fieldInfo: Helper.IListFormLookupFieldInfo;

    /** The dropdown options. */
    options?: Array<IDropdownOption>;
}

/**
 * Lookup Field
 */
export interface IFieldLookup extends IBaseField<IFieldLookupProps, IFieldLookupState> {
    /**
     * Event triggered after the field information is retrieved from SharePoint.
     */
    onFieldLoaded?: (info: any, state: IBaseFieldState) => void;
}