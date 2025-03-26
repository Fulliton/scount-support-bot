import core from '@bootstrap/Core';

export default function config(
    path: string,
    value: number|string|boolean|null = null
): string|number|boolean|null {
    function get(keys: Array<string>, config: Object) {
        const key = keys.shift();

        if (keys.length >= 1) {
            return get(keys, config[key]);
        }

        return config[key] ?? value;
    }

    return get(path.split('.'), core.config) ?? value;
}