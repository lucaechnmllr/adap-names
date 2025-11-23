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

    public asString(delimiter: string = this.delimiter): string {
        if (this.isEmpty()) {
            return "";
        }

        // Collect all components
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }

        // Unmask to get the original values
        const unmaskedParts = parts.map(c => AbstractName.unmask(c));

        // If same delimiter, join directly
        if (delimiter === this.delimiter) {
            return unmaskedParts.join(delimiter);
        } 
        // Otherwise, remask for new delimiter
        else {
            const remaskedParts = unmaskedParts.map(c =>
                AbstractName.maskForDelimiter(c, delimiter)
            );
            return remaskedParts.join(delimiter);
        }
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        if (this.isEmpty()) {
            return "";
        }
        
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const component = this.getComponent(i);
            const unmasked = AbstractName.unmask(component);
            const remasked = AbstractName.maskForDelimiter(unmasked, DEFAULT_DELIMITER);
            parts.push(remasked);
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (other == null || other == undefined) {
            return false;
        }
        
        // Delimiter must be the same
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        
        // Number of components must be the same
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        
        // All components must be the same
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        
        // Simple hash function (djb2)
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;    
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }


    public abstract clone(): Name;

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (other == null || other == undefined) {
            throw new Error("Cannot concat with null or undefined Name");
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}