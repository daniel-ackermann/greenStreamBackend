import { Language } from "../interface/language";

export function getLanguages(): Language[] {
    return [{
        name: "Deutsch",
        value: "de"
    },
    {
        name: "English",
        value: "en"
    }];
}