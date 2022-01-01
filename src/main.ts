import wink, { Bow, Model, Tokens } from "wink-nlp";

export default function withModel(model: Model) {
    return function summarize(text: string, maxSentences: number) {
        const nlp = wink(model);
        const { its, as } = nlp;
        const document = nlp.readDoc(text);

        // Get counts of words
        const counts = document.tokens().filter(
            (t) => t.out(its.type) === 'word' && !t.out(its.stopWordFlag)
        ).out(its.value, as.bow) as Bow;

        
        // Rank sentences by occurrence of words
        const sentences = document.sentences();
        const scores: [string, number][] = [];
        sentences.each(sentence => {
            const tokens = sentence.tokens().out();
            let score = 0;
            for (const token of tokens) {
                score += counts?.[token] ?? 0;
            };

            scores.push([sentence.out(), score]);
        });

        // Return the top sentences
        const sorted = scores.sort((a, b) => b[1] - a[1]);
        return sorted.slice(0, maxSentences).map(s => s[0]).join(" ");
    };
};
