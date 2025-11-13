import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.name = source;
        this.noComponents = this.countComponents(source);
    }

    // Counts components in a string considering escape characters
    // E.g., "oss\.cs.fau.de" has 3 components if delimiter is '.'
    // @methodtype helper-method
    private countComponents(str: string): number {
        if (str.length === 0) return 1; // Empty string has one (empty) component

        let count = 1;
        let escaped = false;

        for (const ch of str) {
            if (escaped) {
                escaped = false;
                continue;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === this.delimiter) {
                count++;
            }
        }
        return count;
    }


    /**
     * Splits the string into components, respecting escape characters
     * necessary because simple split() would break on escaped delimiters
     */
    // @methodtype helper-method
    private splitComponents(): string[] {
        if (this.name.length === 0) {
            return [""];
        }

        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (const ch of this.name) {
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
            } else if (ch === this.delimiter) {
                components.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        components.push(current);

        return components;
    }

    /**
     * Reconstructs the internal string from components
     */
    // @methodtype helper-method
    private joinComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = this.countComponents(this.name);
    }


    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name;
        } else {
            const parts = this.splitComponents().map(c => AbstractName.unmask(c));
            return parts.join(delimiter);
        }
    }

    public asDataString(): string {
        const parts = this.splitComponents().map(c =>
            AbstractName.maskForDelimiter(AbstractName.unmask(c), DEFAULT_DELIMITER)
        );
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        this.validateIndex(x);
        return this.splitComponents()[x];
    }

    public setComponent(n: number, c: string): void {
        this.validateIndex(n);
        const parts = this.splitComponents();
        parts[n] = c;
        this.joinComponents(parts);
    }

    public insert(n: number, c: string): void {
        this.validateIndex(n, true);
        const parts = this.splitComponents();
        parts.splice(n, 0, c);
        this.joinComponents(parts);
    }

    public append(c: string): void {
        const parts = this.splitComponents();
        parts.push(c);
        this.joinComponents(parts);
    }

    public remove(n: number): void {
        this.validateIndex(n);
        const parts = this.splitComponents();
        parts.splice(n, 1);
        this.joinComponents(parts);
    }
}