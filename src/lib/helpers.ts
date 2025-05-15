/**
 * Interpolates variables in a text string using a getter function.
 * Variables are denoted by ${component_id} in the text.
 * If a variable is not found, the original placeholder is kept.
 */
export const interpolateText = (
    text: string,
    getValue: (key: string) => string | undefined
): string => {
    return text.replace(/\${([^}]+)}/g, (match, key) => {
        const value = getValue(key);
        return value !== undefined ? value : match;
    });
}; 