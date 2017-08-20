/// <reference types="react" />
import { IDropdownOption } from "office-ui-fabric-react";
import { BaseField } from "../../common";
import { IFieldChoice, IFieldChoiceProps, IFieldChoiceState } from "../../definitions";
/**
 * Boolean field
 */
export declare class FieldChoice extends BaseField<IFieldChoiceProps, IFieldChoiceState> implements IFieldChoice {
    /**
     * Public Interface
     */
    renderField(): JSX.Element;
    /**
     * Events
     */
    protected onChanged: (option: IDropdownOption) => void;
    onFieldInit: (field: any, state: IFieldChoiceState) => void;
    /**
     * Methods
     */
    private toFieldValue;
    private toOptions;
}