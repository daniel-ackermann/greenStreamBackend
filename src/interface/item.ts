export interface Item {
    id?: number,
    likes?: number,
    marked?: number,
    watched?: number,
    explanation_id?: number,
    type_id: number,
    url: string,
    description: string,
    title: string,
    topic_id: number,
    language: [string],
    simple: number
}