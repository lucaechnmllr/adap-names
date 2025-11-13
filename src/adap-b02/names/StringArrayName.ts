import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];


    constructor(source: string[], delimiter?: string) {
        super();
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.components = [...source];
    }

    public asString(delimiter: string = this.delimiter): string {
        if (this.components.length === 0) {
            return "";
        }
        const parts = this.components.map(c => AbstractName.unmask(c));
        return parts.join(delimiter);
    }

    public asDataString(): string {
        if (this.components.length === 0) {
            return "";
        }
        const parts = this.components.map(c =>
            AbstractName.maskForDelimiter(AbstractName.unmask(c), DEFAULT_DELIMITER)
        );
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.validateIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.validateIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.validateIndex(i, true);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.validateIndex(i);
        this.components.splice(i, 1);
    }
}