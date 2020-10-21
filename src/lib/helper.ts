
export function parseLanguage(lang: string = "de"): string[] {
    if (lang.length === 0) {
        return ["de%"];
    }

    // wildcard for all
    if (lang === '*') {
        return ['%'];
    }

    // Split by , then by ; then returns the country-code with %
    let pairs = lang.split(',');
    let result = [];
    for (let i in pairs) {
        result.push(pairs[i].split(';')[0].split('-')[0] + "%");
    }
    // remove duplicates
    return [... new Set(result)];
}