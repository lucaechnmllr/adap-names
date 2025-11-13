import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    /**
     * Removes escape characters from a masked string
     */
    // @methodtype helper-method
    protected static unmask(comp: string): string {
        let out = '';
        for (let i = 0; i < comp.length; i++) {
            const ch = comp[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < comp.length) {
                    out += comp[i + 1];
                    i++;
                }
                else {
                    out += ESCAPE_CHARACTER;
                }
            }
            else {
                out += ch;
            }
        }
        return out;
    }

    /**
     * Masks special characters for a given delimiter
     */
    // @methodtype helper-method
    protected static maskForDelimiter(raw: string, delimiter: string): string {
        let out = "";
        for (const ch of raw) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                out += ESCAPE_CHARACTER;
            }
            out += ch;
        }
        return out;
    }
    
    protected validateIndex(i: number, allowEqual: boolean = false): void {
        const max = allowEqual ? this.getNoComponents() : this.getNoComponents() - 1;
        if (i < 0 || i > max) {
            throw new RangeError(
                `Index ${i} out of bounds [0, ${max}]. Current components: ${this.getNoComponents()}`
            );
        }
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        if (other == null || other == undefined) {
            throw new Error("Cannot concat with null or undefined Name");
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    public abstract isEmpty(): boolean;

    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    public abstract asString(delimiter?: string): string;
    public abstract asDataString(): string;

}