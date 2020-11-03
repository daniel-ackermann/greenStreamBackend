
export function parseLanguage(lang = "de,en,es"): string[] {
    if (lang.length === 0) {
        return ["de"];
    }

    // Split by , then by ; 
    const pairs = lang.split(',');
    const result = [];
    for (const i in pairs) {
        result.push(pairs[i].split(';')[0].split('-')[0]);
    }
    // remove duplicates
    return [... new Set(result)];
}


export function removeEmptyStrings(value:string): boolean{
    if (value.length === 0) {
        return false;
    } else {
        return true;
    }
}