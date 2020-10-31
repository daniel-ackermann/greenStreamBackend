import { language } from "../interface/language";

export function getLanguages(): language[] {
    return [{
        name: "Deutsch",
        value: "de"
    },
    {
        name: "English",
        value: "en"
    }];
}