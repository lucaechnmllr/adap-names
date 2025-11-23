import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.components = [...source];
    }

    public clone(): Name {
        // Deep copy of components
        return new StringArrayName([...this.components], this.delimiter);
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